<?php
$str_num = $_GET['input'];
$int_num = intval($str_num, 10);
$str_bin_num = "";
for($i = 63; $i >= 0; $i--) {
	$int_num_shift = $int_num >> $i;
	$to_concat = $int_num_shift & 1;
	$str_shift = strval($to_concat);
	$str_bin_num .= $str_shift;
}
echo $str_bin_num;
?>