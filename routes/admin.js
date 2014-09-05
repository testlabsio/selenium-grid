var nodeStore
  , sessionStore;

function setup(app) {

  nodeStore = app.get('nodeStore');
  sessionStore = app.get('sessionStore');

  app.get('/admin', displayAdmin);
  app.get('/admin/capabilities', displayCapabilities);
  app.get('/admin/nodes', displayNodes);
  app.post('/admin/nodes', updateNodes);
  app.get('/admin/sessions', displaySessions);
}

module.exports = exports = setup;

function displayAdmin(req, res) {
  res.render('admin/index', {
    title: 'Admin'
  });
}

function displayCapabilities(req, res) {
  if (req.headers['accept'] === 'application/json') {
    res.send({capabilities: nodeStore.listAllCapabilites() });
  } else {
    res.render('admin/capabilities', {
      title: 'Capabilities',
      capabilities: nodeStore.listAllCapabilites()
    });
  }
}

function displayNodes(req, res) {
  res.render('admin/nodes', {
    title: 'Nodes',
    nodes: nodeStore.listAllNodes()
  });
}

function displaySessions(req, res) {
  res.render('admin/sessions', {
    title: 'Sessions',
    sessions: sessionStore.listAllSessions()
  });
}

function updateNodes(req, res) {
  var nodes = nodeStore.listAllNodes()
    , key = null
    ;
  nodes.forEach(function (node) {
    key = req.param(node.id);
    node.setClientId(key);
  });
  res.redirect('/admin/nodes');
}
