//require passport package
const passport = require("passport");

//require passport-local package
const localStrategy = require("passport-local").Strategy;

//require user model
const User = require("app/models/user");

//seve user information in session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//passport configuration for register
passport.use(
  "local.register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      //if same user exist
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (user)
          return done(
            null,
            false,
            req.flash(
              "errors",
              "کاربری با چنین مشخصاتی قبلا در سایت ثبت نام کرده است"
            )
          );

        //creat new user
        const newUser = new User({
          name: req.body.name,
          email,
          password,
        });
        //save user in DB
        newUser.save((err) => {
          if (err)
            return done(
              err,
              req.flash(
                "errors",
                "ثبت نام با مشکلی مواجه شده ، لطفا مجددا تلاش کنید"
              )
            );
           done(null, newUser);
        });
      });
    }
  )
);


//passport configuration for login
passport.use(
  "local.login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      //if same user exist
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);

        if(! user || ! user.comparePassword(password)){
        return done(null , false , req.flash("errors" , "این کاربر قبلا در سایت ثبت نام نکرده است" ));
        }

        done(null , user)
      });
    }
  )
);
