const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        
        if (!token) {
            return res.status(401).json({ status: "error", message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({ status: "error", message: "Invalid token" });
    }
};

module.exports = auth;