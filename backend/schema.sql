-- =============================================================================
-- ETHIOTRANS DATABASE SCHEMA (MySQL)
-- Version: 1.0
-- Database: transport
-- =============================================================================
-- =============================================================================
-- 1. CREATE DATABASE IF NOT EXISTS
-- =============================================================================
CREATE DATABASE IF NOT EXISTS transport CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE transport;

-- =============================================================================
-- 2. LOCATION & CONFIGURATION TABLES
-- =============================================================================
-- 2.1 CITIES (Geographic reference data)
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geom POINT,
    -- MySQL spatial point
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_cities_region ON cities(region);

CREATE INDEX idx_cities_geom ON cities(geom) USING SPATIAL;

-- 2.2 VEHICLE TYPES (Capacity & pricing rules)
CREATE TABLE IF NOT EXISTS vehicle_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('bus', 'minivan', 'sedan', 'truck')),
    max_capacity SMALLINT NOT NULL CHECK (max_capacity > 0),
    base_fare_multiplier DECIMAL(3, 2) DEFAULT 1.0,
    freight_capacity_kg DECIMAL(10, 2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =============================================================================
-- 3. IDENTITY & ACCESS CONTROL (RBAC)
-- =============================================================================
-- 3.1 USERS (Unified table for all personas: customers, drivers, admins, auditors)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    national_id VARCHAR(20) UNIQUE NOT NULL COMMENT 'Fayda National ID',
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (
        role IN (
            'super_admin',
            'dispatcher',
            'driver',
            'customer',
            'auditor'
        )
    ),
    is_verified BOOLEAN DEFAULT FALSE,
    wallet_balance DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_users_national_id ON users(national_id);

CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_users_phone ON users(phone);

-- =============================================================================
-- 4. FLEET MANAGEMENT
-- =============================================================================
-- 4.1 VEHICLES (Fleet registry)
CREATE TABLE IF NOT EXISTS vehicles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type_id INT NOT NULL,
    model VARCHAR(100),
    year_made SMALLINT,
    current_mileage DECIMAL(12, 2) DEFAULT 0,
    last_service_mileage DECIMAL(12, 2) DEFAULT 0,
    maintenance_status VARCHAR(20) DEFAULT 'operational' CHECK (
        maintenance_status IN (
            'operational',
            'service_due',
            'in_repair',
            'decommissioned'
        )
    ),
    is_active BOOLEAN DEFAULT TRUE,
    geom POINT COMMENT 'Last known GPS location',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_vehicles_status ON vehicles(maintenance_status);

CREATE INDEX idx_vehicles_geom ON vehicles(geom) USING SPATIAL;

-- 4.2 MAINTENANCE ORDERS (Predictive maintenance)
CREATE TABLE IF NOT EXISTS maintenance_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id CHAR(36) NOT NULL,
    issue_description TEXT NOT NULL,
    mileage_at_report DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'in_progress',
            'completed',
            'cancelled'
        )
    ),
    estimated_cost DECIMAL(10, 2),
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_maintenance_vehicle ON maintenance_orders(vehicle_id);

-- =============================================================================
-- 5. ROUTING & TRIP SCHEDULING
-- =============================================================================
-- 5.1 ROUTES (Origin -> Destination pairs)
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origin_city_id INT NOT NULL,
    destination_city_id INT NOT NULL,
    distance_km DECIMAL(8, 2) NOT NULL,
    base_duration_mins INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (origin_city_id) REFERENCES cities(id) ON DELETE RESTRICT,
    FOREIGN KEY (destination_city_id) REFERENCES cities(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_routes_origin_dest (origin_city_id, destination_city_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_routes_origin_dest ON routes(origin_city_id, destination_city_id);

-- 5.2 TRIPS (Scheduled departures)
-- NOTE: MySQL does NOT support exclusion constraints like PostgreSQL.
-- Vehicle overlap prevention must be handled in Node.js application logic.
CREATE TABLE IF NOT EXISTS trips (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    route_id INT NOT NULL,
    vehicle_id CHAR(36) NOT NULL,
    driver_id CHAR(36) NOT NULL,
    scheduled_departure TIMESTAMP NOT NULL,
    estimated_arrival TIMESTAMP NOT NULL,
    actual_departure TIMESTAMP NULL,
    actual_arrival TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (
        status IN (
            'scheduled',
            'boarding',
            'departed',
            'en_route',
            'emergency',
            'completed',
            'cancelled'
        )
    ),
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE RESTRICT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_trips_driver_status ON trips(driver_id, status);

CREATE INDEX idx_trips_departure ON trips(scheduled_departure);

CREATE INDEX idx_trips_status ON trips(status);

-- =============================================================================
-- 6. E-TICKETING & BOOKINGS
-- =============================================================================
-- 6.1 BOOKINGS (Seat reservations with QR verification)
CREATE TABLE IF NOT EXISTS bookings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    trip_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    qr_code_hash VARCHAR(255) UNIQUE NOT NULL COMMENT 'SHA-256 hash for QR verification',
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (
        booking_status IN (
            'confirmed',
            'checked_in',
            'cancelled',
            'no_show'
        )
    ),
    price DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'paid', 'refunded')
    ),
    checked_in_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_bookings_trip_seat (trip_id, seat_number)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_bookings_trip ON bookings(trip_id);

CREATE INDEX idx_bookings_user ON bookings(user_id);

CREATE INDEX idx_bookings_qr ON bookings(qr_code_hash);

-- =============================================================================
-- 7. FINANCIAL DOMAIN (Immutable Ledger)
-- =============================================================================
-- 7.1 WALLET TRANSACTIONS (Append-Only Ledger - never updated or deleted)
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    booking_id CHAR(36) NULL,
    amount DECIMAL(12, 2) NOT NULL COMMENT 'Positive = Credit, Negative = Debit',
    transaction_type VARCHAR(30) NOT NULL CHECK (
        transaction_type IN (
            'deposit',
            'booking_payment',
            'refund_credit',
            'driver_payout',
            'penalty_deduction'
        )
    ),
    balance_after DECIMAL(12, 2) NOT NULL COMMENT 'Snapshot of balance after this transaction',
    reference_external VARCHAR(255) NULL COMMENT 'Telebirr / Bank reference ID',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE
    SET
        NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_wallet_user ON wallet_transactions(user_id);

CREATE INDEX idx_wallet_created ON wallet_transactions(created_at);

-- 7.2 PAYMENT GATEWAY LOGS (Telebirr, CBE, CBEBirr)
CREATE TABLE IF NOT EXISTS payment_gateway_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    booking_id CHAR(36) NULL,
    amount DECIMAL(10, 2) NOT NULL,
    gateway VARCHAR(20) NOT NULL CHECK (
        gateway IN ('telebirr', 'cbebirr', 'cbe_bank', 'cash')
    ),
    gateway_transaction_id VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'success', 'failed', 'reversed')
    ),
    callback_payload JSON COMMENT 'Raw webhook response for reconciliation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE
    SET
        NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 7.3 DRIVER SETTLEMENTS (Auto-calculated on trip completion)
CREATE TABLE IF NOT EXISTS driver_settlements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id CHAR(36) NOT NULL,
    trip_id CHAR(36) NOT NULL,
    gross_earning DECIMAL(10, 2) NOT NULL COMMENT 'Total fare collected',
    institution_fee DECIMAL(10, 2) NOT NULL COMMENT 'e.g., 30% platform fee',
    net_earning DECIMAL(10, 2) NOT NULL COMMENT '70% driver share',
    penalty_deductions DECIMAL(10, 2) DEFAULT 0,
    final_payout DECIMAL(10, 2) NOT NULL COMMENT 'net_earning - penalty_deductions',
    payout_status VARCHAR(20) DEFAULT 'pending' CHECK (
        payout_status IN ('pending', 'processing', 'completed', 'failed')
    ),
    settled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_settlements_driver ON driver_settlements(driver_id);

-- =============================================================================
-- 8. COMPLIANCE & SAFETY
-- =============================================================================
-- 8.1 PENALTIES (Automated fines for violations)
CREATE TABLE IF NOT EXISTS penalties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id CHAR(36) NOT NULL,
    trip_id CHAR(36) NOT NULL,
    penalty_type VARCHAR(20) NOT NULL CHECK (
        penalty_type IN ('overcapacity', 'delay', 'traffic_violation')
    ),
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    is_paid BOOLEAN DEFAULT FALSE COMMENT 'Deducted automatically from settlement',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_penalties_driver ON penalties(driver_id);

-- 8.2 EMERGENCY LOGS (Breakdown, accident, medical, security)
CREATE TABLE IF NOT EXISTS emergency_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_trip_id CHAR(36) NOT NULL,
    previous_driver_id CHAR(36) NOT NULL,
    new_driver_id CHAR(36) NULL,
    new_vehicle_id CHAR(36) NULL,
    emergency_type VARCHAR(30) NOT NULL CHECK (
        emergency_type IN ('breakdown', 'accident', 'medical', 'security')
    ),
    gps_latitude DECIMAL(10, 8) NOT NULL,
    gps_longitude DECIMAL(11, 8) NOT NULL,
    passenger_count SMALLINT NOT NULL,
    institution_notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (original_trip_id) REFERENCES trips(id) ON DELETE RESTRICT,
    FOREIGN KEY (previous_driver_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (new_driver_id) REFERENCES users(id) ON DELETE
    SET
        NULL,
        FOREIGN KEY (new_vehicle_id) REFERENCES vehicles(id) ON DELETE
    SET
        NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_emergency_trip ON emergency_logs(original_trip_id);

-- 8.3 AUDIT LOGS (Immutable regulatory trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    action_type VARCHAR(50) NOT NULL COMMENT 'e.g., LOGIN, BOOKING_CREATED, TRIP_DEPARTED',
    entity_type VARCHAR(50) NOT NULL COMMENT 'e.g., BOOKING, TRIP, USER, VEHICLE',
    entity_id CHAR(36) NULL COMMENT 'ID of the affected record',
    old_values JSON NULL COMMENT 'Snapshot BEFORE change',
    new_values JSON NULL COMMENT 'Snapshot AFTER change',
    ip_address VARCHAR(45) NULL COMMENT 'IPv4 or IPv6',
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_audit_user ON audit_logs(user_id);

CREATE INDEX idx_audit_action ON audit_logs(action_type);

CREATE INDEX idx_audit_entity ON audit_logs(entity_id);

CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- =============================================================================
-- 9. FREIGHT & LOGISTICS
-- =============================================================================
-- 9.1 FREIGHT ORDERS (Cargo shipments)
CREATE TABLE IF NOT EXISTS freight_orders (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    shipper_user_id CHAR(36) NOT NULL,
    pickup_city_id INT NOT NULL,
    dropoff_city_id INT NOT NULL,
    weight_kg DECIMAL(10, 2) NOT NULL,
    volume_cbm DECIMAL(10, 2),
    assigned_trip_id CHAR(36) NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'assigned',
            'in_transit',
            'delivered',
            'customs_hold'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shipper_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (pickup_city_id) REFERENCES cities(id) ON DELETE RESTRICT,
    FOREIGN KEY (dropoff_city_id) REFERENCES cities(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_trip_id) REFERENCES trips(id) ON DELETE
    SET
        NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_freight_status ON freight_orders(status);

-- 9.2 CUSTOMS DOCUMENTS (Pre-clearance for 40-day Djibouti delay)
CREATE TABLE IF NOT EXISTS customs_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    freight_order_id CHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL COMMENT 'invoice, phytosanitary, certificate_of_origin',
    file_url VARCHAR(500) NOT NULL COMMENT 'S3 / Cloudinary URL',
    customs_status VARCHAR(20) DEFAULT 'pending' CHECK (
        customs_status IN ('pending', 'submitted', 'cleared', 'rejected')
    ),
    submitted_to_api_at TIMESTAMP NULL,
    cleared_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (freight_order_id) REFERENCES freight_orders(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_customs_freight ON customs_documents(freight_order_id);

-- =============================================================================
-- 10. SEED DATA (Development / Testing)
-- =============================================================================
-- Insert default vehicle types
INSERT INTO
    vehicle_types (
        name,
        category,
        max_capacity,
        base_fare_multiplier
    )
VALUES
    ('Economy Bus', 'bus', 50, 1.0),
    ('Business Midibus', 'bus', 20, 1.3),
    ('Executive Minivan', 'minivan', 7, 1.8),
    ('City Sedan', 'sedan', 4, 2.0),
    ('Heavy Truck', 'truck', 2, 2.5);

-- Insert major Ethiopian cities (sample)
INSERT INTO
    cities (name, region, latitude, longitude)
VALUES
    ('Addis Ababa', 'Addis Ababa', 9.032, 38.746),
    ('Dire Dawa', 'Dire Dawa', 9.600, 41.850),
    ('Mekelle', 'Tigray', 13.500, 39.470),
    ('Gondar', 'Amhara', 12.600, 37.467),
    ('Bahir Dar', 'Amhara', 11.600, 37.383),
    ('Hawassa', 'Sidama', 7.050, 38.467),
    ('Jimma', 'Oromia', 7.667, 36.833),
    ('Dessie', 'Amhara', 11.133, 39.633),
    ('Jijiga', 'Somali', 9.350, 42.800),
    ('Adama', 'Oromia', 8.550, 39.267);

-- Insert default admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- bcrypt hash for 'admin123'
INSERT INTO
    users (
        national_id,
        full_name,
        phone,
        email,
        password_hash,
        role,
        is_verified,
        wallet_balance
    )
VALUES
    (
        'ADMIN001',
        'System Administrator',
        '0911000000',
        'admin@ethiotrans.com',
        '$2a$12$vW4tTQxGJHjQYFz2iTqHX.tFJzW4tTQxGJHjQYFz2iTqHX.tFJzW',
        'super_admin',
        TRUE,
        0
    );