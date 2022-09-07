<?php

// 1. DB Connection
try {
    $con = new PDO('mysql:host=db;dbname=TESTWHAMERICANFOOTBALL;charset=utf8', 'root', '12345');
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $con->exec("SET CHARACTER SET utf8");
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Help function
function get_string_between($string, $start, $end)
{
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

// 2. Get all matchIds from football_match_actions_competitionId_11.txt
//     FORMAT
//    $football_match_actions_competitionId_11 = [
//        'matchId_1',
//        'matchId_2',
//    ];
$football_match_actions_competitionId_11 = [];
$fileinput = "football_match_actions_competitionId_11.txt";
$file = fopen($fileinput, "r");
while (!feof($file)) {
    $data = fgets($file);
    $matchId = trim($data);
    $football_match_actions_competitionId_11[] = $matchId;
}
fclose($file);

// 3. Get all matchIds from player_resolve.txt
//    FORMAT
//    $player_resolve = [
//        'matchId_1' => [
//            'temporaryId_1' => 'personId_1',
//            'temporaryId_2' => 'personId_2',
//        ],
//        'matchId_2'  => [
//            'temporaryId_3' => 'personId_3',
//        ],
//    ];
$player_resolve = [];
$fileinput = "player_resolve.txt";
$file = fopen($fileinput, "r");
while (!feof($file)) {
    $data = fgets($file);
    $parts = explode('-----', $data);
    $url = $parts[0];
    $matchId = get_string_between($url, '/matches/', '/persons/');
    $json = $parts[1];
    $jsonDecode = json_decode($json, true);
    $player_resolve[$matchId][$jsonDecode['temporaryId']] = $jsonDecode['personId'];
}
fclose($file);

// 4. Look for concurrence in $football_match_actions_competitionId_11 and $player_resolve
//     FORMAT
//    $final = [
//        'matchId_1' => [
//            'temporaryId_1' => 'personId_1',
//            'temporaryId_2' => 'personId_2',
//        ],
//        'matchId_2' => [
//            'temporaryId_3' => 'personId_3',
//        ]
//    ];
$final = [];
foreach ($football_match_actions_competitionId_11 as $competitionId_11_matchId) {
    foreach ($player_resolve as $player_resolve_matchId => $player_resolve_matchId_data) {
        if ($competitionId_11_matchId == $player_resolve_matchId) {
            $final[$competitionId_11_matchId] = $player_resolve_matchId_data;
        }
    }
}

// 5. Update `match_action` table field 'personId'
foreach ($final as $matchId => $playersSwap) {
    $matchId = 1; // TODO KIRIL REMOVE
    $counter = 0; // TODO KIRIL REMOVE
    foreach ($playersSwap as $oldPlayedId => $newPlayerId) {
        $counter++; // TODO KIRIL REMOVE
        if ($counter == 1) { // TODO KIRIL REMOVE
            $oldPlayedId = -111111111; // TODO KIRIL REMOVE
            $newPlayerId = -333333333; // TODO KIRIL REMOVE
        } // TODO KIRIL REMOVE
        if ($counter == 2) { // TODO KIRIL REMOVE
            $oldPlayedId = -22222222; // TODO KIRIL REMOVE
            $newPlayerId = -444444444; // TODO KIRIL REMOVE
        } // TODO KIRIL REMOVE

        $sql = "UPDATE `match_action` SET `personId` = :newPlayerId WHERE (`matchId` = :matchId) and (`personId` = :oldPlayedId);";
        $qry = $con->prepare($sql);
        $qry->bindParam(':matchId', $matchId);
        $qry->bindParam(':oldPlayedId', $oldPlayedId);
        $qry->bindParam(':newPlayerId', $newPlayerId);
        $qry->execute();
    }
    break; // TODO KIRIL REMOVE
}

// 6. Update `match_action` table field 'playersTeam1'
foreach ($final as $matchId => $playersSwap) {
    $matchId = 1; // TODO KIRIL REMOVE
    $counter = 0; // TODO KIRIL REMOVE
    foreach ($playersSwap as $oldPlayedId => $newPlayerId) {
        $counter++; // TODO KIRIL REMOVE
        if ($counter == 1) { // TODO KIRIL REMOVE
            $oldPlayedId = -111111111; // TODO KIRIL REMOVE
            $newPlayerId = -333333333; // TODO KIRIL REMOVE
        } // TODO KIRIL REMOVE
        if ($counter == 2) { // TODO KIRIL REMOVE
            $oldPlayedId = -22222222; // TODO KIRIL REMOVE
            $newPlayerId = -444444444; // TODO KIRIL REMOVE
        } // TODO KIRIL REMOVE

        $sql = "UPDATE `match_action` SET `playersTeam1` = REPLACE(`playersTeam1`, :oldPlayedId, :newPlayerId) " .
            "WHERE (`matchId` = :matchId) and (`playersTeam1` LIKE :oldPlayedIdLike1 OR `playersTeam1` LIKE :oldPlayedIdLike2)";
        $qry = $con->prepare($sql);
        $qry->bindParam(':matchId', $matchId);
        $qry->bindParam(':oldPlayedId', $oldPlayedId);
        $qry->bindParam(':newPlayerId', $newPlayerId);

        $oldPlayedIdLike1 = $oldPlayedId . ';' . '%';
        $qry->bindParam(':oldPlayedIdLike1', $oldPlayedIdLike1);

        $oldPlayedIdLike2 = '%' . ';' . $oldPlayedId . ';' . '%';
        $qry->bindParam(':oldPlayedIdLike2', $oldPlayedIdLike2);
        $qry->execute();
    }
    break; // TODO KIRIL REMOVE
}

// 7. Update `match_action` table field 'playersTeam2'
foreach ($final as $matchId => $playersSwap) {
    $matchId = 1; // TODO KIRIL REMOVE REMOVE
    $counter = 0; // TODO KIRIL REMOVE
    foreach ($playersSwap as $oldPlayedId => $newPlayerId) {
        $counter++; // TODO KIRIL REMOVE
        if ($counter == 1) { // TODO KIRIL REMOVE
            $oldPlayedId = -111111111; // TODO KIRIL REMOVE
            $newPlayerId = -333333333; // TODO KIRIL REMOVE
        } // TODO KIRIL REMOVE
        if ($counter == 2) { // TODO KIRIL REMOVE
            $oldPlayedId = -22222222; // TODO KIRIL REMOVE
            $newPlayerId = -444444444; // TODO KIRIL REMOVE
        } // TODO KIRIL REMOVE

        $sql = "UPDATE `match_action` SET `playersTeam2` = REPLACE(`playersTeam2`, :oldPlayedId, :newPlayerId) " .
            "WHERE (`matchId` = :matchId) and (`playersTeam2` LIKE :oldPlayedIdLike1 OR `playersTeam2` LIKE :oldPlayedIdLike2)";
        $qry = $con->prepare($sql);
        $qry->bindParam(':matchId', $matchId);
        $qry->bindParam(':oldPlayedId', $oldPlayedId);
        $qry->bindParam(':newPlayerId', $newPlayerId);

        $oldPlayedIdLike1 = $oldPlayedId . ';' . '%';
        $qry->bindParam(':oldPlayedIdLike1', $oldPlayedIdLike1);

        $oldPlayedIdLike2 = '%' . ';' . $oldPlayedId . ';' . '%';
        $qry->bindParam(':oldPlayedIdLike2', $oldPlayedIdLike2);
        $qry->execute();
    }
    break; // TODO KIRIL REMOVE
}

// 8. Update `match_action` table field 'qualifiers'
foreach ($final as $matchId => $playersSwap) {
    $matchId = 1; // TODO KIRIL REMOVE
//     Each lookup in `qualifiers`. As an example:
//         kiki:-111111111;type:kickoff;opponenttimeofpossession:0.083333;status:ended
//         grossyards:48;koko:-333333333;netyards:34
    $lookFor = [
        'kiki',
        'koko',
    ];

    foreach ($lookFor as $wordLookup) {
        $counter = 0; // TODO KIRIL REMOVE
        foreach ($playersSwap as $oldPlayedId => $newPlayerId) {
            $counter++; // TODO KIRIL REMOVE
            if ($counter == 1) { // TODO KIRIL REMOVE
                $oldPlayedId = -111111111; // TODO KIRIL REMOVE
                $newPlayerId = -333333333; // TODO KIRIL REMOVE
            } // TODO KIRIL REMOVE
            if ($counter == 2) { // TODO KIRIL REMOVE
                $oldPlayedId = -22222222; // TODO KIRIL REMOVE
                $newPlayerId = -444444444; // TODO KIRIL REMOVE
            } // TODO KIRIL REMOVE

            $sql = "UPDATE `match_action` SET `qualifiers` = REPLACE(`qualifiers`, :oldPlayedIdLookup, :newPlayerIdLookup) " .
                "WHERE (`matchId` = :matchId) and (`qualifiers` LIKE :oldPlayedIdLike1 OR `qualifiers` LIKE :oldPlayedIdLike2)";
            $qry = $con->prepare($sql);

            $qry->bindParam(':matchId', $matchId);

            $tmp1 = $wordLookup . ':' . $oldPlayedId . ';';
            $qry->bindParam(':oldPlayedIdLookup', $tmp1);

            $tmp2= $wordLookup . ':' . $newPlayerId . ';';
            $qry->bindParam(':newPlayerIdLookup', $tmp2);

            $oldPlayedIdLike1 = $wordLookup . ':' . $oldPlayedId . ';' . '%';
            $qry->bindParam(':oldPlayedIdLike1', $oldPlayedIdLike1);

            $oldPlayedIdLike2 = '%' . ';' . $wordLookup . ':' . $oldPlayedId . ';' . '%';
            $qry->bindParam(':oldPlayedIdLike2', $oldPlayedIdLike2);

            $qry->execute();

        }
    }
    break; // TODO KIRIL REMOVE
}

echo 'END';