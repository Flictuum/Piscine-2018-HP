const ErrorHelper = require('../utils/error-utils');
const formatToJSON = require('../utils/format-response');
const message = require('../utils/message/error');
const { getEntry, createEntry, eraseEntry } = require('../utils/db-handler');

function HouseController() {
    this.getHouse = HouseController.prototype.getHouse.bind(this);
    this.createHouse = HouseController.prototype.createHouse.bind(this);
    this.deleteHouse = HouseController.prototype.deleteHouse.bind(this);
}

HouseController.prototype.getHouse = function (req, res) {
    let whereObj = {};
    if (req.query !== undefined && req.query.hasOwnProperty('id')) {
        whereObj = {id: req.query.id};
    }
    getEntry('HOUSES', whereObj, '*').then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.GET_FAIL));
        return false;
    });
};

HouseController.prototype.createHouse = function (req, res) {
    let entryObj = {};
    if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('image') || !req.body.hasOwnProperty('referent')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return false;
    }
    if (typeof req.body.name !== 'string' || typeof req.body.image !== 'string' || typeof req.body.referent !== 'number') {
        res.status(400).json(ErrorHelper(message.Request.WRONGARGUMENTS));
        return false;
    }
    entryObj.name = req.body.name;
    entryObj.image = req.body.image;
    entryObj.referent = req.body.referent;
    createEntry('HOUSES', entryObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.CREATION_FAIL));
        return false;
    });
};

HouseController.prototype.deleteHouse = function (req, res) {
    if (req.body === undefined || !req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return false;
    }
    if (typeof req.body.id !== 'number') {
        res.status(400).json(ErrorHelper(message.Request.WRONGARGUMENTS));
        return false;
    }
    eraseEntry('HOUSES', {id: req.body.id}, '*').then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.GET_FAIL));
        return false;
    });
};

module.exports = HouseController