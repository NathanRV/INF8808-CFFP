
export function load() {

  var margin = { top: 70, right: 110, bottom: 30, left: 60 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var graph = d3.select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  d3.csv('./PIB_habitant_1980-2021_sw_can_ocde.csv').then(function (data) {
    const bisectDate = d3.bisector(function (d) {
      return d.time;
    }).left;

    const colorScale = createColorScale();
    let swedenData = getFilteredData(data, 'SWE');
    let quebecData = getFilteredData(data, 'CAN');
    let oecdData = getFilteredData(data, 'OECD'); 
    
    let xScale = d3.scaleTime()
      .domain(d3.extent(swedenData, function (d) {
        return d.time;
      }))
      .range([0, width])

    graph.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // Add Y axis

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(swedenData, function (d) { return +d.value; })])
      .range([height, 0]);

    graph.append("g")
      .call(d3.axisLeft(yScale));

    graph.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("font-size", "14px")
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
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("transform", "rotate(-90)")
      .text("USD")

    // Add the line
    graph.append("path")
      .datum(swedenData)
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke", "#FFCD00")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) {
          return xScale(d.time)
        })
        .y(function (d) {
          return yScale(Math.round(d.value))
        })
      )

    graph.append("path")
      .datum(quebecData)
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke", "#001F97")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function (d) {
          return xScale(d.time)
        })
        .y(function (d) {
          return yScale(Math.round(d.value))
        })
      )

    graph.append("path")
      .datum(oecdData)
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke", "#95C71B")
      .attr("stroke-width", 2)
      .attr("opacity", 0.5)
      .attr("d", d3.line()
        .x(function (d) {
          return xScale(d.time)
        })
        .y(function (d) {
          return yScale(Math.round(d.value))
        })
    )
    // graph title
    graph.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle") 
        .attr("font-weight", "bold")
        .style("font-size", "16px")  
        .text("PIB par habitant (USD)");
    
    showLegend(graph, width, height)
    let mouseG = graph.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    let lines = document.getElementsByClassName('line');

    var mousePerLine = graph.selectAll('.mouse-per-line')
      .data(data)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function (d) {
        return colorScale(d.location)
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");
    
    mouseG.append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () {
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function () {
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function () {
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function () {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function (d, i) {
            if (d === undefined) return;
            let mouseDate = xScale.invert(mouse[0]);
            idx = bisectDate(swedenData, mouseDate);
            let beginning = 0;
            let end = lines[i].getTotalLength();
            let target = null;
            while (true) {
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
              }
              if (pos.x > mouse[0]) end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break;
            }
            graph.select("#timeLegendVal").text(mouseDate.getUTCFullYear())
            if(i == 0)
              graph.select("#quebecLegendVal").text(Math.round(yScale.invert(pos.y)) + " USD")
            else if (i == 1)
              graph.select("#swedenLegendVal").text(Math.round(yScale.invert(pos.y)) + " USD")
            else if (i == 2)
              graph.select("#oecdLegendVal").text(Math.round(yScale.invert(pos.y)) + " USD")

            d3.select(this).select('text')
              .text(function () {
                return yScale.invert(pos.y).toFixed(2)
              });
            return "translate(" + mouse[0] + "," + pos.y + ")";
          });
      });
  });

  d3.select("#line-chart")
    .style("position", "absolute")
    .style("left", "50%")
    .style("margin-left", String(-width / 2 - margin.left / 2) + "px")
    .style("top", "3400px")
}


/**
 * Removes the other states not used in this dataset.
 *
 * @param {object[]} data The data to be used
 */
function getFilteredData(data, country) {
  var filtered = data.filter(function (d) {
    if (d.location === country)
      return true;
    return false;
  });
  filtered.forEach((element) => {
    element.time = d3.timeParse("%Y")(element.time);
  })
  return filtered;
}

function createColorScale() {
    return d3.scaleOrdinal()
        .domain(["CAN", "SWE", "OECD"])
        .range(["#001F97", "#FFCD00", "#95C71B"]);
}

function showLegend(graph, width) {
  let offsetText = 40
  let offsetGraph = 30
  
  graph.append("circle").attr("cx", width + offsetGraph).attr("cy", 30).attr("r", 6).style("fill", "#001F97")
  graph.append("circle").attr("cx", width + offsetGraph).attr("cy", 70).attr("r", 6).style("fill", "#FFCD00")
  graph.append("circle").attr("cx", width + offsetGraph).attr("cy", 110).attr("r", 6).style("fill", "#95C71B")
  
  graph.append("text").attr("x", width + offsetText).attr("y", 30).text("Quebec").style("font-size", "15px").attr("alignment-baseline", "middle")
  graph.append("text").attr("x", width + offsetText).attr("y", 70).text("Sweden").style("font-size", "15px").attr("alignment-baseline", "middle")
  graph.append("text").attr("x", width + offsetText).attr("y", 110).text("OECD").style("font-size", "15px").attr("alignment-baseline", "middle")
  graph.append("text").attr("x", width + offsetGraph).attr("y", 0).text("Time").style("font-size", "15px").attr("alignment-baseline", "middle")

  graph.append("text")
    .attr("x", width + offsetGraph)
    .attr("y", 130).style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("id", "oecdLegendVal")
    .attr("font-weight", "bold")
    
  graph.append("text")
    .attr("x", width + offsetGraph)
    .attr("y", 90)
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("id", "swedenLegendVal")
    .attr("font-weight", "bold")

  graph.append("text")
    .attr("x", width + offsetGraph)
    .attr("y", 50)
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("id", "quebecLegendVal")
    .attr("font-weight", "bold")

  graph.append("text")
    .attr("x", width + offsetGraph)
    .attr("y", 15)
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
    .attr("id", "timeLegendVal")
    .attr("font-weight", "bold")
}

