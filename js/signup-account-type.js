// Make sure to include these Firebase imports in your HTML
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>

const firebaseConfig = {
  apiKey: "AIzaSyBsn3nzbTWFP0f2k7XTmFsRxdAjd0vhDKA",
  authDomain: "fed-assignment-33cc7.firebaseapp.com",
  databaseURL:
    "https://fed-assignment-33cc7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fed-assignment-33cc7",
  storageBucket: "fed-assignment-33cc7.firebasestorage.app",
  messagingSenderId: "6435796920",
  appId: "1:6435796920:web:5f521b0e023e8882a7014d",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function showForm(formType) {
  // Hide all forms
  document.getElementById("customer-form").style.display = "none";
  document.getElementById("vendor-form").style.display = "none";

  // Remove selected class from all buttons
  const allButtons = document.querySelectorAll(".type-option");
  allButtons.forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Show selected form and highlight the correct button
  if (formType === "customer") {
    document.getElementById("customer-form").style.display = "flex";
    // Highlight Customer button in both forms
    document.querySelectorAll(".type-option").forEach((btn) => {
      if (btn.textContent.includes("Customer")) {
        btn.classList.add("selected");
      }
    });
  } else {
    document.getElementById("vendor-form").style.display = "flex";
    // Highlight Store Owner button in both forms
    document.querySelectorAll(".type-option").forEach((btn) => {
      if (btn.textContent.includes("Store Owner")) {
        btn.classList.add("selected");
      }
    });
  }
}

async function createAccount(type) {
  let userCredential; // Declare outside try block for access in catch

  try {
    if (type === "customer") {
      // Get customer form data using customer-specific IDs
      const customerData = {
        name: document.getElementById("customer-name").value,
        email: document.getElementById("customer-email").value,
        phone: document.getElementById("customer-phone").value,
        password: document.getElementById("customer-password").value,
        accountType: "customer",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Validate
      if (!customerData.name || !customerData.email || !customerData.password) {
        alert("Please fill in all required fields.");
        return;
      }

      // Create user in Firebase Authentication
      userCredential = await auth.createUserWithEmailAndPassword(
        customerData.email,
        customerData.password,
      );

      // Add additional user data to Firestore (INCLUDING PASSWORD)
      await db.collection("customers").doc(userCredential.user.uid).set({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        password: customerData.password, // ADDED: Store password in database
        accountType: customerData.accountType,
        createdAt: customerData.createdAt,
        uid: userCredential.user.uid,
        Points: 0,
      });

      // Auto-login the customer
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          uid: userCredential.user.uid,
          email: customerData.email,
          name: customerData.name,
          accountType: "customer",
        }),
      );

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", "customer");

      alert("Account created successfully!");
      // Redirect to customer home page instead of login
      window.location.href = "main-login.html";
    } else {
      // Get vendor form data using vendor-specific IDs
      const vendorBasicInfo = {
        name: document.getElementById("vendor-name").value,
        email: document.getElementById("vendor-email").value,
        phone: document.getElementById("vendor-phone").value,
        password: document.getElementById("vendor-password").value, // Store password temporarily
        accountType: "vendor",
      };

      // Validate
      if (
        !vendorBasicInfo.name ||
        !vendorBasicInfo.email ||
        !vendorBasicInfo.password
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      // For vendors, DON'T create Firebase user yet - just store in localStorage
      // We'll create the Firebase user on the next page after getting store details

      // Store vendor basic info in localStorage (including password temporarily)
      localStorage.setItem("vendorBasicInfo", JSON.stringify(vendorBasicInfo));

      // Go to vendor details page
      window.location.href = "signup-vendor-details.html";
    }
  } catch (error) {
    // Handle errors
    console.error("Error creating account:", error);

    // If we have userCredential and there's an error, delete the user
    if (userCredential && userCredential.user) {
      try {
        await userCredential.user.delete();
        console.log("Rolled back user creation due to error");
      } catch (deleteError) {
        console.error(
          "Error deleting user after failed creation:",
          deleteError,
        );
      }
    }

    switch (error.code) {
      case "auth/email-already-in-use":
        alert(
          "This email is already registered. Please use a different email or try logging in.",
        );
        break;
      case "auth/invalid-email":
        alert("Please enter a valid email address.");
        break;
      case "auth/weak-password":
        alert("Password should be at least 6 characters long.");
        break;
      case "auth/network-request-failed":
        alert("Network error. Please check your internet connection.");
        break;
      default:
        alert("Error creating account: " + error.message);
    }
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  showForm("customer");

  // Optional: Check if user is already logged in
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, you might want to redirect them
      // window.location.href = "dashboard.html";
    }
  });
});
