// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require('../utilities');  // Import from utilities/index
const regValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicles details view
router.get("/detail/:invId", invController.buildByInvId);

// Route to access managment verhicle
router.get("/", invController.buildManagmentView);

// Route to access add classification
router.get("/add-classification", invController.buildAddClassificationView);

// Route to access add inventory
router.get("/add-inventory", invController.buildAddInventoryView);

// Process adding new classification
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClasData,
    utilities.handleErrors(invController.buildAddClassification),
)

// Process adding new inventory
router.post(
    "/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkInvData,
    utilities.handleErrors(invController.buildAddInventory),
)
module.exports = router;