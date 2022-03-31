export function load() {

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("./stacked-bar-chart-data.csv").then( function(data) {

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function(d){return(d.État)}).keys()

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        // Add Y axis
        var y = d3.scaleBand()
            .domain(groups)
            .range([0, height])
            .padding([0.6])
        yAxis = svg.append("g")
            .call(d3.axisLeft(y))

        yAxis.select('.domain')
        .attr('stroke-width', 0);


        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#031F4B','#265889','#5598C6', '#95C1D8', '#95C71B'])

        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)

        // ----------------
        // Create a tooltip
        // ----------------
        var tooltip = d3.select("#my_dataviz")
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
        var categories = svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", function(d) { 
                return color(d.key); 
            })

        categories
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) {
                return d; 
            })
            .enter()
            .append("rect")
                .attr("x", function(d) { return x(d[0]); })
                .attr("y", function(d) { return y(d.data.État); })
                .attr("height", y.bandwidth())
                .attr("width", function(d) { return x(d[1]) - x(d[0]); })
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
                .attr('x', function(d) { return x(d[0]) + (x(d[1]) - x(d[0])) / 2; })
                .attr('y', function(d) { return y(d.data.État) + y.bandwidth() / 2 + 6; })
                .attr("text-anchor", "middle")
                .style('fill', 'white')
                .attr("pointer-events", "none")


        // Show legend
        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("g")
            .data(subgroups.slice())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + i * 240 + ", " + height + ")"; });
        
        legend.append("rect")
            .attr("x", 0)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", color);
        
        legend.append("text")
            .attr("x", 25)
            .attr("y", 10)
            .attr("dy", "0.32em")
            .style("font-size", "12px")
            .text(function(d) { return d; })
    })

}