const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the lodin and logout HTML 
 ************************** */
Util.getTools = async function (req, res, next, loggedin, userName) {

  if (loggedin == 0) {
    res.locals.accountData = {
      account_id: 0,
      account_firstname: '',
      account_lastname: '',
      account_email: '',
      account_type: '',
      iat: 0,
      exp: 0
    }
    res.locals.loggedin = 0
  }

  let tools = '<div id="tools">';
  if (loggedin !== 0) {
    tools += `<p>Welcome ${userName},</p>`;
    tools += '<a title="Click to log out" href="/account/logout">LOGOUT</a>';
  } else {
    tools += '<a title="Click to log in" href="/account/login">MY ACCOUNT</a>';
  }
  
  tools += '</div>';
  
  return tools;
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildVehicleDetail = async function(vehicles) {
  let details = '';  // Initialize details to an empty string

  if (vehicles.length > 0) {
    details = '<div class="vehicle-detail">';
    
    vehicles.forEach(vehicle => {
      /* details += '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details">'; */

      // Vehicle Image
      details += '<div class="vehicle-image">';
      details += '<img src="' + vehicle.inv_image + '" alt="Full image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">';
      details += '</div>';
      
      // Vehicle Info Section
      details += '<div class="vehicle-info">';
      
      // Title (Make, Model, Year)
      details += '<h1>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>';
      
      // Price
      details += '<p class="price">Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>';
      
      // Mileage
      details += '<p class="mileage">Mileage: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>';
      
      //color
      details += '<p class="vehicle-color">Color: ' + vehicle.inv_color + '</p>';

      // Description
      details += '<div class="description">';
      details += '<h3>Description:</h3>';
      details += '<p>' + vehicle.inv_description + '</p>';
      details += '</div>';
      
      details += '</div>';  // Close vehicle-info
      details += '</div>';  // Close vehicle-detail
    });
  } else {
    details = '<p class="notice">Sorry, the vehicle details could not be found.</p>';
  }

  return details;
};

/* ****************************************
 * Build dropdown classifications
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check type user
 * ************************************ */
Util.checkUserType = (req, res, next) => {
  const typeAccount = res.locals.accountData ? res.locals.accountData.account_type : null
   
  //has to loging to access the page
  if (typeAccount == null) {
    req.flash('notice', 'You must be logged in to access this page.');
    console.log(typeAccount);
    return res.redirect('/account/login');
  }

  // Deny access if the account type is not allowed
  if (typeAccount == "Client") {
    req.flash('notice', 'You do not have permission to access this page. Login as administrator');
    console.log(typeAccount);
    return res.redirect('/account/login');
  }

  next()
}

/* ****************************************
 *  Account view
 * ************************************ */
Util.buildAccountView = async function (req, res, next, accountData) {
  const accountType = accountData.account_type ?? ''

  let accountView = '<h2>Welcome ' + accountData.account_firstname + '</h2>';
  accountView += "<p>Your're logged in.</p>"

  // Update Account Information link (visible to all users)
  accountView += '<a href="/account/update/' + accountData.account_id + '" title="Update your account information"> Update Account Information</a>';

  // Conditional logic for Employee or Admin
  if (accountType === "Employee" || accountType === "Admin") {
    accountView += "<h3>Inventory Management</h3>";
    accountView += '<p><a href="/inv" title="Manage Inventory">Manage Inventory</a></p>';
  }

  return accountView;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;