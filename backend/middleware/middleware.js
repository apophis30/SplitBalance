const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(403).json({
            message: "Invalid Credentials",
        })
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({
            message: "Invalid Credentials",
        })
    }
    
};

module.exports = {
    authMiddleware,
}