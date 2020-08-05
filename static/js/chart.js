d3.json("/api/states").then(function(data) {
    var state_data = data
    console.log(data)
  });
  

function JSONplots(yearChoice) {
    var year = yearChoice;
    d3.json("/api/usda").then((usda) => {
        // console.log(data)
        var ficount = []
        var total = []
        var category = []
        var fi_rate = []

        // console.log(year)
        // var y = year ? year : "2001";
        var data = usda.filter((row) => (row.year).toString() === year);
        // console.log(data)

        // get value for chart
        Object.entries(data).forEach(function([key,value]){
            ficount.push(value.fi_count)
            total.push(value.total_hh)
            category.push(value.category)
            fi_rate.push(value.fi_rate)
        })
        var fiCOUNT = ficount.reverse()
        var fiRate = fi_rate.reverse()
        var catergoryChoice = category.reverse()
        
        var trace = {
            x: fiRate,
            y: category,
            text: "Food Insecurity (%)", 
            type: "bar",
            orientation: "h",
            marker: {
                color: 'rgb(145, 212, 224)'
            }
        };

        // data variable
        var barData = [trace];

        // apply layout
        var layout = {
            title: "Food Insecurity Throughout the Years",
            margin: {
            l: 170,
            r: 100,
            t: 100,
            b: 50
            }
        };

        // render the bar plot
        Plotly.newPlot("bar", barData, layout);

        var traceScatter = {
            x: category,
            y: fiCOUNT,
            text: category, 
            type: "scatter",
            mode: 'markers',
            // orientation: "h",
            marker: {
                color: 'rgb(60, 202, 178)',
                size: 20
            }
        };

        // data variable
        var dataScatter = [traceScatter];

        // apply layout
        var layoutScatter = {
            title: "Count of Food Insecure Household Individuals",
            yaxis: {title: "Count per 1000"},
            xaxis: {fontsize: 10},
            height: 500,
            width: 700,
            margin: {
                l: 80,
                r: 100,
                t: 90,
                b: 100
                },
        };

        // render plot
        Plotly.newPlot("scatter", dataScatter, layoutScatter);

        // create trace2 for bubble
        var traceBubble = {
        x: category,
        y: fiCOUNT,
        text: "count",
        mode: 'markers',
        ids: "testing",
        marker: {
            color: fiRate,
            size: fiRate,
            symbol: 'cross',
            cmax: 36,
            cmid: 16,
            colorscale: 'Jet',
            colorbar: {
                tickcolor: 'slateblue',
                bordercolor: 'whitesmoke',
                x: 1,
                thickness: 10
            }
        }
        };
        // data variable
        var dataBubble = [traceBubble];

        // apply layout
        var layoutBubble = {
            title: "Count of Household Individuals versus FI Rate",
            yaxis: {title: "Count per 1000"},
            xaxis: {
                tickangle: -35,
                fixedrange: true,
            },
            
            margin: {
                l: 50,
                r: 60,
                t: 90,
                b: 100
                },
            height: 400,
            width: 700
        };
        // render the plot
        Plotly.newPlot("bubble", dataBubble, layoutBubble); 

        var trace4 = {
            labels: category,
            values: fiRate,
            hoverinfo: "label+value+text",
            hovertext: "FI Rate(%)",
            type: 'pie'
        };

        var data4 = [trace4];

        var layout4 = {
            title: "FI Rate by Demographics",
            height: 400,
            width: 500,
            margin: {
                l: 10,
                r: 90,
                t: 90,
                b: 100
                },
        };

        Plotly.newPlot('pie', data4, layout4);
    });
}

function optionChanged(yearChoice) {
    console.log(yearChoice)
    JSONplots(yearChoice);
}

// updating by year vs category

function init() {
    var dropdownMenu = d3.select('#selDataset');
    
    d3.json("/api/usda").then(function(data) {
        
        var yearChoice = data.map(item => item.year);
        yearChoice = yearChoice.filter((year, i, a) => a.indexOf(year) === i);
        // console.log(yearChoice)
        Object.values(yearChoice).forEach(year => {
            dropdownMenu.append('option').text(year).property('value', year);
        });
    
        var x = parseInt(yearChoice[0])
        optionChanged(x);
    });
}

init();



