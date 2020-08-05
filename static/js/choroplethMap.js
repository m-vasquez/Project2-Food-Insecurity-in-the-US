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

var geojsonmap;

// function getColor(d) {
//   return d > 30000 ? 'purple' :
//          d > 250  ? 'green' :
//          d > 01000  ? 'blue' :
//          d > 15  ? '#FC4E2A' :
//          d > 1000000   ? '#FD8D3C' :
//          d > 500   ? '#FEB24C' :
//          d > 10000   ? '#FED976' :
//                     'red';
// }

// function style1(feature) {
//   return {
//       fillColor: getColor(feature.properties.countyData),
//       weight: 2,
//       opacity: 1,
//       color: 'white',
//       dashArray: '3',
//       fillOpacity: 0.7
//   };
// }

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'infoLegend'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Food Insecurity</h4>' ;
};

info.addTo(myMap);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        colorGrades = [5, 10, 15, 20, 25];
        div.innerHTML += "<h2><b>Food Insecurity Rate</b></h2>" + "<br>"
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
      color: 'blue',
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

function zoomToFeature(e) {
  myMap.fitBounds(e.target.getBounds());
}

function onEachFeature1(feature, layer) {
  layer.on({
      mouseover: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 0.9
        });
      },
    
      mouseout: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 0.5
        });
      },
      click: function(event) {
              myMap.fitBounds(event.target.getBounds());
            }   
  });
  layer.bindPopup("<h3>" + x.county + "</h3> " + "<hr>" + "<b> FI Rate: </b>" + x.fi_rate + "%" + " " + "<b>FI Count: </b>" + x.fi_count +
  "<br>" + "<b>FI Child Rate:</b> " + x.fi_rate_child + "%" + " " + "<b>FI Child Count: </b>" + x.fi_count_child + "<br>" +
  "<b>Below 185 FPL (child):</b> " + x.fi_rate_fpl + "%" + "<br>" + "<b>Budget Shortfall:</b> $" + x.budget_shortfall)
  // layer.bindPopup("<h1>" + feature.properties.countyData + "</h1> ")
}


var geoJsonData = "../static/data/geoJsonCounty.json"
var geoJsonLink = "https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json"

d3.json(geoJsonData).then(geoJson => {
  d3.json("/api/counties").then(countiesData => {
    geoJson.features.forEach(feature => {
      var countyGeoId = parseInt(feature.properties.STATE + feature.properties.COUNTY);
      var county = Object.keys(countiesData).find(county => {
        return countyGeoId === countiesData[county].geoid;
      });
      feature.properties.countyData = countiesData[county];
    });
    geojsonmap = L.geoJson(geoJson, {
      // valueProperty: "countyData.fi_rate",
      // scale: ["lightsteelblue"],
      // steps: 10,
      // mode: "q",
      style: style1,
      onEachFeature: onEachFeature1

    }).addTo(myMap);
  });
});
  
















      // // Binding a pop up to each layer
      // onEachFeature: function(feature, layer) {
      //   layer.on({
      //     mouseover: function(event) {
      //       layer = event.target;
      //       layer.setStyle({
      //         fillOpacity: 0.9
      //       });
      //     },
        
      //     mouseout: function(event) {
      //       layer = event.target;
      //       layer.setStyle({
      //         fillOpacity: 0.5
      //       });
      //     },
      //     // When a feature is clicked it is enlarged to fit the screen
      //     click: function(event) {
      //       myMap.fitBounds(event.target.getBounds());
      //     }
      //   });
      //   layer.bindPopup("<h1>" + feature.properties.name + "</h1> <hr> <h2>" + feature.properties.fi_rate + "</h2>");
  
      // }
//     }).addTo(myMap);
//   });
// });



// d3.json("/api/states").then(function(data) {
// console.log(data)      
//   // Load in geojson data
//   d3.json("https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson").then(geoJson => {
//     geoJson.features.forEach(feature => {
//        feature.properties[fi_rate] = data[feature.properties.name][fi_rate]
//      });

//     // Create a new choropleth layer
//       L.choropleth(x, {
//       valueProperty: "fi_rate",
//       scale: ["#ffffb2", "#b10026"],
//       steps: 10,
//       mode: "q",
//       style: {
//         color: "black",
//         weight: 1,
//         fillOpacity: 0.7},
  
//       // Binding a pop up to each layer
//       onEachFeature: function(feature, layer) {
//         layer.on({
//           mouseover: function(event) {
//             layer = event.target;
//             layer.setStyle({
//               fillOpacity: 0.9
//             });
//           },
        
//           mouseout: function(event) {
//             layer = event.target;
//             layer.setStyle({
//               fillOpacity: 0.5
//             });
//           },
//           // When a feature is clicked it is enlarged to fit the screen
//           click: function(event) {
//             myMap.fitBounds(event.target.getBounds());
//           }
//         });
//         layer.bindPopup("<h1>" + feature.properties.name + "</h1> <hr> <h2>" + feature.properties.fi_rate + "</h2>");
  
//       }
//     }).addTo(myMap);
//   });
// });
  
      

  
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

