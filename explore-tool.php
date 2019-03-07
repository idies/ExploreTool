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

// Only allow this script to be run within WordPress
defined('ABSPATH') or die("Unknown Access Error");

define( 'EX_DIR_PATH' , plugin_dir_path( __FILE__ ) );
define( 'EX_DIR_URL' , plugin_dir_url( __FILE__ ) );
define( 'EX_DEVELOP' , TRUE );

// load the class file
require_once( EX_DIR_PATH . 'lib/explore-tool.php' );

// Let's roll!
exwp_plugin();
