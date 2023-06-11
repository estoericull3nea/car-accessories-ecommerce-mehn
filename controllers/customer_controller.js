const Register = require("../models/register");
const Product = require("../models/product"); 

const gTempHomepage = (req, res) => {
    res.render("temp_homepage", { pageTitle: "Welcome to EA, Sign In First" });
}

const gLogin = (req, res) => {
    res.render("login", { pageTitle: "Sign In" });
}

const gRegister = (req, res) => {
    res.render("register", { pageTitle: "Sign Up" });
}

const pRegister = async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;

    if (password === cpassword) {

        const newUser = new Register({
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            password: password,
            confirmPassword: cpassword,
        });

        await newUser.save();

        res.redirect("/login");
    } else {
        res.send("password are not match");
    }
    } catch (err) {
        res.status(400).send(err);
    }
}

const pLogin = async (req, res) => {
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
}

const usingMiddleware = async(req, res, next) => {
    latestUser = await Register.findOne().sort({ createdAt: -1 }).limit(1);
    const userID = latestUser._id; 

    Register.findById(userID)
        .then((userInDb) => {
        req.user = userInDb;
        next();
    })
    .catch((err) => console.log(err));
}

const pAddToCart = (req, res) => {
    req.user
        .addToCart(req.body.id)
        .then(() => res.redirect('/home#cart-section'))
        .catch((err) => console.log(err));
}

const gCart = (req, res) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
    res.render("cart", {
        cart: user.cart,
        pageTitle: "Cart",
    });
    }).catch((err) => console.log(err));
}

const pDeleteItemCart = (req, res, next) => {
    req.user
      .removeCart(req.body.id)
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
}

const gProduct = (req, res) => {
    res.render("products", { pageTitle: "Products" });
}

const gOurTeam = (req, res) => {
    res.render("our_team", { pageTitle: "Our Team" });
}

const pCart = async(req, res) => {
    try {
        const { imgURL, title, quantity, price, description } = req.body;
    
        const newProd = new Product({
          imgURL,
          title,
          quantity,
          price,
          description,
        });
    
        const added = await newProd.save();
        res.redirect('/products#prods-area')
      } catch (err) {
        res.status(400).send(err);
    }
}

const gFaq = (req, res) => {
    res.render("faq", { pageTitle: "FAQ" });
}

const gTermsnConditions = (req, res) => {
    res.render("terms_and_conditions", { pageTitle: "Terms and Condition" });
}

const gPrivacyPolicy = (req, res) => {
    res.render("privacy_policy", { pageTitle: "Privacy Policy" });
}

const gAboutUs = (req, res) => {
    res.render("about_us", { pageTitle: "About Us" });
}

const gHome = (req, res) => {
    Product.find().then((products) => {
        res.render("main_homepage", {
            prods: products,
            pageTitle: "Welcome to EA",
        });
    });
}



module.exports = {
    gTempHomepage, gLogin, gRegister, pRegister, pLogin, usingMiddleware, pAddToCart, gCart, pDeleteItemCart, gProduct, gOurTeam, pCart, gFaq, gTermsnConditions,gPrivacyPolicy, gAboutUs, gHome
}