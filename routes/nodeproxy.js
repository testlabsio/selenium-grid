
var request = require('request')
  ;

var LOGGER = require('log4js').getLogger('nodeproxy.js');

var host
  , nodeStore
  , sessionStore
  ;

function createNodeProxy(newHost, newNodeStore, newSessionStore) {
  host = newHost;
  nodeStore = newNodeStore;
  sessionStore = newSessionStore;

  return function handleRequest(req, res, next) {
    if (!(/^\/wd\/hub.*$/.test(req.path))) {
      next();
    } else {
      LOGGER.debug('handling request to %s, body = %j', req.path, req.body);
      if (isNewSessionRequest(req)) {
        handleNewSession(req, res);
      } else if (isEndSessionRequest(req)) {
        handleEndSession(req, res);
      } else {
        var sessionId = getSessionId(req.path)
          , session = sessionStore.findSessionById(sessionId)
          , node = session && session.node
        ;
        if (node === null) {
          var error = 'Error forwarding request, no node found for session id ' + sessionId;
          LOGGER.debug('Returning error for %s. error = %s', req.path, error);
          res.send(500, error);
        } else {
          session.lastUpdated = new Date();
          forward(node, req, res);
        }
      }
    }
  };
}

module.exports = exports = createNodeProxy;


function isNewSessionRequest(req) {
  return req.method === 'POST'
    && req.path === '/wd/hub/session';
}

function handleNewSession(req, res) {
  LOGGER.debug('Handling new session');
  readBody(req, function(rawBody) {
    function newSession() {
      var body = JSON.parse(rawBody)
        , desiredCapabilities = body.desiredCapabilities
        , node = nodeStore.findAvailableNodeWithCapabilities(desiredCapabilities)
        ;
      if (node == null) {
        res.send(503,
          'Error forwarding new session request, no nodes available for desired capabilities.');
      } else {
        node.startSession(desiredCapabilities);
        LOGGER.debug('Forwarding new session request to ', node.url);
        request({
          uri: node.url + '/wd/hub/session',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: rawBody,
          followRedirect: false
        }, function(error, response, body) {
          var location = response && response.headers['location']
            , sessionId = getSessionId(location, body)
            ;
          if (sessionId !== null) {
            sessionStore.startSession(sessionId, node, desiredCapabilities);
            LOGGER.debug('Session started with id %s', sessionId);
            if (location) {
              res.setHeader('Location', location.replace(node.url, host));
              res.send(302);
            } else {
              res.setHeader('Content-Type', response.headers['content-type'])
              res.send(body);
            }
          } else {
            LOGGER.error('Error starting session with node, ', error);
            node.setError(error);
            newSession();
          }
        }).on('error', function(e) {
          LOGGER.error('Error making request', e);
          node.setError(e);
          newSession();
        });
      }
    }
    newSession();
  });
}

function isEndSessionRequest(req) {
  return req.method === 'DELETE'
    && /^(.*)session\/[^\/]*$/.test(req.path);
}

function handleEndSession(req, res) {
  var sessionId = getSessionId(req.path)
    , session = sessionStore.endSession(sessionId)
    , node = session && session.node
    ;
  if (node) {
    LOGGER.debug('Ending session %s', sessionId);
    forward(node, req, res);
  } else {
    LOGGER.info('No session found for end session call.  sessionId = %s', sessionId);
  }
}

function forward(node, req, res) {
  LOGGER.debug('Forwarding request to node %s', node.id);
  req.pipe(request({ uri: node.url + req.path, followRedirect: false })).pipe(res);
}

function getSessionId(path, body) {
  if (path) {
    var match = path && path.match(/.*\/session\/([^\/]*).*/);
    if (match) {
      return match[1];
    }
    return null;
  }
  try {
    var json = JSON.parse(body);
    return json['sessionId'];
  } catch (e) {
  }
  return null;
}

function readBody(req, cb) {
  var buf = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){ buf += chunk });
  req.on('end', function(){
    cb(buf.trim());
  });
}
