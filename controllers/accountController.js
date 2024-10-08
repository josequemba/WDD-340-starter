const utilities = require('../utilities');  // Import from utilities/index
const accountModel = require('../models/account-model');

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
    });
  } catch (error) {
    // If an error occurs, flash a message and render the page again with the error message
    req.flash("notice", "Sorry, loggin failed: " + error.message);
    
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
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
  //const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    // Attempt to register the account
    const regResult = await accountModel.registerAccount(
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.password
    );
    
    // Check registration result
    if (regResult) {
      req.flash(
        "success",
        `Congratulations, you're registered, ${req.body.first_name}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    // Handle errors that occur during registration
    console.error("Registration error:", error);
    req.flash("notice", "An error occurred during registration. Please try again.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }