const express = require("express");
const path = require("path");
const app = express();
require("./db/conn");
const Register = require("./models/register");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", template_path);

app.get("/", (req, res) => {
  res.render("temp_homepage", { pageTitle: "Welcome to EA, Sign In First" });
});

app.get("/login", (req, res) => {
  res.render("login", { pageTitle: "Sign In" });
});

app.get("/register", (req, res) => {
  res.render("register", { pageTitle: "Sign Up" });
});

app.get("/products", (req, res) => {
  res.render("products", { pageTitle: "Products" });
});

app.get("/our-team", (req, res) => {
  res.render("our_team", { pageTitle: "Our Team" });
});

app.get("/cart", (req, res) => {
  res.render("cart", { pageTitle: "Cart" });
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
      // res.render("main_homepage");
      res.redirect("/login");
    } else {
      res.send("password are not match");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });
    if (useremail.password === password) {
      // res.status(200).render("main_homepage");
      res.redirect("/home");
    } else {
      res.send("Email or Password is Incorrect");
    }
  } catch (error) {
    res.status(400).send("Account not found");
  }
});

app.get("/about_us", (req, res) => {
  res.render("about_us", { pageTitle: "About Us" });
});

app.get("/home", (req, res) => {
  res.render("main_homepage", { pageTitle: "Welcome to EA" });
});

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
