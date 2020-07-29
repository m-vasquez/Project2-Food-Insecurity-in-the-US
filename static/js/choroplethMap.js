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
  d3.json("https://leafletjs.com/examples/choropleth/us-states.js").then(geoJson => {
    geoJson.features.forEach(feature => {
       feature.properties[fi_rate] = data[feature.properties.name][fi_rate]
     });

    // Create a new choropleth layer
      L.choropleth(a, {
      // Define what  property in the features to use
      valueProperty: "fi_rate",
      // Set color scale
      scale: ["#ffffb2", "#b10026"],
      // Number of breaks in step range
      steps: 10,
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8},
  
      // Binding a pop-up to each layer
      onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          // When a feature is clicked, it is enlarged to fit the screen
          click: function(event) {
            myMap.fitBounds(event.target.getBounds());
          }
        });
        // Giving each feature a pop-up with information pertinent to it
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

