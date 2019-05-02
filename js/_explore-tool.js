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
		
		attributes: {
			objID: "1237662301903192106",
			ra: "229.525575753922",
			dec: "42.7458537608544"
		},
		
		specData: {},
		
		queriesFinished: {
			data: true,
			imaging: true,
			USNO: true,
			FIRST: true,
			ROSAT: true,
			RC3: true,
			TwoMASS: true,
			WISE: true,
			spectra: true,
			manga: true,
			apogee: true,
			visits: true
		},
		
		targets: {
		data:{
			//put back in https:
		    url:"",
		    //ContentType:"application/json",
		    type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
		    success: function (data) {
				//console.log(data);
				if(data.split("\n")[2] === "") {
					$("ex-data").html(data);
					explore.queriesFinished.data = true;
					explore.queriesFinished.imaging = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayData( dict , true);
					explore.toBin(dict);
				}
		    }
		},
		USNO:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no USNO data available for this object";
					$("#ex-cross-USNO").html(data);
					explore.queriesFinished.USNO = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayUSNO( dict , true);
				}
		    }
		},
		FIRST:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no FIRST data available for this object";
					$("#ex-cross-FIRST").html(data);
					explore.queriesFinished.FIRST = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayFIRST( dict , true);
				}
		    }
		},
		ROSAT:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		   // data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no ROSAT data available for this object";
					$("#ex-cross-ROSAT").html(data);
					explore.queriesFinished.ROSAT = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayROSAT( dict , true);
				}
		    }
		},
		RC3:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				console.log(explore.targets.RC3.url);
				if(data.split("\n")[2] === "") {
					data = "There is no RC3 data available for this object";
					$("#ex-cross-RC3").html(data);
					explore.queriesFinished.RC3 = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayRC3( dict , true);
				}
		    }
		},
		TwoMASS:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no TwoMASS data available for this object";
					$("#ex-cross-TwoMASS").html(data);
					explore.queriesFinished.TwoMASS = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayTwoMASS( dict , true);
				}
		    }
		},
		WISE:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no WISE data available for this object";
					$("#ex-cross-WISE").html(data);
					explore.queriesFinished.WISE = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayWISE( dict , true);
				}
		    }
		},
		spectra:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no Optical Spectra data available for this object";
					$("#ex-spectra").html(data);
					explore.queriesFinished.spectra = true;
					explore.updateHour();
				} else {
					explore.specData = explore.convertDict(data);
					var target = explore.targets.spectraCount;
					target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select count(SpecObjID) as count from SpecObjAll where bestObjID="+explore.specData.bestObjID+"&format=csv";
					$.ajax(target);
				}
		    }
		},
		spectraCount:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		   // data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no Optical Spectra data available for this object";
					$("#ex-spectra").html(data);
					explore.queriesFinished.spectra = true;
					explore.updateHour();
				} else {
					explore.displaySpectra( explore.specData , explore.convertDict(data), true);
				}
		    }
		},
		manga:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no MaNGA data available for this object";
					$("#ex-manga").html(data);
					explore.queriesFinished.manga = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayManga( dict , true);
				}
		    }
		},
		apogee:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no Apogee data available for this object";
					$("#ex-apogee").html(data);
					explore.queriesFinished.apogee = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayApogee( dict , true);
				}
		    }
		},
		visits:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					data = "There is no Visits data available for this object";
					$("#ex-visits").html(data);
					explore.queriesFinished.visits = true;
					explore.updateHour();
				} else {
					explore.displayVisits( data , true);
				}
		    }
		},
		radecFromObj:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					explore.attributes.ra = "";
					explore.attributes.dec = "";
				} else {
					var dict = explore.convertDict(data);
					explore.attributes.ra = dict.ra;
					explore.attributes.dec = dict.dec;
				}
				explore.doSearch();
		    }
		},
		objFromRaDec:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		   // data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					explore.attributes.objID = "";
				} else {
					var dict = explore.convertDict(data);
					explore.attributes.objID = dict.objID;
				}
				explore.doSearch();
		    }
		},
		objFromOther:{
			url:"",
			//ContentType:"application/json",
			type: "POST",
		    //data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data.split("\n")[2] === "") {
					explore.attributes.objID = "";
				} else {
					var dict = explore.convertDict(data);
					explore.attributes.objID = dict.objID;
				}
				var target = explore.targets.radecFromObj;
				target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select ra,dec from PhotoObjAll where objID=" + explore.attributes.objID+"&format=csv";
				$.ajax(target);
		    }
		},
		radecFromName:{
			url:"",
			type: "GET",
			success: function (data) {
				if(data.split("\n")[2] === "") {
					explore.attributes.ra = "";
					explore.attributes.dec = "";
				} else {
					explore.attributes.ra = data.data[0][0].toString();
					explore.attributes.dec = data.data[0][1].toString();
				}
				var target = explore.targets.objFromRaDec;
				target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select top 1 dbo.fGetNearestObjIdAllEq("+explore.attributes.ra+","+explore.attributes.dec+",0.5) as objID&format=csv";
				$.ajax(target);
		    }
		}
		},
			
		init: function(){
			this.doSearch();
			this.showForm( explore.context , false , true );
			$(document).on('click', "#Name_button", explore.nameSearch);
			$(document).on('click', "#SpecObjID_button", explore.specObjSearch);
			$(document).on('click', "#Ra_Dec_button", explore.ra_decSearch);
			$(document).on('click', "#SDSS_button", explore.sdssSearch);
			$(document).on("click", "#ObjID_button", explore.objSearch);
			$(document).on('click', "#plate_mjd_fiber_button", explore.plateSearch);
			$(document).on('click', "#mangaID_button", explore.mangaSearch);
		},
		
		nameSearch: function(e) {
			var value = $("#Name").attr('value');
			var target = explore.targets.radecFromName;
			target.url = "//simbad.u-strasbg.fr/simbad/sim-tap/sync?request=doQuery&lang=adql&format=json&query=SELECT%20a.ra,a.dec%20from%20basic%20as%20a,IDENT%20as%20b%20where%20a.oid=b.oidref%20and%20b.id=%27" + value + "%27";
			$.ajax(target);
		},
		
		specObjSearch: function(e) {
			var value = $("#SpecObjID").attr('value');
			var target;
			if(value.includes(".")) {
				target = explore.targets.objFromOther;
				target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select top 1 ra,dec,dbo.fGetNearestObjIdAllEq(ra,dec,0.5) as objID from apogeeStar where apstar_id='" + value + "'&format=csv";
				$.ajax(target);
			} else if(value.includes("+")) {
				target = explore.targets.objFromOther;
				target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select top 1 ra,dec,dbo.fGetNearestObjIdAllEq(ra,dec,0.5) as objID from apogeeStar where apogee_id='" + value + "'&format=csv";
				$.ajax(target);
				
			} else {
				target = explore.targets.objFromOther;
				target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select bestObjID as objID from SpecObjAll where specObjID=" + value + "&format=csv";
				$.ajax(target);
			}
		},
		
		ra_decSearch: function(e) {
			explore.attributes.ra = $("#Ra").attr('value');
			explore.attributes.dec = $("#Dec").attr('value');
			var target = explore.targets.objFromRaDec;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select top 1 dbo.fGetNearestObjIdAllEq("+explore.attributes.ra+","+explore.attributes.dec+",0.5) as objID&format=csv";
			$.ajax(target);
		},
		
		sdssSearch: function(e) {
			var values = ($("#SDSS").attr('value')).split("-");
			var target = explore.targets.objFromOther;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select top 1 objID from PhotoObjAll where run="+values[0]+" and rerun="+values[1]+" and camcol="+values[2]+" and field="+values[3]+" and obj="+values[4]+"&format=csv";
			$.ajax(target);
		},
		
		objSearch: function(e) {
			explore.attributes.objID = $("#ObjID").attr('value');
			var target = explore.targets.radecFromObj;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select ra,dec from PhotoObjAll where objID=" + explore.attributes.objID+"&format=csv";
			$.ajax(target);
			
		},
		
		plateSearch: function(e) {
			var plate_val = $("#Plate").attr('value');
			var mjd_val = $("#MJD").attr('value');
			var fiber_val = $("#Fiber").attr('value');
			var target = explore.targets.objFromOther;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select a.objID from photoObjAll a,SpecObjAll b where a.objID=b.bestObjID and b.plate="+plate_val+" and b.mjd="+mjd_val+" and b.fiberID="+fiber_val+"&format=csv";
			$.ajax(target);
		},
		
		mangaSearch: function(e) {
			var manga = $("#MangaID").attr('value');
			var target = explore.targets.objFromOther;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select top 1 objra,objdec,dbo.fGetNearestObjIdAllEq(objra,objdec,0.5) as objID from mangaDAPall where mangaid='" + manga + "'&format=csv";
			$.ajax(target);
		},
		
		doSearch: function() {
			explore.queriesFinished.data = false;
			explore.queriesFinished.imaging = false;
			explore.queriesFinished.USNO = false;
			explore.queriesFinished.FIRST = false;
			explore.queriesFinished.ROSAT = false;
			explore.queriesFinished.RC3 = false;
			explore.queriesFinished.TwoMASS = false;
			explore.queriesFinished.WISE = false;
			explore.queriesFinished.spectra = false;
			explore.queriesFinished.manga = false;
			explore.queriesFinished.apogee = false;
			explore.queriesFinished.visits = false;
			$("#ex-hour").prop("style", "");
			var target = explore.targets.data;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=SELECT dbo.fPhotoTypeN(p.type) AS Type, p.ra, p.dec, p.run, p.rerun, p.camcol, p.field, p.obj, p.specObjID, p.objID, p.l, p.b, p.type, p.u, p.g, p.r, p.i, p.z AS pz, p.err_u, p.err_g, p.err_r, p.err_i, p.err_z, p.flags, p.mjd AS ImageMJD, dbo.fMjdToGMT(p.mjd) AS ImageMJDString, dbo.fPhotoModeN(p.mode) AS Mode, p.parentID, p.nChild, p.extinction_r, p.petroRad_r, p.petroRadErr_r, Photoz.z AS Photoz, Photoz.zerr AS Photoz_err, zooSpec.spiral AS Zoo1Morphology_spiral, zooSpec.elliptical AS Zoo1Morphology_elliptical, zooSpec.uncertain AS Zoo1Morphology_uncertain, s.instrument, s.class, s.z, s.zErr, s.survey, s.programname, s.sourcetype, s.velDisp, s.velDispErr, s.plate, s.mjd AS specMJD, s.fiberID FROM PhotoObjAll AS p LEFT JOIN Photoz ON Photoz.objID = p.objID LEFT JOIN zooSpec ON zooSpec.objID = p.objID LEFT JOIN SpecObjAll AS s ON s.specObjID = p.specObjID WHERE p.objID=" + explore.attributes.objID + "&format=csv";
			$.ajax(target);
			
			target = explore.targets.USNO;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select PROPERMOTION, MURAERR, MUDECERR, ANGLE from USNO where OBJID=" + explore.attributes.objID + "&format=csv";
			$.ajax(target);
			
			target = explore.targets.FIRST;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select f.peak,f.rms,f.major,f.minor from FIRST f where f.objID=" + explore.attributes.objID + "&format=csv";
			$.ajax(target);
			
			target = explore.targets.ROSAT;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select q.CPS, q.HR1,q.HR2,q.EXT from ROSAT q where q.OBJID=" + explore.attributes.objID + "&format=csv";
			$.ajax(target);
			
			target = explore.targets.RC3;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select r.HUBBLE, r.M21, r.M21ERR, r.HI from RC3 r where r.objID=" + explore.attributes.objID + "&format=csv";
			$.ajax(target);
			
			target = explore.targets.TwoMASS;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select j,h,k, phQual from TwoMASS s where s.OBJID=" + explore.attributes.objID + "&format=csv";
			$.ajax(target);
			
			target = explore.targets.WISE;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select TwoMASS.OBJID, t.w1mag, t.w2mag, t.w3mag, t.w4mag from WISE_allsky t, TwoMASS where t.tmass_key=TwoMASS.ptsKey and TwoMASS.OBJID=" + explore.attributes.objID + "&format=csv";
			$.ajax(target);
			
			target = explore.targets.spectra;
			//Still need to find function for legacy_target2
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select top 1 a.bestObjID,a.specObjID, a.img, a.fiberID, a.mjd, a.plate, a.survey, a.programname, a.instrument,a.sourceType,a.z, a.zErr, dbo.fSpecZWarningN(a.zWarning) as WARNING, a.sciencePrimary, dbo.fPrimTargetN(a.legacy_target1) as targetOne, a.legacy_target2 as targetTwo, a.class as CLASS, a.velDisp, a.velDispErr from SpecObjAll a where bestObjID=" + explore.attributes.objID+" order by a.sciencePrimary DESC&format=csv";
			$.ajax(target);
			
			target = explore.targets.manga;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select * from dbo.fGetNearestMangaObjEq(" + explore.attributes.ra + "," + explore.attributes.dec + ",0.5)&format=csv";
			$.ajax(target);
			
			target = explore.targets.apogee;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select b.apogee_id, dbo.fApogeeStarFlagN(m.starflag) as starflag,dbo.fApogeeAspcapFlagN(a.aspcapflag) as ascapflag,a.teff,a.teff_err,a.logg,a.logg_err,a.fe_h,a.fe_h_err,a.alpha_m,a.alpha_m_err,m.vhelio_avg,m.vscatter,dbo.fApogeeTarget1N(m.apogee_target1) as target1,dbo.fApogeeTarget2N(m.apogee_target2) as target2,m.commiss,p.ra,p.dec,m.glon,m.glat,p.apogee_id,m.apstar_id,p.j,p.j_err,p.h,p.h_err,p.k,p.k_err, p.irac_4_5, p.irac_4_5_err, p.src_4_5 from apogeeObject p, apogeeStar m, aspcapStar a, dbo.fGetNearestApogeeStarEq(" + explore.attributes.ra + "," + explore.attributes.dec + ",0.5) b where p.apogee_id=b.apogee_id and a.apogee_id=b.apogee_id and m.apogee_id=b.apogee_id&format=csv";
			$.ajax(target);
			
			target = explore.targets.visits;
			target.url = "//skyserver.sdss.org/dr15/SkyServerWS/SearchTools/SqlSearch?cmd=select a.visit_id, a.plate, a.mjd, a.fiberid, dbo.fMjdToGMT(a.mjd) as string, a.vrel, b.apogee_id from apogeeVisit a, dbo.fGetNearestApogeeStarEq(" + explore.attributes.ra + "," + explore.attributes.dec + ",0.5) b where a.apogee_id=b.apogee_id order by mjd&format=csv";
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
			var container = $("#ex-data");
			var contents = explore.formatLineOne(dict);
			contents += ('<br>' + explore.formatLineTwo(dict));
			$(container).html(contents);
			explore.doCollapse(explore.context + ' .ex-data-wrap>h2>a[data-toggle]', $("#ex-data-outer"), show );
			explore.queriesFinished.data = true;
			explore.updateHour();
		},
		
		displayImaging: function( dict, binFlags, show) {
			var container = $("#ex-imaging");
			var contents = explore.formatImaging(dict, binFlags);
			$(container).html(contents);
			explore.doCollapse(explore.context + ' .ex-imaging-wrap>h2>a[data-toggle]', $("#ex-imaging-outer"), show );
			explore.queriesFinished.imaging = true;
			explore.updateHour();
		},
		
		displayUSNO: function(dict, show) {
			var container = $("#ex-cross-USNO");
			var contents = explore.formatUSNO(dict);
			$(container).html(contents);
			explore.queriesFinished.USNO = true;
			explore.updateHour();
		},
		
		displayFIRST: function(dict, show) {
			var container = $("#ex-cross-FIRST");
			var contents = explore.formatFIRST(dict);
			$(container).html(contents);
			explore.queriesFinished.FIRST = true;
			explore.updateHour();
		},
		
		displayROSAT: function(dict, show) {
			var container = $("#ex-cross-ROSAT");
			var contents = explore.formatROSAT(dict);
			$(container).html(contents);
			explore.queriesFinished.ROSAT = true;
			explore.updateHour();
		},
		
		displayRC3: function(dict, show) {
			var container = $("#ex-cross-RC3");
			var contents = explore.formatRC3(dict);
			$(container).html(contents);
			explore.queriesFinished.RC3 = true;
			explore.updateHour();
		},
		
		displayTwoMASS: function(dict, show) {
			var container = $("#ex-cross-TwoMASS");
			var contents = explore.formatTwoMASS(dict);
			$(container).html(contents);
			explore.queriesFinished.TwoMASS = true;
			explore.updateHour();
		},
		
		displayWISE: function(dict, show) {
			var container = $("#ex-cross-WISE");
			var contents = explore.formatWISE(dict);
			$(container).html(contents);
			explore.queriesFinished.WISE = true;
			explore.updateHour();
		},
		
		displaySpectra: function(dict, count, show) {
			var container = $("#ex-spectra");
			var contents = explore.formatSpectra(dict, count);
			$(container).html(contents);
			explore.queriesFinished.spectra = true;
			explore.updateHour();
		},
		
		displayManga: function(dict, show) {
			var container = $("#ex-manga");
			var contents = explore.formatManga(dict);
			$(container).html(contents);
			explore.queriesFinished.manga = true;
			explore.updateHour();
		},
		
		displayApogee: function(dict, show) {
			var container = $("#ex-apogee");
			var contents = explore.formatApogee(dict);
			$(container).html(contents);
			explore.queriesFinished.apogee = true;
			explore.updateHour();
		},
		
		displayVisits: function(input, show) {
			var container = $("#ex-visits");
			var contents = explore.formatVisits(input);
			$(container).html(contents);
			explore.queriesFinished.visits = true;
			explore.updateHour();
		},
		
		formatVisits: function(input) {
			var output = '<table class="table-bordered table-responsive"><tr><th>visit_id</th><th>plate</th><th>mjd</th><th>fiberid</th><th>date</th><th>time (UTC)</th><th>vrel</th></tr>';
			var body = input.substring(input.indexOf('"'));
			var lines = body.split('\n');
			for(var i = 0; i < lines.length - 1; i++) {
				output += '<tr>';
				var line = lines[i].split(',');
				for(var x = 0; x < line.length - 1; x++) {
					line[x] = line[x].replace('"', '');
					line[x] = line[x].replace('"', '');
					output += '<td>';
					if(x !== 4) {
						output += line[x];
					} else {
						var temp = line[x].split(' ');
						output += (temp[0] + '</td><td>');
						output += temp[1];
					}
					output += '</td>';
				}
				output += '</tr>';
			}
			output += '</table>';
			return output;
		},
		
		formatApogee: function(dict) {
			var output ='<strong>Targeted star apogee_id</strong>: ' + dict.apogee_id + '<br>';
			output += '<table class="table-bordered table-responsive"><tr><th>Instrument</th><td>APOGEE</td></tr>';
			output += ('<tr><th>apstar_id</th><td>'+dict.apstar_id+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr>';
			output += '<th colspan="2">Galactic Coordinates</th><th colspan="2">RA,dec</th></tr>';
			output += '<tr><th>Longitude (L)</th><th>Latitude (B)</th><th>Decimal</th><th>Sexagesimal</th></tr>';
			output += '<tr><td>'+dict.glon+'</td><td>'+dict.glat+'</td><td>'+dict.ra+', '+dict.dec+'</td><td>'+explore.raToSexagesimal(parseFloat(dict.ra))+', '+explore.decToSexagesimal(parseFloat(dict.dec))+'</td></tr></table>';
			var apstar = (dict.apstar_id).split(".");
			var imLink = '"https://dr15.sdss.org/sas/dr15/'+apstar[0]+'/spectro/redux/r8/stars/'+apstar[1]+'/'+apstar[4]+'/plots/apStar-r8-'+apstar[5].replace("+","%2b")+'.jpg"';
			output += ('<img style="-webkit-user-select: none;" src='+imLink+'>');
			output += ('<table class="table-responsive"><tr><td><a href="http://dr15.sdss.org/infrared/spectrum/view/stars?location_id='+apstar[4]+'&commiss='+dict.commiss+'&apogee_id='+dict.apogee_id+'&action=search" target="_blank">Interactive Spectrum</a></td>');
			output += ('<td><a href="http://dr15.sdss.org/sas/dr15/'+apstar[0]+'/spectro/redux/r8/stars/'+apstar[1]+'/'+apstar[4]+'/apStar-r8-'+apstar[5].replace("+","%2b")+'.fits">Download FITS</a></td></tr></table>');
			output += '<h4>Targeting Information</h4>';
			output += '<table class="table-bordered table-responsive"><tr><th>2MASS j</th><th>2MASS h</th><th>2MASS k</th><th>j_err</th><th>h_err</th><th>k_err</th></tr>';
			output += ('<tr><td>'+dict.j+'</td><td>'+dict.h+'</td><td>'+dict.k+'</td><td>'+dict.j_err+'</td><td>'+dict.h_err+'</td><td>'+dict.k_err+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr><th>4.5 micron magnitude</th><th>4.5 micron magnitude error</th><th>4.5 micron magnitude source</th></tr>';
			output += ('<tr><td>'+dict.irac_4_5+'</td><td>'+dict.irac_4_5_err+'</td><td>'+dict.src_4_5+'</td></tr></table>');
			output += ('<table class="table-bordered table-responsive"><tr><th>APOGEE target flags 1</th><td>'+dict.target1+'</td></tr>');
			output += ('<tr><th>APOGEE target flags 2</th><td>'+dict.target2+'</td></tr></table>');
			
			output += '<h4>Stellar Parameters</h4>';
			output += '<table class="table-bordered table-responsive"><tr><th>Avg v<sub>helio</sub> (km/s)</th><th>Scatter in v<sub>helio</sub> (km/s)</th><th>Best-fit temperature (K)</th><th>Temp error</th></tr>';
			output += ('<tr><td>'+dict.vhelio_avg+'</td><td>'+dict.vscatter+'</td><td>'+dict.teff+'</td><td>'+dict.teff_err+'</td></tr></table');
			output += '<table class="table-bordered table-responsive"><tr><th>Surface Gravity log<sub>10</sub>(g)</th><th>log(g) error</th><th>Metallicity [Fe/H]</th><th>Metal error</th><th>[&alpha;/Fe]</th><th>[&alpha;/Fe] error</th></tr>';
			output += ('<tr><td>'+dict.logg+'</td><td>'+dict.logg_err+'</td><td>'+dict.fe_h+'</td><td>'+dict.fe_h_err+'</td><td>'+dict.alpha_m+'</td><td>'+dict.alpha_m_err+'</td></tr></table>');
			output += ('<table class="table-bordered table-responsive"><tr><th>Star flags</th><td>'+dict.starflag+'</td></tr>');
			output += ('<tr><th>Processing flags (ASPCAP)</th><td>'+dict.ascapflag+'</td></tr></table>');
			return output;
		},
		
		formatManga: function(dict) {
			var PlateIFU = (dict.plateIFU).split("-");
			var imLink = '"https://dr15.sdss.org/sas/dr15/manga/spectro/redux/v2_4_3/'+PlateIFU[0]+'/stack/images/'+PlateIFU[1]+'.png"';
			var LINLink = '"http://data.sdss.org/sas/dr15/manga/spectro/redux/v2_4_3/'+PlateIFU[0]+'/stack/manga-'+dict.plateIFU+'-LINCUBE.fits.gz"';
			var LOGLink = '"http://data.sdss.org/sas/dr15/manga/spectro/redux/v2_4_3/'+PlateIFU[0]+'/stack/manga-'+dict.plateIFU+'-LOGCUBE.fits.gz"';
			var ExpLink = '"http://sas.sdss.org/marvin/galaxy/'+dict.plateIFU+'"';
			var output = '<div><table class="table-responsive"><tr><td><a href='+imLink+' target="_blank">View Larger</a></td>';
			output += ('<td><a href='+LINLink+'>LIN Data Cube</a></td>');
			output += ('<td><a href='+LOGLink+'>LOG Data Cube</a></td>');
			output += ('<td><a href='+ExpLink+' target="_blank">Explore in Marvin</a></td></tr></table></div>');
			output += ('<img style="-webkit-user-select: none;" src='+imLink+' width="150" height="150" class="left">');
			output += '<div class="manga-table"><table class="table-bordered table-responsive"><tr><th>plateIFU</th><th>mangaid</th><th>objra</th><th>objdec</th><th>ifura</th><th>ifudec</th></tr>';
			output += ('<tr><td>'+dict.plateIFU+'</td><td>'+dict.mangaid+'</td><td>'+dict.objra+'</td><td>'+dict.objdec+'</td><td>'+dict.ifura+'</td><td>'+dict.ifudec+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr><th>drp3qual</th><th>bluesn2</th><th>redsn2</th><th>mjdmax</th><th>mngtarg1</th><th>mngtarg2</th><th>mngtarg3</th></tr>';
			output += ('<tr><td>'+dict.drp3qual+'</td><td>'+dict.bluesn2+'</td><td>'+dict.redsn2+'</td><td>'+dict.mjdmax+'</td><td>'+dict.mngtarg1+'</td><td>'+dict.mngtarg2+'</td><td>'+dict.mngtarg3+'</td></tr></table></div>');
			return output;
		},
		formatSpectra: function(dict, countDict) {
			var output = '<strong>SpecObjID</strong> = ' + dict.specObjID +'<br>';
			output += ('<div><a href="http://skyserver.sdss.org/dr15/en/get/SpecById.ashx?id='+dict.specObjID+'" target="_blank">View Larger</a></div>');
			output += ('<img style="-webkit-user-select: none;" src="http://skyserver.sdss.org/dr15/en/get/SpecById.ashx?id='+dict.specObjID+'" width="400" height="400" class="left">');
			output += ('<div class="spectra-table"><table class="table-bordered table-responsive"><tr><th>Spectrograph</th><td>'+dict.instrument+'</td></tr><tr><th>class</th><td>'+dict.CLASS+'</td></tr><tr><th>Redshift (z)</th><td>'+dict.z+'</td></tr>');
			output += ('<tr><th>Redshift error</th><td>'+dict.zErr+'</td></tr><tr><th>Redshift flags</th><td>'+dict.WARNING+'</td></tr><tr><th>survey</th><td>'+dict.survey+'</td></tr><tr><th>programname</th><td>'+dict.programname+'</td></tr><tr><th>primary</th><td>'+dict.sciencePrimary+'</td></tr>');
			output += ('<tr><th>Other spec</th><td>'+(parseInt(countDict.count)-1).toString()+'</td></tr><tr><th>sourcetype</th><td>'+dict.sourceType+'</td></tr><tr><th>Velocity dispersion (km/s)</th><td>'+dict.velDisp+'</td></tr><tr><th>veldisp_error</th><td>'+dict.velDispErr+'</td></tr>');
			output += ('<tr><th>targeting_flags</th><td>'+dict.targetOne+'</td></tr><tr><th>plate</th><td>'+dict.plate+'</td></tr><tr><th>mjd</th><td>'+dict.mjd+'</td></tr><tr><th>fiberid</th><td>'+dict.fiberID+'</td></tr></table></div>');
			return output;
		},
		
		formatWISE: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>w1mag</th><th>w2mag</th><th>w3mag</th><th>w4mag</th><th>Full WISE data</th></tr>';
			output += ('<tr><td>WISE</td><td>'+dict.w1mag+'</td><td>'+dict.w2mag+'</td><td>'+dict.w3mag+'</td><td>'+dict.w4mag+'</td><td><a href="http://skyserver.sdss.org/dr15/en/tools/explore/DisplayResults.aspx?id='+dict.OBJID+'&name=wiseLinkCrossId" target="_blank">Link</a></td></tr></table>');
			return output;
		},
		
		formatTwoMASS: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>J</th><th>H</th><th>K_s</th><th>phQual</th></tr>';
			output += ('<tr><td>TwoMASS</td><td>'+dict.j+'</td><td>'+dict.h+'</td><td>'+dict.k+'</td><td>'+dict.phQual+'</td></tr></table>');
			return output;
		},
		
		formatRC3: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>Hubble type</th><th>21 cm magnitude</th><th>Neutral Hydrogen Index</th></tr>';
			output += ('<tr><td>RC3</td><td>'+dict.HUBBLE+'</td><td>'+dict.M21+' &#177; '+dict.M21ERR+'</td><td>'+dict.HI+'</td></tr></table>');
			return output;
		},
		
		formatROSAT: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>cps</th><th>hr1</th><th>hr2</th><th>ext</th></tr>';
			output += ('<tr><td>ROSAT</td><td>'+dict.CPS+'</td><td>'+dict.HR1+'</td><td>'+dict.HR2+'</td><td>'+dict.EXT+'</td></tr></table>');
			return output;
		},
		
		formatFIRST: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>Peak Flux (mJy)</th><th>Major axis (arcsec)</th><th>Minor axis (arcsec)</th></tr>';
			output += ('<tr><td>FIRST</td><td>'+dict.peak+' &#177; '+dict.rms+'</td><td>'+dict.major+'</td><td>'+dict.minor+'</td></tr></table>');
			return output;
		},
		
		formatUSNO: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>Proper Motion (mas/yr)</th><th>PM angle (deg E)</th></tr>';
			var pm = (parseFloat(dict.PROPERMOTION)*10.0).toFixed(2).toString();
			output += ('<tr><td>USNO</td><td>'+pm+' &#177; '+dict.MURAERR+'</td><td>'+dict.ANGLE+'</td></tr></table>');
			return output;
		},
		
		convertDict: function(data) {
			var output = '{';
			var lines = data.split('\n');
			var header = lines[1].split(',');
			var items = lines[2].split(',');
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
		},
		
		updateHour: function() {
			if((((explore.queriesFinished.data && explore.queriesFinished.imaging) && (explore.queriesFinished.USNO && explore.queriesFinished.FIRST)) && ((explore.queriesFinished.ROSAT && explore.queriesFinished.RC3) && (explore.queriesFinished.TwoMASS && explore.queriesFinished.WISE))) && (explore.queriesFinished.spectra && explore.queriesFinished.manga) && (explore.queriesFinished.apogee && explore.queriesFinished.visits)) {
				$("#ex-hour").prop("style", "display: none;");
			}
		}
	};

	$(document).ready( function(  ) {
		explore.init();
	} );
	
})(jQuery);