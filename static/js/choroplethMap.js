// Creating map object
var myMap = L.map("map_id", {
    center: [37.0902, -95.7129],
    zoom: 4.5
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

d3.json("/api/states").then(function(data) {
console.log(data)      
  // Load in geojson data
  d3.json("https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson").then(geoJson => {
    geoJson.features.forEach(feature => {
       feature.properties[fi_rate] = data[feature.properties.name][fi_rate]
     });

    // Create a new choropleth layer
      L.choropleth(x, {
      valueProperty: "fi_rate",
      scale: ["#ffffb2", "#b10026"],
      steps: 10,
      mode: "q",
      style: {
        color: "black",
        weight: 1,
        fillOpacity: 0.7},
  
      // Binding a pop up to each layer
      onEachFeature: function(feature, layer) {
        layer.on({
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
        
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          // When a feature is clicked it is enlarged to fit the screen
          click: function(event) {
            myMap.fitBounds(event.target.getBounds());
          }
        });
        layer.bindPopup("<h1>" + feature.properties.name + "</h1> <hr> <h2>" + feature.properties.fi_rate + "</h2>");
  
      }
    }).addTo(myMap);
  });
});
  
      

  
//     // Set up the legend
//     var legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//       var div = L.DomUtil.create("div", "info legend");
//       var limits = geojson.options.limits;
//       var colors = geojson.options.colors;
//       var labels = [];
  
//       // Add min & max
//       var legendInfo = "<h1>Median Income</h1>" +
//         "<div class=\"labels\">" +
//           "<div class=\"min\">" + limits[0] + "</div>" +
//           "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//         "</div>";
  
//       div.innerHTML = legendInfo;
  
//       limits.forEach(function(limit, index) {
//         labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//       });
  
//       div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//       return div;
//     };
  
//     // Adding legend to the map
//     legend.addTo(myMap);
  

// d3.json("https://leafletjs.com/examples/choropleth/us-states.js").then(geoJson => {
//     geoJson.features.forEach(feature => {
//        feature.properties[fi_rate] = data[feature.properties.name][fi_rate]
//      });
//      L.choropleth(geoJson, {
//           data: //‘fi_rate’

