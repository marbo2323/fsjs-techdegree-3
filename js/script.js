const registrationForm = document.querySelector("form");
const userNameInputField = document.querySelector("#name");
const emailInputField = document.querySelector("#email");
const otherJobRoleInputField = document.querySelector("#other-job-role");
const titleSelectField = document.querySelector("#title");
const designSelectField = document.querySelector("#design");
const colorSelectField = document.querySelector("#color");
const activitiesFieldset = document.querySelector("#activities");
const paymentSelectField = document.querySelector("#payment");
const creditCardInputField = document.querySelector("#cc-num");
const zipCodeInputField = document.querySelector("#zip");
const cvvInputField = document.querySelector("#cvv");

const defaultPaymentMethod = "credit-card";
const validationHandlerCustomAttributeName = "data-validation-handler";

function showHideOtherJobRoleField() {
  otherJobRoleInputField.style.display =
    titleSelectField.value === "other" ? "block" : "none";
}

function filterColorSelectFieldOptionsBySelectedDesign() {
  const selectedDesign = designSelectField.value;
  const currentColor = colorSelectField.value;
  if (selectedDesign) {
    for (let colorOption of colorSelectField.options) {
      colorOption.hidden = !(colorOption.dataset.theme === selectedDesign);
    }
    if (currentColor) {
      colorSelectField.options[0].selected = true;
    }
    colorSelectField.disabled = false;
  }
}

function calculateActivitiesTotal() {
  let totalCost = 0;
  const totalRegexp = /^(Total:\s\$)(\d+)$/;
  const totalParagraph = document.querySelector("#activities-cost");

  document
    .querySelectorAll("#activities input[type='checkbox']:checked")
    .forEach((activity) => {
      totalCost += parseInt(activity.dataset.cost);
    });

  const totalReplacement = "$1" + totalCost.toString();
  totalParagraph.textContent = totalParagraph.textContent.replace(
    totalRegexp,
    totalReplacement
  );
}

function preventSelectingOverlappingActivities(e) {
  const currentCheckbox = e.target;
  const currentCheckboxDateTime = currentCheckbox.dataset.dayAndTime;

  if (currentCheckboxDateTime) {
    const fieldSet = currentCheckbox.closest("fieldset");
    fieldSet
      .querySelectorAll(
        `input[type='checkbox'][data-day-and-time='${currentCheckboxDateTime}']`
      )
      .forEach((checkBox) => {
        checkBox.disabled =
          checkBox !== currentCheckbox && currentCheckbox.checked;
      });
  }
}

function togglePaymentMethodSection() {
  const selectedPaymentethod = paymentSelectField.value;

  for (let option of paymentSelectField.options) {
    if (!option.hidden) {
      const paymentMethod = option.value;
      document.querySelector(`#${paymentMethod}`).style.display =
        paymentMethod === selectedPaymentethod ? "block" : "none";
    }
  }
}

function isValidName(userName) {
  return userName.trim() !== "";
}

function isValidEmail(emaiAddress) {
  return /^[^@]+@[^@.]+\.[a-z]+$/i.test(emaiAddress);
}

function isValidActivites() {
  return (
    document.querySelectorAll("#activities input[type='checkbox']:checked")
      .length > 0
  );
}

function isValidCreditCard(cardNumber) {
  return /^\d{13,16}$/.test(cardNumber);
}

function isValidZipCode(zipCode) {
  return /^\d{5}$/.test(zipCode);
}

function isValidCvv(cvv) {
  return /^\d{3}$/.test(cvv);
}

function validateInputField(inputField, validationHandler) {
  const fielLabel = inputField.closest("label");
  const fieldHint = inputField.parentNode.querySelector("span.hint");
  if (!validationHandler(inputField.value)) {
    console.log(inputField.id + " is not valid");
    fielLabel.className = "not-valid";
    fieldHint.style.display = "block";
    event.preventDefault();
  } else {
    fielLabel.className = "valid";
    fieldHint.style.display = "none";
  }
}

function validateForm(event) {
  const validateActivities = () => {
    const activitiesLegend = activitiesFieldset.querySelector("legend");
    const activitiesHint = activitiesFieldset.querySelector("p.hint");
    if (!isValidActivites()) {
      console.log("activities fieldset is not valid");
      activitiesLegend.classList.add("not-valid");
      activitiesHint.style.display = "block";
      event.preventDefault();
    } else {
      activitiesLegend.classList.remove("not-valid");
      activitiesLegend.classList.add("valid");
      activitiesHint.style.display = "none";
    }
  };

  validateInputField(userNameInputField, isValidName);
  validateInputField(emailInputField, isValidEmail);
  if (paymentSelectField.value === defaultPaymentMethod) {
    validateInputField(creditCardInputField, isValidCreditCard);
    validateInputField(zipCodeInputField, isValidZipCode);
    validateInputField(cvvInputField, isValidCvv);
  }
  validateActivities();
}

function setupCheckBoxFocusStyle() {
  activitiesFieldset
    .querySelectorAll("input[type='checkbox']")
    .forEach((checkBox) => {
      checkBox.addEventListener("focus", (e) => {
        e.target.parentElement.className = "focus";
      });

      checkBox.addEventListener("blur", (e) => {
        activitiesFieldset
          .querySelector("label.focus")
          .classList.remove("focus");
      });
    });
}

function initFormFeatures() {
  userNameInputField.focus();
  showHideOtherJobRoleField();
  colorSelectField.disabled = true;
  paymentSelectField.value = defaultPaymentMethod;
  togglePaymentMethodSection();

  titleSelectField.addEventListener("change", showHideOtherJobRoleField);
  designSelectField.addEventListener(
    "change",
    filterColorSelectFieldOptionsBySelectedDesign
  );

  activitiesFieldset.addEventListener("change", calculateActivitiesTotal);
  activitiesFieldset.addEventListener(
    "change",
    preventSelectingOverlappingActivities
  );

  paymentSelectField.addEventListener("change", togglePaymentMethodSection);

  registrationForm.addEventListener("submit", validateForm);
  setupCheckBoxFocusStyle();

  // write validation handler names to
  // the required field data attribute
  userNameInputField.setAttribute(
    validationHandlerCustomAttributeName,
    isValidName.name
  );
  emailInputField.setAttribute(
    validationHandlerCustomAttributeName,
    isValidEmail.name
  );
  creditCardInputField.setAttribute(
    validationHandlerCustomAttributeName,
    isValidCreditCard.name
  );
  zipCodeInputField.setAttribute(
    validationHandlerCustomAttributeName,
    isValidZipCode.name
  );
  cvvInputField.setAttribute(
    validationHandlerCustomAttributeName,
    isValidCvv.name
  );

  // add event listeners to the required fields to make
  // them use the validation function from data attribute
  document
    .querySelectorAll(`form [${validationHandlerCustomAttributeName}]`)
    .forEach((field) => {
      field.addEventListener("input", (e) => {
        console.log("validating field " + e.target.id);
        const validationFandler = window[e.target.dataset.validationHandler];
        validateInputField(e.target, validationFandler);
      });
    });
}

initFormFeatures();
