const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const expressSession = require("express-session");

require("./models/User");
require("./models/TodoItem");


const User = mongoose.model("users");


mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

const app = express();

app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/fonts", express.static(__dirname + "/public/fonts"));
app.use("/vendor", express.static(__dirname + "/public/vendor"));
app.use("/images", express.static(__dirname + "/public/images"));



app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(expressSession({ secret: 'foo barr',
	cookie: { expires: Date.now() + (30 * 86400 * 1000) },
	resave: true,
	saveUninitialized: true 
}));

global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userId && !global.user) {
    const user = await User.findById(req.session.userId);
    global.user = user;
  }
  next();
});

app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store')
	next()
  });

app.set("view engine", "ejs");


require("./controllers/user")(app);
require("./controllers/todo")(app);

app.get("/", function (req, res) {
	res.render("pages/index", { error: false });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);