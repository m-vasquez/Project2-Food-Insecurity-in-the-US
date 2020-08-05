d3.json("/api/usdastate").then(function(data) {
    // console.log(data)
    var yearBlock = []
    var fiRate = []
    var stateName = []
    var test = []

Object.entries(data).forEach(function([key,value]){
            yearBlock.push(value.year)
            fiRate.push(value.fi_rate)
            stateName.push(value.state)
            test.push(key)
        })
        
        console.log(`year block: ${yearBlock}`)
        console.log(`state name: ${stateName}`)
        console.log(`fi rate: ${fiRate}`)
        console.log(`testing keys: ${test}`)

});


function JSONplots(year) {

    d3.json("/api/usdastate").then(function(data) {
        console.log(data)
        var yearBlock = []
        var fiRate = []
        var stateName = []

        // Object.entries(data).forEach(function([key,value]){
        //     counttest.push(value.fi_count)
        //     totaltest.push(value.total_hh)
        //     categorytest.push(value.category)
        // })
        // var counttest2 = counttest.reverse()
        // var categorytest2 = categorytest.reverse()
        // console.log(counttest)
        // console.log(totaltest)
         
        // // get value for chart
        // var fiCount = data.map(item => item.fi_count).reverse()
        // // console.log(`FI Counts: ${fiCount}`)
        // // get labels for bar chart
        // var categoryChoice = data.map(item => item.category).reverse()
        // // console.log(`Categories: ${categoryChoice}`)
        // // get value for hover
        // var fiRate = data.map(item => item.fi_rate).reverse();
        // // console.log(`FI Rates: ${fiRate}`)
        // var demoTotal = data.map(item => item.total_hh).reverse();
        // // console.log(`Total HH: ${demoTotal}`)
        // var yearChoice = data.map(item => item.year).reverse()
    
        // create trace1 for bar
        var trace1 = {
            x: fiRate,
            y: categoryChoice,
            text: "Food Insecurity (%)", 
            type: "bar",
            orientation: "h",
            marker: {
                color: 'rgb(138,202,225)'
            }
        };

        // data variable
        var data = [trace1];

        // apply layout
        var layout = {
            title: "Food Insecurity Throughout the Years",
            margin: {
            l: 170,
            r: 40,
            t: 50,
            b: 50
            }
        };

        // render the bar plot
        Plotly.newPlot("bar", data, layout);

        var trace3 = {
            x: categoryChoice,
            y: counttest2,
            text: "Food Insecure Count", 
            type: "scatter",
            mode: 'markers',
            // orientation: "h",
            marker: {
                color: 'lightseagreen'
            }
        };

        // data variable
        var data3 = [trace3];

        // apply layout
        var layout3 = {
            title: "Count of Food Insecure Individuals",
            yaxis: {title: "Count per 1000"},
            xaxis: {fontsize: 8},
            margin: {
                l: 100,
                r: 40,
                t: 50,
                b: 80
                }
        };

        // render the bar plot
        Plotly.newPlot("scatter", data3, layout3);

        var trace4 = {
            labels: [categorytest],
            values: [totaltest],
            type: 'pie'
        };

        var data4 = [trace4]

        var layout4 = {
            title: "Population per Category",
        };

        Plotly.newPlot('pie', data4, layout4);    
    });
}
