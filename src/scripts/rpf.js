/*
* Categories used in the csv file associated with their display text
*
*/
const CATEGORIES = {
    'Taux de prélèvements supranational': 'Supranational',
    'Taux de prélèvements fiscaux pour l’administration fédérale': 'Administration fédérale',
    'Taux de prélèvements fiscaux pour l’administration provinciale': 'Administration provinciale',
    'Taux de prélèvements fiscaux pour l’administration locale et autochtones': 'Administration locale et autochtone',
    'Taux de prélèvements fiscaux pour les régimes de pension': 'Sécurité sociale'
  }

/*
* Functions used to draw the viz related to RPF (Répartition prélèvements fiscaux)
*
*/
import d3Tip from "d3-tip";
import d3Legend from "d3-svg-legend";

export function load() {

    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 100, bottom: 20, left: 100},
        width = 1300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    d3.select("#rpf-chart")
        .append("h2")
        .attr("id","rpf-title")
        .text("Comparaison de la répartition des prélèvements fiscaux")
        .style("font-family", "sans-serif")

    // append the svg object to the body of the page
    let svg = d3.select("#rpf-chart")
        .append("svg")
            .attr("id","rpf-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("id","rpf-g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");   
    
    let svgGraph = svg.append("g")
        .attr("id","rpf-graph")

    let legend = svg.append("g")
        .attr("id", "rpf-legend")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")

    let tips = createTips(svg);

    // Parse the Data
    d3.csv("./Tab6-Repartition_prelevements_fiscaux_2020.csv").then( function(data) {

        data = removeOtherStates(data);

        data = formatData(data)

        // X axis
        let subgroups = d3.map(data, function(d) {
            return(d.Indicateur)
        }).keys()

        data = regroupByState(data)

        // Y axis
        let groups = d3.map(data, function(d) {
            return(d.État)
        }).keys()

        // Transform data for stacked bar chart
        let stackedData = d3.stack()
            .keys(subgroups)
            (data)

        // // Creating scales
        let xScale = createXScale(width)
        let yScale = createYScale(groups, height, svgGraph)
        let colorScale = createColorScale(subgroups)

        showBars(svgGraph, stackedData, xScale, yScale, colorScale, tips)

        showLegend(colorScale, legend)
    })
}

/**
 * Creates tooltips to be used and returns an array of them.
 * 
 * @param {*} svg Selection of group element of the chart.
 */
 function createTips(svg) {
    let firstBarTip = d3Tip()
        .attr("class", "d3-tip")
        .style("font-family", "sans-serif")
        .html(function(d) {
            return d;
        })

    let secondBarTip = d3Tip()
        .attr("class", "d3-tip")
        .style("font-family", "sans-serif")
        .html(function(d){
            return d;
        });

    
    let tips = [firstBarTip, secondBarTip];
    tips.forEach((tip) => svg.call(tip));

    return tips;
}

/**
 * Removes the other states not used in this dataset.
 *
 * @param {object[]} data The data to be used
 */
 function removeOtherStates(data){
    var filtered = data.filter(function(d){
        if (d.État == 'Suède' || d.État =='Québec' || d.État == ''){
            return true;
        }
      return false;
    })
  
    return filtered;
}

/**
 * Change indicator text value and puts value in percentage
 *
 * @param {object[]} data The data to be used
 */
 function formatData(data) {

    data.forEach(value => {
        value.Indicateur = CATEGORIES[value.Indicateur]
        value.Valeur = (value.Valeur * 100)
      });
  
    return data;
}

/**
 * Regroups the data by state
 *
 * @param {object[]} data The data to be used
 */
 function regroupByState(data) {
    let groupedData = {}

    // Group by state
    for (entry in data){
        let state = data[entry].État;

        if (!groupedData[state]) {
            groupedData[state] = [];
        }
        groupedData[state].push(data[entry]);
    }

    formattedData = []
    // Format into array of data (easier to use)
    for (state in groupedData) {
        let tmp = []
        groupedData[state].forEach(indicator => {
            tmp["État"] = indicator["État"]
            tmp[indicator["Indicateur"]] = indicator["Valeur"]
        })
        formattedData.push(tmp)
    }

    return formattedData;
}

/**
 * Creates the X axis shown on the chart.
 *
 * @param {number} width Max width of the scale
 */
 function createXScale(width) {
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
    let y = d3.scaleBand()
        .domain(groups)
        .range([0, height])
        .padding([0.6])

    yAxis = svg
        .append("g")
        .style("font-size", 14)
        .call(d3.axisLeft(y))

    yAxis.select(".domain")
        .attr("stroke-width", 0)

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
        .range(["#031F4B","#265889","#5598C6", "#95C1D8", "#95C71B"])
}

/**
 * Shows the stacked bar chart.
 *
 * @param {*} svgGraph The d3 Selection of the graph's g SVG legend element.
 * @param {*} stackedData The data to display formatted for stacked bar chart.
 * @param {*} xScale X scale used to position tips.
 * @param {*} yScale Y scale used to position tips.
 * @param {*} colorScale The color scale to use.
 * @param {*} tips Array of selection of the tips div element.
 */
function showBars(svgGraph, stackedData, xScale, yScale, colorScale, tips) {
    let categories =  showCategories(svgGraph, stackedData, xScale, colorScale, tips)

    showCategoryRectangles(categories, xScale, yScale)

    showRectanglesText(categories, xScale, yScale)
}

/**
 * Shows the different groups (categories) of the stacked bar chart.
 *
 * @param {*} svgGraph The d3 Selection of the graph's g SVG graph element
 * @param {*} stackedData The data to display formatted for stacked bar charts
 * @param {*} xScale X scale used to position tips.
 * @param {*} colorScale The color scale to use
 * @param {*} tips Array of selection of the tips div element.
 */
function showCategories(svgGraph, stackedData, xScale, colorScale, tips) {
    categories = svgGraph
        .selectAll("g.category")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "category")
        .attr("fill", function(d) { 
            return colorScale(d.key); 
        })
        .on("mouseover", function(d) {
            showTips(tips, this, d, xScale);
            selectGroup(d3.select(this).datum().key);
        })
        .on("mouseout", function(d){
            hideTips(tips, d);
            unselectGroup();
            }) 
    return categories
}

/**
 * Shows the different elements in each category of the stacked bar chart.
 *
 * @param {*} categories The d3 Selection of the graph's g SVG category element
 * @param {*} xScale X scale used to position tips.
 * @param {*} yScale Y scale used to position tips.
 */
function showCategoryRectangles(categories, xScale, yScale) {
    categories
        .selectAll("rect")
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
}

/**
 * Shows the text for each element in each category of the stacked bar chart.
 *
 * @param {*} categories The d3 Selection of the graph's g SVG category element
 * @param {*} xScale X scale used to position tips.
 * @param {*} yScale Y scale used to position tips.
 */
function showRectanglesText(categories, xScale, yScale) {
    categories
            .selectAll("text")
            .data(function(d) {
                return d; 
            })
            .enter()
            .append("text")
                .text(function(d) {
                    if (d[1] - d[0] < 3) return ""
                    return Math.round((d[1] - d[0] + Number.EPSILON) * 100) / 100 + " %"
                })
                .attr("x", function(d) { return xScale(d[0]) + (xScale(d[1]) - xScale(d[0])) / 2; })
                .attr("y", function(d) { return yScale(d.data.État) + yScale.bandwidth() / 2 + 6; })
                .attr("text-anchor", "middle")
                .attr("font-family", "sans-serif")
                .style("fill", "white")
                .attr("pointer-events", "none")
}

/**
 * Shows the tips.
 *
 * @param {*} tips Array of selection of the tips div element.
 * @param {*} object Selection of group element hovered.
 * @param {*} data Data used in the group element.
 * @param {*} xScale X scale used to position tips.
 */
 function showTips(tips, object, data, xScale) {
     firstTipValue = Math.round(((data[0][1] - data[0][0]) + Number.EPSILON) * 100) / 100;
     secondTipValue = Math.round(((data[1][1] - data[1][0]) + Number.EPSILON) * 100) / 100;

    if(secondTipValue != 0.0) {
        tips[0].offset([-5, xScale(firstTipValue/2 + data[0][0] - (secondTipValue/2 + data[1][0]))])
    }
    else tips[0].offset([-5, 0])

    if(firstTipValue != 0) {
        tips[1].offset([100, 0])
    }
    else tips[1].offset([0, 0])

    if(firstTipValue != 0.0) {
        tips[0].show(data.key + " : " + firstTipValue + " %", object)
    }
    if(secondTipValue != 0.0) {
        tips[1].show(data.key + " : " + secondTipValue + " %", object)
    }
}

/**
 * Hides the tips.
 *
 * @param {*} tips Array of selection of the tips div element.
 */
 function hideTips(tips){
    tips.forEach((tip)=>{
        tip.hide()
    })
}

/**
 * Highlights the group passed as argument.
 *
 * @param {*} subgroupName group element key to highlight.
 */
 function selectGroup(subgroupName) {
    d3.selectAll("g.category")
        .style("opacity", function(d) {
            if(d.key == subgroupName) {
                return 1
            }
            return 0.5;
        })
    d3.selectAll(".cell")
        .style("opacity", function(d) {
            if(d == subgroupName) {
                return 1
            }
            return 0.5;
        })
        
}

/**
 * Removes highlights.
 */
 function unselectGroup() {
    d3.selectAll("g.category")
        .style("opacity", 1)

    d3.selectAll(".cell")
        .style("opacity", 1);
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
                    .shapePadding("220")
                    .labelAlign("start")
                    .labelWrap("200")
                    .scale(colorScale)
  
    legendSVG.call(legend)

    legendSVG.selectAll(".label")
        .attr("font-family", "sans-serif")
        .attr("transform", "translate(20, 13)")
        .attr("font-size", 16)
}