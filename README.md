# ExploreTool
<h2>Overview</h2>
ExploreTool is a lightweight version of the Skyserver Explore Tool for use in education materials on Voyages. It allows the user to search for an object in the SDSS database under a variety of criteria and displays data pertaining to the object.
<h3>Search</h3>
There are seven search buttons on the form, each for a different type. Each search can be done independently of the others. Possible searches include by Name, SpecObjID/apstar_id/apogee_id, Ra/Dec, 5-part SDSS, ObjID, Plate-MJD-Fiber, and MangaID.
<h3>Results</h3>
Once a search is completed, the data for that object will be displayed below. Possible data categories include general, imaging, cross-identifications, optical spectra, MaNGA, and Apogee data. Not every object will have data in all of these categories. If no data could be found for a given object, a message will display indicating no data was available.
<h2>Installation and Implementation</h2>
To install ExploreTool on a WordPress site, download the zip file of ExploreTool and extract it. Then, copy the entire folder into the wp-content/plugins directory for your site. ExploreTool should now be available under "Plugins" in the wp-admin dashboard. Click "activate" to enable the plugin on your site. 
<br><br>
Once installed, ExploreTool can be implemented on a page using the following shortcode: [explore-tool].
This shortcode has one optional argument, default. This argument provides an objID for the default data displayed by the tool. Example: [explore-tool default="1237668296598749280"]
