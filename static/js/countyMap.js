mapboxgl.accessToken = API_key;

d3.json("/api/counties").then(function(data) {
    console.log(data)
     createMap(data);    
 });
 
 // create funciton for map
function createMap(data) {
  var map = new mapboxgl.Map({
    container: "map_id",
    style: "mapbox://styles/mapbox/streets-v11",
    center: { lat: 37.0902, lng: -95.7129 },
    zoom: 3
  });

  // state level
map.on("load", function() {
  map.addLayer({
    id: "states",
    type: "fill",
    source: {
      type: "vector",
      tiles: [
        "https://gis-server.data.census.gov/arcgis/rest/services/Hosted/VT_2017_040_00_PY_D1/VectorTileServer/tile/{z}/{y}/{x}.pbf"
      ]
    },
    "source-layer": "State",
    paint: {
      "fill-opacity": 0.6,
      "fill-color": "green"
    }
  });
});

  map.on("load", function() {
    d3.json("/api/counties").then(function(data) {
    
        var values = Object.entries(data).map(function(county) {
          return county.fi_rate;
        }); //get all the GINI Index values , B19083_001E
        var colorScale = chroma
          .scale("OrRd")
          .padding(0.15)
          .domain(values, "q", 5); // 5 quantiles
  
        function getColor(val) {
          return colorScale(val).hex();
        }
  
        //generate style expression
        var colors = {};
  
        Object.entries(data).forEach(function(county) {
          var GEOID = county.geoid;
          var value = county.fi_rate;
          var color = getColor(value);
          if (!colors[color]) {
            colors[color] = [];
          }
          colors[color].push(GEOID);
        });
  
        var colorExpression = ["match", ["get", "GEOID"]];
        var colorQuantiles = Object.entries(colors).forEach(function([
          color,
          GEOIDs
        ]) {
          colorExpression.push(GEOIDs, color);
        });
  
        colorExpression.push("rgba(0,0,0,0)");
  
      map.addLayer({
          id: "counties",
          type: "fill",
          source: {
            type: "vector",
            tiles: [
              "https://gis-server.data.census.gov/arcgis/rest/services/Hosted/VT_2017_050_00_PY_D1/VectorTileServer/tile/{z}/{y}/{x}.pbf"
            ]
          },
          "source-layer": "County",
          paint: {
            "fill-opacity": 0.8,
            "fill-color": colorExpression
          }
        });
      }
    );
  }); 

}

 