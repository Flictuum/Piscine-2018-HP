const ErrorHelper = require('../utils/error-utils');
const formatToJSON = require('../utils/format-response');
const message = require('../utils/message/error');
const { getEntry , createEntry, eraseEntry } = require('../utils/db-handler');

function PointController() {
    this.getPoints = PointController.prototype.getPoints.bind(this);
    this.createPoints = PointController.prototype.createPoints.bind(this);
    this.deletePoints = PointController.prototype.deletePoints.bind(this);
}

PointController.prototype.getPoints = function(req, res) {
    let whereObj = {};
    if (req.query !== undefined && req.query.hasOwnProperty('id')) {
        whereObj = {id: req.query.id};
    }
    if (req.query !== undefined && req.query.hasOwnProperty('house')) {
        whereObj = {house: req.query.house};
    }
    if (req.query !== undefined && req.query.hasOwnProperty('user')) {
        whereObj = {user: req.query.user};
    }
    getEntry('POINTS', whereObj, '*').then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.GET_FAIL));
        return false;
    });
};

PointController.prototype.createPoints = function(req, res) {
    if (!req.body.hasOwnProperty('house') || !req.body.hasOwnProperty('user') || !req.body.hasOwnProperty('points') || !req.body.hasOwnProperty('title')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return false;
    }
    if (typeof req.body.house !== 'number' || typeof req.body.user !== 'number' || typeof req.body.points !== 'number' || typeof req.body.title !== 'string') {
        res.status(400).json(ErrorHelper(message.Request.WRONGARGUMENTS));
        return false;
    }
    let entryObj = Object.assign(req.body);
    createEntry('POINTS', entryObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.GET_FAIL));
        return false;
    });
};

PointController.prototype.deletePoints = function(req, res) {
    if (req.body === undefined || !req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.Request.MISSINGARGUMENTS));
        return false;
    }
    if (typeof req.body.id !== 'number') {
        res.status(400).json(ErrorHelper(message.Request.WRONGARGUMENTS));
        return false;
    }
    eraseEntry('POINTS', {id: req.body.id}, '*').then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.Database.GET_FAIL));
        return false;
    });
};

module.exports = PointController;