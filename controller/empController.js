const Employee = require("../model/employeeSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/dbconn.env" });

const login_get = (req, res) => {
	res.render("login", { msg: "" });
};

const register_get = (req, res) => {
	res.render("register", { msg: "" });
};

const register_post = async (req, res) => {
	const { firstName, lastName, organizationName, email, password, password2 } = req.body;

	try {
		if (password === password2) {
			const employeeDetails = await new Employee({
				firstName,
				lastName,
				organizationName,
				email,
				password,
			});

			const token = await employeeDetails.generateToken();

			res.cookie("jwtauth", token, {
				expires: new Date(Date.now() + 300000),
				httpOnly: true,
			});

			const registered = await employeeDetails.save();

			res.render("register", { msg: "Employee Registered Successfully!!!" });
		} else {
			res.render("register", { msg: "Passwords do not match!!!" });
		}
	} catch (error) {
		console.log(error);
		res.render("register", { msg: "Please fill all the details!!!" });
	}
};

const login_post = async (req, res) => {
	try {
		const { email, password } = req.body;

		const employee = await Employee.findOne({ email });

		const isMatch = await bcrypt.compare(password, employee.password);

		const token = await employee.generateToken();

		res.cookie("jwtauth", token, {
			expires: new Date(Date.now() + 300000),
			httpOnly: true,
		});

		if (isMatch) {
			res.redirect("/profile");
		} else {
			res.render("login", { msg: "User Details Invalid" });
		}
	} catch (error) {
		res.render("login", { msg: "User Details Invalid" });
	}
};

const profile_get = async (req, res) => {
	const employees = await Employee.find({});
	res.render("profile", { employees: employees });
};

const logout_get = (req, res) => {
	res.clearCookie("jwtauth");
	res.redirect("/");
};

module.exports = {
	login_get,
	register_get,
	register_post,
	login_post,
	profile_get,
	logout_get,
};
