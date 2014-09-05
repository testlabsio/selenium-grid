var Node = require('../model/node');

var LOGGER = require('log4js').getLogger('api.js');

var nodeStore
  , sessionStore
  ;

function setup(app) {
    nodeStore = app.get('nodeStore');
    sessionStore = app.get('sessionStore');
    app.get('/api/nodes', getNodes);
    app.get('/api/sessions', getSessions);
    app.get('/api/capabilities', getCapabilites);
}

module.exports = exports = setup;

function getNodes(req, res) {
    LOGGER.debug('getNodes');
    res.send({nodes: nodeStore.listAllNodes()});
}

function getSessions(req, res) {
    LOGGER.debug('getSessions');
    res.send({sessions: nodeStore.listAllSessions()});
}

function getCapabilites(req, res) {
    LOGGER.debug('getCapabilites');
    res.send({capabilities: nodeStore.listAllCapabilites()});
}
