function JSONplots(yearChoice) {
    var year = yearChoice;
    d3.json("/api/usda").then((usda) => {
        // console.log(data)
        var counttest = []
        var totaltest = []
        var categorytest = []

        // console.log(year)
        // var y = year ? year : "2001";
        var data = usda.filter((row) => (row.year).toString() === year);
        // console.log(data)
        
        Object.entries(data).forEach(function([key,value]){
            counttest.push(value.fi_count)
            totaltest.push(value.total_hh)
            categorytest.push(value.category)
        })
        var counttest2 = counttest.reverse()
        var categorytest2 = categorytest.reverse()
        // console.log(`count: ${counttest}`)
        // console.log(`count2: ${counttest2}`)
         
        // get value for chart
        var fiCount = data.map(item => item.fi_count).reverse()
        // console.log(`FI Counts: ${fiCount}`)
        // get labels for bar chart
        var categoryChoice = data.map(item => item.category).reverse()
        // console.log(`Categories: ${categoryChoice}`)
        // get value for hover
        var fiRate = data.map(item => item.fi_rate).reverse();
        // console.log(`FI Rates: ${fiRate}`)
        var demoTotal = data.map(item => item.total_hh).reverse();
        // console.log(`Total HH: ${demoTotal}`)
        var yearChoice = data.map(item => item.year).reverse()
    
        // create trace1 for bar
        var trace1 = {
            x: counttest,
            y: categorytest2,
            text: "Food Insecurity (%)", 
            type: "bar",
            orientation: "h",
            marker: {
                color: 'rgb(138,202,225)'
            }
        };

        // data variable
        var barData = [trace1];

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
        Plotly.newPlot("bar", barData, layout);

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

        // // create trace2 for bubble
        // var trace2 = {
        // x: categoryChoice,
        // y: fiCount,
        // text: "Food Insecure # per Demographic",
        // mode: 'markers',
        // marker: {
        //     color: categoryChoice,
        //     size: fiCount,
        //     symbol: ['circle', 'square', 'bowtie', 'cross', 'star', 'pentagon', 'star-square', 'circle-cross', 'hash'],
        //     colorscale: 'portland'
        // }
        // };

        // // data variable
        // var data2 = [trace2];

        // // apply layout
        // var layout2 = {
        //     title: "FI Data",
        //     height: 400,
        //     width: 800
        // };
        // // render the bar plot
        // Plotly.newPlot("bubble", data2, layout2); 

        var trace4 = {
            labels: categorytest,
            values: totaltest,
            type: 'pie'
        };

        var data4 = [trace4];

        var layout4 = {
            title: "Population per Category",
            height: 400,
            width: 500
        };

        Plotly.newPlot('pie', data4, layout4);

        var trace4 = {
            labels: categorytest,
            values: counttest,
            type: 'pie'
        };

        var data4 = [trace4]

        var layout4 = {
            title: "FI Population",
        };

        Plotly.newPlot('pie2', data4, layout4);
        
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
    
        // select first sample in drop down to call all functions
        // console.log(parseInt(yearChoice[0]));
        var x = parseInt(yearChoice[0])
        optionChanged(x);
    });
}

init();



// if want to change by category vs. by year

// function init() {
//     var dropdownMenu = d3.select('#selDataset');
//     // console.log(dropdownMenu)
//     JSONplots()
//     optionChanged()
//     d3.json("/api/usda").then(function(data) {
        
//         var categoryChoice = data.map(item => item.category)
//         // console.log(yearChoice)
//         Object.values(categoryChoice).forEach(year => {
//             dropdownMenu.append('option').text(year).property('value', year);
//         });
    
//     // select first sample in drop down to call all functions
//     // JSONplots(categoryChoice[0])
//     });
// }
// init();
// optionChanged();






