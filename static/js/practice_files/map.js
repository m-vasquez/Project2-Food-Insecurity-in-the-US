// d3.json("/api/states").then(function(data) {
//     //    console.log(data)
//         createMap(data);    
//     });
    
// // create funciton for map
// function createMap(data) {
// var myMap = L.map('map_id', {
//     center: [37.0902, -95.7129],
//     zoom: 5,
//     // layers: [light_map, data]
// }); 

// var light_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//     }).addTo(myMap);

// // var dark_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
// //     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",    
// //     id: 'mapbox/dark-v10',
// //     tileSize: 512,
// //     accessToken: API_KEY
// //     });

// //     // create basemaps obj to hold layers
// //     var baseMaps = {
// //         "light": light_map,
// //         "dark": dark_map
// //     };

// //     var overlayMaps = {
// //         'data': data,
// //         'data2': data2
// //     }

// //     L.control.layers(baseMaps, overlayMaps, {
// //         collapsed: false
// //     }).addTo(myMap);
    
//     var markers = createMarkers(data)
//     markers.addTo(myMap)

// }
    
// // create markers function
// function createMarkers(data_state) {
//     var stateMarker = Object.keys(data_state).map(s=> {
//         return L.marker([data_state[s].lat, data_state[s].lng])//return L.marker([data.latitude, data.longitude]) // does this take care of "mouseover"
//         .bindPopup(`<h3> <strong>${data_state[s].state}</strong></h3><hr/>`+ 
//         `<b>FI Rate:</b>${data_state[s].fi_rate}%`+ " " + `<b>FI Count:</b> ${data_state[s].fi_count}<br>` +
//         `<b>FI Child Rate:</b> ${data_state[s].fi_rate_child}%`+ " " +`<b>FI Child Count:</b> ${data_state[s].fi_count_child}<br> `+
//         `<b>Below 185 FPL Rate(child):</b> ${data_state[s].fi_rate_fpl}%<br>`+
//         `<b>Meal Cost:</b> $${data_state[s].meal_cost}` + " " +`<b>Budget Shortfall:</b> $${data_state[s].budget_shortfall} `) 
//     });

//     // create a layer group from the state markers and pass it into the map function
//     var markerLayer = L.layerGroup(stateMarker)
//     return markerLayer;
// };




// ---------------------------- with vector tiles

mapboxgl.accessToken = API_key;

var map = new mapboxgl.Map({  container: "map_id",
style: "mapbox://styles/mapbox/streets-v11",
center: { lat: 37.0902, lng: -95.7129 },
zoom: 3 });

map.on("load", function() {
    map.addLayer({
      id: "counties",
      type: "fill",
      source: {
        type: "vector",
        tiles: [
          "https://gis-server.data.census.gov/arcgis/rest/services/Hosted/VT_2017_050_00_PY_D1/VectorTileServer/tile/{z}/{y}/{x}.pbf"
        ]
      },
      "source-layer": "County",
      paint: {
        "fill-opacity": 0.6,
        "fill-color": "blue"
      }
    });
  });

  var geoJsonData = "../static/data/geoJsonCounty.json"
// var geoJsonLink = "https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json"

d3.json(geoJsonData).then(geoJson => {
  d3.json("/api/counties").then(countiesData => {
    geoJson.features.forEach(feature => {
      var countyGeoId = parseInt(feature.properties.STATE + feature.properties.COUNTY);
      var county = Object.keys(countiesData).find(county => {
        return countyGeoId === countiesData[county].geoid;
      });
      var coords2 = Object.keys(countiesData).map(county =>{
        return countiesData[county].lng + "," + countiesData[county].lat;
      });
      var x = feature.properties.countyData = countiesData[county];
      
      // var coordinates = feature.properties.countyData.lng + "," + feature.properties.countyData.lat
      // console.log(coordinates)
      new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat([coords2])[1]
      .setHTML("<h1>" + feature.properties.countyData.county + "</h1> " + feature.properties.countyData.fi_count)
      .addTo(map)
    });

    });
  });
  