<?php
include "db_connect.php";

$vtEmail = $decodedData['email'];
$vtPw = $decodedData['password']; //password is hashed

$SQL = "SELECT * FROM VolunteerUser WHERE vtEmail = '$vtEmail'";
$result = mysqli_query($conn, $SQL);

if (mysqli_num_rows($result)> 0) {
    $Row = mysqli_fetch_assoc($result);
    $message = "successful query";
    if ($Row['vtPw'] != $vtPw) {
        $message = "wrong password";
        $response = array("message" => $message);
    } else {
        $message = "success";
        $response = array("message" => $message, "result" => $Row);
    }
} else {
    $message = "email not found";
    $response = array("message" => $message, "email" => $vtEmail, "password" => $vtPw, "result" => $result, "sql" => $SQL);
}

echo json_encode($response);