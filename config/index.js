
function setup(app) {
  console.log('Loading', app.get('env'), 'environment');
  require('./' + app.get('env') + '.js')(app);
  return app;
}
module.exports = setup;
