const utilities = require('../utilities');  // Import from utilities/index
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();

    // Custom error-checking logic
    if (!nav) {
      throw new Error("Failed to load navigation.");
    }

    // If everything is fine, render the register page
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    // If an error occurs, flash a message and render the page again with the error message
    req.flash("notice", "Sorry, loggin failed: " + error.message);
    
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();

    // Custom error-checking logic
    if (!nav) {
      throw new Error("Failed to load navigation.");
    }

    // If everything is fine, render the register page
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    // If an error occurs, flash a message and render the page again with the error message
    req.flash("notice", "Sorry, something went wrong: " + error.message);
    
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    //hashedPassword = await bcrypt.hashSync(req.body.password, 10) //hashSync method, which is a blocking call
    // in an async function, it’s better to use the asynchronous bcrypt.hash method to avoid blocking the event loop.
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  try {
    // Attempt to register the account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    // Check registration result
    if (regResult) {
      req.flash(
        "success",
        `Congratulations, you're registered, ${account_firstname}. Please log in.`
      );
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    // Handle errors that occur during registration
    console.error("Registration error:", error);
    req.flash("notice", "An error occurred during registration. Please try again.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
*  Process login
* *************************************** */
/* async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  try {
    // Attempt to find the account with the provided email and password
    const loginResult = await accountModel.loginAccount(
      req.body.account_email,
      req.body.account_password
    );

    // Check if login was successful
    if (loginResult === req.body.account_email) {
      req.flash(
        "success",
        `Welcome back, ${req.body.account_email}!`
      );
      //res.status(200).redirect("/"); // Redirect to a dashboard or homepage
      res.status(200).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Invalid email or password.");
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    // Handle any errors that occur during login
    console.error("Login error:", error);
    req.flash("notice", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}
 */
/* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });

    return;
  }

  try {
    const validPassword = await bcrypt.compare(account_password, accountData.account_password);
    
    if (validPassword) {
        delete accountData.account_password;
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
        
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        return res.redirect("/account/")
    } else {
      delete accountData.account_password;
      
      req.flash("notice", "Please check your email or password and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });

      return;
    }
  } catch (error) {
     return new Error('Access Forbidden')
  }
 }

/* ****************************************
 *  Process logged in user view
 * ************************************ */
 async function buildLoggedInUserView(req, res, next) {
  try {
    let nav = await utilities.getNav();

    // Custom error-checking logic
    if (!nav) {
      throw new Error("Failed to load navigation.");
    }

    // If everything is fine, render the register page
    res.render("account/account", {
      title: "Logged in",
      nav,
      errors: null,
    });
  } catch (error) {
    // If an error occurs, flash a message and render the page again with the error message
    req.flash("notice", "Sorry, something went wrong: " + error.message);
    
    let nav = await utilities.getNav();
    res.render("account/logged", {
      title: "Logged in",
      nav,
      errors: null,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, 
  loginAccount, buildLoggedInUserView 
}