

document.addEventListener("DOMContentLoaded", function() {
    const textarea = document.getElementById("invDescription");
    const validationIcon = document.getElementById("validationIcon");

    if (textarea && validationIcon) {
        textarea.addEventListener("input", function() {
            const value = textarea.value;
            const isValid = value.length >= 10 && value.length <= 500 && /^[\w\s.,!?'\'-]*$/.test(value);

            if (isValid) {
                textarea.classList.add("valid");
                textarea.classList.remove("invalid");
                validationIcon.classList.add("valid");
                validationIcon.classList.remove("invalid");
                validationIcon.innerHTML = "&#10003;"; // Checkmark
            } else {
                textarea.classList.add("invalid");
                textarea.classList.remove("valid");
                validationIcon.classList.add("invalid");
                validationIcon.classList.remove("valid");
                validationIcon.innerHTML = "&#10060;"; // Cross
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const textarea = document.getElementById("accountBio");
    const validationIcon = document.getElementById("validationIcon");

    if (textarea && validationIcon) {
        textarea.addEventListener("input", function() {
            const value = textarea.value;
            const isValid = value.length >= 10 && value.length <= 500 && /^[\w\s.,!?'\'-]*$/.test(value);

            if (isValid) {
                textarea.classList.add("valid");
                textarea.classList.remove("invalid");
                validationIcon.classList.add("valid");
                validationIcon.classList.remove("invalid");
                validationIcon.innerHTML = "&#10003;"; // Checkmark
            } else {
                textarea.classList.add("invalid");
                textarea.classList.remove("valid");
                validationIcon.classList.add("invalid");
                validationIcon.classList.remove("valid");
                validationIcon.innerHTML = "&#10060;"; // Cross
            }
        });
    }
});