// Add the root project directory to the app module search path:
require("app-module-path").addPath(__dirname);


//call class Application in index.js
const App = require("./app");

//access env file
require("dotenv").config();

//access to config 
global.config=require("./config");


new App();
