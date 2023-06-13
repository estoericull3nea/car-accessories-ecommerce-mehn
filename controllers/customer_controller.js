const Register = require("../models/register");
const Product = require("../models/product"); 
const AddedList = require("../models/added_list"); 

const nodemailer = require('nodemailer');

const Token = require("../models/token"); 
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const gTempHomepage = (req, res) => {
    res.render("temp_homepage", { pageTitle: "Welcome to EA, Sign In First" });
}

const gLogin = (req, res) => {
    res.render("login", { pageTitle: "Sign In" });
}

const gRegister = (req, res) => {
    res.render("register", { pageTitle: "Sign Up" });
}
// email service
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'noreply050623@gmail.com',
        pass: 'xlqhaxnjiowsxuyr'
    }
})

// verify transport
transporter.verify((err, success) => {
    if(err) {
        console.log(err);
    } else {
        console.log('Ready For Messages');
        console.log(success);
    }
})
// end of email service

const pRegister = async (req, res) => {


    try {
        const { email } = req.body
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;

        const existingUser = await Register.findOne({ email })

        if (existingUser) {
            res.json('email already exist in database')
        } else if (password.length <= 3) {
            res.json('password must be atleast 4 characters')
        } else {
            if (password === cpassword) {


                const newUser = new Register({
                    fullName: req.body.fullName,
                    username: req.body.username,
                    email: req.body.email,
                    password: password,
                    confirmPassword: cpassword,
                });
        
                await newUser.save()
                    .then(user => {
                    // sendVerificationEmail(result, res)
                   
                    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex')})
                    token.save().then( (err) => {

                        if(err) {
                            console.log(err);
                        }

                        const mailOptions = {
                            to: user.email,
                            from: 'noreply050623@gmail.com',
                            subject: 'Acc Verification Token',
                            html: `Please Verify Your Account by clicking this <a href="http://${req.headers.host}/confirmation/${token.token}">link</a>`
                        }

                        transporter.sendMail(mailOptions, err => {
                            if(err) {
                                console.log('failed');
                            }
                            res.render('pleaseCheck')
                        })

                    }) // end token of save
                }); // end of user save


                // await newUser.save()
                // res.redirect("/login");


            } else {
                res.json("password are not match");
            }
        }

    } catch (err) {
        res.status(400).send(err);
    }

}

const pConfirmation = (req, res) => {
    res.render('verified')
}

// const gVerify = (req, res) => {
//     const email = req.user.email

//     const mailOptions = {
//         from: 'noreply050623@gmail.com',
//         to: email,
//         subject: 'Email Verification',
//         text: 'Please click the link to verify your email.',
//       };

//       transporter.sendMail(mailOptions, (err, info) => {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log('Email sent' + info.response);
//         }
//       })
// }



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

        const ifExist = await AddedList.findOne({ imgURL: imgURL });
        if(!ifExist) {
            const newProd2 = new AddedList({
                imgURL,
                title,
                quantity,
                price,
                description,
              });
        
            const added = await newProd.save();
            const added2 = await newProd2.save();
            res.redirect('/products#prods-area')
        } else {
            res.redirect('/products#prods-area')
        }
        
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
    gTempHomepage, gLogin, gRegister, pRegister, pLogin, usingMiddleware, pAddToCart, gCart, pDeleteItemCart, gProduct, gOurTeam, pCart, gFaq, gTermsnConditions,gPrivacyPolicy, gAboutUs, gHome, pConfirmation
}