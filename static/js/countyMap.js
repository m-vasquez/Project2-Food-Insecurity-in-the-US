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
// method to update the control based on feature properties passed
info.update = function (feature) {
  this._div.innerHTML = '<h4>US Food Insecurity by County</h4>' + (feature ?
    '<b>' + "testing" + '</b><br />' + feature.properties.countyData.county
    : 'Choose a county for more info!');
};
info.addTo(myMap);

function getColor(feature) {
  // console.log(feature)
  switch (true) {
    case feature == 0:
      return "red";
    case feature <= 5:
      return "dodgerblue";
    case feature <= 10:
      return "lightsteelblue";
    case feature <= 15:
      return "indianred";
    case feature <= 20:
      return "slateblue";
    case feature <= 25:
      return "mediumpurple";
    case feature <= 35:
      return "orchid";
    default:
      return "lightsalmon";
  }
}

function styleCounty(feature) {
  var color = "lightsalmon"
  if (feature.properties.countyData !== undefined) {

    color = getColor(feature.properties.countyData.fi_rate)
  }
  return {
    fillColor: color,
    weight: 2,
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

function onEachFeature1(feature, layer) {
  // console.log(feature.countyData)
  var props = feature.properties

  layer.on({
    mouseover: function (event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.9
      });
    },
    mouseout: function (event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.7
      });
    },
    // click: function(event) {
    //         myMap.fitBounds(event.target.getBounds());
    //       }  
  });
  if (feature.properties.countyData === undefined) {
    feature.properties.countyData = 'None'
  }
  layer.bindPopup("<h3>" + feature.properties.countyData.county + "</h3> " + "<hr>" + "<b> FI Rate: </b>" + feature.properties.countyData.fi_rate + "%" + " " + "<b>FI Count: </b>" + feature.properties.countyData.fi_count +
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

    });

    geojsonmap = L.geoJson(geoJsonData, {
      style: styleCounty,

      // bind a pop-up for each layer
      onEachFeature: onEachFeature1
    }).addTo(myMap);
  })
})