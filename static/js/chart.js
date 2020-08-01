// d3.json("/api/usda").then(function(data) {
    // data.filter(data => data[0] == data.id[1])
    // console.log(data)
    // var sampleYear = data[0].year
    // console.log(sampleYear)
    // var countChoice = data[0].fi_count
    // console.log(countChoice)
    // var filterResult = data.filter(id => id[0] == id.id[1])[0];
    // console.log(filterResult);
    // var fiCount = data[0].fi_count;
    // console.log(`FI Count: ${fiCount}`);
    // var categoryChoice = data[0].category
    // console.log(`Category: ${categoryChoice}`)
    // var fiRate = data[0].fi_rate
    // console.log(`FI Rate: ${fiRate}`)
    // var labels = Object.values(data.year)[0];
    // console.log(labels)
    // var test = data.fi_count.forEach(x => {
    //     return x;
    // // console.log(data)
    // });
    // console.log(test)
    // for (index = 0; index < data.length; index++) { 
    //     console.log(data[index]); 
    // } 
    // data.forEach(myFunction); 
    // function myFunction(item, index) 
    // { 
    // // console.log(item); 
    // var fiCount = item.fi_count
    // console.log(`FI Counts: ${fiCount}`)
    // // get labels for bar chart
    // var categoryChoice = item.category
    // console.log(`Categories: ${categoryChoice}`)
    // // get value for hover
    // var fiRate = item.fi_rate
    // console.log(`FI Rates: ${fiRate}`)

    // }
    // })


function JSONplots(name) {

    d3.json("/api/usda").then(function(data) {
        data.forEach(myFunction); 
        function myFunction(item, index) 
        { 
        // get value for chart
        var fiCount = item.fi_count
        // console.log(`FI Counts: ${fiCount}`)
        // get labels for bar chart
        var categoryChoice = item.category
        // console.log(`Categories: ${categoryChoice}`)
        // get value for hover
        var fiRate = item.fi_rate
        // console.log(`FI Rates: ${fiRate}`)
    

        // create trace1 for bar
        var trace1 = {
            x: fiCount,
            y: categoryChoice,
            text: fiRate, 
            type: "bar",
            // orientation: "h",
            marker: {
                color: 'rgb(138,202,225)'
            }
            };

        // data variable
        var data = [trace1];

        // apply layout
        var layout = {
            title: "Food Insecurity in the US",
            margin: {
            l: 90,
            r: 40,
            t: 40,
            b: 40
            }
        };

        // render the bar plot
        Plotly.newPlot("bar", data, layout);

            // create trace2 for bubble
            var trace2 = {
            x: categoryChoice,
            y: fiCount,
            text: fiRate,
            mode: 'markers',
            marker: {
                color: categoryChoice,
                size: fiCount,
                symbol: ['circle', 'square', 'bowtie', 'cross', 'star', 'pentagon', 'star-square', 'circle-cross', 'hash'],
                colorscale: 'portland'
            }
            };

        // data variable
        var data = [trace2];

        // apply layout
        var layout = {
            title: "FI Data",
            height: 400,
            width: 800
        };
        // render the bar plot
        Plotly.newPlot("bubble", data, layout);
    }
    });
}

function optionChanged(name) {
    JSONplots(name);

}

function init() {
    var dropdownMenu = d3.select('#selDataset');
    // console.log(dropdownMenu)
    
    d3.json("/api/usda").then(function(data) {
        data.forEach(myFunction); 
        function myFunction(item, index) {
        var yearChoice = item.year
        console.log(yearChoice)
        Object.entries(yearChoice).forEach(name => {
            dropdownMenu.append('option').text(name).property('value', name);
        });
    JSONplots(yearChoice[0])
    }
    // select first sample in drop down to call all functions
    // JSONplots(yearChoice[0])


    });

}

init();