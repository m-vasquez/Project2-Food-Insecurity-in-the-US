var myMap = L.map("map_id", {
  center: [37.0902, -95.7129],
  zoom: 4.5,
  layer: tilemap
});

var tilemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxzoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var geojsonmap;

var info = L.control();

info.onAdd = function (myMap) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// use for map style
info.update = function (feature) {
  this._div.innerHTML = '<h4>US Food Insecurity by State</h4>' + 'Choose a state for more info!'
};
info.addTo(myMap);

function getColor(feature) {
  // console.log(feature)
  switch (true) {
    case feature <= 10000000:
      return "snow";
    case feature <= 50000000:
      return "blue";
    case feature <= 100000000:
      return "deepskyblue";
    case feature <= 250000000:
      return "dodgerblue";
    case feature <= 500000000:
      return "royalblue";
    case feature <= 750000000:
      return "slateblue";
    case feature <= 1000000000:
      return "mediumpurple";
    case feature <= 1500000000:
      return "darkviolet";
    default:
      return "indigo";
  }
}

function styleCounty(feature) {
  var color = "lightsalmon"
  if (feature.properties.stateData !== undefined) {

    color = getColor(feature.properties.stateData.budget_shortfall)
  }
  return {
    fillColor: color,
    weight: 2,
    opacity: 1,
    color: 'whitesmoke',
    dashArray: '2',
    fillOpacity: 0.9
  };
}

// add a legend for colorscale
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [10000000, 50000000, 100000000, 250000000, 500000000, 750000000, 1000000000, 1500000000],
        labels = [];
        div.innerHTML += "<h4><b>Food Insecurity</b></h4>"
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += 
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);

function highlightFeature(e) {
  var layer = e.target;
  info.update(layer.feature.properties)
  
  layer.setStyle({
      weight: 1,
      color: 'thistle',
      dashArray: '',
      fillOpacity: 0.5
  });
  
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
  }
  
  function resetHighlight(e) {
  geojsonmap.resetStyle(e.target);
  info.update();
  }
 
function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
  });
  if (feature.properties.stateData === undefined) {
    feature.properties.stateData = 'None'
   }
  layer.bindPopup("<h3>" + feature.properties.stateData.state + "</h3> " + "<hr>" + "<b> FI Rate: </b>" + feature.properties.stateData.fi_rate + "%" + " " + "<b>FI Count: </b>" + feature.properties.stateData.fi_count +
  "<br>" + "<b>FI Child Rate:</b> " + feature.properties.stateData.fi_rate_child + "%" + " " + "<b>FI Child Count: </b>" + feature.properties.stateData.fi_count_child + "<br>" +
  "<b>Below 185 FPL (child):</b> " + feature.properties.stateData.fi_rate_fpl + "%" + "<br>" + "<b>Budget Shortfall:</b> $" + feature.properties.stateData.budget_shortfall)
  // layer.bindPopup("<h1>" + feature.properties.countyData + "</h1> ")
  }


d3.json("../static/data/geoJsonState.json").then(function(geoJsonData) {
  // perform GET req
  d3.json("/api/states").then(DATA => {
    geoJsonData.features.forEach(feature => {
     
      var stateName = feature.properties.NAME;
      var state = Object.keys(DATA).find(state => {
        return stateName === DATA[state].state;
      });
      feature.properties.stateData = DATA[state];
    });
          
        // create choropleth
        geojsonmap = L.geoJson(geoJsonData, {
          style: styleCounty,
    
          // bind a pop-up for each layer
          onEachFeature: onEachFeature
        }).addTo(myMap);
      })
    })
