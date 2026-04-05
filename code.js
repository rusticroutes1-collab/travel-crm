// ================== INIT ==================
document.addEventListener("DOMContentLoaded", function () {

let hotels = JSON.parse(localStorage.getItem("hotels")) || [];
let editIndex = -1;


// ================== SAVE ==================
function saveHotels() {
  localStorage.setItem("hotels", JSON.stringify(hotels));
}


// ================== ADD ==================
window.addHotel = function () {

  let priceValue = document.getElementById("price")?.value || "";

  let hotel = {
    name: document.getElementById("hotelName")?.value || "",
    location: document.getElementById("location")?.value || "",

    // ✅ backward compatible
    price: priceValue,
    pricing: {
      base: priceValue
    },

    roomType: document.getElementById("roomType")?.value || "",
    mealPlan: document.getElementById("mealPlan")?.value || "",
    contactName: document.getElementById("contactName")?.value || "",
    phone: document.getElementById("contact")?.value || "",
    email: document.getElementById("email")?.value || "",
    remarks: document.getElementById("remarks")?.value || "",
    vendorId: ""
  };

  if (editIndex >= 0) {
    hotels[editIndex] = {
      ...hotel,
      id: hotels[editIndex].id
    };
    editIndex = -1;
  } else {
    hotels.push({
      id: Date.now(),
      ...hotel
    });
  }

  saveHotels();
  renderHotels();
  clearForm();
};


// ================== DELETE ==================
window.deleteHotel = function (index) {
  hotels.splice(index, 1);
  saveHotels();
  renderHotels();
};


// ================== EDIT ==================
window.editHotel = function (index) {
  let h = hotels[index];
  editIndex = index;

  document.getElementById("hotelName").value = h.name;
  document.getElementById("location").value = h.location;
  document.getElementById("price").value = h.pricing?.base || h.price || "";
  document.getElementById("roomType").value = h.roomType;
  document.getElementById("mealPlan").value = h.mealPlan;
  document.getElementById("contactName").value = h.contactName;
  document.getElementById("contact").value = h.phone;
  document.getElementById("email").value = h.email;
  document.getElementById("remarks").value = h.remarks;
};


// ================== CLEAR ==================
window.clearForm = function () {
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("remarks").value = "";
};


// ================== RENDER ==================
function renderHotels() {

  let table = document.querySelector("#hotelTable");
  if (!table) return;

  let rows = hotels.map((h, i) => `
    <tr>
      <td>${h.name}</td>
      <td>${h.location}</td>
      <td>${h.pricing?.base || h.price || ""}</td>
      <td>${h.roomType}</td>
      <td>${h.mealPlan}</td>
      <td>${h.contactName}</td>
      <td>${h.phone}</td>
      <td>${h.email}</td>
      <td>${h.remarks}</td>
      <td>
        <button onclick="editHotel(${i})">Edit</button>
        <button onclick="deleteHotel(${i})">Delete</button>
      </td>
    </tr>
  `).join("");

  table.innerHTML = rows;
}


// ================== BULK ADD ==================
window.bulkAdd = function () {

  let text = document.querySelector("textarea").value;
  let lines = text.split("\n");

  let added = 0;

  lines.forEach(line => {

    if (!line.trim()) return;

    let parts = line.split(" ");

    let price = parts.find(p => /^\d+$/.test(p)) || "";
    let location = parts.find(p =>
      ["Delhi","Jaipur","Agra","Udaipur","Mumbai"].includes(p)
    ) || "";

    let name = parts.filter(p =>
      p !== price && p !== location
    ).join(" ");

    hotels.push({
      id: Date.now(),
      name: name,
      location: location,
      price: price,
      pricing: {
        base: price
      },
      roomType: "",
      mealPlan: "",
      contactName: "",
      phone: "",
      email: "",
      remarks: "",
      vendorId: "",
      isParsed: true
    });

    added++;

  });

  saveHotels();
  renderHotels();

  alert(added + " entries added");
};


// ================== INIT ==================
renderHotels();

});
