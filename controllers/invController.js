const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;

  //getting classification mame through the server
  const classifications = await invModel.getClassifications();
  const classification = classifications.rows
      .filter(element => element.classification_id == classification_id)

  //getting the vehiles
  let data = await invModel.getInventoryByClassificationId(classification_id)
  let className;

  //check if there is not vehicle data under classifications
  if (data.message) {
    className = classification.map(element => element.classification_name);;
  } else {
    //getting classification mame through the vihicles
    className = data[0].classification_name
  }

  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const detailsData = await invModel.getDetailsByInvId(inv_id);
  const detailsGrid = await utilities.buildVehicleDetail(detailsData);
  let nav = await utilities.getNav();
  const vehicleName = detailsData[0].inv_make;
  res.render("./inventory/details", {
    title: vehicleName + " details",
    nav,
    detailsGrid,
  })
}

invCont.buildManagmentView = async function (req, res, next) {
  let nav = await utilities.getNav();
  //select list
  const classificationSelect = await utilities.buildClassificationList()
  
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  })
}

invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.buildAddInventoryView = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const classificationNames = await utilities.buildClassificationList(classification_id)
  let nav = await utilities.getNav();
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationNames,
    errors: null,
  })
};

invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let data = req.body;
  const classification_id = req.params.classificationId
  const classificationNames = await utilities.buildClassificationList(classification_id)

  console.log(data);

  try {
    // Attempt to register the account
    const regResult = await invModel.addInventory(
      data
    );

    // Check registration result
    if (regResult) {
      req.flash(
        "success",
        `Congratulations, you've added ${data.inv_make} ${data.inv_model} to the list of vehicles`
      );
      return res.status(201).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationNames
      });
    } else {
      req.flash("notice", "Sorry, adding a vehicle failed.");
      return res.status(501).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationNames
      });
    }
  } catch (error) {
    // Handle errors that occur during registration
    console.error("Error:", error);
    req.flash("notice", "An error occurred during the process. Please try again.");
    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classificationNames
    });
  }
}

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  let data = req.body;

  try {
    // Attempt to register the account
    const regResult = await invModel.addClassification(
      data.classification_name
    );

    // Check registration result
    if (regResult) {
      req.flash(
        "success",
        `Congratulations, you've added ${data.classification_name} as a new classification`
      );
      return res.status(201).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, adding classification failed.");
      return res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    // Handle errors that occur during registration
    console.error("Error:", error);
    req.flash("notice", "An error occurred during the process. Please try again.");
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.classification_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetailsByInvId(inv_id)
  const classificationNames = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationNames: classificationNames,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Edit inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("success", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.classification_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetailsByInvId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Delete inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    classification_id,
  } = req.body

  const itemName = `${inv_make} ${inv_model}`;

  const updateResult = await invModel.deleteInventoryItem(inv_id);

  if (updateResult) {
    req.flash("success", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    let nav = await utilities.getNav()
    const itemData = await invModel.getDetailsByInvId(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: inv_id,
      inv_make: inv_make,
      inv_model: inv_model,
      inv_year: inv_year,
      inv_price: inv_price,
      classification_id: classification_id
    })
  }
}

module.exports = invCont;