// create google map
//var map = new MapModel();
//map.initMap();
//var mapView = new MapView({model: map});
//mapView.render();

// standard gmaps initialization
    var myLatlng = new google.maps.LatLng(48.3333, 16.35);

    // define map properties
    var myOptions = {
           center: new google.maps.LatLng(0, 0),
             zoom: 3,
             minZoom: 1,

        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        scrollwheel: false,
		draggable: false,
        navigationControl: true,
        mapTypeControl: false,
        scaleControl: true,
        disableDoubleClickZoom: false,
		 styles: [{"stylers":[{"hue":"#16a085"}]},{"elementType":"geometry","stylers":[{"color":"#212121"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]}]
    };

    // we'll use the heatmapArea
    var map = new google.maps.Map($("#map")[0], myOptions);

// listen for events from /stream decorator
var source = new EventSource(
    "/stream"
);


  var heatmapLayer = new HeatmapOverlay(map, {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "radius": 2,
            "maxOpacity": 1,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": false,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'value',
	  gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    '0.0': 'blue',
  '1': 'red'
  }
    });
  //var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
//var accessToken = 'pk.eyJ1IjoiZ2VuZXNpc2NyZXciLCJhIjoiY2poeXRlNXV6MGxncTNybnlrMnplYWhrYyJ9.0J20MQ-ofgHOUGU41LkiWg';

//var grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox.dark', attribution: "", maxZoom: 4, accessToken: accessToken});


/*var baseLayer = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=",{
      attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>",
      maxZoom: 18
    }
  ); */
  //setup map and add layers
  /*var map = new L.Map('map', {
    center: new L.LatLng(40.6953, -73.9891),
    zoom: 4,
    layers: [ heatmapLayer]
  }); */









  // Data contains max & min values and an array of point objects, this is out tweet array
var data = {
  max: 50,
  min: 0,
  data: []
}

var goodData = [];





source.onmessage = function(event){

	//heatmapLayer.setData(data);

	console.log("data received");

	// convert event.data str to obj
	event_source_tweet = JSON.parse(event.data);
    var marker_info = {
    	username: event_source_tweet.screen_name,
    	text: event_source_tweet.text,
    	created_at: event_source_tweet.created_at,
    	location: event_source_tweet.coord,
		lat: event_source_tweet.coord[0],
		lng: event_source_tweet.coord[1]
    };
    	marker_info.value = 3;
		marker_info.fresh=true;
		 goodData.push(marker_info);
		 //create new array for live points, push it to the map
	data.data = goodData;
    var newData = [];
    for(var j=0;j<data.data.length;j++) {
      var point = data.data[j];
      if(point.value >= 50) {
        point.fresh = false;
      }
      //fade in fresh points, fade out unfresh points
      if(point.fresh) {
        point.value = point.value + 8;
      } else {
        point.value = point.value - 1;
      }

      if(point.value > 0) {
        newData.push(data.data[j]);
      }
    }
    data.data = newData;

		 console.log(goodData.length);
		 data.data = goodData
		 heatmapLayer.setData(data);
		//heatmapLayer.repaint();


   // var markerView = new MarkerView({model: map, marker_info: marker_info});
    //markerView.render();

};


