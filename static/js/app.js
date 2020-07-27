
d3.json("/api/states").then(function(data) {
    var us_data = data
    console.log(data)



var myMap = L.map('map', {
    center: [39.82, -98.57],
    zoom: 2
}); 

var us_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",    
    id: 'mapbox/streets-v11',
    tileSize: 512,
    accessToken: API_KEY
})

// Define Variables for Tile Layers
// var us_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.satellite",
//     accessToken: API_KEY
// });

us_map.addTo(myMap);

});


// pull in data for counties
d3.json("/api/counties").then(function(data) {
    var county_data = data
    console.log(data)
});