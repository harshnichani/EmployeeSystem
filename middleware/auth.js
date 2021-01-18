const jwt = require("jsonwebtoken");
const Employee = require("../model/employeeSchema");
require("dotenv").config({ path: "../config/dbconn.env" });

const auth = async (req, res, next) => {
	try {
		const token = req.cookies.jwtauth;
		const verifiedUser = await jwt.verify(token, process.env.SECRET_KET);
		const user = await Employee.findOne({ _id: verifiedUser._id });
		res.locals.user = user;
		next();
	} catch (error) {
		res.redirect("/");
	}
};

module.exports = auth;
