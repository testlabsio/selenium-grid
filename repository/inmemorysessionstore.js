
var Session = require('../model/session');

var LOGGER = require('log4js').getLogger('inmemorysessionstore.js')
  , CLEAN_PERIOD = 10000
  ;

function InMemorySessionStore() {
    setTimeout(this._cleanSessions.bind(this), CLEAN_PERIOD);
}

InMemorySessionStore.prototype = {

  sessions: {},

  endSession: function(sessionId) {
    LOGGER.debug('endSession: %s', sessionId);
    var session = this.sessions[sessionId];
    if (session) {
      session.end();
      delete this.sessions[sessionId];
    }
    return session;
  },

  findSessionById: function(id) {
    LOGGER.debug('findSessionById: %s', id);
    return this.sessions[id];
  },

  listAllSessions: function() {
    var ids = Object.keys(this.sessions)
      , sessions = []
      ;
    for (var i = 0; i < ids.length; i++) {
      sessions.push(this.sessions[ids[i]]);
    }
    return sessions;
  },

  startSession: function(sessionId, node, capabilities) {
    LOGGER.debug('startSession: %s, %s', sessionId, node.id);
    this.sessions[sessionId] = new Session(sessionId, node, capabilities);
    return sessionId;
  },

  _cleanSessions: function() {
    LOGGER.debug('_cleanSessions');
    var sessionStore = this;
    Object.keys(sessionStore.sessions).forEach(function(sessionId) {
      if (sessionStore.sessions[sessionId].hasExpired()) {
        LOGGER.info('Session has expired, removing.  sessionId = %s', sessionId)
        sessionStore.endSession(sessionId);
      }
    });
    setTimeout(sessionStore._cleanSessions.bind(sessionStore), CLEAN_PERIOD);
  }
};

module.exports = exports = InMemorySessionStore;
