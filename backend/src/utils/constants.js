/**
 * Application constants
 */

// User roles (RBAC)
const ROLES = {
    SUPER_ADMIN: 'super_admin',
    DISPATCHER: 'dispatcher',
    DRIVER: 'driver',
    CUSTOMER: 'customer',
    AUDITOR: 'auditor',
};

// Trip statuses
const TRIP_STATUSES = {
    SCHEDULED: 'scheduled',
    BOARDING: 'boarding',
    DEPARTED: 'departed',
    EN_ROUTE: 'en_route',
    EMERGENCY: 'emergency',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// Booking statuses
const BOOKING_STATUSES = {
    CONFIRMED: 'confirmed',
    CHECKED_IN: 'checked_in',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
};

// Payment statuses
const PAYMENT_STATUSES = {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
};

// Transaction types
const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    BOOKING_PAYMENT: 'booking_payment',
    REFUND_CREDIT: 'refund_credit',
    DRIVER_PAYOUT: 'driver_payout',
    PENALTY_DEDUCTION: 'penalty_deduction',
};

// Penalty types
const PENALTY_TYPES = {
    OVERCAPACITY: 'overcapacity',
    DELAY: 'delay',
    TRAFFIC_VIOLATION: 'traffic_violation',
};

// Emergency types
const EMERGENCY_TYPES = {
    BREAKDOWN: 'breakdown',
    ACCIDENT: 'accident',
    MEDICAL: 'medical',
    SECURITY: 'security',
};

// Payment gateways
const GATEWAYS = {
    TELEBIRR: 'telebirr',
    CBEBIRR: 'cbebirr',
    CBE_BANK: 'cbe_bank',
    CASH: 'cash',
};

module.exports = {
    ROLES,
    TRIP_STATUSES,
    BOOKING_STATUSES,
    PAYMENT_STATUSES,
    TRANSACTION_TYPES,
    PENALTY_TYPES,
    EMERGENCY_TYPES,
    GATEWAYS,
};