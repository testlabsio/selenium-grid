
// Session timeout in millis, 3 minutes.
var TIMEOUT = 180000;

function Session(id, node, capabilities) {
  this.id = id;
  this.node = node;
  this.capabilities = capabilities;
  this.lastUpdated = new Date();
}

Session.prototype.end = function() {
  this.node.endSession(this.capabilities);
};

Session.prototype.hasExpired = function() {
  return (new Date() - this.lastUpdated) > TIMEOUT;
};

module.exports = exports = Session;
