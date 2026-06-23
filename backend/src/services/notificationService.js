// Stubs - replace with actual SMS/Push/Email providers
exports.sendSMS = async (phone, message) => {
    console.log(`📱 SMS to ${phone}: ${message}`);
};

exports.sendPushNotification = async (userId, title, body) => {
    console.log(`🔔 Push to ${userId}: ${title} - ${body}`);
};

exports.notifyAdmin = async (emergencyLog) => {
    console.log('🚨 Admin Alert:', emergencyLog);
};