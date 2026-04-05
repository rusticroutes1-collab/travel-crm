// upgrade test
// ================== INIT SAFE ==================
document.addEventListener("DOMContentLoaded", function () {

let hotels = JSON.parse(localStorage.getItem("hotels")) || [];
let editIndex = -1;


// ================== SAVE ==================
function saveHotels() {
  localStorage.setItem("hotels", JSON.stringify(hotels));
}


// ================== ADD ==================
window.addHotel = function () {

  let hotel = {
    name: document.getElementById("hotelName")?.value || "",
    location: document.getElementById("location")?.value || "",
    price: document.getElementById("price")?.value || "",
    roomType: document.getElementById("roomType")?.value || "",
    mealPlan: document.getElementById("mealPlan")?.value || "",
    contactName: document.getElementById("contactName")?.value || "",
    phone: document.getElementById("contact")?.value || "",
    email: document.getElementById("email")?.value || "",
    remarks: document.getElementById("remarks")?.value || ""
  };

  if (editIndex >= 0) {
    hotels[editIndex] = hotel;
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
  document.getElementById("price").value = h.price;
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

  let table = document.querySelector("#hotelTable"); // ✅ IMPORTANT FIX

  if (!table) return;

  let rows = hotels.map((h, i) => `
    <tr>
      <td>${h.name}</td>
      <td>${h.location}</td>
      <td>${h.price}</td>
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


// ================== BULK ==================
window.bulkAdd = function () {

  let text = document.querySelector("textarea").value;
  let lines = text.split("\n").filter(l => l.trim() !== "");

  let added = 0;

  lines.forEach(line => {

    // 🔹 STEP 1: split words
    let words = line.split(" ").filter(Boolean);

    // 🔹 STEP 2: keep original safe
    let originalWords = [...words];

    // 🔹 STEP 3: remove junk (safe copy)
    let cleanWords = words.filter(w =>
      !w.includes("http") &&
      !w.startsWith("www") &&
      !w.includes(".html")
    );

    // 🔹 STEP 4: extract key values from original
    let phone = originalWords.find(w => /^\d{10}$/.test(w)) || "";
    let email = originalWords.find(w => w.includes("@")) || "";
    let price = originalWords.find(w => /^\d{3,6}$/.test(w)) || "";

    let mealPlans = ["EP", "CP", "MAP", "AP"];
    let mealPlan = originalWords.find(w => mealPlans.includes(w)) || "";

    let roomTypes = ["Deluxe", "Superior", "Suite", "Standard", "Executive", "Grand"];
    let roomType = originalWords.find(w => roomTypes.includes(w)) || "";

    // 🔹 STEP 5: remove extracted values from cleanWords
    let clean = cleanWords.filter(w =>
      w !== phone &&
      w !== email &&
      w !== price &&
      w !== mealPlan &&
      w !== roomType
    );

    // 🔹 STEP 6: detect location (simple city logic)
    let knownCities = ["Delhi", "Mumbai", "Jaipur", "Udaipur", "Indore", "Bangalore"];

    let location = clean.find(w => knownCities.includes(w)) || "";

    // remove location from clean
    clean = clean.filter(w => w !== location);

    // 🔹 STEP 7: contact = last 2 words
    let contactName = "";
    if (clean.length >= 2) {
      contactName = clean.slice(-2).join(" ");
      clean.splice(-2);
    }

    // 🔹 STEP 8: name = remaining words
    let name = clean.join(" ");

    // 🔹 STEP 9: push to hotels
    // 🔹 STEP: detect vendor
// 🔹 STEP: detect vendor
let vendorKeywords = [
  "travels", "tours", "dmc", "holidays",
  "taxi", "cab", "transport", "agency", "operator"
];

let isVendor = vendorKeywords.some(k =>
  line.toLowerCase().includes(k)
);

// 🔹 IF VENDOR → SAVE IN vendors
if (isVendor) {

  let vendors = JSON.parse(localStorage.getItem("vendors")) || [];

  vendors.push({
    name: name,
    destination: location,
    phone: phone,
    email: email
  });

  localStorage.setItem("vendors", JSON.stringify(vendors));

} else {

  // 🔹 HOTEL → save normally
  let exists = hotels.some(h =>
  h.name.toLowerCase() === name.toLowerCase() &&
  h.location.toLowerCase() === location.toLowerCase()
);

if (!exists) {
  hotels.push({
    id: Date.now(),
    name,
    location,
    price,
    roomType,
    mealPlan,
    contactName,
    phone,
    email,
    remarks: "",
    isParsed: true
  });
}
}

    added++;

  });

  // 🔹 SAVE + RENDER
  saveHotels();
  renderHotels();
  

  alert(added + " entries added");
};


// ================== INIT ==================
renderHotels();
renderVendors();
});
