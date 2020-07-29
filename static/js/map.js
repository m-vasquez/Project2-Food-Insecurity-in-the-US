// // define path for db info
// d3.json("/api/counties").then(function(data) {

// })

// map.addLayers([layer1, layer2])

d3.json("/api/states").then(function(data) {
//    console.log(data)
    createMap(data);    

    d3.json("/api/states").then(function(data2) {
        console.log(data2)
        createMap(data2);    
 });
});

// create funciton for map
function createMap(data, data2) {
var myMap = L.map('map_id', {
    center: [37.0902, -95.7129],
    zoom: 5,
    layers: [light_map, data]
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

    // create basemaps obj to hold layers
    var baseMaps = {
        "light": light_map,
        "dark": dark_map
    };

    var overlayMaps = {
        'data': data,
        'data2': data2
    }

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
    var markers = createMarkers(data)
    markers.addTo(myMap)

    var markers2 = createMarkers2(data2)
    markers2.addTo(myMap)

}

// create markers function
function createMarkers(data_state) {
    var stateMarker = Object.keys(data_state).map(s=> {
        return L.marker([data_state[s].lat, data_state[s].lng])//return L.marker([data.latitude, data.longitude]) // does this take care of "mouseover"
        .bindPopup(`<h3> <strong>${data_state[s].state}</strong></h3><hr/>`+ 
        `<b>FI Rate:</b>${data_state[s].fi_rate}%`+ " " + `<b>FI Count:</b> ${data_state[s].fi_count}<br>` +
        `<b>FI Child Rate:</b> ${data_state[s].fi_rate_child}%`+ " " +`<b>FI Child Count:</b> ${data_state[s].fi_count_child}<br> `+
        `<b>Below 185 FPL Rate(child):</b> ${data_state[s].fi_rate_fpl}%<br>`+
        `<b>Meal Cost:</b> $${data_state[s].meal_cost}` + " " +`<b>Budget Shortfall:</b> $${data_state[s].budget_shortfall} `) 
    });

    // create a layer group from the state markers and pass it into the map function
    var markerLayer = L.layerGroup(stateMarker)
    return markerLayer;
};

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



  








