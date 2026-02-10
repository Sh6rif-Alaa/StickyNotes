import jwt from 'jsonwebtoken';

const TOKEN_SECRET = 'ldskfjdslkj%@21421'

export const jwtToken = ({ data, expiresIn = "1h" } = {}) => {
    return jwt.sign({ data }, TOKEN_SECRET, { expiresIn });
}

export const verifyToken = ({ token } = {}) => {
    try {
        return jwt.verify(token, TOKEN_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired token", { cause: 403 });
    }
}

export const authenticateToken = (req, res, next) => {
    const token = req.headers['token'];

    if (!token) throw new Error("no token provided", { cause: 401 })

    req.decodedToken = verifyToken({ token })
    next();
};
