const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .isEmail()
        //.normalizeEmail() // refer to validator.js docs  - takes dots away
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
  validate.loginRules = () => {
    return [
      // valid email is required
      body("account_email")
        .trim()
        .isEmail()
        //.normalizeEmail() - takes dots away
        .withMessage("Please provide a valid email."), // Error message on invalid email
  
      // password is required
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Please provide a password.") // Error message if password is empty
    ]
  }

  /* ******************************
 * Check data and return errors or continue to Login
 * ***************************** */
  validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
  }
  
  /*  **********************************
  *  Update credentials Validation Rules
  * ********************************* */
validate.credentialsRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      //.normalizeEmail()  - takes dots away
      .withMessage("A valid email is required.")
      .custom(async (account_email, data) => {
        const account_id = await data.req.body.account_id

        const emailExists = await accountModel.checkExistingEmailAllowSame(account_email, account_id)

        if (emailExists){
          throw new Error("Email exists. Please use different email")
        }
    }),
    // Profile picture URL (optional)
    body("account_profilepicture")
      .trim()
      .notEmpty()
      .withMessage("Please provide a valid URL for the profile picture."),

    // Phone number is required and must match the pattern
    body("account_phone")
      .trim()
      .notEmpty()
      .matches(/^\+?[\d\s().-]{10,15}$/)
      .withMessage("Please enter a valid phone number with 10-15 digits."),

    // Bio is required, length 10-500, and must match allowed characters
    body("account_bio")
      .trim()
      .notEmpty()
      .isLength({ min: 10, max: 500 })
      .matches(/^[\w\s.,!?'\'-]*$/)
      .withMessage("Please enter a valid bio (10-500 characters)."),

    // Location is required and limited to 100 characters
    body("account_location")
      .trim()
      .notEmpty()
      .isLength({ max: 100 })
      .withMessage("Please enter a valid location (up to 100 characters)."),

    // Social media link is required and must be a valid URL
    body("account_sociallinks")
      .trim()
      .notEmpty()
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage("Please enter a valid URL starting with http or https."),
  ]
}

/*  **********************************
  *  Update password Validation Rules
  * ********************************* */
validate.passwordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to update 
 * ***************************** */
   validate.checkUpdateAcountData = async (req, res, next) => {
    const { 
      account_firstname,
      account_lastname,
      account_email,
      account_profilepicture,
      account_phone,
      account_bio,
      account_location,
      account_sociallinks,
      account_id,
    } = req.body

    const accountData = res.locals.accountData ?? {} 
    const userName = accountData.account_firstname ?? ""
    const loggedin = res.locals.loggedin ?? 0
    const tools = await utilities.getTools(req, res, next, loggedin, userName)

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      return res.render("account/update-account", {
        title: "Update Account",
        nav,
        errors,
        tools,
        account_firstname,
        account_lastname,
        account_email,
        account_profilepicture,
        account_phone,
        account_bio,
        account_location,
        account_sociallinks,
        account_id,
      })
    }
    next()
  }

  module.exports = validate;