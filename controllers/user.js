
const mongoose = require("mongoose");
const User = mongoose.model("users");
const bcrypt = require("bcrypt");

module.exports = (app) => {

	app.post("/register", async (req, res) => {
		if (req.body.psw !== req.body.pswRepeat) {
			return res.render("pages/register", {
				error: true,
				errors: { password: "Passwords do not match." },
			});
		}
		console.log(req.body.email);
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		

		if(!re.test(req.body.email)) {
			return res.render("pages/register", {
				error: true,
				errors: { email: "Please enter correct email format" },
			});	
		}
		const emailExist = await User.find({email: req.body.email});
		console.log(emailExist.length);
		if(emailExist.length > 0) {
			return res.render("pages/register", {
				error: true,
				errors: { email: "Email already registerd." },
			});
		}

		const user = new User({
			email: req.body.email,
			password: req.body.psw,
		});

		try {
			await user.save();
			return res.redirect("/login");
		} catch (err) {
			console.log(err);
			return res.render("pages/http500");
		}
	});

	app.get("/register", async (req, res) => {
		res.render("pages/register", { error: false });
	});

	app.get("/login", async(req, res) => {
		res.render("pages/login", { error: false })
	})

	app.post("/login", async(req, res) => {
		try {
			console.log(req.psw);
			const user = await User.findOne({ email: req.body.email });

			if(!user) {
				return res.render("pages/login", {error: true, errors: {login: "Wrong email or password"}});
			}

			const match = await bcrypt.compare(req.body.psw, user.password);

			if(match) {
				req.session.userId = user._id;
				console.log(req.session.userId);
				return res.redirect("/todos");
			}

			res.render("pages/login", { error: false })
		} catch (error) {
			console.log(error);
		}
	});

	app.get("/logout", async (req, res) => {
		req.session.destroy();
		global.user = false;
		res.redirect('/');
	});
};