d3.json("/api/counties").then(function(data) {
    console.log(data)
     createMap2(data);    
 });
 
 // create funciton for map
 function createMap2(data) {
 var myMap = L.map('map_id', {
     center: [37.0902, -95.7129],
     zoom: 5,
     // layers: [light_map]
 }); 
 
 var light_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
     tileSize: 512,
     maxZoom: 18,
     zoomOffset: -1,
     id: "mapbox/streets-v11",
     accessToken: API_KEY
     }).addTo(myMap);
 
 var dark_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",    
     id: 'mapbox/dark-v10',
     tileSize: 512,
     accessToken: API_KEY
     });
 
     // // create basemaps obj to hold layers
     // var baseMaps = {
     //     "light": light_map,
     //     "dark": dark_map
     // };
     
     var markers = createMarkers2(data)
     markers.addTo(myMap)
 
     d3.json("/api/counties").then(function(dataCounty) {
         console.log(dataCounty)      
           // Load in geojson data //("../static/geoJsonCounty")
           d3.json("https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json").then(geoJson => {
             geoJson.features.forEach(feature => {
                feature.properties[state] = dataCounty[feature.properties.USPS][state]
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
 
 }
 
 // create markers function
 function createMarkers2(data_county) {
     var countyMarker = Object.keys(data_county).map(s=> {
         return L.marker([data_county[s].lat, data_county[s].lng])//return L.marker([data.latitude, data.longitude]) // does this take care of "mouseover"
         .bindPopup(`<h3> <strong>${data_county[s].county}</strong></h3><hr/>`+ 
         `<b>FI Rate:</b>${data_county[s].fi_rate}%`+ " " + `<b>FI Count:</b> ${data_county[s].fi_count}<br>` +
         `<b>FI Child Rate:</b> ${data_county[s].fi_rate_child}%`+ " " +`<b>FI Child Count:</b> ${data_county[s].fi_count_child}<br> `+
         `<b>Below 185 FPL Rate(child):</b> ${data_county[s].fi_rate_fpl}%<br>`+
         `<b>Meal Cost:</b> $${data_county[s].meal_cost}` + " " +`<b>Budget Shortfall:</b> $${data_county[s].budget_shortfall} `) 
     });
 
     // create a layer group from the state markers and pass it into the map function
     var markerLayer = L.layerGroup(countyMarker)
     return markerLayer;
 };
 
 
   
 
 
 
 
 
 
 
 
 