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
router.get('/', utilities.handleErrors(accountController.buildLoggedInUserView));

// GET route for logout the user
router.get('/logout', utilities.handleErrors(accountController.logoutAccount));

// GET route for acount update
router.get(
    '/update/:account_id',
    utilities.checkLogin, 
    utilities.handleErrors(accountController.updateAccount)
);

router.post(
    '/update/credentials', 
    utilities.checkLogin,
    regValidate.credentialsRules(),
    regValidate.checkUpdateAcountData,
    utilities.handleErrors(accountController.updateAccountCredentials)
);

router.post(
    '/update/password', 
    utilities.checkLogin,
    regValidate.passwordRules(),
    regValidate.checkUpdateAcountData,
    utilities.handleErrors(accountController.updateAccountPassword)
);
// Export the router
module.exports = router;