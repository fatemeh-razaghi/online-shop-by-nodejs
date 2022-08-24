//handle all errors
class errorHandler {

    //define error 404
  async error404(req, res, next) {
    try {
      res.statusCode = 404;
      throw new Error("چنین صفحه ای یافت نشد!");
    } catch (err) {
      next(err);
    }
  }

  //handle errors 
  async handler(err , req , res , next){

    //get items
    const statusCode=err.status || 500;
    const message = err.message || "";
    const stack = err.stack || "";
  
    //define a master for error layouts
    const layouts = {
      layout: "errors/master",
      extractStyles: false,
      extractScripts: false,
    };
  
    if (config.debug) return res.render("errors/stack", { message, stack, ...layouts });
  
    return res.render(`errors/${statusCode}` ,{message , stack , ...layouts});

  }
}

module.exports = new errorHandler();
 