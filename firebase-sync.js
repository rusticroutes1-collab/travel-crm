// 🔥 Load Firebase scripts dynamically (safe)
function loadFirebase() {
  return new Promise((resolve) => {
    if (window.firebase) {
      resolve();
      return;
    }

    const appScript = document.createElement("script");
    appScript.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";

    const dbScript = document.createElement("script");
    dbScript.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

    appScript.onload = () => {
      document.body.appendChild(dbScript);
    };

    dbScript.onload = () => {
      resolve();
    };

    document.body.appendChild(appScript);
  });
}

// 🔥 Initialize Firebase safely
let db = null;

async function initFirebase() {
  try {
    await loadFirebase();

    const firebaseConfig = {
      apiKey: "AIzaSyDiDoZFzLrAeh0DVU6c38jJZY4MrYlenQI",
      authDomain: "crm-leads-f8968.firebaseapp.com",
      projectId: "crm-leads-f8968"
    };

    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();

    console.log("✅ Firebase connected");

    enableRealtimeSync();
  } catch (e) {
    console.log("⚠️ Firebase failed → local only");
  }
}

// 🔥 Push local → cloud
function syncToCloud(leads) {
  if (!db) return;

  leads.forEach(lead => {
    db.collection("leads").doc(String(lead.id)).set(lead);
  });
}

// 🔥 Pull cloud → local
function enableRealtimeSync() {
  if (!db) return;

  db.collection("leads").onSnapshot(snapshot => {
    let leads = [];

    snapshot.forEach(doc => {
      leads.push(doc.data());
    });

    localStorage.setItem("leads", JSON.stringify(leads));
    renderLeads();

    console.log("🔥 Real-time sync updated");
  });
}

// 🔥 Hook into your existing save
const originalSave = window.saveLeads;

window.saveLeads = function(leads) {
  originalSave(leads);   // local save
  syncToCloud(leads);    // cloud save
};

// 🔥 Start Firebase
initFirebase();