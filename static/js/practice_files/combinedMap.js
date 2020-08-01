// Creating map object
var myMap = L.map("map_id", {
    center: [37.0902, -95.7129],
    zoom: 4.75
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Use this link to get the geojson data.
  var stateLink = "https://leafletjs.com/examples/choropleth/us-states.js";
  var countyLink = "https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json";

  // create a function to pull the data from the county db via flask
  d3.json("/api/counties").then(function(countyData) { 
      console.log(countyData)
      return countyData          
 });

 // create function to get each county and break up by color
 function getCountyColor(GEOID10) {
     var colors = ['#e5f5f9','#99d8c9','#2ca25f']; // or a palette like 'picnic' or 'PuBuGn'
     return colors[GEOID10-1]
 }

 // get geojson data
 d3.json(stateLink).then(function(data) {

     L.geoJson(data, {
         style: function(feature) {
            var mapStyle = {
                color: 'white',
                fillColor: getCountyColor(feautre.properties.name), //need to pass in function to get each county by color
                fillOpacity: 0.5,
                weight: 1.5
            }
             return mapStyle
         },
         onEachFeature: function(feature, layer) {
             layer.on({
                 mouseover: function(event) {},
                 mouseout: function(event) {},
                 click: function(event) {},
             })
         } 
     }).addTo(myMap);
 }); // end of func
