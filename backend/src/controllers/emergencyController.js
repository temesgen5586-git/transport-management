const { pool } = require('../config/db');
const { logAction } = require('../services/auditService');
const { notifyAdmin, sendPushNotification } = require('../services/notificationService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { EMERGENCY_TYPES } = require('../utils/constants');

/**
 * Trigger emergency (SOS) from driver
 * POST /api/v1/emergency
 */
exports.handleEmergency = catchAsync(async (req, res, next) => {
    const { trip_id, emergency_type, latitude, longitude } = req.body;
    const driver_id = req.user.id;

    if (!trip_id || !emergency_type || !latitude || !longitude) {
        return next(new AppError('trip_id, emergency_type, latitude, longitude are required', 400));
    }
    if (!Object.values(EMERGENCY_TYPES).includes(emergency_type)) {
        return next(new AppError(`Invalid emergency_type. Allowed: ${Object.values(EMERGENCY_TYPES).join(', ')}`, 400));
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get trip and passenger count
        const [tripRows] = await connection.execute(`
            SELECT t.id, t.vehicle_id, v.vehicle_type_id,
                   (SELECT COUNT(*) FROM bookings WHERE trip_id = t.id AND booking_status != 'cancelled') AS passenger_count
            FROM trips t
            JOIN vehicles v ON t.vehicle_id = v.id
            WHERE t.id = ? AND t.driver_id = ?
        `, [trip_id, driver_id]);

        if (tripRows.length === 0) {
            return next(new AppError('Trip not found or not assigned to you', 404));
        }
        const original = tripRows[0];

        // Find nearest compatible vehicle (MySQL spatial query)
        const [nearest] = await connection.execute(`
            SELECT v.id AS vehicle_id, u.id AS driver_id, u.full_name
            FROM vehicles v
            JOIN trips t ON v.id = t.vehicle_id
            JOIN users u ON t.driver_id = u.id
            WHERE v.vehicle_type_id = ?
              AND v.maintenance_status = 'operational'
              AND t.status = 'scheduled'
              AND t.scheduled_departure > NOW()
              AND v.id != ?
            ORDER BY ST_Distance_Sphere(v.geom, POINT(?, ?)) ASC
            LIMIT 1
        `, [original.vehicle_type_id, original.vehicle_id, longitude, latitude]);

        let new_driver_id = null;
        let new_vehicle_id = null;

        if (nearest.length > 0) {
            new_driver_id = nearest[0].driver_id;
            new_vehicle_id = nearest[0].vehicle_id;

            // Create new trip for replacement vehicle
            const [newTrip] = await connection.execute(`
                INSERT INTO trips (route_id, vehicle_id, driver_id, scheduled_departure, estimated_arrival, status)
                SELECT route_id, ?, ?, NOW(), NOW() + INTERVAL 30 MINUTE, 'departed'
                FROM trips WHERE id = ?
            `, [new_vehicle_id, new_driver_id, trip_id]);

            const newTripId = newTrip.insertId;

            // Transfer bookings to new trip
            await connection.execute(
                'UPDATE bookings SET trip_id = ? WHERE trip_id = ?',
                [newTripId, trip_id]
            );
        }

        // Insert emergency log
        await connection.execute(`
            INSERT INTO emergency_logs (
                original_trip_id, previous_driver_id, new_driver_id, new_vehicle_id,
                emergency_type, gps_latitude, gps_longitude, passenger_count, institution_notified_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [trip_id, driver_id, new_driver_id, new_vehicle_id, emergency_type, latitude, longitude, original.passenger_count]);

        // Update original trip status
        await connection.execute(
            'UPDATE trips SET status = "emergency" WHERE id = ?',
            [trip_id]
        );

        // Audit log
        await logAction(driver_id, 'EMERGENCY_TRIGGERED', 'TRIP', trip_id, null, { emergency_type, new_driver_id, new_vehicle_id }, req);

        await connection.commit();

        // Notify admin
        if (new_driver_id) {
            await notifyAdmin({
                trip_id,
                previous_driver_id: driver_id,
                new_driver_id,
                new_vehicle_id,
                emergency_type,
                passenger_count: original.passenger_count,
                message: `Emergency ${emergency_type} on trip ${trip_id}. Reassigned to driver ${new_driver_id}.`
            });
        } else {
            await notifyAdmin({
                trip_id,
                previous_driver_id: driver_id,
                emergency_type,
                passenger_count: original.passenger_count,
                message: `Emergency ${emergency_type} on trip ${trip_id}. No backup vehicle found.`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Emergency logged.',
            data: {
                reassigned: !!new_driver_id,
                new_driver_id,
                new_vehicle_id
            }
        });

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
});

/**
 * Get emergency logs (Admin/Auditor)
 * GET /api/v1/emergency/logs
 */
exports.getEmergencyLogs = catchAsync(async (req, res, next) => {
    const [rows] = await pool.execute(`
        SELECT el.*, u1.full_name AS previous_driver, u2.full_name AS new_driver,
               v.plate_number AS new_vehicle
        FROM emergency_logs el
        LEFT JOIN users u1 ON el.previous_driver_id = u1.id
        LEFT JOIN users u2 ON el.new_driver_id = u2.id
        LEFT JOIN vehicles v ON el.new_vehicle_id = v.id
        ORDER BY el.created_at DESC
        LIMIT 100
    `);
    res.status(200).json({ success: true, data: rows });
});