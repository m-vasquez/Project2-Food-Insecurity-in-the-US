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
   this._div.innerHTML = '<h4>US Food Insecurity by County</h4>' +  (feature ?
       '<b>' + "testing"+ '</b><br />' + feature.properties.countyData.county
       : 'Choose a county for more info!');
 };
//      this._div.innerHTML = '<h4>US Food Insecurity by County</h4>' +  (feature ?
//          '<b>' + feature.properties.countyData.county+ '</b><br />' + "<b>FI Rate: </b> " + feature.fi_rate + '%' + "<b>FI Count: </b> "
//          + feature.fi_count + '<br>' + "<b>FI Child Rate: </b> " + feature.fi_rate_child + '%' + ' ' +
//          "<b>FI Child Count: </b> " + feature.fi_count_child + '<br>' + "<b>Below 185 FPL (child): </b>" +
//          feature.fi_rate_fpl + "%" + "<br>" + "<b>Budget Shortfall:</b> $" + feature.budget_shortfall
//          : 'Hover over a county for more info!');
//  };
 info.addTo(myMap);

 
//  function style(feature) {
//   var weight;
//   if (feature === undefined) {
//     weight = 0;
//    } else {
//     weight = feature.properties.countyData.fi_rate
//    }
//   return {
//       fillColor: getColor(weight), //getColor(x.fi_rate),
//       weight: 2,
//       opacity: 1,
//       color: 'white',
//       dashArray: '2',
//       fillOpacity: 0.7
//   };
//  }
 function getColor(feature) {
  switch (true) {
  case feature = 0 :
    return "lightskyblue";
  case feature >= 5 :
    return "powderblue";
  case feature >= 10 :
    return "lightsteelblue";
  case feature >= 15 : 
    return "steelgrey";
  case feature >= 20 :
    return "slateblue";
  case feature >= 25 :
    return "aquamarine";
  default:
    return "black";
  }
}


 function style(feature) {
  return {
      fillColor: "steelblue", //getColor(feature.properties.countyData.fi_rate), //getColor(feature.properties.countyData.fi_rate), //getColor(x.fi_rate),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '2',
      fillOpacity: 0.7
  };
}

//  function style(feature) {
//     if (feature === undefined) {
//   feature = 'None'
//  }
//   return {
//       fillColor: getColor(feature.properties.countyData.fi_rate), //getColor(x.fi_rate),
//       weight: 2,
//       opacity: 1,
//       color: 'white',
//       dashArray: '2',
//       fillOpacity: 0.7
//   };
//  }

// // add legend for color variation based off fi_rate
//  var legend = L.control({position: 'bottomright'});
//  legend.onAdd = function (map) {
//   var div = L.DomUtil.create('div', 'info legend'),
//       colorGrades = [5, 10, 15, 20, 25];
//       div.innerHTML += "<h4><b>Food Insecurity Rate</b></h4>"
//   // loop through our density intervals and generate a label with a colored square for each interval
//   for (var i = 0; i < colorGrades.length; i++) {
//       div.innerHTML +=
//           '<i style="background:' + getColor(colorGrades[i] + 1) + '"></i> ' +
//           colorGrades[i] + (colorGrades[i + 1] ? '&ndash;' + colorGrades[i + 1] + '<br>' : '+');
//   }
//   return div;
//  };
//  legend.addTo(myMap);

 function highlightFeature(e) {
 var layer = e.target;
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
        fillOpacity: 0.7
      });
    },
  //   click: function(event) {
  //           myMap.fitBounds(event.target.getBounds());
  //         }  
 });
 if (feature.properties.countyData === undefined) {
  feature.properties.countyData = 'None'
 }
 layer.bindPopup("<h3>" + feature.properties.countyData.county + "</h3> " + "<hr>" + "<b> FI Rate: </b>" + feature.properties.countyData.fi_rate + "%" + " " + "<b>FI Count: </b>" + feature.properties.countyData.fi_count +
 "<br>" + "<b>FI Child Rate:</b> " + feature.properties.countyData.fi_rate_child + "%" + " " + "<b>FI Child Count: </b>" + feature.properties.countyData.fi_count_child + "<br>" +
 "<b>Below 185 FPL (child):</b> " + feature.properties.countyData.fi_rate_fpl + "%" + "<br>" + "<b>Budget Shortfall:</b> $" + feature.properties.countyData.budget_shortfall)
 }

 d3.json("../static/data/geoJsonCounty.json").then(function(geoJsonData) {
 // console.log(geoJsonData)
  // perform GET req
  d3.json("/api/counties").then(countiesData => {
    // console.log(countiesData)
      geoJsonData.features.forEach(feature => {
        var countyName = Object.keys(countiesData)
        var county_Data = Object.values(countiesData)
        var fiRate = Object.values(countiesData).map(county => {
            return county.fi_rate
        });
        var countyGeoId = parseInt(feature.properties.GEO_ID.slice(9,14));
        var county = Object.keys(countiesData).filter(Boolean).find(county => {
          return countyGeoId === countiesData[county].geoid;
        });
        feature.properties.countyData = countiesData[county];
        
      });
      
      
        // create choropleth
        geojsonmap= L.choropleth(geoJsonData, {
            valueProperty: "fi_rate",
            steps: 10,
            mode: "q",
            style: style,
        
            // bind a pop-up for each layer
            onEachFeature: onEachFeature1
        }).addTo(myMap);
  })
 })