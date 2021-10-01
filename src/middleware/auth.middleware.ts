import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';

import NoTokenException from '../exceptions/NoTokenException';
import WrongTokenException from '../exceptions/WrongTokenException';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';

import Admin from "../entities/admin.entity";
import User from "../entities/user.entity";

interface LoginData {
    id: string;
}

// map the user types
const userTypes = new Map<string, object>([["admin", Admin], ["user", User]]);

// define the type for the type argument
type authType = ("admin" | "user")[] | ("none")[];

const authMiddleware = (...types: authType): RequestHandler =>
    async (request, response, next) => {

        // get the authorization header
        const bearerHeader = request.headers['authorization'];
        // throw exception if there's no authorization header
        if (!bearerHeader) next(new NoTokenException());
        // get the token from header
        const token = bearerHeader?.split(' ')[1];
        // get the jwt secret from .env
        const secret = <string>process.env.JWT_SECRET;
        // throw exception if there's no token
        if(!token)  next(new NoTokenException());

        // loop through the user tpyes supplied as parameters
        for(let type of types) {
            // if no role was specified, proceed to the next middleware (without assigning the user object to the response locals)
            if(type === "none") return next();
            // get the actual user type based on the string provided in parameters ("admin" => Admin, "user" => User)
            const userType: any = userTypes.get(type);
            try {
                // verify the token and decode it to get LoginData (which was previously signed during login)
                const payload = <LoginData>verify(<string>token, secret);
                // get the user depending on the provided type
                try {
                    const user = await userType.findOne(payload.id);
                    // if the token did match at least one of the types, the next function will be called
                    if(user) {
                        // save the login data to the request object
                        response.locals.user = user;
                        return next();
                    }
                }
                catch {}
            } 
            catch (error) {
                next(new WrongTokenException());
            }
        }
        // if the token matched none of the types call the next function with a NotAuthorizedExc
        next(new NotAuthorizedException());
    }

export default authMiddleware;