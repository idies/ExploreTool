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
		    url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data) {
				var dict = explore.convertDict(data);
				explore.displayData( dict , true);
				explore.toBin(dict);
		    }
		}
		},
			
		init: function(){
			this.displayInitial();
			this.showForm( explore.context , false , true );
		},
		
		displayInitial: function() {
			var target = explore.targets.data;
			target.data.Query = "SELECT dbo.fPhotoTypeN(p.type) AS Type, p.ra, p.dec, p.run, p.rerun, p.camcol, p.field, p.obj, p.specObjID, p.objID, p.l, p.b, p.type, p.u, p.g, p.r, p.i, p.z AS pz, p.err_u, p.err_g, p.err_r, p.err_i, p.err_z, p.flags, p.mjd AS ImageMJD, dbo.fMjdToGMT(p.mjd) AS ImageMJDString, dbo.fPhotoModeN(p.mode) AS Mode, p.parentID, p.nChild, p.extinction_r, p.petroRad_r, p.petroRadErr_r, Photoz.z AS Photoz, Photoz.zerr AS Photoz_err, zooSpec.spiral AS Zoo1Morphology_spiral, zooSpec.elliptical AS Zoo1Morphology_elliptical, zooSpec.uncertain AS Zoo1Morphology_uncertain, s.instrument, s.class, s.z, s.zErr, s.survey, s.programname, s.sourcetype, s.velDisp, s.velDispErr, s.plate, s.mjd AS specMJD, s.fiberID FROM PhotoObj AS p LEFT JOIN Photoz ON Photoz.objID = p.objID LEFT JOIN zooSpec ON zooSpec.objID = p.objID LEFT JOIN SpecObj AS s ON s.specObjID = p.specObjID WHERE p.objID=1237662301903192106";
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
		displayData: function( dict , show) {
			console.log(dict.flags);
			var container = $("#ex-data");
			var contents = explore.formatLineOne(dict);
			contents += ('<br>' + explore.formatLineTwo(dict));
			$(container).html(contents);
			explore.doCollapse(explore.context + ' .ex-data-wrap>h2>a[data-toggle]', $("#ex-data-outer"), show );
		},
		
		displayImaging: function( dict, binFlags, show) {
			var container = $("#ex-imaging");
			var contents = explore.formatImaging(dict, binFlags);
			$(container).html(contents);
			explore.doCollapse(explore.context + ' .ex-imaging-wrap>h2>a[data-toggle]', $("#ex-imaging-outer"), show );
		},
		
		convertDict: function(data) {
			var output = '{';
			var lines = data.split('\n');
			var header = lines[0].split(',');
			var items = lines[1].split(',');
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
		
		formatLineOne: function(dict) {
		    var output = '<table class="table-bordered table-responsive"><tr>';
		    output += '<th>Type</th><th>run</th><th>rerun</th><th>camcol</th><th>field</th><th>obj</th><th>SDSS Objid</th></tr>';
			output += ('<tr><td>' +dict.Type+'</td><td>'+dict.run+'</td><td>'+dict.rerun+'</td><td>'+dict.camcol+'</td><td>'+dict.field+'</td><td>'+dict.obj+'</td><td>'+dict.objID+'</td></tr>');
			output += '</table>';
			return output;
		},
		
		formatLineTwo: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr>';
			output += '<th colspan="2">RA, Dec</th><th colspan="2">Galactic Coordinates (l, b)</th></tr>';
			output += '<tr><th>Decimal</th><th>Sexagesimal</th><th>l</th><th>b</th></tr>';
			output += '<tr><td>'+dict.ra+', '+dict.dec+'</td><td>'+explore.raToSexagesimal(parseFloat(dict.ra))+', '+explore.decToSexagesimal(parseFloat(dict.dec))+'</td><td>'+dict.l+'</td><td>'+dict.b+'</td></tr>';
			output += '</table>';
			return output;
			
		},
		
		formatImaging: function(dict, binFlags) {
			var output = '<table class="table-bordered table-responsive"><tr><th><a href="https://www.sdss.org/dr15/algorithms/photo_flags_recommend/" target="_blank">Flags</a></th><td>' + explore.generateFlags(binFlags) + '</td></tr></table>';
			output += ('<img style="-webkit-user-select: none;" src="http://skyserver.sdss.org/dr15/SkyServerWS/ImgCutout/getjpeg?TaskName=Skyserver.Explore.Image&ra='+dict.ra+'&dec='+dict.dec+'&scale=0.2&width=256&height=256&opt=G" width="256" height="256" class="left">');
			output += '<div class="im-table"><table class="table-bordered table-responsive"><tr><th colspan="5" style="text-align:center">Magnitudes</th></tr><tr><td>u</td><td>g</td><td>r</td><td>i</td><td>z</td></tr>';
			output += ('<tr><td>'+dict.u+'</td><td>'+dict.g+'</td><td>'+dict.r+'</td><td>'+dict.i+'</td><td>'+dict.pz+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr><th colspan="5" style="text-align:center">Magnitude Uncertainties</th></tr><tr><td>err_u</td><td>err_g</td><td>err_r</td><td>err_i</td><td>err_z</td></tr>';
			output += ('<tr><td>'+dict.err_u+'</td><td>'+dict.err_g+'</td><td>'+dict.err_r+'</td><td>'+dict.err_i+'</td><td>'+dict.err_z+'</td></tr></table></div>');
			output += ('<br><a target="_blank" href="http://skyserver.sdss.org/dr15/en/tools/chart/navi.aspx?'+'ra='+dict.ra+'&dec='+dict.dec+'&scale=0.2&width=256&height=256">View in Navigation Tool</a>');
			output += '<br><table class="table-bordered table-responsive"><tr><td>Image MJD</td><td>mode</td><td>parentID</td><td>nChild</td><td>extinction_r</td><td>PetroRad_r (arcsec)</td></tr>';
			output += ('<tr><td>'+dict.ImageMJD+'</td><td>'+dict.Mode+'</td><td>'+dict.parentID+'</td><td>'+dict.nChild+'</td><td>'+dict.extinction_r+'</td><td>'+dict.petroRad_r+' &#177; '+dict.petroRadErr_r+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr><td>Mjd-Date</td><td>photoZ (KD-tree method)</td><td>Galaxy Zoo 1 morphology</td></tr>';
			var spiral = parseInt(dict.Zoo1Morphology_spiral);
			var elliptical = parseInt(dict.Zoo1Morphology_elliptical);
			var display = "Uncertain";
			if(spiral === 1 || spiral > elliptical) {
				display = "Spiral";
			} else if(elliptical === 1 || elliptical > spiral) {
				display = "Elliptical";
			}
			var dates = dict.ImageMJDString.split(" ");
			output += ('<tr><td>'+dates[0]+'</td><td>'+dict.Photoz+' &#177; '+dict.Photoz_err+'</td><td>'+display+'</td></tr></table>');
			return output;
		},
		
		generateFlags: function(binFlags) {
			var flags = {'CANONICAL_CENTER': '0',
			'BRIGHT': '1',
			'EDGE': '2',
			'BLENDED': '3',
			'CHILD': '4',
			'PEAKCENTER': '5',
			'NODEBLEND': '6',
			'NOPROFILE': '7',
			'NOPETRO': '8',
			'MANYPETRO': '9',
			'NOPETRO_BIG': '10',
			'DEBLEND_TOO_MANY_PEAKS': '11',
			'COSMIC_RAY': '12',
			'MANYR50': '13',
			'MANYR90': '14',
			'BAD_RADIAL': '15',
			'INCOMPLETE_PROFILE': '16',
			'INTERP': '17',
			'SATUR': '18',
			'NOTCHECKED': '19',
			'SUBTRACTED': '20',
			'NOSTOKES': '21',
			'BADSKY': '22',
			'PETROFAINT': '23',
			'TOO_LARGE': '24',
			'DEBLENDED_AS_PSF': '25',
			'DEBLEND_PRUNED': '26',
			'ELLIPFAINT': '27',
			'BINNED1': '28',
			'BINNED2': '29',
			'BINNED4': '30',
			'MOVED': '31',
			'DEBLENDED_AS_MOVING': '32',
			'NODEBLEND_MOVING': '33',
			'TOO_FEW_DETECTIONS': '34',
			'BAD_MOVING_FIT': '35',
			'STATIONARY': '36',
			'PEAKS_TOO_CLOSE': '37',
			'BINNED_CENTER': '38',
			'LOCAL_EDGE': '39',
			'BAD_COUNTS_ERROR': '40',
			'BAD_MOVING_FIT_CHILD': '41',
			'DEBLEND_UNASSIGNED_FLUX': '42',
			'SATUR_CENTER': '43',
			'INTERP_CENTER': '44',
			'DEBLENDED_AT_EDGE': '45',
			'DEBLEND_NOPEAK': '46',
			'PSF_FLUX_INTERP': '47',
			'TOO_FEW_GOOD_DETECTIONS': '48',
			'CENTER_OFF_AIMAGE': '49',
			'DEBLEND_DEGENERATE': '50',
			'BRIGHTEST_GALAXY_CHILD': '51',
			'CANONICAL_BAND': '52',
			'AMOMENT_UNWEIGHTED': '53',
			'AMOMENT_SHIFT': '54',
			'AMOMENT_MAXITER': '55',
			'MAYBE_CR': '56',
			'MAYBE_EGHOST': '57',
			'NOTCHECKED_CENTER': '58',
			'HAS_SATUR_DN': '59',
			'DEBLEND_PEEPHOLE': '60'};
			var toReturn = "";
			for(var key in flags) {
				var value = binFlags.charAt(binFlags.length - (parseInt(flags[key]) + 1));
				if(value === "1") {
					toReturn += (key + " ");
				}
			}
			return toReturn;
		},
		
		toBin: function(dict) {
			var str_num = dict.flags;
			$.ajax({
				type: 'GET',
				url: $('#ex-container').data('ex-webroot') + '/convert.php',
				data:{'input': str_num},
				success: function (data) {
					explore.displayImaging(dict, data, true);
				}
			});
		},
		
		decToSexagesimal: function(num) {
			var prepend = "+";
			if(num < 0) {
				prepend = "-";
				num *= -1;
			}
			var hours = Math.trunc(num);
			var minutes = Math.trunc((num-hours) * 60);
			var seconds = parseFloat(Math.round(((num - hours) * 60 - minutes) * 60 * 100) / 100).toFixed(2);
			return (prepend + hours.toString() + ":" + minutes.toString() + ":" + seconds.toString());
		},
		
		raToSexagesimal: function(num) {
			var prepend = "";
			if(num < 0) {
				prepend = "-";
				num *= -1;
			}
			var hours = Math.trunc(num / 15);
			var minutes = Math.trunc((num / 15 - hours) * 60);
			var seconds = parseFloat(Math.round(((num / 15 - hours) * 60 - minutes) * 60 * 100) / 100).toFixed(2);
			return (prepend + hours.toString() + ":" + minutes.toString() + ":" + seconds.toString());
		}
	};

	$(document).ready( function(  ) {
		explore.init();
	} );
	
})(jQuery);