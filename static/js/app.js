

// pull in data for counties
d3.json("/api/counties").then(function(data) {
    var county_data = data
    console.log(data)
});

mapboxgl.accessToken = API_key

var map = new mapboxgl.Map({
    container: 'map_id', // container id
    style: 'mapbox://styles/m-vasquez/ckd51ke8p06n41impleff2s11' 
  });


map.on('load', function() {
var layers = ['0-10', '10-20', '20-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
map.addLayer({
    id: 'terrain-data',
    type: 'line',
    source: {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2'
    },
    'source-layer': 'contour'
    });

    // for (i = 0; i < layers.length; i++) {
    // var layer = fi_rate[i];
    // var color = colors[i];
    // var item = document.createElement('div');
    // var key = document.createElement('span');
    // key.className = 'legend-key';
    // key.style.backgroundColor = color;
    
    // var value = document.createElement('span');
    // value.innerHTML = layer;
    // };

});
    
    