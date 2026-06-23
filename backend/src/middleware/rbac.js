const AppError = require('../utils/appError');

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('You are not authenticated.', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};

const hasRole = (user, ...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
};

module.exports = { restrictTo, hasRole };