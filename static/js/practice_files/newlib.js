// d3.json("/api/usda").then(function(data) {
//     console.log("hello")
//     // create scatter plot
//     var category_list = []
//     var count_list = []
//     var rate_list = []
//     var years = []

//     // Object.entries(data).forEach(function([key,value]){
//     //     years.push(key)

//     // })

// });


var data = {
  "name": "A1",
  "children": [
    {
      "name": "B1",
      "children": [
        {
          "name": "Alabama",
          "value": 17
        },
        {
          "name": "Alaska",
          "value": 13
        },
        {
          "name": "Arizona",
          "value": 13
        },
        {
          "name": "Arkansas",
          "value": 17
        },
        {
          "name": "California",
          "value": 11
        },
        {
          "name": "Colorado",
          "value": 10
        },
        {
          "name": "Connecticut",
          "value": 12
        },
        {
          "name": "Delaware",
          "value": 13
        },
        {
          "name": "Florida",
          "value": 13
        },
        {
          "name": "Georgia",
          "value": 13
        },
        {
          "name": "Hawaii",
          "value": 11
        },
        {
          "name": "Idaho",
          "value": 11
        },
        {
          "name": "Illinois",
          "value": 10
        },
        {
          "name": "Indiana",
          "value": 13
        },
        {
          "name": "Iowa",
          "value": 10
        },
        {
          "name": "Kansas",
          "value": 13
        },
        {
          "name": "Kentucky",
          "value": 15
        },
        {
          "name": "Louisiana",
          "value": 16
        },
        {
          "name": "Maine",
          "value": 13
        },
        {
          "name": "Maryland",
          "value": 11
        },
        {
          "name": "Massachusetts",
          "value": 9
        },
        {
          "name": "Michigan",
          "value": 14
        },
        {
          "name": "Minnesota",
          "value": 8
        },
        {
          "name": "Mississippi",
          "value": 19
        },
         {
          "name": "Missouri",
          "value": 13
        },
        {
          "name": "Montana",
          "value": 10
        },
        {
          "name": "Nebraska",
          "value": 12
        },
        {
          "name": "Nevada",
          "value": 13
        },
        {
          "name": "New Hampshire",
          "value": 9
        },
        {
          "name": "New Jersey",
          "value": 9
        },
        {
          "name": "New Mexico",
          "value": 15
        },
         {
          "name": "New York",
          "value": 11
        },
        {
          "name": "North Carolina",
          "value": 14
        },
        {
          "name": "North Dakota",
          "value": 7
        },
        {
          "name": "Ohio",
          "value": 14
        },
        {
          "name": "Oklahoma",
          "value": 15
        },
        {
          "name": "Oregon",
          "value": 12
        },
        {
          "name": "Pennsylvania",
          "value": 11
        },
         {
          "name": "Rhode Island",
          "value": 11
        },
        {
          "name": "South Carolina",
          "value": 12
        },
        {
          "name": "South Dakota",
          "value": 11
        },
        {
          "name": "Tennessee",
          "value": 14
        },
        {
          "name": "Texas",
          "value": 15
        },
         {
          "name": "Utah",
          "value": 11
        },
        {
          "name": "Vermont",
          "value": 11
        },
        {
          "name": "Virginia",
          "value": 10
        },
        {
          "name": "Washington",
          "value": 11
        },
        {
          "name": "West Virginia",
          "value": 14
        },
         {
          "name": "Wisconsin",
          "value": 9
        },
        {
          "name": "Wyoming",
          "value": 12
        },

      ]
    },
    
  ]
};
        
      

// var data2 = d3.json("/api/states").then(statesData => {
//     console.log(statesData)
//     return statesData
// })


var packLayout = d3.pack()
  .size([900, 700]);

var rootNode = d3.hierarchy(data)

rootNode.sum(function(d) {
  return d.value;
});

packLayout(rootNode);

var nodes = d3.select('svg g')
  .selectAll('g')
  .data(rootNode.descendants())
  .enter()
  .append('g')
  .attr('transform', function(d) {return 'translate(' + [d.x, d.y] + ')'})

nodes
  .append('circle')
  .attr('r', function(d) { return d.r; })

nodes
  .append('text')
  .attr('dy', 4)
  .text(function(d) {
    return d.children === undefined ? d.data.name : '';
  })

 