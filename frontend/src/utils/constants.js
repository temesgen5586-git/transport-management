// src/utils/constants.js
// Application constants

// ==================== USER ROLES ====================
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    DISPATCHER: 'dispatcher',
    DRIVER: 'driver',
    CUSTOMER: 'customer',
    AUDITOR: 'auditor',
};

export const ROLE_LABELS = {
    super_admin: 'Super Admin',
    dispatcher: 'Dispatcher',
    driver: 'Driver',
    customer: 'Customer',
    auditor: 'Auditor',
};

// ==================== TRIP STATUSES ====================
export const TRIP_STATUSES = {
    SCHEDULED: 'scheduled',
    BOARDING: 'boarding',
    DEPARTED: 'departed',
    EN_ROUTE: 'en_route',
    EMERGENCY: 'emergency',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const TRIP_STATUS_LABELS = {
    scheduled: 'Scheduled',
    boarding: 'Boarding',
    departed: 'Departed',
    en_route: 'En Route',
    emergency: 'Emergency',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

export const TRIP_STATUS_COLORS = {
    scheduled: 'badge-info',
    boarding: 'badge-warning',
    departed: 'badge-warning',
    en_route: 'badge-warning',
    emergency: 'badge-danger',
    completed: 'badge-success',
    cancelled: 'badge-gray',
};

// ==================== BOOKING STATUSES ====================
export const BOOKING_STATUSES = {
    CONFIRMED: 'confirmed',
    CHECKED_IN: 'checked_in',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
    COMPLETED: 'completed',
};

export const BOOKING_STATUS_LABELS = {
    confirmed: 'Confirmed',
    checked_in: 'Checked In',
    cancelled: 'Cancelled',
    no_show: 'No Show',
    completed: 'Completed',
};

export const BOOKING_STATUS_COLORS = {
    confirmed: 'badge-success',
    checked_in: 'badge-info',
    cancelled: 'badge-danger',
    no_show: 'badge-gray',
    completed: 'badge-success',
};

// ==================== PAYMENT STATUSES ====================
export const PAYMENT_STATUSES = {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
    FAILED: 'failed',
};

export const PAYMENT_STATUS_LABELS = {
    pending: 'Pending',
    paid: 'Paid',
    refunded: 'Refunded',
    failed: 'Failed',
};

export const PAYMENT_STATUS_COLORS = {
    pending: 'badge-warning',
    paid: 'badge-success',
    refunded: 'badge-info',
    failed: 'badge-danger',
};

// ==================== TRANSACTION TYPES ====================
export const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    BOOKING_PAYMENT: 'booking_payment',
    REFUND_CREDIT: 'refund_credit',
    DRIVER_PAYOUT: 'driver_payout',
    PENALTY_DEDUCTION: 'penalty_deduction',
};

export const TRANSACTION_TYPE_LABELS = {
    deposit: 'Deposit',
    booking_payment: 'Booking Payment',
    refund_credit: 'Refund',
    driver_payout: 'Driver Payout',
    penalty_deduction: 'Penalty Deduction',
};

export const TRANSACTION_TYPE_COLORS = {
    deposit: 'badge-success',
    booking_payment: 'badge-info',
    refund_credit: 'badge-warning',
    driver_payout: 'badge-info',
    penalty_deduction: 'badge-danger',
};

// ==================== PENALTY TYPES ====================
export const PENALTY_TYPES = {
    OVERCAPACITY: 'overcapacity',
    DELAY: 'delay',
    TRAFFIC_VIOLATION: 'traffic_violation',
};

export const PENALTY_TYPE_LABELS = {
    overcapacity: 'Overcapacity',
    delay: 'Delay',
    traffic_violation: 'Traffic Violation',
};

export const PENALTY_TYPE_COLORS = {
    overcapacity: 'badge-danger',
    delay: 'badge-warning',
    traffic_violation: 'badge-info',
};

// ==================== EMERGENCY TYPES ====================
export const EMERGENCY_TYPES = {
    BREAKDOWN: 'breakdown',
    ACCIDENT: 'accident',
    MEDICAL: 'medical',
    SECURITY: 'security',
};

export const EMERGENCY_TYPE_LABELS = {
    breakdown: 'Breakdown',
    accident: 'Accident',
    medical: 'Medical',
    security: 'Security',
};

// ==================== PAYMENT GATEWAYS ====================
export const GATEWAYS = {
    TELEBIRR: 'telebirr',
    CBEBIRR: 'cbebirr',
    CBE_BANK: 'cbe_bank',
    CASH: 'cash',
};

export const GATEWAY_LABELS = {
    telebirr: 'Telebirr',
    cbebirr: 'CBEBirr',
    cbe_bank: 'CBE Bank',
    cash: 'Cash',
};

// ==================== VEHICLE CATEGORIES ====================
export const VEHICLE_CATEGORIES = {
    BUS: 'bus',
    MINIVAN: 'minivan',
    SEDAN: 'sedan',
    TRUCK: 'truck',
};

export const VEHICLE_CATEGORY_LABELS = {
    bus: 'Bus',
    minivan: 'Minivan',
    sedan: 'Sedan',
    truck: 'Truck',
};

// ==================== MAINTENANCE STATUSES ====================
export const MAINTENANCE_STATUSES = {
    OPERATIONAL: 'operational',
    SERVICE_DUE: 'service_due',
    IN_REPAIR: 'in_repair',
    DECOMMISSIONED: 'decommissioned',
};

export const MAINTENANCE_STATUS_LABELS = {
    operational: 'Operational',
    service_due: 'Service Due',
    in_repair: 'In Repair',
    decommissioned: 'Decommissioned',
};

// ==================== FREIGHT STATUSES ====================
export const FREIGHT_STATUSES = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CUSTOMS_HOLD: 'customs_hold',
};

export const FREIGHT_STATUS_LABELS = {
    pending: 'Pending',
    assigned: 'Assigned',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    customs_hold: 'Customs Hold',
};

// ==================== CUSTOMS STATUSES ====================
export const CUSTOMS_STATUSES = {
    PENDING: 'pending',
    SUBMITTED: 'submitted',
    CLEARED: 'cleared',
    REJECTED: 'rejected',
};

export const CUSTOMS_STATUS_LABELS = {
    pending: 'Pending',
    submitted: 'Submitted',
    cleared: 'Cleared',
    rejected: 'Rejected',
};

// ==================== PAYOUT STATUSES ====================
export const PAYOUT_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
};

export const PAYOUT_STATUS_LABELS = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
};

// ==================== SYSTEM CONSTANTS ====================
export const SYSTEM = {
    MAX_SEATS: 50,
    MINIMUM_WITHDRAWAL: 10,
    MAX_WITHDRAWAL: 50000,
    DEFAULT_CURRENCY: 'ETB',
    TIMEZONE: 'Africa/Addis_Ababa',
    AUTO_CANCEL_DELAY_MINUTES: 15,
    MAINTENANCE_MILEAGE_THRESHOLD: 5000,
    OVERCAPACITY_PENALTY_AMOUNT: 50,
    DELAY_PENALTY_AMOUNT: 10,
};

// ==================== API ENDPOINTS ====================
export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    ADMIN: {
        USERS: '/admin/users',
        CITIES: '/admin/cities',
        ROUTES: '/admin/routes',
        VEHICLES: '/admin/vehicles',
        VEHICLE_TYPES: '/admin/vehicle-types',
        STATS: '/admin/stats',
        PENALTIES: '/admin/penalties',
        FLEET_CAPACITY: '/admin/fleet/capacity',
        TABLES: '/admin/tables',
    },
    TRIPS: {
        BASE: '/trips',
        LIVE: '/trips/live',
        DEPART: (id) => `/trips/${id}/depart`,
        COMPLETE: (id) => `/trips/${id}/complete`,
    },
    BOOKINGS: {
        BASE: '/bookings',
        CHECKIN: (id) => `/bookings/${id}/checkin`,
    },
    WALLET: {
        BALANCE: '/wallet/balance',
        HISTORY: '/wallet/history',
        DEPOSIT: '/wallet/deposit',
        REFUND: '/wallet/refund',
    },
    DRIVER: {
        TRIPS: '/driver/trips',
        SETTLEMENTS: '/driver/settlements',
        PAYOUT: '/driver/payout/request',
        PENALTIES: '/driver/penalties',
    },
    FREIGHT: {
        ORDERS: '/freight/orders',
        MATCH: (id) => `/freight/orders/${id}/match`,
        CUSTOMS: '/admin/customs-documents',
    },
    EMERGENCY: {
        LOGS: '/emergency/logs',
    },
    AUDIT: {
        LOGS: '/audit/logs',
        EXPORT: '/audit/export',
    },
};