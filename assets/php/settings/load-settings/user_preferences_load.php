<?php

$str = file_get_contents(__DIR__ . "/../../../config/config.json");

$json = json_decode($str, true);

$preferences = $json['preferences'];

$return = json_encode($preferences, true);

echo $return;

