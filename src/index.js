let express = require('express');
let os = require('os');
const configPath = '../config/piscine-hp.config'
let config = require(configPath);
let DashboardServer = require('./dashboardServer');

let server = express()
let dashboardServer = new DashboardServer(config)

dashboardServer.start().then((router) => {
    server.set('x-powered-by', false);
    server.use(router);
    server.listen(config.port, (error) => {
        if (error) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
    return true;
}).catch((error) => {
    console.error(error); // eslint-disable-line no-console
    return false;
});