const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user = null;
            req.user = decoded.user;
            next();
        });
        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        };
    } else {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
    }
})

const authorization = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(403).json({ message: "User is not authorized for this action" });;
        }
        next();
    };
};

// module.exports = { validateToken, authorization }
module.exports = validateToken;