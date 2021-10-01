import HttpException from './HttpException';

class NotAuthorizedException extends HttpException {
    constructor() {
        super(403, "Not Authorized");
    }
}

export default NotAuthorizedException;