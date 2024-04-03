document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bookingform');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        bookNow();
    });
});

const firebaseConfig = {
    apiKey: "AIzaSyBRI8aRPiHrQL9fWgNH9JgWpBtD8GTPuv8",
    authDomain: "guesthousebookingsystem-675c6.firebaseapp.com",
    databaseURL: "https://guesthousebookingsystem-675c6-default-rtdb.firebaseio.com",
    projectId: "guesthousebookingsystem-675c6",
    storageBucket: "guesthousebookingsystem-675c6.appspot.com",
    messagingSenderId: "979837493640",
    appId: "1:979837493640:web:64745b6eefd825d4c31a3d"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();
const ref = database.ref("bookings");

// Define global variable
let enteredCaptcha;
let displayedCaptcha;
let captchaVerified;
let guestHouse;

// Function to generate a unique booking ID
async function generateBookingID() {
    try {
        const snapshot = await ref.orderByChild('bookingID').limitToLast(1).once("value");
        let latestBookingID = 1000; // Default starting value

        snapshot.forEach(function(childSnapshot) {
            latestBookingID = parseInt(childSnapshot.child('bookingID').val().substring(3)); // Extract the numeric part
        });

        // Increment the latest booking ID
        latestBookingID++;

        return "BIT" + latestBookingID;
    } catch (error) {
        console.error("Error generating booking ID:", error);
        return null;
    }
}

// Update booking ID when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const bookingId = await generateBookingID();
        if (bookingId) {
            document.getElementById('booking_id').value = bookingId;
        } else {
            console.error("Failed to generate booking ID.");
        }
    } catch (error) {
        console.error("Error setting booking ID:", error);
    }
});

function bookNow() {
    // Collect form data
    const bookingID = document.getElementById('booking_id').value.trim();
    const name = document.getElementById('name').value.trim();
    const email =  document.getElementById('email').value.trim();
    const inst_email =  document.getElementById('inst_email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const alt_phone = document.getElementById('alt_phone').value.trim();
    const category = document.getElementById('category').value.trim();
    const idProof = document.getElementById('id_proof').value.trim();
    const idProofNumber = document.getElementById('id_proof_number').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const permanentAddressLocation = document.getElementById('permanent_address_location').value.trim();
    const permanentAddressPin = document.getElementById('permanent_address_pin').value.trim();
    const permanentAddressState = document.getElementById('permanent_address_state').value.trim();
    const permanentAddressArea = document.getElementById('permanent_address_area').value.trim();
    enteredCaptcha = document.getElementById('textInput').value.trim();
    displayedCaptcha = document.getElementById('capt').value.trim();
    const guestHouse = document.getElementById('guest_house').value.trim();
    const roomType = document.getElementById('room_type').value.trim();
    const occupacy = document.getElementById('occupacy').value.trim();
    const dateFrom = new Date(document.getElementById('dateF').value);
    const dateTo = new Date(document.getElementById('dateTo').value);
    const dateTime = document.getElementById('curr_date').value;

    const duration = document.getElementById('duration').value.trim();
    const status = "upcoming";

    function validateFields(name, email, phone, category, idProof, idProofNumber, gender, permanentAddressLocation, permanentAddressPin, permanentAddressState, permanentAddressArea, guestHouse, dateF, dateTo, roomType, occupacy, enteredCaptcha, status) {
       // Your field validation logic goes here
        const emptyFields = [];

        if (name === "") emptyFields.push("Name");
        if (email === "") emptyFields.push("Email");
        if (phone === "") emptyFields.push("Phone");
        if (category === "") emptyFields.push("Category");
        if (idProof === "") emptyFields.push("ID Proof");
        if (idProofNumber === "") emptyFields.push("ID Proof Number");
        if (gender === "") emptyFields.push("Gender");
        if (permanentAddressLocation === "") emptyFields.push("Permanent Address Location");
        if (permanentAddressPin === "") emptyFields.push("PIN Code");
        if (permanentAddressState === "") emptyFields.push("State");
        if (permanentAddressArea === "") emptyFields.push("Area");
        if (roomType === "") emptyFields.push("Room Type");
        if (occupacy === "") emptyFields.push("Occupacy");
        if (enteredCaptcha === "") emptyFields.push("Captcha");
        if (guestHouse === "") emptyFields.push("Guest House");
        if (dateF === "") emptyFields.push("Date From");
        if (dateTo === "") emptyFields.push("Date To");
        if (status === "") emptyFields.push("Status");

        if (emptyFields.length > 0) {
            const errorMessage = "Please fill in all mandatory fields: " + emptyFields.join(", ");
            alert(errorMessage);
            return false; // Prevent form submission
        } else {
            return true; // Allow form submission
        }
    }

    // Verify Captcha
    captchaVerified = verifyCaptcha();

    if (!captchaVerified || !validateFields()) {
        return false; // Prevent form submission
    }

    // Proceed with booking
    // Push data to Firebase
    ref.child(bookingID).set({
        bookingID: bookingID,
        name: name,
        email: email,
        inst_email: inst_email,
        phone: phone,
        alt_phone: alt_phone,
        category: category,
        idProof: idProof,
        idProofNumber: idProofNumber,
        gender: gender,
        permanentAddressLocation: permanentAddressLocation,
        permanentAddressPin: permanentAddressPin,
        permanentAddressState: permanentAddressState,
        permanentAddressArea: permanentAddressArea,
        guestHouse: guestHouse,
        roomType: roomType,
        occupacy: occupacy,
        dateFrom: dateFrom.toString(),
        dateTo: dateTo.toString(),
        duration: duration,
        dateTime: dateTime.toString(),
        status: status
        // Add other form fields here
    }, function (error) {
        if (error) {
            alert("Error occurred while saving data: " + error.message);
        } else {
            var form = document.getElementById("bookingform");
            var formData = new FormData(form);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://github.com/PiyushKhandelia/TRIAL200237/php/sendConfirmation.php", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    alert(xhr.responseText); // You can handle response here
                }
            };
            xhr.send(formData);

            alert("Booking Success");
            //window.location.href="https://piyushkhandelia.github.io/Guest_House_Reservation_System/Pages/booking.html";
        }
    });
}

function verifyCaptcha() {
    // Your captcha verification logic goes here
    if (enteredCaptcha === displayedCaptcha) {
            return true; //Allows Form Submission
        } else if (enteredCaptcha !== displayedCaptcha) {
            // Display the "Invalid Captcha" alert
            const alertTimeout = setTimeout(function() {
                alert("Invalid Captcha");
            }, 500);
            return false; // Prevent form submission
        }
}