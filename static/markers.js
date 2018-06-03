// create google map
//var map = new MapModel();
//map.initMap();
//var mapView = new MapView({model: map});
//mapView.render();

// listen for events from /stream decorator
var source = new EventSource(
    "/stream"
);

 //heatmap.js config
  var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": .001,
    "maxOpacity": 1,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    //latField: 'latitude',
    // which field name in your data represents the longitude - default "lng"
    //lngField: 'longitude',
    // which field name in your data represents the data value - default "value"
    valueField: 'value'
  };
  var heatmapLayer = new HeatmapOverlay(cfg);
  var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
var accessToken = 'pk.eyJ1IjoiZ2VuZXNpc2NyZXciLCJhIjoiY2poeXRlNXV6MGxncTNybnlrMnplYWhrYyJ9.0J20MQ-ofgHOUGU41LkiWg';

var grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox.dark', attribution: "", maxZoom: 4, accessToken: accessToken});


var baseLayer = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=",{
      attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>",
      maxZoom: 18
    }
  );
  //setup map and add layers
  var map = new L.Map('map', {
    center: new L.LatLng(40.6953, -73.9891),
    zoom: 4,
    layers: [grayscale/*, heatmapLayer*/]
  });









  // Data contains max & min values and an array of point objects, this is out tweet array
var data = {
  max: 15,
  min: 0,
  data: []
}

var goodData = [];

//initilaize variables for the D3 chart
    var countArray = [],
      svg,
      day,
      x,
      y,
      margin,
      height,
      width,
      intervalCounter = 10,
      index = 0,
      lastDate,
      data = {
        max:15,
        min:0,
        data:[]
      };

    //initializeChart();


source.onmessage = function(event){
	// convert event.data str to obj
	event_source_tweet = JSON.parse(event.data);
    var marker_info = {
    	username: event_source_tweet.screen_name,
    	text: event_source_tweet.text,
    	created_at: event_source_tweet.created_at,
    	location: event_source_tweet.coord
    };
    	marker_info.value = 0;
		marker_info.fresh=true;
		 goodData.push(this.marker_info);
   // var markerView = new MarkerView({model: map, marker_info: marker_info});
    //markerView.render();

};


 //sets margins and axes for the D3 chart.  Borrowed from Chris Metcalf's example on dev.socrata.com
    function initializeChart() {

          // Set our margins
       margin = {
          top: 20,
          right: 20,
          bottom: 30,
          left: 60
      },
      width = 800 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;
      // Our X scale
      x = d3.time.scale()
          .domain([new Date(goodData[0].date), d3.time.day.offset(new Date(goodData[goodData.length - 1].date), 1)])
          .rangeRound([0, width - margin.left - margin.right])
          //.ticks(d3.time.day, 1);
      // Our Y scale
      y = d3.scale.linear()
          .domain([0,100])
          .rangeRound([height, 0]);
      // Our color bands
      var color = d3.scale.ordinal()
          .range(["#308fef", "#5fa9f3", "#1176db"]);
      // Use our X scale to set a bottom axis
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      // Same for our left axis
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickValues([0,50,100]);
      // Add our chart to the #chart div
      svg = d3.select("#chartBox").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
    };