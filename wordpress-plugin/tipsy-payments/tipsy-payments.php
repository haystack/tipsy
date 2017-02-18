<?php
/*
Plugin Name: Tipsy Payment Info
Plugin URI: http://tipsy.csail.mit.edu/
Description: Enables micropayments from visitors with the Tipsy browser extension.
Version: 2.1
Author: schilippe
License: GPL
*/

add_option("tipsy_paypal_email");
add_option("tipsy_dwolla_key");
add_action("admin_menu" , 'tipsy_wp_admin_options_page');
add_action("wp_head" , 'tipsy_inject');

function tipsy_wp_admin_options_page(){
	add_management_page("Tipsy Payment Info" , "Tipsy Payment Info", "administrator" , "tipsy-payments" , "tipsy_options_input");
}

function tipsy_options_input(){
	$inputs  = "<div><h2>Insert Tipsy Payment Info</h2></br>" ;
	$inputs .= "<form method='post' action='options.php'>" . wp_nonce_field('update-options');
	$inputs .= "<p>Enter your PayPal email: <br><input type='email' value = '" . esc_html(get_option(tipsy_paypal_email)) . "' name='tipsy_paypal_email'/></p><br/>" ;
	$inputs .= "<p>Enter your Dwolla key : <br> <input type='text' value =  '" . esc_html(get_option(tipsy_dwolla_key)) . "' name='tipsy_dwolla_key'/></p><br/>" ;
	$inputs .= "<input type='submit' value='Update' /><input type='hidden' name='action' value='update' />
				<input type='hidden' name='page_options' value='tipsy_paypal_email,tipsy_dwolla_key' /></form></div>";
	echo $inputs;
}

function tipsy_inject($content){
    	$ppe = esc_html(get_option(tipsy_paypal_email));
	$dwk = esc_html(get_option(tipsy_dwolla_key));
	
	if ($ppe === '' && $dwk === '' ) {
		return; 
	}
	$string = '<link rel="author" name="' . get_bloginfo('name') . '"';

	if ($ppe !== '') {
		$string .= ' data-paypal="' . $ppe . '"';
	}

	if ($dwk !== '') {
		$string .= ' data-dwolla="' . $dwk . '"';
	}
	
	$string .= ">\n";
	print($string); 
	return;
}
?>
