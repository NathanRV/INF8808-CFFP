/*
* Functions used to draw the viz related to RPF (Répartition prélèvements fiscaux)
*
*/
import d3Tip from 'd3-tip';
import d3Legend from 'd3-svg-legend';

export function load() {

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#rpf-chart")
        .append("svg")
            .attr("id","rpf-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("id","rpf-g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");   
    
    var svgGraph = svg.append("g")
        .attr("id","rpf-graph")

    var legend = svg.append("g")
        .attr("id", "rpf-legend")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")

    let tips = createTips(svg);

    // Parse the Data
    d3.csv("./stacked-bar-chart-data.csv").then( function(data) {

        // List of subgroups = header of the csv files
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the Y axis
        var groups = d3.map(data, function(d){return(d.État)}).keys()

        // Creating scales and axis
        let xScale = createXAxis(width)
        let yScale = createYScale(groups, height, svgGraph)

        var colorScale = createColorScale(subgroups)

        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)

        // Create a tooltip
        var tooltip = d3.select("#rpf-chart")
            .append("div")
                .style("opacity", 0)
                .attr("class", "d3-tip")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName];
        tooltip
            .html(subgroupName + ' : ' + subgroupValue + ' % <br>' + 999 + ' G $')
            .style("opacity", 1)
        }

        var mousemove = function(d) {
            tooltip
                .style("left", "90px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", "90px")
        }

        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
        }

        // Show the bars
        var categories = svgGraph
            .selectAll("g.category")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "category")
            .attr("fill", function(d) { 
                return colorScale(d.key); 
            })

        categories
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) {
                return d; 
            })
            .enter()
            .append("rect")
                .attr("x", function(d) { return xScale(d[0]); })
                .attr("y", function(d) { return yScale(d.data.État); })
                .attr("height", yScale.bandwidth())
                .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); })
                .attr("stroke", "white")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        categories
            .selectAll("text")
            // enter a second time = loop subgroup per subgroup to add all text
            .data(function(d) {
                return d; 
            })
            .enter()
            .append("text")
                .text(function(d) {
                    if (d[1] - d[0] < 3) return ""
                    return parseFloat(d[1] - d[0]).toFixed(2) + " %"
                })
                .attr('x', function(d) { return xScale(d[0]) + (xScale(d[1]) - xScale(d[0])) / 2; })
                .attr('y', function(d) { return yScale(d.data.État) + yScale.bandwidth() / 2 + 6; })
                .attr("text-anchor", "middle")
                .style('fill', 'white')
                .attr("pointer-events", "none")

        showLegend(colorScale, legend)
    })
}

/**
 * Creates tooltips to be used and returns an array of them.
 * 
 * @param {*} svg Selection of group element of the chart.
 */
 function createTips(svg){
    let firstBarTip = d3Tip().attr("class","d3-tip")
        .html(function(d){
            return d;
        });

    let secondBarTip = d3Tip().attr("class","d3-tip")
        .html(function(d){
            return d;
        });

    
    let tips = [firstBarTip, secondBarTip];
    tips.forEach((tip) => svg.call(tip));

    return tips;
}

/**
 * Creates the X axis shown on the chart.
 *
 * @param {number} width Max width of the scale
 */
 function createXAxis(width) {
    return d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);;
}

/**
 * Creates the y scale used throughout the chart.
 *
 * @param {Object[]} groups Differents groups used to build y scale.
 * @param {number} height Max height of the scale
 * @param {number} svg The d3 Selection of the graph's g SVG element
 */
function createYScale(groups, height, svg){
    var y = d3.scaleBand()
        .domain(groups)
        .range([0, height])
        .padding([0.6])

    yAxis = svg
        .append("g")
        .call(d3.axisLeft(y))

    yAxis.select('.domain')
        .attr('stroke-width', 0)

    return y;
}

/**
 * Creates a color scale for the countries used.
 *
 * @param {*} subgroups The categories in the scale
 */
 function createColorScale(subgroups){
    return d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#031F4B','#265889','#5598C6', '#95C1D8', '#95C71B'])
}

/**
 * Draws the legend. Using d3-svg-legend library
 * https://d3-legend.susielu.com/
 *
 * @param {*} colorScale The color scale to use
 * @param {*} legendSVG The d3 Selection of the graph's g SVG legend element
 */
function showLegend (colorScale, legendSVG) {  
    let legend = d3Legend.legendColor()
                    .orient("horizontal")
                    .shapePadding('220')
                    .labelAlign('start')
                    .labelWrap('200')
                    .scale(colorScale)
  
    legendSVG.call(legend)

    legendSVG.selectAll('.label')
        .attr("transform", "translate(20, 13)")
        .attr("font-size", 16)
}