<?php
include "db_connect.php";

$viEmail = $decodedData['email'];
$viPw = $decodedData['password']; //password is hashed

$SQL = "SELECT * FROM VisuallyImpairedUser WHERE viEmail = '$viEmail'";
$result = mysqli_query($conn, $SQL);

if (mysqli_num_rows($result)> 0) {
    $Row = mysqli_fetch_assoc($result);
    $message = "successful query";
    if ($Row['viPw'] != $viPw) {
        $message = "wrong password";
        $response = array("message" => $message);
    } else {
        $message = "success";
        $response = array("message" => $message, "result" => $Row);
    }
} else {
    $message = "email not found";
    $response = array("message" => $message, "email" => $viEmail, "password" => $viPw, "result" => $result, "sql" => $SQL);
}

echo json_encode($response);