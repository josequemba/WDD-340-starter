const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  try {
    const nav = await utilities.getNav() // Fetch `nav` array or object
    res.render("index", { title: "Home", nav }) // Pass `nav` to EJS
  } catch (error) {
    console.error("Error fetching nav:", error)
    res.status(500).send("An error occurred while building the home page. eliud")
  }
}

module.exports = baseController