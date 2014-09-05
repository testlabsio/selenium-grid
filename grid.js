
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , createNodeProxy = require('./routes/nodeproxy')
  , setup = require('./config/setup.js')
  , less = require('less-middleware')
  , routes = require('./routes')
  , security = require('connect-security')
  ;

var InMemoryUserProvider = require('connect-security/lib/service/inmemoryuserprovider')
  , BasicAuthenticationFilter = require('connect-security/lib/filter/basicauthenticationfilter')
  , BasicAuthenticationEntryPoint = require('connect-security/lib/entrypoint/basicauthenticationentrypoint')
  ;

var app = express();

setup(app, express);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);

  app.engine('ejs', require('ejs-locals'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  app.use(express.favicon());

  app.use(express.cookieParser());
  app.use(express.cookieSession({ key: 'testlabs-grid', secret: 'jdHU82*sH3!!laD' }));

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
  }))

  // all requests to /wd/hub/* should be proxied through to a node.
  app.use(createNodeProxy(app.get('host'), app.get('nodeStore'), app.get('sessionStore')));

  // set correct content-type on register requests
  app.use(function(req, res, next) {
    if (req.method == 'POST' && /\/grid\/register/.test(req.path)) {
      req.headers['content-type'] = 'application/json';
    }
    next();
  });

  app.use(express.bodyParser());
  app.use(app.router);
  app.use(less({ src: path.join(__dirname, 'public') }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(security.errorHandler());
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("TestLabs Grid listening on port " + app.get('port'));
});
