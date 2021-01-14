const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = async (req, res, next) => {
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.redirect('/login');
    }
    next();
}