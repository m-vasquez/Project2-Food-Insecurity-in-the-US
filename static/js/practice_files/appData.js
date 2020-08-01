var countyData =  d3.json("/api/counties").then(function(data) {
    // console.log(data)
    return data
 });

 