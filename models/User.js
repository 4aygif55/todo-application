const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
	},
	password: { type: String, required: [true, "Password is required"] },
});

userSchema.pre("save", async function(next) {
	try {
		console.log(this.password);
		const hash = await bcrypt.hash(this.password, 10);
		this.password = hash;
		next();
	} catch (error) {
		console.log(error);
		throw Error("Could not hash password");
	}
});

mongoose.model("users", userSchema);
