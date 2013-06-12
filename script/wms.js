
OpenLayers.ProxyHost="proxy.php?url=";


$.URD = $.URD || {};

$.URD.addWMS = function (server,layer,title) {


var format = new OpenLayers.Format.WMSCapabilities({versiom:"1.3.0"});

OpenLayers.Request.GET({
    url: server,
    params: {
        SERVICE: "WMS",
        VERSION: "1.3.0", //should check for availability of 1.3.0 also?
        REQUEST: "GetCapabilities"
    },
    success: function(request) {
        var doc = request.responseXML;
        if (!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        var capabilities = format.read(doc);
		
		var matchedLayer = "";

		if (typeof(capabilities.capability)=="undefined"){
			alert("Excuses, er is een fout opgetreden bij het verbinden met "+server+".");
			return;
		}
		
			var layerNames = [];
			//does the layer exist
			$(capabilities.capability.layers).each(function(){
				//als laag is de geselecteerde laag, of laag is geselecteerd maar dan zonder prefix, of er is maar 1 laag in service
				if (this.name==layer || (this.name.indexOf(":")>0 && this.name.split(":")[1]==layer) || capabilities.capability.layers.length == 1) {
					 var lyrOpts = {
					 type:"wms",
					 url: capabilities.service.href||server, 
					 desc: this.abstract,
					 layers: this.name, 
					 label: this.title, 
					 styles: this.styles,
					 legend: {url:this.styles[0].legend.href,title:this.styles[0].legend.title},
					 queryable:this.queryable,
					 metadataURLs: this.metadataURLs,
					 formats: this.formats,
					 bounds:this.bounds,
					 attribution: this.attribution
					}
					client.layers(lyrOpts);
					matchedLayer = this.name;	
				}
				layerNames.push({name:this.name,title:this.title});
			})
		
		if (matchedLayer=="") {

	console.log(layerNames);
		
			//here open a panel to let the user select a layer from the list
			//note that layer can contain a comma separated list of layers
			
			var html = "<select id='selLayer'>";
			$(layerNames).each(function(){
				console.log(this);
				html += "<option value="+this.name+">"+(this.title||this.name)+"</option>";
			})
			html+= "</select><button onclick=\"$.URD.addWMS('"+ server+ "',$('#selLayer').val(),$('#selLayer option:selected').text());$('#wmsSelectLayer').dialog( 'close');\">Selecteer</button>";
		$( "#wmsSelectLayer" ).html(html).dialog({
			autoOpen: true,
			height: 500,
			width: 750,
			modal: true
		});
		
		};

		
    },
    failure: function() {
        alert("Trouble getting capabilities doc");
        OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
    }
});
}

   