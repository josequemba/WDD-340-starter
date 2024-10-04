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
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
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

module.exports = {getClassifications, getInventoryByClassificationId,
  getDetailsByInvId
};