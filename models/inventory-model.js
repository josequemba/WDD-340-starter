const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT i.*, c.classification_name 
      FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );

    if (data.rows.length === 0) {
      return { message: "No inventory found for the specified classification." };
    }

    return data.rows;
  } catch (error) {
    console.error("error: " + error);
    throw new Error("Database query failed.");
  }
}

async function getDetailsByInvId(inv_id) {
  try {
    const detailsData = await pool.query(
      `SELECT * FROM public.inventory
       WHERE inv_id = $1`,
      [inv_id]
    );

    // Return the rows from the query result
    return detailsData.rows;
  } catch (e) {
    console.error('Error fetching inventory details:', e.message);
    
    // Optionally, rethrow or handle the error more gracefully
    throw new Error('Could not fetch inventory details');
  }
}

async function addClassification(classification_name) {
  try {
      // SQL query to insert the new classification
      const sql = `
          INSERT INTO public.classification (classification_name)
          VALUES ($1)
          RETURNING *`;
      const result = await pool.query(sql, [classification_name]);

      return result.rows[0]; // Return the inserted classification row
  } catch (error) {
      console.error('Error adding classification:', error);
      throw new Error('Could not add classification. Please try again later.');
  }
}

async function addInventory(data) {
  try {
      // Destructure the data object to extract required fields
      const {
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
      } = data;

      // SQL query to insert the new inventory item
      const sql = `
          INSERT INTO public.inventory (
            classification_id, inv_make, inv_model, inv_description, 
            inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *`;
      // Execute the query and return the result
      const result = await pool.query(sql, [classification_id, inv_make, 
        inv_model, inv_description, inv_image, 
        inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]);
      
      return result.rows[0]; // Return the inserted inventory row
  } catch (error) {
      console.error('Error adding inventory new vehicle:', error);
      throw new Error('Could not add new vehicle item. Please try again later.');
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(account_email){
  try {
    const sql = `SELECT * FROM public.classification WHERE classification_name = $1`
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId,
  getDetailsByInvId, addClassification, addInventory, checkExistingClassification
};