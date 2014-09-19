var lats=0;
var longis=0;
var Map = require('ti.map');

function mapwindow()
{ 
	var self = Ti.UI.createWindow(
		{ 
			title: 'Map of Kundas', 
			backgroundColor: '#FFFFFF', 
			barColor: '#3498db',
			fullscreen: true,
			navBarHidden: true 
		});
	self.addEventListener('focus', fillMap);
		
	var mapview = Map.createView(
	{
	    mapType: Map.NORMAL_TYPE,
	    region: {latitude:33.9996, longitude:71.4866,
	            latitudeDelta:0.1, longitudeDelta:0.1},
	    animate:true,
	    width:Ti.UI.FILL,
	    height:Ti.UI.FILL,
	    regionFit:true,
	    //userLocation:true,
	    //annotations: fillAnnotations()
	});
	
	function fillMap()
	{
		var annotationss = [];
		
		var apiurl = "http://nokunda.labandroid.com/api?task=incidents&limit=10";
	 	var client = Ti.Network.createHTTPClient(
	 	{
	    	onload : function(e) 
		    {
		         //Ti.API.info("Received Report: " + this.responseText);
		         var obj = JSON.parse(this.responseText);
				 var x = obj.payload.incidents;
				 //lats = x[i].incident.locationlatitude;
				 //longis = x[i].incident.locationlongitude;
				 
				 for (var i=0; i < x.length;i++)
				 {
				 	var annon = Map.createAnnotation(
					{
					    latitude: parseFloat(x[i].incident.locationlatitude),
					    longitude: parseFloat(x[i].incident.locationlongitude),
					    title: x[i].incident.incidenttitle,
					    subtitle: 'Pekhawar',
					    pincolor: Map.ANNOTATION_RED,
					    myid: i
					});
					
					annotationss.push(annon);
				 }
	
				Ti.API.info("PUSHED Reports: " + annotationss);
				
				mapview.annotations = annotationss;
				self.add(mapview);
		    },
	     
	     	onerror : function(e) 
	     	{
	         Ti.API.debug(e.error);
	         //alert('error');
	         
	         var annon = Map.createAnnotation(
			 {
			    latitude: 33.9996,
			    longitude: 71.4866,
			    title:"Error Fetching Reports",
			    subtitle:'Error',
			    pincolor:Map.ANNOTATION_RED,
			    myid:1
			 });
			 annotationss.push(annon);
			 
		 	mapview.annotations = annotationss;
		 	self.add(mapview);
	     	},
	     timeout : 5000
		 });
		 
		 client.open("GET", apiurl);
		 client.send();
	}
	
	fillMap();
	
	if (Ti.Platform.osname == "android")
	{
		rc = Map.isGooglePlayServicesAvailable();
		if ( rc == Map.SUCCESS )
		{
			Ti.API.info('Google Play Services INSTALLED on Phone!!');
		}
		else
		{
			Ti.API.info('Google Play services NOT INSTALLED!');
		}
	}
	
	return self; 
};
module.exports = mapwindow;
