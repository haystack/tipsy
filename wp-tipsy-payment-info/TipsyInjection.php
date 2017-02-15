<?php
/*
Plugin Name: Insert Tipsy Payment Info
Plugin URI: tipsy.csail.mit.edu
Description: Inserts Tipsy payment info into your site's head tag.
Version: 2.0
Author: schilippe
License: GPL
*/

add_option("tipsy_paypal_email");
add_option("tipsy_dwolla_key");
add_action("admin_menu" , 'tipsy_wp_admin_options_page');
add_action("wp_head" , 'tipsy_inject');

function tipsy_wp_admin_options_page(){
	add_management_page("Insert Tipsy Info" , "Insert Tipsy Info" , "administrator" , "Tipsy-Injection" , "tipsy_options_input");
}

function tipsy_options_input(){
	$inputs  = "<div><h2>Insert Tipsy Payment Info</h2></br>" ;
	$inputs .= "<form method='post' action='options.php'>" . wp_nonce_field('update-options');
	$inputs .= "<p>Enter your PayPal email: <br><input type='email' value = '" . esc_html(get_option(tipsy_paypal_email)) . "' name='paypal_email'/></input></p><br/>" ;
	$inputs .= "<p>Enter your Dwolla key : <br> <input type='text' value =  '" . esc_html(get_option(tipsy_dwolla_key)) . "' name='dwolla_key'/></input></p><br/>" ;
	$inputs .= "<input type='submit' value='Update' /><input type='hidden' name='action' value='update' />
				<input type='hidden' name='page_options' value='paypal_email, dwolla_key' /></form></div>"; 
	echo $inputs;
}

function tipsy_inject($content){
    	$ppe = esc_html(get_option(tipsy_paypal_email));
	$dwk = esc_html(get_option(tipsy_dwolla_key));
	
	if ($ppe === '' && $dwk === '' ) {
		return; 
	}
	$string = '<link rel="author" name="' . bloginfo('name') . '"';

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
