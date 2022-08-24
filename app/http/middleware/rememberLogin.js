//require user model
const User = require("app/models/user");

//require autobind for use mor methods
const middleWare=require("./middleware");

class rememberLogin extends middleWare {

 //handle for when user wanted authenticate by remember token
  handle(req, res, next) {
    if (!req.isAuthenticated()) {
      const rememberToken = req.signedCookies.remember_token;
      if (rememberToken) return this.userFind(req, rememberToken, next);
    }
    next();
  }

  //userFind for when user found by a remember token then login
  userFind(req, rememberToken, next) {
    User.findOne({ rememberToken })
    .then((user) => {
     if(user){
        req.login(user, (err) => {
            if (err) next(err);
            next();
          });
     }
    })
    .catch(err=>next(err));
  

  }
}

module.exports = new rememberLogin();
