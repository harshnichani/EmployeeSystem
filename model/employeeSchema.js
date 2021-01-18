const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/dbconn.env" });

const employeeSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	organizationName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		index: {
			unique: true,
		},
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

employeeSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

employeeSchema.methods.generateToken = async function () {
	try {
		const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KET);
		return token;
	} catch {
		console.log("Error!!");
	}
};

const Employee = mongoose.model("employees", employeeSchema);

module.exports = Employee;
