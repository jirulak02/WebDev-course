require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res) {
	res.render("home");
});

app.get("/login", function(req, res) {
	res.render("login");
});

app.post("/login", function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	async function myFindOne() {
		const foundUser = await User.findOne({email: username});

		if (foundUser) {
			bcrypt.compare(password, foundUser.password, function(err, result) {
				if (result === true) {
					res.render("secrets");
				} else {
					console.log("Incorrect password");
				}
			});
		} else {
			console.log("User not found");
		}
	}
	myFindOne();
});

app.get("/register", function(req, res) {
	res.render("register");
});

app.post("/register", function(req, res) {
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		const newUser = new User({
			email: req.body.username,
			password: hash
		});
		const saveUser = newUser.save();

		if (saveUser) {
			res.render("secrets");
		} else {
			console.log("User detailes saved");
		}
	});
});

app.listen(3000, function() {
	console.log("Server started on port 3000");
});
