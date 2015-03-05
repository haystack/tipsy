<?php
/*
Plugin Name: Insert Tipsy Payment Info
Plugin URI: tipsy.csail.mit.edu
Description: Inserts Tipsy payment info into your site's head tag.
Version: 2.0
Author: schilippe
License: GPL
*/

add_option("paypal_email");
add_option("dwolla_key");
add_action("admin_menu" , 'wp_admin_options_page');
add_action("wp_head" , 'inject');

function wp_admin_options_page(){
	add_management_page("Insert Tipsy Info" , "Insert Tipsy Info" , "administrator" , "Tipsy-Injection" , "inputs");
}

function inputs(){
	$inputs  = "<div><h2>Insert Tipsy Payment Info</h2></br>" ;
	$inputs .= "<form method='post' action='options.php'>" . wp_nonce_field('update-options');
	$inputs .= "<p>Enter your PayPal email: <br><input type='email' value = '" . get_option(paypal_email) . "' name= 'paypal_email'/></input></p><br/>" ;
	$inputs .= "<p>Enter your Dwolla key : <br> <input type='text' value =  '" . get_option(dwolla_key) . "' name= 'dwolla_key'/></input></p><br/>" ;
	$inputs .= "<input type='submit' value='Update' /><input type='hidden' name='action' value='update' />
				<input type='hidden' name='page_options' value='paypal_email, dwolla_key' /></form></div>"; 
	echo $inputs;
}

function inject($content){
    	$ppe = get_option(paypal_email);
	$dwk = get_option(dwolla_key);
	
	if ($ppe === '' && $dwk === '' ) {
		return; 
	}
	$string = "<link rel='author' name='Tipsy'";

	if ($ppe !== '') {
		$string .= " data-paypal='".$ppe . "'";
	}

	if ($dwk !== '') {
		$string .= " data-dwolla='".$dwk . "'";
	}
	
	$string .= ">\n";
	echo $string; 
	return;
}
?>
