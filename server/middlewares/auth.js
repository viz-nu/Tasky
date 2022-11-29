import jwt from "jsonwebtoken";
import config from "config";
let {JWT}=config.get("SECRET_KEYS")
async function authMiddleware(req, res, next) {
    try {
        let decoded = jwt.verify(req.headers["auth-token"],JWT);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Unauthorised or Token Expired' });
    }
}

export default authMiddleware;
