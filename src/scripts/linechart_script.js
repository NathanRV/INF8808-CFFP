export function load() {

  var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
  var graph = d3.select("#line-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  
  d3.csv('./PIB_habitant_1980-2021_sw_can_ocde.csv').then(function (data) {
    swedenData = getFilteredData(data, 'SWE');
    quebecData = getFilteredData(data, 'CAN');
    oecdData = getFilteredData(data, 'OECD')
    var x = d3.scaleTime()
      .domain(d3.extent(swedenData, function (d) {
        return d.time;
      }))
        .range([ 0, width ]);
    graph.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(swedenData, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    graph.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    graph.append("path")
      .datum(swedenData)
      .attr("fill", "none")
      .attr("stroke", "#FFCD00")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) {
          return x(d.time)
        })
        .y(function(d) { return y(Math.round(d.value)) })
    )

    graph.append("path")
    .datum(quebecData)
    .attr("fill", "none")
    .attr("stroke", "#001F97")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
      .x(function (d) {
        return x(d.time)
      })
      .y(function(d) { return y(Math.round(d.value)) })
    )
    
     graph.append("path")
    .datum(oecdData)
    .attr("fill", "none")
    .attr("stroke", "#FF0000")
    .attr("stroke-width", 2)
    .attr("opacity", 0.5)  
    .attr("d", d3.line()
      .x(function (d) {
        return x(d.time)
      })
      .y(function(d) { return y(Math.round(d.value)) })
    )
    
  });
}


/**
 * Removes the other states not used in this dataset.
 *
 * @param {object[]} data The data to be used
 */
function getFilteredData(data, country) {
  var filtered = data.filter(function(d){
      if (d.location === country)
          return true;
      return false;
  });
  filtered.forEach((element) => {
    element.time = d3.timeParse("%Y")(element.time);
  })
  return filtered;
}