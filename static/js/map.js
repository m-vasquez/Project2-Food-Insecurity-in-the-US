// define path for db info
var data_state = d3.json("/api/states")
var data_county = d3.json("/api/counties")

console.log(data_state)
console.log(data_county)

// create function to get all data
function stateData() {
    return data_state
}

// create function to get state lat/lng
function getStateGeo() {
    return data_state.then(S=>S.latitude && S.longitude)
    .catch(console.error)
};
// getStateGeo()

// create function to get states
function getStates() {
    return data_state.then(S => S.state)
    .catch(console.error)
}
// getStates()

// create funciton for map
function createMap(data) {
    var light_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",    
    id: 'mapbox/light-v10',
    // tileSize: 512,
    accessToken: API_KEY
    });

var dark_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",    
    id: 'mapbox/dark-v10',
    // tileSize: 512,
    accessToken: API_KEY
    });

    // create basemaps obj to hold layers
    var baseMaps = {
        "light": light_map,
        "dark": dark_map
    };
    // create overlay
    var overlayMaps = {
        'data': data
    };
    //create map object
    var myMap = L.map('map', {
        center: [37.0902, -95.7129],
        zoom: 15,
        layers: [light, data]
    }); 
    // control layer and add to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}

// create markers function
function createMarkers(state) {
    var stateMarker = state.map(s=> {
        return L.marker([getStateGeo])//return L.marker([data.latitude, data.longitude]) // does this take care of "mouseover"
        .bindPopup(`<h3>${s.state}</h3><br/>`, s.fi_rate, s.fi_count, s.fi_rate_child, s.fi_count_child,
        s.fi_rate_below_185_fpl_child, s.cost_per_meal, s.food_budget_shortfall) 
    });

    // create a layer group from the state markers and pass it into the map function
    var markerLayer = L.layerGroup(stateMarker)
    return markerLayer;
};

// function createMarkers(response) {
//     // Pull the "state" property off of response
//     var states = response.state;
  
//     // Initialize an array to hold bike markers
//     var stateMarkers = [];
  
//     // Loop through the stations array
//     for (var index = 0; index < states.length; index++) {
//       var state = states[index];
  
//       // For each station, create a marker and bind a popup with the station's name
//       var stateMarker = L.marker([state.lat, state.lon])
//         .bindPopup("<h3>" + state.state + "<h3><h3>fi_rate: " + state.fi_rate + "</h3>");
  
//       // Add the marker to the bikeMarkers array
//       stateMarkers.push(stateMarker);
//     }

//     // create a layer group from the state markers and pass it into the map function
//     var markerLayer = L.layerGroup(stateMarkers)
//     return markerLayer;
  
//     // // Create a layer group made from the bike markers array, pass it into the createMap function
//     // createMap(L.layerGroup(bikeMarkers));
//   }
  

// perform call to get state data info and call markers 
// function run() {
//     getStates().then(s=>{
//         return createMarkers;
//     }).then(markerLayer => {
//         return createMap(markerLayer);
//     })
// }

// function handleError(err) {
//     console.error(err);
//     d3.select('map').text('<h1>an error has occured</h1>');
// }

function runAll() {
    getStates().then(createMarkers).then(createMap)//.catch(handleError);
}

runAll();


// county info