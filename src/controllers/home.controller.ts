import { Request, Response, NextFunction } from "express";

import User from "../entities/user.entity";
import JSONResponse from "../utils/JSONResponse";
import createJWT from "../utils/createJWT";
import BaseController from "../types/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import authMiddleware from "../middleware/auth.middleware";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import HttpException from "../exceptions/HttpException";
import LoginInput from "../dto/login.dto";
import { UploadImageInput } from "../dto/upload-image.dto";
import { UpdatePfpInput } from "../dto/update-pfp.dto";
import { compare } from "bcrypt";
import { Controller, Handler } from "../decorators/routing";

@Controller()
export default class HomeController extends BaseController {

    @Handler('post', '/login', validationMiddleware(LoginInput))
    async login(req: Request, res: Response, next: NextFunction): Promise<any> {
        // get cin and cne from the body
        const email = req.body.email;
        const password = req.body.password;
        try {
            // get user with the email
            const user = await User.findOne({ where: { email }});
            // check if the user exists
            if(!user) return next(new WrongCredentialsException());
            // check if password matches
            const isPasswordMatch = await compare(password, user.password);
            if(!isPasswordMatch) return next(new WrongCredentialsException());
            // send back the token
            const token = createJWT({ id: user.id });
            JSONResponse.success(res, { token });
        }
        catch {
            next(new HttpException(500));
        }
    }

    @Handler('get', '/me', authMiddleware("none"))
    async me(_: Request, response: Response) {
        // get the user info
        const user = response.locals.user;
        return JSONResponse.success(response, user);
    }

    @Handler('post', '/upload/image', authMiddleware("none"), validationMiddleware(UploadImageInput))
    async uploadImage(request: Request, response: Response, next: NextFunction) {
        try {
            // get the image
            const photo = request.files?.image;
            // check if the photo is valid
            if(!photo) return next(new HttpException(400, "Photo must be an image file (jpg/png)"));
            if (Array.isArray(photo)) return next(new HttpException(422, "Unable to process request"));
            // check if the profile is actually an image
            if(photo.mimetype !== "image/jpeg" && photo.mimetype !== "image/png") return next(new HttpException(415, "Photo must be an image file (jpeg/jpg/png)"));

            // save the image
            const ps = photo.name.split('.');
            const extension = ps[ps.length - 1];
            const name = ps.slice(0, ps.length-1).join('.');
            // return error if file extension is not [jpeg/jpg/png]
            if(extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') return next(new HttpException(415, "Photo must be a jpeg or jpg or png"));
            const fileName = `${name}-${Date.now()}.${extension}`;
            photo.mv(`./public/${request.body.type}/` + fileName);
            // return the file name
            JSONResponse.success(response, { fileName });
        }
        catch {
            next(new HttpException());
        }
    }

    @Handler('post', '/upload/file', authMiddleware("admin"))
    async uploadFile(request: Request, response: Response, next: NextFunction) {
        try {
            // get the file
            const file = request.files?.file;
            // check if the photo is valid
            if(!file) return next(new HttpException(400, "Please select a file"));
            if (Array.isArray(file)) return next(new HttpException(422, "Unable to process request"));

            // save the image
            file.mv(`./public/attachements/` + file.name);
            // return the file name
            JSONResponse.success(response, { fileName: file.name });
        }
        catch {
            next(new HttpException());
        }
    }

    @Handler('put', '/pfp', authMiddleware("user"))
    async updatePfp(request: Request, response: Response, next: NextFunction) {
        try {
            // get file name
            const { photo }: UpdatePfpInput = request.body;
            // get current user
            const user = <User>response.locals.user;
            user.photo = photo.toString().trim();
            await user.save();
            JSONResponse.success(response, { photo });
        }
        catch {
            next(new HttpException());
        }
    }
}
