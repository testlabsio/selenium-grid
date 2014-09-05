
var LOGGER = require('log4js').getLogger('inmemorynodestore.js')
  , CLEAN_PERIOD = 10000
  ;

function InMemoryNodeStore() {
    setTimeout(this._cleanNodes.bind(this), CLEAN_PERIOD);
}

InMemoryNodeStore.prototype = {

    nodes: {},

    addNode: function(node) {
        LOGGER.debug('addNode: %j', node);
        this.nodes[node.id] = node;
    },

    findNodeById: function(id) {
        LOGGER.debug('findNodeById: %s', id);
        return this.nodes[id];
    },

    findAvailableNodeWithCapabilities: function(capabilities) {
        LOGGER.debug('findNodeWithCapabilities: %j', capabilities);
        var keys = Object.keys(this.nodes);
        for (var i = 0; i < keys.length; i++) {
            var node = this.nodes[keys[i]];
            if (node.supports(capabilities)) {
                if (node.isAvailable()) {
                    LOGGER.debug('Found node with capabilities.');
                    return node;
                }
                LOGGER.debug('Found with capabilites node but busy');
            }
        }
        return null;
    },

    listAllCapabilites: function() {
        var nodes = this.listAllNodes()
          , capabilities = {}
          ;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i]
              , nc = node.getCapabilities()
              ;
            if (node.isAvailable()) {
                for (var j = 0; j < nc.length; j++) {
                    capabilities[capabilitiesToString(nc[j])] = nc[j];
                }
            }
        }
        var toReturn = [];
        Object.keys(capabilities).forEach(function(c) {
            toReturn.push(capabilities[c]);
        });
        return toReturn;
    },

    listAllNodes: function() {
        var ids = Object.keys(this.nodes)
          , nodes = []
          ;
        for (var i = 0; i < ids.length; i++) {
            nodes.push(this.nodes[ids[i]]);
        }
        return nodes;
    },

    removeNode: function(node) {
        LOGGER.debug('removeNode: %j', node);
        delete this.nodes[node.id];
    },

    _cleanNodes: function() {
        LOGGER.debug('_cleanNodes');
        var nodeStore = this;
        Object.keys(nodeStore.nodes).forEach(function(id) {
            if (nodeStore.nodes[id].hasTimedOut()) {
                LOGGER.info('Node has timed out, removing. id = %s', id)
                nodeStore.removeNode(nodeStore.nodes[id]);
            }
        });
        setTimeout(nodeStore._cleanNodes.bind(nodeStore), CLEAN_PERIOD);
    }
};

module.exports = exports = InMemoryNodeStore;

function capabilitiesToString(capabilities) {
    return capabilities.platform + capabilities.osVersion + capabilities.browserName
        + capabilities.version + capabilities.javascriptEnabled;
}
