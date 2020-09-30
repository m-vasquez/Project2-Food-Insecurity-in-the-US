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
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};
// add map explanation/title
info.update = function (feature) {
  this._div.innerHTML = '<h4>US Food Insecurity by County</h4>' + 'Choose a county for more info!'
};
info.addTo(myMap);

function getColor(feature) {
  // console.log(feature)
  switch (true) {
    case feature <= 0:
      return "mintcream";
    case feature <= 5:
      return "mediumaquamarine";
    case feature <= 10:
      return "lightgreen";
    case feature <= 15:
      return "lightseagreen";
    case feature <= 20:
      return "lightsalmon"; 
    case feature <= 25:
      return "orange"; 
    case feature <= 35:
      return "red"; 
    default:
      return "lightgrey";
  }
}

function styleCounty(feature) {
  var color = "lightgrey"
  if (feature.properties.countyData !== undefined) {

    color = getColor(feature.properties.countyData.fi_rate)
  }
  return {
    fillColor: color,
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '2',
    fillOpacity: 0.9
  };
}

// add a legend for colorscale
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 15, 20, 25, 35, "no data"],
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
 
function onEachFeature1(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
  });
  if (feature.properties.countyData === undefined) {
    feature.properties.countyData = 'None'
   }
  layer.bindPopup("<h5>" + feature.properties.countyData.county + "</h5> " + "<hr>" + "<b> FI Rate: </b>" + feature.properties.countyData.fi_rate + "%" + " " + "<b>FI Count: </b>" + feature.properties.countyData.fi_count +
    "<br>" + "<b>FI Child Rate:</b> " + feature.properties.countyData.fi_rate_child + "%" + " " + "<b>FI Child Count: </b>" + feature.properties.countyData.fi_count_child + "<br>" +
    "<b>Below 185 FPL (child):</b> " + feature.properties.countyData.fi_rate_fpl + "%" + "<br>" + "<b>Budget Shortfall:</b> $" + feature.properties.countyData.budget_shortfall)
}

d3.json("../static/data/geoJsonCounty.json").then(function (geoJsonData) {
  // console.log(geoJsonData)

  // perform GET req
  d3.json("/api/counties").then(countiesData => {
    // console.log(countiesData)
    geoJsonData.features.forEach(feature => {
      var countyGeoId = parseInt(feature.properties.GEO_ID.slice(9, 14));
      var county = Object.keys(countiesData).filter(Boolean).find(county => {
        return countyGeoId === countiesData[county].geoid;
      });
      feature.properties.countyData = countiesData[county];
      console.log(feature.properties.countyData)

    });

    geojsonmap = L.geoJson(geoJsonData, {
      style: styleCounty,

      // bind a pop-up for each layer
      onEachFeature: onEachFeature1
    }).addTo(myMap);
  })
})