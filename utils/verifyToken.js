import jwt from 'jsonwebtoken'

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return false;

        return decoded;
    });
}

export default verifyToken