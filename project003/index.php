<?php

$host = '127.0.0.1';
$db   = 'test';
$user = 'root';
$pass = '12345';
$charset = 'utf8mb4';
$port = '3316';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset;port=$port";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}




$fileinput = "player_resolve.txt";
$file = fopen($fileinput, "r");
while(!feof($file)) {
    $data = fgets($file);
    $parts = explode('-----', $data);
    $url = $parts[0];
    $json = $parts[1];
    $jsonDecode = json_decode($json, true);
    $ttt = 'd';
}
/* Close the streams */
fclose($file);

die;

$fileinput = "matchIds.txt";
$file = fopen($fileinput, "r");
while(!feof($file)) {
    $data = fgets($file);
    $matchId = trim($data);
    $ttt = 'd';
}
/* Close the streams */
fclose($file);
// TODO KIRIL
echo 'END';die;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function CallAPI($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, "username:password");

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}

echo CallAPI('GET', 'https://catfact.ninja/fact', []);