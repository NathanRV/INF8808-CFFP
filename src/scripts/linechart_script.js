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
    const bisectDate = d3.bisector(function(d) { 
      console.log(d);
      return d.time; }).left;
    swedenData = getFilteredData(data, 'SWE');
    quebecData = getFilteredData(data, 'CAN');
    oecdData = getFilteredData(data, 'OECD')
    let xScale = d3.scaleTime()
      .domain(d3.extent(swedenData, function (d) {
        return d.time;
      }))
      .range([ 0, width ])
  
    graph.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // Add Y axis
  
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(swedenData, function(d) { return +d.value; })])
      .range([ height, 0 ]);

    graph.append("g")
      .call(d3.axisLeft(yScale));
    
    graph.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("font-size", "13px")
      .attr("padding-bottom", "20px")
      .attr("font-weight", "bold")
      .attr("x", width)
      .attr("y", height + 30)
      .text("Year");

    graph.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", "-4em")
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .attr("transform", "rotate(-90)")
      .text("GDP per capita")

    // Add the line
    graph.append("path")
      .datum(swedenData)
      .attr("fill", "none")
      .attr("stroke", "#FFCD00")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) {
          return xScale(d.time)
        })
        .y(function(d) { return yScale(Math.round(d.value)) })
    )

    graph.append("path")
      .datum(quebecData)
      .attr("fill", "none")
      .attr("stroke", "#001F97")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function (d) {
          return xScale(d.time)
        })
        .y(function(d) { return yScale(Math.round(d.value)) })
      )
    
    graph.append("path")
      .datum(oecdData)
      .attr("fill", "none")
      .attr("stroke", "#FF0000")
      .attr("stroke-width", 2)
      .attr("opacity", 0.5)  
      .attr("d", d3.line()
        .x(function (d) {
          return xScale(d.time)
        })
        .y(function(d) { return yScale(Math.round(d.value)) })
      )

    let hoverLineGroup = graph.append("g")
      .attr("class", "hover-line");

    let hoverLine = hoverLineGroup
      .append("line")
      .attr("stroke", "#000")
      .attr("x1", 10).attr("x2", 10) 
      .attr("y1", 0).attr("y2", height); 

    let hoverTT = hoverLineGroup.append('text')
      .attr("class", "hover-tex capo")
      .attr('dy', "0.35em");

    let cle = hoverLineGroup.append("circle")
      .attr("r", 4.5);

    let hoverTT2 = hoverLineGroup.append('text')
      .attr("class", "hover-text capo")
      .attr('dy', "0.55em");

    hoverLineGroup.style("opacity", 1e-6);

    graph.append("rect")
      .data(swedenData)
      .attr("fill", "none")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height);

    let activeYear = 0;
    let hoverMouseOnSweden =  function(d){
      let mouse_x = d3.mouse(this)[0];
      let mouse_y = d3.mouse(this)[1];
      let mouseDate = xScale.invert(mouse_x);
      let i = bisectDate(swedenData, mouseDate); // returns the index to the current data item
      let d0 = swedenData[i - 1]
      let d1 = swedenData[i];
      // work out which date value is closest to the mouse
      var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
      console.log(d.time);
      activeYear = d.time;
      hoverTT.attr('x', mouse_x);
      hoverTT.attr('y', yScale(d.value));
      hoverTT2.text("GDP: " + Math.round(d.value))
        .attr('x', mouse_x)
        .attr('y', yScale(d.value) + 10);
      cle
        .attr('x', mouse_x)
        .attr('y', mouse_y);
      hoverLine.attr("x1", mouse_x).attr("x2", mouse_x)
      hoverLineGroup.style("opacity", 1);

    }
  let hoverMouseOff = function() {
    hoverLineGroup.style("opacity", 0);
  }
    graph.on("mousemove", hoverMouseOnSweden)
    graph.on("mouseleave", hoverMouseOff)
    

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

