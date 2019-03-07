/* ========================================================================
 * explore v1.0.0
 * ========================================================================
 *
 * What it does:
 * 		Creates Explore Tool
 * 
 * Licensed under MIT 
 * ======================================================================== */
(function($) {
	'use strict';

	// PUBLIC CLASS DEFINITION
	// ================================

	var EXDEBUG = true;

	var explore = {

		context: "ex-container",
		
		targets: {
		data:{
			//put back in https:
		    url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr14/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data) {
			explore.displayData( data , true);
		    }
		}
		},
			
		init: function(){
			// get base url of files, test or prod query, target query location, and how to show results.
			//var webroot = $( "#ex-container" ).data('ex-webroot');
			//var which = $( "#ex-container" ).data('ex-which');
			//var target = explore.targets[which];
			// Show the Search Page
			this.showForm( explore.context , false , true );
			this.displayInitial();
			// Prevent form submitting/reloading page
			//$(".ex-form", explore.context).on( "submit" , function( e ){ e.preventDefault(); });
			//$(".ex-searchform", explore.context).on( "submit" , function( e ){ e.preventDefault(); });
			
			// Add (delegated) click event handlers to buttons
			//$(".ex-edit", explore.context).on('click', explore.enableQuery);
			//$(".ex-query", explore.context).on('input', explore.doQueryUpdate);
			//$(".ex-download", explore.context).on('click', explore.download);
			//$(".ex-newWindow", explore.context).on('change', explore.updateCheckbox);
			//$(".ex-submit", explore.context).on( "click" , { target:target , which:which } , explore.doSubmit );
			//$(".ex-syntax", explore.context).on( "click" , explore.doSyntax );
			//$(".ex-reset", explore.context).on( "click" , explore.doReset );
			
		},
		
		displayInitial: function() {
			var target = explore.targets.data;
			target.data.Query = "SELECT dbo.fPhotoTypeN(p.type) AS type, p.ra, p.dec, p.run, p.rerun, p.camcol, p.field, p.obj, p.specObjID, p.objID, p.l, p.b, p.type, p.u, p.g, p.r, p.i, p.z, p.err_u, p.err_g, p.err_r, p.err_i, p.err_z, p.flags, p.mjd AS ImageMJD, p.mode, p.parentID, p.nChild, p.extinction_r, p.petroRad_r, p.petroRadErr_r, Photoz.z AS Photoz, Photoz.zerr AS Photoz_err, zooSpec.spiral AS Zoo1Morphology_spiral, zooSpec.elliptical AS Zoo1Morphology_elliptical, zooSpec.uncertain AS Zoo1Morphology_uncertain, s.instrument, s.class, s.z, s.zErr, s.survey, s.programname, s.sourcetype, s.velDisp, s.velDispErr, s.plate, s.mjd AS specMJD, s.fiberID FROM PhotoObj AS p LEFT JOIN Photoz ON Photoz.objID = p.objID LEFT JOIN zooSpec ON zooSpec.objID = p.objID LEFT JOIN SpecObj AS s ON s.specObjID = p.specObjID WHERE p.objID=1237662301903192106";
			$.ajax(target);
		},
		
		
		doCollapse: function( toggle, container, show ) {
			$('.collapse').collapse();
			if ( show === true ) {
				$(container).collapse('show');
			} else {
				$(container).collapse('hide');
			}
		},
		
		showForm: function( context , append , show ) {
			var toggle = $('.ex-form-wrap>h2>a[data-toggle]', explore.context);
			var container = $(".ex-form-wrap", explore.context);
			if (EXDEBUG) { console.log(  $( toggle ).attr('href') ); }
			
			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			explore.doCollapse(explore.context + ' .ex-form-wrap>h2>a[data-toggle]', container, show );
			
		},
		
		/**
		 * @summary Appends or updates the displayed Results.
		 * 
		 * @param String $results Results to display
		 * @param Boolean $append Append or replace current message(s)
		**/
		displayData: function( results , show) {
			var container = $("#ex-data");
			var dict = explore.convertDict(results);
			var contents = explore.formatResults(dict);
			$(container).html(contents);
			explore.doCollapse(explore.context + ' .ex-data-wrap>h2>a[data-toggle]', $("#ex-data-outer"), show );
		},
		
		convertDict: function(data) {
			var output = '{';
			var lines = data.split('\n');
			var header = lines[0].split(',');
			console.log(header);
			var items = lines[1].split(',');
			console.log(items);
			for(var i = 0; i < items.length; i++) {
				if(!items[i].startsWith('"')) {
					output += ('"' + header[i] + '":"' + items[i] + '"');
				} else {
					output += ('"' + header[i] + '":' + items[i]);
				}
				if(i !== items.length - 1) {
					output += ',';
				} else {
				output += '}';
				}
			}
			return JSON.parse(output);
		},
		
		formatResults: function(dict) {
		    var output = '<table class="table-bordered table-responsive"><tr>';
		    output += '<th>Type</th><th>run</th><th>rerun</th><th>camcol</th><th>field</th><th>obj</th><th>SDSS Objid</th></tr>';
			output += ('<tr><td>' +dict.type+'</td><td>'+dict.run+'</td><td>'+dict.rerun+'</td><td>'+dict.camcol+'</td><td>'+dict.field+'</td><td>'+dict.obj+'</td><td>'+dict.objID+'</td></tr>');
			output += '</table>';
			return output;
		}
	};

	$(document).ready( function(  ) {
		explore.init();
	} );
	
})(jQuery);