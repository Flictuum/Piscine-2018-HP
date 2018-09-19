const { database } = require('./db-handler');

class RequestMiddleware {
    static verifySessionAndPrivilege(req, res, next) {
        let user = req.user !== undefined ? req.user.id : null;
        if (user !== null) {
            next();
        } else if (req.method === 'GET' || req.url === '/users/login' || req.url === '/whoami') {
            next();
        } else {
            res.status(400).json({ status: 'error', message: 'Please login first' });
        }
    }

    /*
    ** Method:  addActionToCollection
    ** Purpose: Monitor behavior of the user and save in the database each action taken by the user.
    */
    static addActionToCollection(req, __unused__res, next) {
        let username = req.user ? req.user.username : req.body ? req.body.username : '';
        let body = Object.assign({}, req.body);
        if (body.pw !== undefined)
            body.pw = '*';
        database('LOGS')
            .insert({ 'router': req.url, 'method': req.method, 'body': JSON.stringify(body), 'user': username ? username : '' })
            .then(__unused__res => {
                if (process.env.NODE_ENV === 'development')
                    console.log(`${req.method} - ${req.originalUrl} : ${username ? username : ''}`);
                return true;
            })
            .catch(err => {
                if (process.env.NODE_ENV === 'development')
                    console.log(`Error caught :${err}`);
                return false;
            });
        next();
    }
}


module.exports = RequestMiddleware;