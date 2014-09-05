

function Node(json) {
  this._json = json;
  this.id = json.configuration.remoteHost;
  this.url = json.configuration.remoteHost;
  this.secretKey = json.configuration.secretKey;
  this.timeout = json.configuration.timeout;
  this.lastUpdated = new Date();
  this.lastSession = null;
  this._state = Node.AVAILABLE;
  this.error = null;
  this.key = '';
}

Node.prototype.setKey = function(key) {
  this.key = key;
};

Node.prototype.isAvailable = function() {
  return this._state === Node.AVAILABLE;
};

Node.prototype.hasTimedOut = function() {
  return (new Date() - this.lastUpdated) > this.timeout;
};

Node.prototype.startSession = function(capabilities) {
  this._state = Node.BUSY;
};

Node.prototype.endSession = function(capabilities) {
  this._state = Node.AVAILABLE;
};

Node.prototype.getCapabilities = function() {
  return this._json.capabilities;
};

Node.prototype.setError = function(e) {
  this._state = Node.ERROR;
  this.lastUpdated = new Date();
  this.error = e;
};

Node.prototype.clearError = function() {
  this.lastUpdated = new Date();
  if (this._state === Node.ERROR) {
    this._state = Node.AVAILABLE;
    this.error = null;
  }
};

Node.prototype.supports = function(capabilities) {
  if (this.secretKey && this.secretKey !== capabilities.secretKey) {
    return false;
  }
  if (this.key && this.key !== capabilities.key) {
    return false;
  }
  for (var i = 0; i < this._json.capabilities.length; i++) {
    var pc = this._json.capabilities[i]
      , match = true;
      ;
    Object.keys(capabilities).every(function(key) {
      match = matches(capabilities[key], pc[key]);
      return match;
    });
    if (match) {
      return true;
    }
  }
  return false;
};

Node.AVAILABLE = 'node:available';
Node.BUSY = 'node:busy';
Node.ERROR = 'node:error';

module.exports = exports = Node;

function matches(lhs, rhs) {
  if (lhs === undefined || rhs === undefined) {
    return true;
  }
  if (lhs === null || rhs === null) {
    return true;
  }
  if (lhs === '' || rhs === '') {
    return true;
  }

  if (typeof(lhs) === 'string') {
    lhs = lhs.toLowerCase();
  }
  if (typeof(rhs) === 'string') {
    rhs = rhs.toLowerCase();
  }

  if (lhs === 'any' || rhs === 'any') {
    return true;
  }
  if (lhs === rhs) {
    return true;
  }
  return false;
}
