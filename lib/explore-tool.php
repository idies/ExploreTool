<?php
/*
Plugin Name: ExploreTool
Plugin URI: https://github.com/idies/SQLSearchWP-Casjobs/blob/master/README.md
Description: Explore Tool
Version: 1.0.0
Author: William Harrington
Author URI: https://github.com/wharrington12
License: MIT
*/

/**
 * Singleton class for setting up the plugin.
 *
 */
final class ExploreTool {

	public $dir_path = '';
	public $dir_uri = '';
	public $lib_dir = '';
	public $includes_dir = '';
	public $css_uri = '';
	public $js_uri = '';
	public $bootstrap_uri = '';
	
	public $whichs=array( );
	public $displays=array( );
	public $wheres=array( );

	/**
	 * Returns the instance.
	 */
	public static function get_instance() {

		// THERE CAN ONLY BE ONE
		static $instance = null;
		if ( is_null( $instance ) ) {
			
			$instance = new ExploreTool;
			$instance->setup();
			$instance->includes();
			$instance->setup_actions();
		}
		return $instance;
	}
	
	/**
	 * Constructor method.
	 */
	private function __construct() {
		
		//Add Scripts
		add_action( 'wp_enqueue_scripts', array( $this , 'register_exwp_script' ) );
		
		//Add Shortcodes
		add_shortcode( 'explore-tool' , array( $this , 'explore_tool_shortcode' ) );
		
		//Add page(s) to the Admin Menu
		add_action( 'admin_menu' , array( $this , 'ex_menu' ) );

	}
	
	 /**
	 * Add shortcodes menu
	**/
	function ex_menu() {

		// Add a submenu item and page to Tools 
		add_management_page( 'ExploreTool Settings', 'ExploreTool Settings', 'export', 'exwp-tools-page' , array( 	$this , 'exwp_tools_page' ) );
		
	}

	/**
	 * Add shortcodes page
	**/
	function exwp_tools_page() {
		
		if ( !current_user_can( 'export' ) )  {
				wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		}
		echo '<div class="ex-tools-wrap">';
		echo '<h2>ExploreTool Settings</h2>';
		echo '</div>';	
	}

	//
	function register_exwp_script() {
		
		//Scripts to be Registered, but not enqueued. This example requires jquery
	  if(defined('WP_ENV')) {
	    if(WP_ENV == 'development') {
		wp_register_script( 'explore-tool-script', $this->js_uri . "explore-tool.js" , array() , '1.0.0', true );
		
		//Styles to be Registered, but not enqueued
		wp_register_style( 'explore-tool-style', $this->css_uri . "explore-tool.css" );
	    } else {
	        wp_register_script( 'explore-tool-script', $this->js_uri . "explore-tool.min.js", array() , '1.0.0', true );
		wp_register_style( 'explore-tool-style', $this->css_uri . "explore-tool.min.css");
	    }
	  }
		
	}

	public function explore_tool_shortcode( $atts = array() ) {

		$webroot = $this->dir_uri;
		
		$which = ( !empty( $atts) && array_key_exists( 'form' , $atts ) && 
			in_array( $atts['form'] , $this->whichs ) ) ? $atts['form'] : $this->whichs[0] ; 
		$display = ( !empty( $atts) && array_key_exists( 'display' , $atts ) && 
			in_array( $atts['display'] , $this->displays ) ) ? $atts['display'] : $this->displays[0] ; 
			
		//Shortcode loads scripts and styles
		wp_enqueue_script( 'explore-tool-script' );
		wp_enqueue_style( 'explore-tool-style' );
		
		$default = "";
		if(!empty( $atts) && array_key_exists( 'default' , $atts )) {
			$default = $atts['default'];
		}
		else {
			$default = "1237662301903192106";
		}
		
		if ( defined( 'EX_DEVELOP' ) && EX_DEVELOP ) 
			wp_enqueue_script( 'bootstrap' );
		else
			wp_enqueue_script( 'bootstrap-min' );
		
		return $this->getForm( $which , $display , $webroot, $default);
	}
	
	public function getContextName() {
		return $this->context_name;
	}

	/**
	 * Generate HTML for this form
	 */
	public function getForm( $which , $display , $webroot, $default) {
		//Content 
		$result = '<div id="ex-container" class="ex-wrap" data-ex-webroot="' . $webroot . '" data-ex-which="' . $which . '" data-ex-display="' . $display . '" >';
		require($this->includes_dir . 'form-'. $which . '.php'); 
		
		$result .= '</div>';
		return $result;
	}

	/**
	 * Magic method to output a string if trying to use the object as a string.
	 */
	public function __toString() {
		return 'explore-tool';
	}

	/**
	 * Magic method to keep the object from being cloned.
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Sorry, no can do.', 'explore-tool' ), '1.0' );
	}

	/**
	 * Magic method to keep the object from being unserialized.
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Sorry, no can do.', 'explore-tool' ), '1.0' );
	}

	/**
	 * Magic method to prevent a fatal error when calling a method that doesn't exist.
	 */
	public function __call( $method = '', $args = array() ) {
		_doing_it_wrong( "ExploreTool::{$method}", esc_html__( 'Method does not exist.', 'explore-tool' ), '1.0' );
		unset( $method, $args );
		return null;
	}

	/**
	 * Sets up globals.
	 */
	private function setup() {

		// Main plugin directory path and URI.
		$this->dir_path = trailingslashit( EX_DIR_PATH );
		$this->dir_uri  = trailingslashit( EX_DIR_URL );

		// Plugin directory paths.
		$this->lib_dir       = trailingslashit( $this->dir_path . 'lib'       );
		$this->includes_dir = trailingslashit( $this->dir_path . 'includes' );

		// Plugin directory URIs.
		$this->css_uri = trailingslashit( $this->dir_uri . 'css' );
		$this->js_uri  = trailingslashit( $this->dir_uri . 'js'  );
		$this->bootstrap_uri  = trailingslashit( $this->dir_uri . 'vendor/bootstrap/dist/js'  );
		
		$this->whichs=array( 
			'explore'
		);
		$this->displays=array( 
			'div' , 
			'iframe' 
		);
		$this->wheres=array( 
			'skyserverws' , 
			'casjobs' 
		);

	}

	/**
	 * Loads files needed by the plugin.
	 */
	private function includes() {}

	/**
	 * Sets up main plugin actions and filters.
	 */
	private function setup_actions() {

		// Register activation hook.
		register_activation_hook( __FILE__, array( $this, 'activation' ) );
	}

	/**
	 * Method that runs only when the plugin is activated.
	 */
	public function activation() {}
	
}

/**
 * Gets the instance of the `SQLSearchWP` class.  This function is useful for quickly grabbing data
 * used throughout the plugin.
 */
function exwp_plugin() {
	return ExploreTool::get_instance();
}
