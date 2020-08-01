// var statesData = d3.json("/api/states")
// var myMap = L.map("map", {
//     center: [37.0902, -95.7129],
//     zoom: 4.25
//   });
  
//   // Adding tile layer
//   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//   }).addTo(myMap);
  
//   L.geoJson(statesData).addTo(map);
// // load in data
// statesData.then(function(data) {
//     L.choropleth(data, {
//         valueProperty: 'state', // which property in the features to use
//         scale: ['white', 'red'], // chroma.js scale - include as many as you like
//         steps: 5, // number of breaks or steps in range
//         mode: 'q', // q for quantile, e for equidistant, k for k-means
//         style: {
//             color: '#fff', // border color
//             weight: 2,
//             fillOpacity: 0.8
//         },
//         onEachFeature: function(feature, layer) {
//             layer.bindPopup(feature.fi_rate)
//         }
//     }).addTo(map)
// });

// Plotly.d3.json("/api/states"), function(err, rows){
//     function unpack(rows, key) {
//         return rows.map(function(row) { return row[key]; });
//     }
//     var code = states.latitude && states.longitude;
//     var data = [{
//         type: 'choropleth',
//         locationmode: 'USA-states',
//         locations: unpack(rows, code),
//         z: unpack(rows, 'fi_rate'),
//         text: unpack(rows, 'state'),
//         autocolorscale: true
//     }];

//     var layout = {
//         title: '2018 US FI Data by State',
//         geo:{
//             scope: 'usa',
//             countrycolor: 'rgb(255, 255, 255)',
//             showland: true,
//             landcolor: 'rgb(217, 217, 217)',
//             showlakes: true,
//             lakecolor: 'rgb(255, 255, 255)',
//             subunitcolor: 'rgb(255, 255, 255)',
//             lonaxis: {},
//             lataxis: {}
//         }
//     };
//     Plotly.newPlot("myDiv", data, layout, {showLink: false});
//     };

// Plotly.d3.json("/api/counties", function(countyjson) {

//     Plotly.newPlot('div', [{
//       type: 'scattermapbox',
//       lat: countyjson.latitude,
//       lon: countyjson.longitude
//     }], {
//       title: "US Counties",
//       height: 600,
//       width: 600,
//       mapbox: { 
//         center: {
//           lat: 39.82,
//           lon: -98.57
//         },
//         style: 'light',
//         zoom: 4.25,
//         layers: [
//           {
//             sourcetype: 'geojson',
//             source: countyjson,
//             type: 'fill',
//             color: 'rgba(163,22,19,0.8)'
//           }
//         ]
//       }
//     }, {
//       mapboxAccessToken: API_KEY
//     });  
// });


Plotly.d3.json("/api/states", function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
      }
      var code = states.latitude && states.longitude;
      var data = [{
          type: 'choropleth',
          locationmode: 'USA-states',
          locations: unpack(rows, code),
          z: unpack(rows, 'state'),
          text: unpack(rows, 'state'),
          zmin: 0,
          zmax: 17000,
          colorscale: [
              [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
              [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
              [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
          ],
          colorbar: {
              title: 'colorbar title here',
              thickness: 0.2
          },
          marker: {
              line:{
                  color: 'rgb(255,255,255)',
                  width: 2
              }
          }
      }];

      var layout = {
          title: 'layout name here',
          geo:{
              scope: 'usa',
              showlakes: true,
              lakecolor: 'rgb(255,255,255)'
          }
      };

      Plotly.newPlot("myDiv", data, layout, {showLink: false});
});