//require autobind for use mor methods
const middleWare = require("./middleware");

class convertFileToField extends middleWare {
  //handle method for when admin user uploaded file dont show any error message
  handle(req , res , next) {
    if(! req.file) 
        req.body.images = undefined;
    else
        req.body.images = req.file.filename;

    next();
}
}

module.exports = new convertFileToField();
