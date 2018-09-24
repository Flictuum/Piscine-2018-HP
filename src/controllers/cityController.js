const ErrorHelper = require('../utils/error-utils');
const formatToJSON = require('../utils/format-response');
const message = require('../utils/message/error');
const { getEntry, createEntry, eraseEntry } = require('../utils/db-handler');

function CityController() {
    this.getCity = CityController.prototype.getCity.bind(this);
    this.createCity = CityController.prototype.createCity.bind(this);
    this.deleteCity = CityController.prototype.deleteCity.bind(this);
}

CityController.prototype.getCity = function (req, res) {
    let whereObj = {};
    if (req.query !== undefined && req.query.hasOwnProperty('id')) {
        whereObj = {id: req.query.id};
    }
    getEntry('CITIES', whereObj, '*').then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.GET_FAIL));
        return false;
    });
};

CityController.prototype.createCity = function (req, res) {
    let entryObj = {};
    if (!req.body.hasOwnProperty('name')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return false;
    }
    if (typeof req.body.name !== 'string') {
        res.status(400).json(ErrorHelper(message.Request.WRONGARGUMENTS));
        return false;
    }
    entryObj.name = req.body.name;
    createEntry('CITIES', entryObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.CREATION_FAIL));
        return false;
    });
};

CityController.prototype.deleteCity = function (req, res) {
    if (req.body === undefined || !req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return false;
    }
    if (typeof req.body.id !== 'number') {
        res.status(400).json(ErrorHelper(message.Request.WRONGARGUMENTS));
        return false;
    }
    eraseEntry('CITIES', {id: req.body.id}, '*').then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.GET_FAIL));
        return false;
    });
};

module.exports = CityController