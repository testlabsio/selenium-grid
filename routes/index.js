
function setup(app) {
  require('./admin')(app);
  require('./grid')(app);
  require('./api')(app);
}

module.exports = exports = setup;