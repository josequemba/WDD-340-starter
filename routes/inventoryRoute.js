// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require('../utilities');  // Import from utilities/index
const regValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicles details view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to access managment verhicle
router.get("/", utilities.checkUserType, utilities.handleErrors(invController.buildManagmentView));

// Route to access add classification
router.get("/add-classification", utilities.checkLogin, utilities.checkUserType, utilities.handleErrors(invController.buildAddClassificationView));

// Route to access add inventory
router.get("/add-inventory", utilities.checkLogin, utilities.checkUserType, utilities.handleErrors(invController.buildAddInventoryView));

// Process adding new classification
router.post(
    "/add-classification",
    utilities.checkLogin,
    regValidate.classificationRules(),
    regValidate.checkClasData,
    utilities.checkUserType,
    utilities.handleErrors(invController.buildAddClassification),
)

// Process adding new inventory
router.post(
    "/add-inventory",
    utilities.checkLogin,
    regValidate.inventoryRules(),
    regValidate.checkInvData,
    utilities.checkUserType,
    utilities.handleErrors(invController.buildAddInventory),
)

//inventory route by the javascript code
router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.handleErrors(invController.getInventoryJSON))

//inventory edit route
router.get("/edit/:classification_id", utilities.checkLogin, utilities.handleErrors(invController.editInventoryView))

//inventory edit click route
router.post(
    "/update/", 
    utilities.checkLogin,
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.checkUserType,
    utilities.handleErrors(invController.updateInventory),
),

//inventory deletion route
router.get("/delete/:classification_id", utilities.checkLogin, utilities.checkUserType, utilities.handleErrors(invController.deleteInventoryView)),

//inventory deletion click route
router.post("/delete/", utilities.checkLogin, utilities.checkUserType, utilities.handleErrors(invController.deleteInventory)),

module.exports = router;