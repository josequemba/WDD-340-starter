const express = require('express');
const router = express.Router();
const utilities = require('../utilities');  // Import from utilities/index
const accountController = require('../controllers/accountController');  // Placeholder for the account controller
const regValidate = require('../utilities/account-validation');

// GET route for "My Account" page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// GET route for "registration" page
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process the registration data with validator
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount),
)

// GET route for logged users
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildLoggedInUserView));

// Export the router
module.exports = router;