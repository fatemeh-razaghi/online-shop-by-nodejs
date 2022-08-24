const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");



module.exports={

        secret:process.env.SESSION_SECRETKEY ,
        resave: false,
        saveUninitialized: true,
        cookie: {expires : new Date(Date.now() +1000*60*60*24) },
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    
}