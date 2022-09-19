<?php
$development = true;
if ($development) {
    // Show Queries only
    header("Content-Type: application/json");
    $return = [];
}
// 1. DB Connection
try {
    $con = new PDO('mysql:host=db;dbname=TESTWHAMERICANFOOTBALL;charset=utf8', 'root', '12345');
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $con->exec("SET CHARACTER SET utf8");
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Helper function
function getStringBetween($string, $start, $end)
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
//    $footballMatchActionsCompetitionId11 = [
//        'matchId_1',
//        'matchId_2',
//    ];
$footballMatchActionsCompetitionId11 = [];
$fileInput = "football_match_actions_competitionId_11.txt";
$file = fopen($fileInput, "r");
while (!feof($file)) {
    $data = fgets($file);
    $matchId = trim($data);
    $footballMatchActionsCompetitionId11[] = $matchId;
}
fclose($file);
if ($development) {
    $return['football_match_actions_competitionId_11'] = $footballMatchActionsCompetitionId11;
}

// 3. Get all matchIds from player_resolve.txt
//    FORMAT
//    $playerResolve = [
//        'matchId_1' => [
//            'temporaryId_1' => 'personId_1',
//            'temporaryId_2' => 'personId_2',
//        ],
//        'matchId_2'  => [
//            'temporaryId_3' => 'personId_3',
//        ],
//    ];
$playerResolve = [];
$fileInput = "player_resolve.txt";
$file = fopen($fileInput, "r");
while (!feof($file)) {
    $data = fgets($file);
    $parts = explode('-----', $data);
    $url = $parts[0];
    $matchId = getStringBetween($url, '/matches/', '/persons/');
    $json = $parts[1];
    $jsonDecode = json_decode($json, true);
    $playerResolve[$matchId][$jsonDecode['temporaryId']] = $jsonDecode['personId'];
}
fclose($file);
if ($development) {
    $return['player_resolve'] = $playerResolve;
}
// 4. Look for concurrence in $footballMatchActionsCompetitionId11 and $playerResolve
//     FORMAT
//    $concurrence = [
//        'matchId_1' => [
//            'temporaryId_1' => 'personId_1',
//            'temporaryId_2' => 'personId_2',
//        ],
//        'matchId_2' => [
//            'temporaryId_3' => 'personId_3',
//        ]
//    ];
$concurrence = array_filter(
    $playerResolve,
    function ($key) use ($footballMatchActionsCompetitionId11) {
        return in_array($key, $footballMatchActionsCompetitionId11);
    },
    ARRAY_FILTER_USE_KEY
);
if ($development) {
    $return['concurrence'] = $concurrence;

    $concurrence = [
        1 => [
            -111111111 => -333333333,
            -22222222 => -444444444,
        ]
    ];
    $return['testing_concurrence'] = $concurrence;
}
// 5. Update `match_action` table field 'personId'
foreach ($concurrence as $matchId => $playersSwap) {
    foreach ($playersSwap as $oldPlayedId => $newPlayerId) {
        $sql = "UPDATE `match_action` SET `personId` = :newPlayerId WHERE (`matchId` = :matchId) AND (`personId` = :oldPlayedId);";
        $qry = $con->prepare($sql);
        $qry->bindParam(':matchId', $matchId);
        $qry->bindParam(':oldPlayedId', $oldPlayedId);
        $qry->bindParam(':newPlayerId', $newPlayerId);
        if ($development) {
            $queryString = [
                $qry->queryString => [
                    'matchId' => $matchId,
                    'oldPlayedId' => $oldPlayedId,
                    'newPlayerId' => $newPlayerId,
                ]
            ];
            $return['query_string'][] = $queryString;
        }
        $qry->execute();
    }
}

// 6. Update `match_action` table field 'playersTeam1'
foreach ($concurrence as $matchId => $playersSwap) {
    foreach ($playersSwap as $oldPlayedId => $newPlayerId) {
        $sql = "UPDATE `match_action` SET `playersTeam1` = REPLACE(`playersTeam1`, :oldPlayedId, :newPlayerId) " .
            "WHERE (`matchId` = :matchId) AND (`playersTeam1` LIKE :oldPlayedIdLike1 OR `playersTeam1` LIKE :oldPlayedIdLike2)";
        $qry = $con->prepare($sql);
        $qry->bindParam(':matchId', $matchId);
        $qry->bindParam(':oldPlayedId', $oldPlayedId);
        $qry->bindParam(':newPlayerId', $newPlayerId);

        $oldPlayedIdLike1 = $oldPlayedId . ';' . '%';
        $qry->bindParam(':oldPlayedIdLike1', $oldPlayedIdLike1);

        $oldPlayedIdLike2 = '%' . ';' . $oldPlayedId . ';' . '%';
        $qry->bindParam(':oldPlayedIdLike2', $oldPlayedIdLike2);
        if ($development) {
            $queryString = [
                $qry->queryString => [
                    'matchId' => $matchId,
                    'oldPlayedId' => $oldPlayedId,
                    'newPlayerId' => $newPlayerId,
                    'oldPlayedIdLike1' => $oldPlayedIdLike1,
                    'oldPlayedIdLike2' => $oldPlayedIdLike2,
                ]
            ];
            $return['query_string'][] = $queryString;
        }
        $qry->execute();
    }
}
// 7. Update `match_action` table field 'playersTeam2'
foreach ($concurrence as $matchId => $playersSwap) {
    foreach ($playersSwap as $oldPlayedId => $newPlayerId) {
        $sql = "UPDATE `match_action` SET `playersTeam2` = REPLACE(`playersTeam2`, :oldPlayedId, :newPlayerId) " .
            "WHERE (`matchId` = :matchId) AND (`playersTeam2` LIKE :oldPlayedIdLike1 OR `playersTeam2` LIKE :oldPlayedIdLike2)";
        $qry = $con->prepare($sql);
        $qry->bindParam(':matchId', $matchId);
        $qry->bindParam(':oldPlayedId', $oldPlayedId);
        $qry->bindParam(':newPlayerId', $newPlayerId);

        $oldPlayedIdLike1 = $oldPlayedId . ';' . '%';
        $qry->bindParam(':oldPlayedIdLike1', $oldPlayedIdLike1);

        $oldPlayedIdLike2 = '%' . ';' . $oldPlayedId . ';' . '%';
        $qry->bindParam(':oldPlayedIdLike2', $oldPlayedIdLike2);
        if ($development) {
            $queryString = [
                $qry->queryString => [
                    'matchId' => $matchId,
                    'oldPlayedId' => $oldPlayedId,
                    'newPlayerId' => $newPlayerId,
                    'oldPlayedIdLike1' => $oldPlayedIdLike1,
                    'oldPlayedIdLike2' => $oldPlayedIdLike2,
                ]
            ];
            $return['query_string'][] = $queryString;
        }
        $qry->execute();
    }
}
// 8. Update `match_action` table field 'qualifiers'
//     Each lookup in `qualifiers`. As an example:
//         kiki:-111111111;type:kickoff;koko:-111111111;opponenttimeofpossession:0.083333;status:ended
//         grossyards:48;koko:-333333333;netyards:34;kiki:-333333333;
$qualifierKeys = [
    'kiki',
    'koko',
];
foreach ($concurrence as $matchId => $playersSwap) {
    foreach ($qualifierKeys as $qualifierKey) {
        foreach ($playersSwap as $oldPlayedId => $newPlayerId) {
            $sql = "UPDATE `match_action` SET `qualifiers` = REPLACE(`qualifiers`, :oldPlayedIdLookup, :newPlayerIdLookup) " .
                "WHERE (`matchId` = :matchId) AND (`qualifiers` LIKE :oldPlayedIdLike1 OR `qualifiers` LIKE :oldPlayedIdLike2)";
            $qry = $con->prepare($sql);

            $qry->bindParam(':matchId', $matchId);

            $oldPlayedIdLookup = $qualifierKey . ':' . $oldPlayedId . ';';
            $qry->bindParam(':oldPlayedIdLookup', $oldPlayedIdLookup);

            $newPlayerIdLookup= $qualifierKey . ':' . $newPlayerId . ';';
            $qry->bindParam(':newPlayerIdLookup', $newPlayerIdLookup);

            $oldPlayedIdLike1 = $qualifierKey . ':' . $oldPlayedId . ';' . '%';
            $qry->bindParam(':oldPlayedIdLike1', $oldPlayedIdLike1);

            $oldPlayedIdLike2 = '%' . ';' . $qualifierKey . ':' . $oldPlayedId . ';' . '%';
            $qry->bindParam(':oldPlayedIdLike2', $oldPlayedIdLike2);

            if ($development) {
                $queryString = [
                    $qry->queryString => [
                        'matchId' => $matchId,
                        'oldPlayedIdLookup' => $oldPlayedIdLookup,
                        'newPlayerIdLookup' => $newPlayerIdLookup,
                        'oldPlayedIdLike1' => $oldPlayedIdLike1,
                        'oldPlayedIdLike2' => $oldPlayedIdLike2,
                    ]
                ];
                $return['query_string'][] = $queryString;
            }
            $qry->execute();
        }
    }
}
if ($development) {
    echo json_encode($return);
} else {
    echo 'Done';
}