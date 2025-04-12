let reservation = JSON.parse(localStorage.getItem("reservation")) || [];
console.log(reservation);
document.addEventListener("DOMContentLoaded", updateTable);

let editingRow = -1;
const form = document.getElementById("rentalForm");
const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const carType = document.getElementById("carType");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const totalCost = document.getElementById("totalCost");
const table = document.getElementById("reservationTable");

/// error messages

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const carTypeError = document.getElementById("carTypeError");
const startDateError = document.getElementById("startDateError");
const endDateError = document.getElementById("endDateError");

// ACTIONS
// carType test
const isValidCarType = () => {
  return carType.value !== "";
};

// start date test
const isValidDateS = () =>
  startDate.value !== "" &&
  Math.floor(new Date(startDate.value) / (1000 * 60 * 60 * 24)) >=
    Math.floor(new Date() / (1000 * 60 * 60 * 24));

// end date test
const isValidDateE = () =>
  endDate.value !== "" && new Date(endDate.value) >= new Date(startDate.value);

function displayTotalCost() {
  const rentDays =
    (new Date(endDate.value).getTime() - new Date(startDate.value).getTime()) /
    1000 /
    60 /
    60 /
    24;
  const totalCost1 = Number.parseInt(carType.value) * rentDays;
  if (isValidCarType() && isValidDateS() && isValidDateE()) {
    totalCost.value = totalCost1 + " TND";
  } else totalCost.value = "0 TND";
}

carType.addEventListener("input", displayTotalCost);
startDate.addEventListener("input", displayTotalCost);
endDate.addEventListener("input", displayTotalCost);

function isValidForm() {
  let isValid = true;
  // name test
  const isValidName = () =>
    name.value.split(/\s+/).reduce((res, w) => res && w.length >= 3) &&
    name.value.split(" ").length >= 2;

  if (!isValidName()) {
    nameError.classList.remove("hidden");
    isValid = false;
  } else nameError.classList.add("hidden");

  // email test
  const isValidEmail = () =>
    !email.value.startsWith("@") &&
    email.value.includes("@") &&
    email.value.includes(".", email.value.indexOf("@")) &&
    !email.value.endsWith(".");

  if (!isValidEmail()) {
    emailError.classList.remove("hidden");
    isValid = false;
  } else emailError.classList.add("hidden");

  // phone test

  const isValidPhone = () => {
    const trimedPhone = phone.value.trim().split(" ").join("");
    const isNotNumber = isNaN(trimedPhone);
    return !isNotNumber && trimedPhone.length == 8;
  };
  if (!isValidPhone()) {
    phoneError.classList.remove("hidden");
    isValid = false;
  } else {
    phoneError.classList.add("hidden");
  }

  if (carType.value == "") {
    carTypeError.classList.remove("hidden");
    isValid = false;
  } else carTypeError.classList.add("hidden");

  if (!isValidDateS()) {
    startDateError.classList.remove("hidden");
    isValid = false;
  } else startDateError.classList.add("hidden");

  // end date

  if (!isValidDateE()) {
    endDateError.classList.remove("hidden");
    isValid = false;
  } else endDateError.classList.add("hidden");

  // last return
  return isValid;
}

// add reservation

function addReservation() {
  const row = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    carType: carType.options[carType.selectedIndex].text,
    startDate: startDate.value,
    endDate: endDate.value,
    totalCost: totalCost.value,
  };
  reservation.push(row);
  localStorage.setItem("reservation", JSON.stringify(reservation));
  updateTable();
}

function updateTable() {
  const table = document.getElementById("reservationTable");
  table.innerHTML = "";
  reservation.forEach((e, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${e.name}</td>
    <td>${e.email}</td>
    <td>${e.phone}</td>
    <td>${e.carType}</td>
    <td>${e.startDate}</td>
    <td>${e.endDate}</td>
    <td>${e.totalCost}</td>
    <td>
    <button class="bg-blue-400 px-3 rounded text-xs text-white" onclick="editRow(${i})">Edit</button>
    <button class="bg-red-400 px-3 rounded text-xs text-white" onclick="deleteRow(${i})">Delete</button>
    </td>
  `;
    tr.classList.add("text-center");
    table.appendChild(tr);
  });
}

// function edit
function editRow(index) {
  const row = reservation[index];
  name.value = row.name;
  email.value = row.email;
  phone.value = row.phone;
  carType.value =
    row.carType == "Economy ($50/day)"
      ? "50"
      : row.carType == "Standard ($70/day)"
      ? "70"
      : "100";
  startDate.value = row.startDate;
  endDate.value = row.endDate;
  totalCost.value = row.totalCost;
  editingRow = index;
}

//function update
function updateRow() {
  console.log(editingRow);
  const row = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    carType: carType.options[carType.selectedIndex].text,
    startDate: startDate.value,
    endDate: endDate.value,
    totalCost: totalCost.value,
  };
  reservation.splice(editingRow, 1, row);
  updateTable();
}

// function delete
function deleteRow(index) {
  reservation.splice(index, 1);
  localStorage.setItem("reservation", JSON.stringify(reservation));
  updateTable();
}
function submitForm(e) {
  e.preventDefault();
  const isValid = isValidForm();

  if (isValid) {
    addReservation();
    form.reset();
  }
}

form.addEventListener("submit", (e) => submitForm(e));
