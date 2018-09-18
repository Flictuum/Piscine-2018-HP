const nodeify = require('nodeify');
const ErrorHelper = require('../utils/error-utils');
const formatToJSON = require('../utils/format-response');
const message = require('../utils/message/error');
const { getEntry, createEntry, eraseEntry } = require('../utils/db-handler');

function UserController() {
    this.user = new userCore();

    this.serializeUser = UserController.prototype.serializeUser.bind(this);
    this.deserializeUser = UserController.prototype.deserializeUser.bind(this);
    this.getUser = UserController.prototype.getUser.bind(this);
    this.createUser = UserController.prototype.createUser.bind(this);
    this.eraseUser = UserController.prototype.eraseUser.bind(this);
    this.loginUser = UserController.prototype.loginUser.bind(this);
    this.logoutUser = UserController.prototype.logoutUser.bind(this);
    this.whoAmI = UserController.prototype.whoAmI.bind(this);
}

/**
 * @fn serializeUser
 * @desc Called by session middleware to simplify user model
 * @param deserializedUser User as a plain JS object with all its properties
 * @param done
 */
UserController.prototype.serializeUser = function (deserializedUser, done) {
    if (deserializedUser.hasOwnProperty('id') === false)
        done('User has no ID', null);
    else {
        done(null, {
            id: deserializedUser.id,
            username: deserializedUser.username
        });
    }
};

/**
 * @fn deserializeUser
 * @desc Called by session middleware to roll back on the user model
 * @param serializedUser As returned by deserializeUser
 * @param done Callback to pass the deserialized user result to
 */
UserController.prototype.deserializeUser = function (serializedUser, done) {
    nodeify(this.user.getUserByID(serializedUser.id).then((user) => {
        if (user.length > 0)
            return [null, user[0]];
        return [`Failed to retreive the user for ID ${serializedUser.id}`, null];
    }).catch((error) => [`Session broke: ${error}`, null]), (__unused__error, [message, user]) => {
        done(message, user);
    });
};

UserController.prototype.getUser = function (req, res) {
    let whereObj = {}
    if (req.body.hasOwnProperty('id'))
        whereObj['id'] = req.body.id;
    if (req.body.hasOwnProperty('username'))
        whereObj['username'] = req.body.username;
    getEntry('USERS', whereObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    })
};

UserController.prototype.createUser = function (req, res) {
    if (!req.body.hasOwnProperty('pw') || !req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('realname')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return;
    }
    if (typeof req.body.pw !== 'string' || typeof req.body.username !== 'string' || typeof req.body.isAdmin !== 'number' || typeof req.body.realname !== 'string') {
        res.status(400).json(ErrorHelper(message.Request.WRONGARGUMENTS));
        return;
    }
    let entryObj = {};
    let hashContainer = generateAndHash(req.body.pw);
    entryObj.username = req.body.username;
    entryObj.realname = req.body.realname;
    entryObj.pw = hashContainer.hashed;
    entryObj.salt = hashContainer.salt;
    entryObj.iterations = hashContainer.iteration;
    this.user.createUser(req.user, req.body).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Users.CREATION_FAIL, error));
        return false;
    });
};

UserController.prototype.eraseUser = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        eraseEntry('USERS', {id: req.body.id}).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.Users.ERASEFAILED, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.Request.WRONGARGUMENTS));
        return;
    }
};

UserController.prototype.loginUser = function (req, res) {
    if (!req.body.hasOwnProperty('pw') || !req.body.hasOwnProperty('username')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return;
    }
    this.user.loginUser(req.body).then((result) => {
        req.login(result, (err) => {
            if (err) {
                res.status(400).send(ErrorHelper('Failed to login', err));
                return false;
            }
            delete result.pw;
            delete result.salt;
            delete result.iteration;
            res.status(200).json({ status: 'OK', message: 'Successfully logged in', account: result });
        });
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(error));
        return false;
    });
};

UserController.prototype.logoutUser = function (req, res) {
    // this.user.logoutUser(req.user).then(() => {
    req.session.destroy((err) => {
        if (req.user === undefined || req.user === null) {
            res.status(401);
            res.json(ErrorHelper('Not logged in'));
            return;
        }
        req.logout();
        if (err) {
            res.status(500);
            res.json(ErrorHelper('Cannot destroy session', err));
        }
        else {
            res.status(200);
            res.json({ message: 'Successfully logged out' });
        }
    });
};

/**
 * @fn whoAmI
 * @desc Based on the current session,
 * returns which user if logged in if any
 * @param req Express.js request object
 * @param res Express.js response object
 */
UserController.prototype.whoAmI = function (req, res) {
    let Iam = req.user;
    if (Iam === undefined || Iam === null) {
        res.status(404);
        res.json(ErrorHelper('An unknown unicorn'));
    }
    else {
        res.status(200);
        res.json(Iam);
    }
};

module.exports = UserController;