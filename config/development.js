
var InMemoryNodeStore = require('../repository/inmemorynodestore')
  , InMemorySessionStore = require('../repository/inmemorysessionstore')
  , Node = require('../model/node')
  , request = require('request')
  , log4js = require('log4js')
  ;

function setup(app, express) {

    log4js.setGlobalLogLevel('DEBUG');

    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(log4js.connectLogger(log4js.getLogger('express.js')));

    var nodeStore = new InMemoryNodeStore();
    nodeStore.addNode(new Node({
      configuration: { remoteHost: 'localhost:60001', timeout: 180000 },
      capabilities: []
    }));

    app.set('nodeStore', nodeStore);
    app.set('sessionStore', new InMemorySessionStore());
    app.set('host', 'http://localhost:3000');

    app.set('users', {
        'framework': {
            username : 'framework',
            password : 'password',
            roles : [ 'user' ]
        },
        'node': {
            username : 'node',
            password : 'password',
            roles : [ 'user' ]
        },
        'admin': {
            username : 'admin',
            password : 'password',
            roles : [ 'admin' ]
        }
    })
}

module.exports = exports = setup;
