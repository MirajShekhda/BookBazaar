const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({ status: "error", message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ status: "error", message: "Not authorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ status: "error", message: "Invalid token" });
    }
};

module.exports = adminAuth;