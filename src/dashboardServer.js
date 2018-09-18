//External node module imports
const express = require('express');
const expressSession = require('express-session');
const body_parser = require('body-parser');
const passport = require('passport');
const { migrate, erase } = require('./utils/db-handler')

function DashboardServer(config) {
    this.config = config;
    this.app = express();

    // Bind member functions
    this.start = DashboardServer.prototype.start.bind(this);
    this.setupUsers = DashboardServer.prototype.setupUsers.bind(this);
    this.setupHouses = DashboardServer.prototype.setupHouses.bind(this);

    this.app.set('x-powered-by', false);
}

DashboardServer.prototype.start = function () {
    let _this = this
    return new Promise((resolve, reject) => {
        erase();
        migrate().then(() => {

            // Setup sessions with third party middleware
            _this.app.use(expressSession({
                secret: 'EPISCINE',
                saveUninitialized: false,
                resave: false,
                cookie: { secure: false },
                store: _this.mongoStore
            })
            );

            _this.app.use(passport.initialize());
            _this.app.use(passport.session());

            // Init third party middleware for parsing HTTP requests body
            _this.app.use(body_parser.urlencoded({
                extended: true
            }));
            _this.app.use(body_parser.json());

            _this.setupUsers()

            resolve(_this.app);
            return true;
        }).catch((error) => {
            reject(error);
            return false
        });
    });
}

DashboardServer.prototype.setupUsers = function () {
    // Import the controller
    const UserController = require('./controllers/userController');
    this.userCtrl = new UserController();

    //Passport session serialize and deserialize
    passport.serializeUser(this.userCtrl.serializeUser);
    passport.deserializeUser(this.userCtrl.deserializeUser);

    this.app.route('/whoami')
        .get(this.userCtrl.whoAmI); //GET current session user

    // Log the user in
    this.app.route('/users/login').post(this.userCtrl.loginUser);

    // Log the user out
    this.app.route('/users/logout').post(this.userCtrl.logoutUser);

    // Interacts with the user in the DB
    // (POST : create / DELETE : delete / PUT : modify)
    // Real path is /users
    this.app.route('/users')
        .get(this.userCtrl.getUser)
        .post(this.userCtrl.createUser)
        .delete(this.userCtrl.eraseUser);
}

DashboardServer.prototype.setupHouses = function () {

}

module.exports = DashboardServer;