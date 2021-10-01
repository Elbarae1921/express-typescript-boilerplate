import HttpException from './HttpException';

class NoTokenException extends HttpException {
    constructor() {
        super(401, "Authentication Token Missing");
    }
}

export default NoTokenException;