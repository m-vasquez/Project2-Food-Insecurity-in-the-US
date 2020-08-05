// d3.json("/api/counties").then(function(data) {
//     console.log(data)
//     var state = 02
//     var county = 102
//     var geoid = state.concat(county)
//     console.log(geoid)
//     data.features.forEach()
    
     
//  });

//////////////////

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

var geoJsonData = "../static/data/geoJsonCounty.json"

 d3.json(geoJsonData).then(geoJson => {
    d3.json("/api/counties").then(countiesData => {
        var countyName = Object.keys(countiesData)
        var countyData = Object.values(countiesData)
        var fiRate = Object.values(countiesData).map(county => {
            return county.fi_rate
        });
        
        geoJson.features.forEach(feature => {
            var countyGeoId = parseInt(feature.properties.GEO_ID.slice(9,14));
            var county = Object.keys(countiesData).find(county => {
                return countyGeoId === countiesData[county].geoid;
        });
        
        feature.properties.countyData = countiesData[county];
        // console.log(feature.properties.countyData)
           
        // var test = feature.properties.countyData[coordinates][0] + ", " + feature.properties.countyData[coordinates][1]
        // var coords = [feature.properties.countyData.lng + "," + feature.properties.countyData.lat]
        // console.log('insidee', feature.properties.countyData.county)
        // console.log(countyName)
      });
    //   console.log('outside', feature.properties.countyData)
      function getColor(r) {
        return r > 5  ? 'palevioletred' :
               r > 10  ? 'green' :
               r > 15  ? 'peachpuff' :
               r > 20   ? 'mistyrose' :
               r > 25   ? 'papayawhip' :
                          'red';
      }
      function style(feature) {
        return {
            fillColor: getColor(feature.properties.countyData.fi_rate),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '2',
            fillOpacity: 0.7
        };
      }

      // create choropleth
      L.choropleth(geoJsonData, {
          valueProperty: "x.fi_rate",
          // set color scale
          scale: ["papayawhip", "palevioletred", "mistyrose", "peachpuff"],
          steps: 10,
          mode: "q",
          style: style,
          // bind a pop-up for each layer
          onEachFeature: function (feature, layer) {
              layer.bindPopup("<h3>" + x.county + "</h3> " + "<hr>" + "<b> FI Rate: </b>" + x.fi_rate + "%" + " " + "<b>FI Count:</b>" + x.fi_count +
              "<br>" + "<b>FI Child Rate:</b>" + x.fi_rate_child + "%" + " " + "<b>FI Child Count:</b>" + x.fi_count_child + "<br>" +
              "<b>Below 185 FPL (child):</b>" + x.fi_rate_fpl + "%" + "<br>" + "<b>Budget Shortfall:</b> $" + " " + x.budget_shortfall)
          }
      }).addTo(myMap);
    });
  });
//////////////////////////////////


// d3.json("../static/data/geoJsonCounty.json").then(function(countyData) {
//     // perform GET req
//     d3.json("/api/counties").then(function (data) {

//         var test1 = Object.keys(data)
//         var test2 = Object.values(data)
//         var test3 = Object.keys(countyData.properties)
//         // var test4 = test3.feature.properties
//         console.log(test3)
//         // console.log(test2)

//     })
// })

// d3.json("../static/data/geoJsonCounty.json").then(function(countyData) {
//     // perform GET req
//     d3.json("/api/counties").then(function (data) {

//         var countyName = Object.keys(data)
//         var countyData = Object.values(data)
         
//         countyData.features.forEach(county => {
//             var countyID = county.properties.GEO_ID.slice(9,14);
//             var countyName = county.properties.NAME + " " + county.properties.COUNTY;

//             if (countyID in data) {
//                 county.properties.countyName = data[countyID].countyName
//             }
//             else {
//                 county.properties.countyName = "data not found";;
//             }
//         })
//         console.log(data);

//     })
// })
