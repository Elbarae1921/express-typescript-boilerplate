import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
    constructor() {
        super(400, "Wrong credentials");
    }
}

export default WrongCredentialsException;