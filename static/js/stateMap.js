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

// method that we will use to update the control based on feature properties passed
info.update = function (feature) {
  if (feature.properties.stateData === undefined) {
    feature.properties.stateData = 'None'
   }
      this._div.innerHTML = '<h4>US Food Insecurity</h4>' +  (feature ?
        '<b>' + feature.properties.countyData.county+ '</b><br />' + "<b>FI Rate: </b> " + feature.properties.countyData.fi_rate + '%' + "<b>FI Count: </b> " 
        + feature.properties.countyData.fi_count + '<br>' + "<b>FI Child Rate: </b> " + 'props.fi_rate_child' + '%' + ' ' + 
        "<b>FI Child Count: </b> " + feature.properties.countyData.fi_count_child + '<br>' + "<b>Below 185 FPL (child): </b>" + 
        feature.properties.countyData.fi_rate_fpl + "%" + "<br>" + "<b>Budget Shortfall:</b> $" + feature.properties.countyData.budget_shortfall
        : 'Hover over a county!');

  // this._div.innerHTML = '<h4>US Food Insecurity</h4>' + '<hr>' + 'Choose a state for more info'
};
//     this._div.innerHTML = '<h4>US Food Insecurity</h4>' +  (props ?
//         '<b>' + props.county+ '</b><br />' + "<b>FI Rate: </b> " + props.fi_rate + '%' + "<b>FI Count: </b> " 
//         + props.fi_count + '<br>' + "<b>FI Child Rate: </b> " + 'props.fi_rate_child' + '%' + ' ' + 
//         "<b>FI Child Count: </b> " + props.fi_count_child + '<br>' + "<b>Below 185 FPL (child): </b>" + 
//         props.fi_rate_fpl + "%" + "<br>" + "<b>Budget Shortfall:</b> $" + props.budget_shortfall
//         : 'Hover over a county!');
// };

info.addTo(myMap);

function style(feature) {
  return {
      fillColor: "gainsboro", //getColor(feature.properties.countyData.fi_rate),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '2',
      fillOpacity: 0.7
  };
}

function getColor(r) {
  return r > 5  ? 'slateblue' :
         r > 10  ? 'wheat' :
         r > 15  ? 'old lace' :
         r > 20   ? 'seashell' :
         r > 25   ? 'rosybrown' :
                    'slategrey';
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
      colorGrades = [0, 5, 10, 15, 20, 25];
      div.innerHTML += "<h4><b>Food Insecurity</b></h4>" 
  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < colorGrades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(colorGrades[i] + 1) + '"></i> ' + 
          colorGrades[i] + (colorGrades[i + 1] ? '&ndash;' + colorGrades[i + 1] + '%' + '<br>' : '+');
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
  //   click: function(event) {
  //           myMap.fitBounds(event.target.getBounds());
  //         }   
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
      var state_Name = Object.keys(DATA)
      var state_Data = Object.values(DATA)
      var fiRate = Object.values(DATA).map(state => {
          return state.fi_rate
      });
      var stateName = feature.properties.NAME;
      var state = Object.keys(DATA).find(state => {
        return stateName === DATA[state].state;
      });
      feature.properties.stateData = DATA[state];
    });
          // console.log('inside:', DATA) 
        // console.log(stateName)

      // console.log('outside:', x.fi_rate)

      // create function to get color
      // function getColor(r) {
      //     return r > 5  ? 'palevioletred' :
      //            r > 10  ? 'lawngreen' :
      //            r > 15  ? 'peachpuff' :
      //            r > 20   ? 'mistyrose' :
      //            r > 25   ? 'papayawhip' :
      //                       'gainsboro';
      //   }
      //   function style(feature) {
      //     return {
      //         fillColor: "orchid", //getColor(feature.properties.countyData.fi_rate),
      //         weight: 2,
      //         opacity: 1,
      //         color: 'white',
      //         dashArray: '2',
      //         fillOpacity: 0.7
      //     };
      //   }

        // create choropleth
        geojsonmap= L.choropleth(geoJsonData, {
            valueProperty: "x.fi_rate",
            // set color scale
            scale: ["papayawhip", "palevioletred", "mistyrose", "peachpuff"],
            steps: 10,
            mode: "q",
            style: style,
            // bind a pop-up for each layer
            onEachFeature: onEachFeature1
        }).addTo(myMap);
  })
})
