const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");
const Register = require("./models/register");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("temp_homepage");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/products", (req, res) => {
  res.render("products");
});

app.get("/our-team", (req, res) => {
  res.render("our_team");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;

    if (password === cpassword) {
      const newUser = new Register({
        email: req.body.email,
        password: password,
        confirmPassword: cpassword,
      });

      const registered = await newUser.save();
      res.render("main_homepage");
    } else {
      res.send("password are not match");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// app.get("/main_homepage", (req, res) => {
//   res.render("main_homepage");
// });

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });
    if (useremail.password === password) {
      res.status(200).render("main_homepage");
    } else {
      res.send("Email or Password is Incorrect");
    }
  } catch (error) {
    res.status(400).send("Account not found");
  }
});

app.get("/about_us", (req, res) => {
  res.render("about_us");
});

app.get("/home", (req, res) => {
  res.render("main_homepage");
});

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
