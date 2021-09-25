const router = require("express").Router();

const User = require("../models/User");
const passport = require("passport");

router.get("/users", (req, res) => {
	res.render("users/all-users");
});

router.get("/users/signin", (req, res) => {
	res.render("users/signin");
});

router.post("/users/signin",passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/users/signin",
		failureFlash: true,
	})
);

router.get("/users/signup", (req, res) => {
	res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
	const { name,last_name,phone, email, password, confirm_password } = req.body;
	const errors = [];
	if (name.length == 0) {
		errors.push({ text: "Por favor, inserta tu nombre" });
	}
	if (email.length == 0) {
		errors.push({ text: "Por favor, inserta tu email" });
	}
	if (password.length == 0) {
		errors.push({ text: "Por favor, inserta una contraseña" });
	} else {
		if (confirm_password.length == 0) {
			errors.push({ text: "Por favor, confirma tu contraseña" });
		}
		if (password.length < 4) {
			errors.push({ text: "Contraseña debil" });
		}
		if (password != confirm_password) {
			errors.push({ text: "Claves no coinciden" });
		}
	}

	if (errors.length > 0) {
		res.render("users/signup", {
			errors,
			name,
			last_name,
			phone,
			email,
			password,
			confirm_password,
		});
	} else {
		const newUser = await new User({
			name,
			last_name,
			phone,
			email,
			password,
		});
		const emailUser = await User.findOne({ email: email });
		if (emailUser) {
			req.flash("error_msg", "you are register");
			res.redirect("/users/signup");
		}
		newUser.password = await newUser.encryptPassword(password);
		await newUser.save();
		req.flash("success_msg", "you are register");
		res.redirect("/users/signin");
	}
});

router.get("/users/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

module.exports = router;
