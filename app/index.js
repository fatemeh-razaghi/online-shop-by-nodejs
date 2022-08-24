const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const validator = require("express-validator");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const Helpers = require("./helpers");
const methodOverride = require("method-override");
const rememberLogin = require("app/http/middleware/rememberLogin");

module.exports = class Application {
  constructor() {
    this.setupExpress();
    this.setMongoConnection();
    this.setConfig();
    this.routers();
  }

  //setup Express
  setupExpress() {
    const server = http.createServer(app);
    server.listen(config.port, () =>
      console.log(`listening on port ${config.port}...`)
    );
  }

  //setup Mongodb
  setMongoConnection() {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.database.url);
  }

  //set Config
  setConfig() {
    //require passport-local strategy for register and login
    require("app/passport/passport-local");

    //static files of express
    app.use(express.static(config.layout.public_dir));

    //template engine is 'ejs'
    app.set("view engine", config.layout.view_engin);

    //path of views
    app.set("views", config.layout.view_dir);

    // master page layouts configs
    app.use(config.layout.ejs.expressLayouts);
    app.set("layout extractScripts", config.layout.ejs.extractScripts);
    app.set("layout extractStyles", config.layout.ejs.extractStyles);
    app.set("layout", config.layout.ejs.master);

    // parse application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // override with POST having ?_method=DELETE
    app.use(methodOverride("_method"));

    //cookie-parser middleware
    app.use(cookieParser(config.cookie_secretkey));

    //express-validator middleware
    app.use(validator());

    //session config
    app.use(session({ ...config.session }));

    //connect-flash middleware
    app.use(flash());

    //config passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    //read rememberlogin
    app.use(rememberLogin.handle);

    //locals configs for after user authenticated
    app.use((req, res, next) => {
      app.locals = new Helpers(req, res).getObjects();
      next();
    });

  }

  //call routers with middlewares
  routers() {
    app.use(require("app/routes/web"));
    app.use(require("app/routes/api"));
  }
};
