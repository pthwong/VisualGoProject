<?php

define('DB_SERVER', "localhost");
define('DB_USER', "root");
define('DB_PASSWORD', "2000W*82213th");
define("DB_DATABASE", "VisualGoDB");

$conn = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD);
$db = mysqli_select_db($conn, DB_DATABASE);


if(mysqli_connect_errno()) {
    echo json_encode("Failed to connect: " . mysqli_connect_error());
} else {
    $encodedData = file_get_contents('php://input');
    $decodedData = json_decode($encodedData, true);
} 