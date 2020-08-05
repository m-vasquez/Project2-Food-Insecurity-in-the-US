var myMap = L.map("map_id", {
    center: [37.0902, -95.7129],
    zoom: 4.5,
    layer: greymap
});

var greymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
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

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Food Insecurity</h4>' +  (props ?
        '<b>' + "testing"+ '</b><br />' + props.features.properties.countyData.county
        : 'Hover over a county!');
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
        fillColor: "orchid", //getColor(feature.properties.countyData.fi_rate),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.7
    };
  }

function getColor(r) {
    return r > 5  ? 'palevioletred' :
           r > 10  ? 'lawngreen' :
           r > 15  ? 'peachpuff' :
           r > 20   ? 'mistyrose' :
           r > 25   ? 'papayawhip' :
                      'gainsboro';
  }

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        colorGrades = [5, 10, 15, 20, 25];
        div.innerHTML += "<h4><b>Food Insecurity Rate</b></h4>" 
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < colorGrades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(colorGrades[i] + 1) + '"></i> ' +
            colorGrades[i] + (colorGrades[i + 1] ? '&ndash;' + colorGrades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);


function highlightFeature(e) {
  var layer = e.target;
  info.update(layer.feature.properties)

  layer.setStyle({
      weight: 1,
      color: 'darkslateblue',
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
  layer.bindPopup("<h3>" + feature.properties.countyData.county + "</h3> ")
  // layer.bindPopup("<h1>" + feature.properties.countyData + "</h1> ")
}

d3.json("../static/data/geoJsonCounty.json").then(function(geoJsonData) {
    // perform GET req
    d3.json("/api/counties").then(countiesData => {
    //   var countiesData = "[" + countiesData + "]"
    //   console.log(countiesData)
    //   var countiesDataa = Object.keys(countiesData).filter(county=> {
    //     if (county.includes("County"))
    //     return countiesData.county
    //   })
    //   function filterByValue(array, string) {
    //     return array.filter(o =>
    //         Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
    // }
    // console.log(filterByValue(countiesData, "County"))
    
    
      

    //   console.log(countiesDataa)
        geoJsonData.features.forEach(feature => {
          var countyName = Object.keys(countiesData)
          var county_Data = Object.values(countiesData)
          var fiRate = Object.values(countiesData).map(county => {
              return county.fi_rate
          });
          var countyGeoId = parseInt(feature.properties.GEO_ID.slice(9,14));
          var county = Object.keys(countiesData).find(county => {
            return countyGeoId === countiesData[county].geoid;
          });
          if (feature.properties.countyData) {
            feature.properties.countyData = countiesData[county];
            console.log(feature.properties.countyData)
          
        // });
            
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
        }
        });
    })
})
