var data_county = d3.json("/api/counties")

var data_state = d3.json("/api/states").then(data => {
    // console.log(data)
    for (let i in data) {
        // if (data.hasOwnProperty(i)) {
        //     console.log(i + " -> " + data[i]);
        // }
        // console.log(data[i].fi_rate)
        // console.log(i)
    }
    return data
})

console.log(data_state)

// var geoCode = data_state.then(data => {
//     for (var indv_state in data) {
//         if  (data.hasOwnProperty(indv_state)) {
//             // [data[indv_state].latitude +", "+ data[indv_state].longitude]
//     }
// }
//     return [data[indv_state].latitude +", "+ data[indv_state].longitude]
// })

// console.log(geoCode)

Plotly.d3.json('"/api/states', function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
      }

      var data = [{
          type: 'choropleth',
          locationmode: 'USA-states',
          locations: unpack(rows, geoCode),
          z: unpack(rows, 'total exports'),
          text: unpack(rows, 'state'),
          zmin: 0,
          zmax: 17000,
          colorscale: [
              [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
              [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
              [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
          ],
          colorbar: {
              title: 'Millions USD',
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
          title: '2011 US Agriculture Exports by State',
          geo:{
              scope: 'usa',
              showlakes: true,
              lakecolor: 'rgb(255,255,255)'
          }
      };

      Plotly.newPlot("myDiv", data, layout, {showLink: false});
});
