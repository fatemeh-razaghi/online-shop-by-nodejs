const session=require("./session");
const database=require("./database");
const layout=require("./layout");
const service=require("./service");



module.exports={
   session,
   database,
   layout,
   service,
   port:process.env.APPLICATION_PORT,
   cookie_secretkey:process.env.COOKIE_SECRETKEY,
   debug:true,

}