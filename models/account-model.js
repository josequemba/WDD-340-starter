const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
}
async function checkExistingEmailAllowSame(account_email, account_id) {
  try {
    // Check if the email entered matches any existing user
    const sql1 = "SELECT * FROM account WHERE account_email = $1";
    const email1 = await pool.query(sql1, [account_email]);

    // If the email exists, check if it belongs to the current user
    if (email1.rowCount > 0 && email1.rows[0].account_id == account_id) {
      return false; // This means the email is valid (same as the current user's)
    }

    // Query the database to check if any other user has this email
    const sql2 = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2";
    const email2 = await pool.query(sql2, [account_email, account_id]);

    // If email exists for any user other than the current user, return true (email is taken)
    return email2.rowCount > 0;
  } catch (error) {
    return error.message;
  }
}
/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
    try {
      const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
        [account_email])
      return result.rows[0]
    } catch (error) {
      return new Error("No matching email found")
    }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountByAccountId (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account id found")
  }
}

/* ***************************
 *  Update account credentials
 * ************************** */
async function updateCredentialsById(account_firstname, account_lastname, account_email, account_profilepicture, account_phone, account_bio, account_location, account_sociallinks, account_id) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3, account_profilepicture = $4, account_phone = $5, account_bio = $6, account_location = $7, account_sociallinks = $8 WHERE account_id = $9 RETURNING *";
    const data = await pool.query(sql, [
      account_firstname, 
      account_lastname, 
      account_email,
      account_profilepicture,
      account_phone,
      account_bio,
      account_location,
      account_sociallinks, 
      account_id
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Update account password
 * ************************** */
async function updatePasswordById(account_password, account_id) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [account_password, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
* Return account full data using account id
* ***************************** */
async function getFullAccountByAccountId(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_profilepicture, account_phone, account_bio, account_location, account_joineddate, account_sociallinks FROM account WHERE account_id = $1',
      [account_id]
    );
    return result.rows[0]; // Return the first row of the result
  } catch (error) {
    console.error(error); // Log the error for debugging
    throw new Error("No matching account id found");
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountByAccountId,
  updateCredentialsById, updatePasswordById, checkExistingEmailAllowSame, getFullAccountByAccountId
 }
  