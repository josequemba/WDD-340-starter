const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const inventoryModel = require("../models/inventory-model")


/*  **********************************
  *  Adding inventory Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
      // Classification is required
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a classification."),
  
      // Make is required and must have a minimum length of 3 characters
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Make must be at least 3 characters long."),
  
      // Model is required and must have a minimum length of 3 characters
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Model must be at least 3 characters long."),
  
      // Description is required and must be between 10 and 500 characters
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10, max: 500 })
        .withMessage("Description must be between 10 and 500 characters."),
  
      // Image path is required
      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Image path is required."),
  
      // Thumbnail path is required
      body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Thumbnail path is required."),
  
      // Price is required and must be a valid number greater than or equal to 0
      body("inv_price")
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid number greater than or equal to 0."),
  
      // Year is required and must be a 4-digit number between 1900 and the current year
      body("inv_year")
        .notEmpty()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage("Please enter a valid 4-digit year."),
  
      // Miles is required and must be a valid number (digits only)
      body("inv_miles")
        .notEmpty()
        .matches(/^[0-9]+$/)
        .withMessage("Miles must be digits only."),
  
      // Color is required
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Color is required."),
    ];
};

/* ******************************
 * Check data and return errors or continue to adding inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color } = req.body
    let errors = []

    console.log('eliuddcfcvefvfe')
    console.log(req.body)
    
    const classificationNames = await utilities.buildClassificationList(classification_id)

    errors = validationResult(req);

    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        classificationNames,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      })
      return
    }
    next()
}

/*  **********************************
  *  Adding classification Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // Classification name is required and must contain only alphabetic characters (no spaces or special characters)
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Classification name must contain only alphabetic characters, no spaces or special characters.")
        .custom(async (classification_name) => {
            const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
            console.log('eliud fedfdfd')
            console.log(classificationExists)
            if (classificationExists){
              throw new Error("Classification already exists. Please try a different name")
            }
        })
    ];
};


/* ******************************
 * Check data and return errors or continue to adding chassification
 * ***************************** */
validate.checkClasData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req);

    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name
      })
      return
    }
    next()
}


module.exports = validate;