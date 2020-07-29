Plotly.d3.json('https://leafletjs.com/examples/choropleth/us-states.js', function(statejson) {

  Plotly.d3.json('https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json', function(countyjson) {

    Plotly.newPlot('myDiv', [{
      type: 'scattermapbox',
      lat: [46],
      lon: [-74]
    }], {
      title: "Let's see",
      height: 600,
      width: 600,
      mapbox: {
        center: {
          lat: 28,
          lon: -84
        },
        style: 'light',
        zoom: 4.8,
        layers: [
          {
            sourcetype: 'geojson',
            source: statejson,
            type: 'fill',
            color: 'rgba(163,22,19,0.8)'
          },
          {
            sourcetype: 'geojson',
            source: countyjson,
            type: 'fill',
            color: 'rgba(40,0,113,0.8)'
          },        
        ]
      }
    }, {
      mapboxAccessToken: API_KE
    });
      
    
});

});