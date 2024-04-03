<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $bookingID = $_POST['booking_id'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $guesthouse = $_POST['guest_house'];
    $room_type = $_POST['room_type'];
    $dateF = $_POST['dateF'];
    $dateT  = $_POST['dateT'];
    $curr_date = $_POST['curr_date'];
    $guestHouse = "";

    // Assign guest house name based on value
    if ($guesthouse == 'IGH') {
        $guestHouse = "International Guest House";
    } elseif ($guesthouse == 'OGH') {
        $guestHouse = "Old Guest House";
    } else {
        // Handle other cases or set a default value
        $guestHouse = "Unknown Guest House";
    }

    // Send email
    $to = $email;
    $subject = "Booking Confirmation Email";
    $message = "Dear $name,\n
                Mob: $phone,\n\n    
                We are pleased to confirm that your booking at $guestHouse has been successfully registered. Below are the details of your reservation:\n\n
                Booking ID: $bookingID\n
                Room Type: $room_type\n
                Expected Check-in Date: $dateF\n
                Expected Check-out Date: $dateT\n\n
                If you have any further inquiries or require assistance, please do not hesitate to contact us. We look forward to welcoming you to $guestHouse.\n\n
                Warm regards,\n\n
                BIT Guest House  & Team MCA SPARK";
    $headers = "From: piyushkhandelia2002@gmail.com" . "\r\n" .
               "Reply-To: piyushkhandelia2002@gmail.com" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    mail($to, $subject, $message, $headers);

    echo "Form submitted successfully!";

} else {
    echo "Error: Form submission failed!";
}
?>