import { sign } from "jsonwebtoken";

const createJWT = (payload: object) => {
    const expiresIn = 60 * 60 * 24; //a day
    const token = sign(payload, <string>process.env.JWT_SECRET, { expiresIn });
    return token;
}

export default createJWT;