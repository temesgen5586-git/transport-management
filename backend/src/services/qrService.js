const crypto = require('crypto');

exports.generateQRHash = (tripId, userId, seatNumber) => {
    const raw = `${tripId}-${userId}-${seatNumber}-${Date.now()}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
};