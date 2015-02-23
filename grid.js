
var express = require('express')
  , path = require('path')
  , security = require('connect-security')
  , createNodeProxy = require('./routes/nodeproxy')
  , config = require('./config')
  , routes = require('./routes')
  ;

var InMemoryUserProvider = require('connect-security/lib/service/inmemoryuserprovider')
  , BasicAuthenticationFilter = require('connect-security/lib/filter/basicauthenticationfilter')
  , BasicAuthenticationEntryPoint = require('connect-security/lib/entrypoint/basicauthenticationentrypoint')
  ;

var app = express();

config(app);

app.set('port', process.env.PORT || 3000);

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('express-session')({
  resave: true,
  saveUninitialized: true,
  secret: 'jdHU82*sH3!!laD'
}));

if (app.get('users')) {
  app.use(security({
    interceptUrls: [
      { url: /^\/(css|img|js)/, access: 'isAuthenticated()' },
      { url: /^\/admin/, access: 'hasRole("admin")' },
      { url: /^\/api/, access: 'isAuthenticated()' },
      { url: /^\//, access: 'hasRole("user")' }
    ],
    filters: [
      new BasicAuthenticationFilter({
        userProvider : new InMemoryUserProvider({
          users: app.get('users')
        })
      })
    ],
    entryPoint: new BasicAuthenticationEntryPoint({
      realmName: 'TestLabs Grid'
    })
  }));
}

// all requests to /wd/hub/* should be proxied through to a node.
app.use('/wd/hub', createNodeProxy(app.get('host'), app.get('nodeStore'), app.get('sessionStore')));

// set correct content-type on register requests
app.use(function(req, res, next) {
  if (req.method === 'POST' && /\/grid\/register/.test(req.path)) {
    req.headers['content-type'] = 'application/json';
  }
  next();
});

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());

routes(app);

if (app.get('users')) {
  app.use(security.errorHandler());
}

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('TestLabs Grid listening at http://%s:%s', host, port);
});
