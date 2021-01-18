const express = require("express");
const empController = require("../controller/empController");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", empController.login_get);

router.get("/register", empController.register_get);

router.post("/register", empController.register_post);

router.post("/", empController.login_post);

router.get("/profile", auth, empController.profile_get);

router.get("/logout", auth, empController.logout_get);

module.exports = router;
