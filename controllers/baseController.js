const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res, next){
  try {
    const nav = await utilities.getNav() // Fetch `nav` array or object

    req.flash("notice", "This is a flash message.");

    const accountData = res.locals.accountData ?? {}
    const userName = accountData.account_firstname ?? ""
    const loggedin = res.locals.loggedin ?? 0
    const tools = await utilities.getTools(req, res, next, loggedin, userName)

    //account data stucture
    /* {
      account_id: 10,
      account_firstname: 'JOSÉ',
      account_lastname: 'QUEMBA',
      account_email: 'quembajoseeliud@gmail.com',
      account_type: 'Client',
      iat: 1729183016,
      exp: 1729186616
    } */
    //account data stucture

    res.render("index", { title: "Home", nav, tools}) // Pass `nav` to EJS
  } catch (error) {
    console.error("Error fetching nav:", error);
    res.status(500).send("An error occurred while building the home page.");
  }
}

module.exports = baseController