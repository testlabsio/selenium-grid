

function setup(app, express) {

  app.configure('development', function() {
    require("./development.js")(app, express);
  });

  app.configure('staging', function() {
    require("./staging.js")(app, express);
  });

  app.configure('production', function() {
    require("./production.js")(app, express);
  });
}

module.exports = exports = setup;