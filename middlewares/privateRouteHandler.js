import verifyToken from "../utils/verifyToken.js";

export default (req, res, next) => {
    const {authorization} = req.headers;

    if (!authorization || !authorization.split(" ")[1]) {
        return res.status(403).json({
            success: false,
            message: "Bearer token not found",
        })
    }

    const decoded = verifyToken(authorization.split(" ")[1]);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Invalid/Expired token",
        })
    }

    req.body._id = decoded._id;

    next();
}