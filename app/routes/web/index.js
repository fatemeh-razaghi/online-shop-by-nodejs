const express = require("express");
const router = express.Router();

//middlewares
const redirectIfAuthenticated = require("app/http/middleware/redirectIfAuthenticated");
const redirectIfNotAdmin = require("app/http/middleware/redirectIfNotAdmin");
const errorHandler = require("app/http/middleware/errorHandler");

//call admin routes
const adminRouter = require("app/routes/web/admin");
router.use("/admin", redirectIfNotAdmin.handle, adminRouter);

//call home routes
const homeRouter = require("app/routes/web/home");
router.use("/", homeRouter);

//call authentication routes
const authRouter = require("app/routes/web/auth");
router.use("/auth", redirectIfAuthenticated.handle, authRouter);

//handle errors for all routes
router.all("*", errorHandler.error404);
router.use(errorHandler.handler);

module.exports = router;
