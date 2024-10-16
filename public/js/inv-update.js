'use strict' 

//normal approach if changes are not done
/* const form = document.querySelector("#inventoryForm")
    console.log('eliud 00001')
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    }) */

//if changes are not done shows a message
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#inventoryForm");
    const updateBtn = document.querySelector("button");
    
    // Capture the initial form data
    const initialData = new FormData(form);
  
    // Enable the button when changes are detected
    form.addEventListener("change", function () {
      updateBtn.removeAttribute("disabled");
    });
  
    // Check if changes were made on form submission
    form.addEventListener("submit", function (e) {
      const currentData = new FormData(form);
      let dataChanged = false;
  
      // Compare current form data with initial form data
      for (let [key, value] of currentData.entries()) {
        if (value !== initialData.get(key)) {
          dataChanged = true;
          break;
        }
      }
  
      // If no changes were made, prevent form submission and show a message
      if (!dataChanged) {
        e.preventDefault();
        alert("No changes were made. Please update the form before submitting.");
      }
    });
});