// const statesGeo = "./geoJsonState.json"

d3.json("https://data.sfgov.org/resource/cuks-n6tp.json?$limit=1000", function(data) {
    //    console.log(data)
    console.log(data)
});
console.log("apple")


// d3.json("/api/counties").then(function(data2) {
//         console.log(data2)
//         createMap(data2);    
//     });
// import * as statesGeo fro./geoJsonStateson'

// var statesGeo = require("geoJsonSate.js")

// var myMap = L.map('map_id', {
//     center: [37.0902, -95.7129],
//     zoom: 5
//     // layers: [light_map, data]
// }); 

// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//     }).addTo(myMap);

// const statesGeo = "https://docs.mapbox.com/help/demos/choropleth-studio-gl/stateData.geojson"

// d3.json(statesGeo, function(data) {
//     // console.log(data)
//     L.geoJson(data, {
//         style: function(feature) {
//         var mapStyle = {
//             color: 'white',
//             fillColor: "blue", //need to pass in function to get each county by color
//             fillOpacity: 0.5,
//             weight: 1.5
//         }
//             return mapStyle
//         },
//         onEachFeature: function(feature, layer) {
//             layer.on({
//                 mouseover: function(event) {},
//                 mouseout: function(event) {},
//                 click: function(event) {},
//             })
//         } 
//     }).addTo(myMap);
//     }); // end of func

