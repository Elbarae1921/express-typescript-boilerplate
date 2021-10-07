import { Request, Response, NextFunction } from "express";
import { compare, hash } from "bcrypt";

import Admin from "../entities/admin.entity";
import JSONResponse from "../utils/JSONResponse";
import createJWT from "../utils/createJWT";
import BaseController from "../types/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import authMiddleware from "../middleware/auth.middleware";
import AdminLoginInput from "../dto/login.dto";
import ChangePasswordInput from "../dto/change-password.dto";
import HttpException from "../exceptions/HttpException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import { Controller, Handler } from "../decorators/routing";

@Controller('admin')
export default class AdminController extends BaseController {

    @Handler('post', '/login', validationMiddleware(AdminLoginInput))
    async adminLogin(request: Request, response: Response, next: NextFunction) {
        // get cin and cne from the body
        const { password } = request.body;
        const email = request.body.email;
        try {
            // get admin with the email
            const admin = await Admin.findOne({ where: { email }});
            // check if the admin exists
            if(!admin) return next(new WrongCredentialsException());
            // check if password matches
            const isPasswordMatch = await compare(password, admin.password);
            if(!isPasswordMatch) return next(new WrongCredentialsException());
            // send back the token
            const token = createJWT({ id: admin.id });
            JSONResponse.success(response, { token });
        }
        catch {
            next(new HttpException(500, "Erreur Interne du Serveur"));
        }
    }

    @Handler('post', '/password', authMiddleware("admin"), validationMiddleware(ChangePasswordInput))
    async changePassword(request: Request, response: Response, next: NextFunction) {
        // get the current admin
        const admin = <Admin>response.locals.user;
        // get the old and new passwords from the request body
        const { oldPass, newPass } = request.body;
        try {
            // compare old password
            const isPasswordMatch = await compare(oldPass, admin.password);
            if(!isPasswordMatch) return next(new WrongCredentialsException());
            // change password
            const password = await hash(newPass, 12);
            admin.password = password;
            // save
            admin.save();
            // return success
            JSONResponse.success(response, "Password changed");
        }
        catch {
            next(new HttpException());
        }
    }
}