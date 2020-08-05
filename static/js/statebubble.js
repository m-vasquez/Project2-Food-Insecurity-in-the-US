        
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


var tooltip = d3.select("body")
  .append("div")
  // .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background", "#000")
  .text(rootNode);

d3.select("body")
.selectAll("div")
  .data(data)
.enter().append("div")
  .style("width", function(d) { return x(d) + "px"; })
  .text(function(d) { return d; })
  .on("mouseover", function(d){tooltip.text(d); return tooltip.style("visibility", "visible");})
    .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});



