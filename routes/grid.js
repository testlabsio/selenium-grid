var Node = require('../model/node')
  ;

var LOGGER = require('log4js').getLogger('grid.js');

var nodeStore;

function setup(app) {
    nodeStore = app.get('nodeStore');
    app.post('/grid/register', registerNode)
    app.get('/grid/api/hub', retrieveHubStatus);
    app.get('/grid/api/proxy', retrieveNodeStatus);
    app.get('/grid/api/testsession', retrieveTestSessionStatus);
}

module.exports = exports = setup;

function registerNode(req, res) {
    LOGGER.debug('registerNode');
    var node = new Node(req.body);
    nodeStore.addNode(node);
    res.send(200, 'ok');
}

function retrieveHubStatus(req, res) {
    LOGGER.debug('retrieveHubStatus');
    res.send({success: true});
}

function retrieveNodeStatus(req, res) {
    var id = req.param('id');
    LOGGER.debug('retrieveNodeStatus, id = %s', id);
    if (id) {
        var node = nodeStore.findNodeById(id);
        if (node == null) {
            res.send({
                'msg': 'Cannot find node with ID = ' + id + ' in the registry.',
                'success': false
            });
        } else {
            node.clearError();
            res.send({
                'msg': 'Node found.',
                'success': true,
                'id': id,
                'request': node.json
            });
        }
    } else {
        res.send(400, 'No id specified.');
    }
}

function retrieveTestSessionStatus(req, res) {
    var sessionId = req.param('session') || req.body.session;
    LOGGER.debug('retrieveTestSessionStatus, sessionId = %s', sessionId);
    if (sessionId) {
        var session = nodeStore.findSessionById(sessionId);
        if (session == null) {
            res.send({
                'msg': 'Cannot find session ' + sessionId + ' in the registry.',
                'success': false
            });
        } else {
            res.send({
                'msg': 'Session found.',
                'success': true,
                'session': sessionId,
                'internalKey': sessionId,
                'inactivityTime': 0,
                'proxyId': session.node.id
            });
        }
    } else {
        res.send(400, 'No session specified.');
    }
}
