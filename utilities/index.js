const invModel = require("../models/inventory-model")
const Util = {}

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
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
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

Util.buildLoginForm = async function () {
  
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;