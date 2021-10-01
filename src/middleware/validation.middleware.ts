import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import express from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(type: ClassConstructor<T>): express.RequestHandler {
    return async (req, _, next) => {
        // get input validation errors for provided type
        const errors = await validate(plainToClass(type, req.body))
        // check for errors
        if (errors.length > 0) {
            // format error message
            const message = errors.map((error: ValidationError) => {
                if(!error.constraints) return 'Please provide all the necessary fields';
                return Object.values(error.constraints)
            }).join(', ');

            // call the next function with an exception to trigger the Error Middleware
            return next(new HttpException(400, message));
        }
        next();
    }
}

export default validationMiddleware;