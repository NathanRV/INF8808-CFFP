/*
* Functions used to draw the viz related to CFN (charge fiscale nette)
*
*/
import d3Tip from 'd3-tip';
import d3Legend from 'd3-svg-legend';

// Global variables used in many functions
let radius = 10

export function load(){
    let margin = {top: 10, right: 30, bottom: 30, left: 250};
    let width = 1200 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    d3.select("#cfn-chart")
        .append("h2")
        .attr("class","cfn-title")
        .text("Comparaison charge fiscale nette selon situation familiale");

        
    let svg = d3.select("#cfn-chart")
        .append("svg")
            .attr("id","cfn-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("id","cfn-g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");   

    let tips = createTips(svg);

    d3.csv("./Charge_fiscale_nette_2020.csv").then( function(data){
        // Preprocessing data
        data = removeOtherStates(data);
        data = transformValues(data);
        data = regroupBySituation(data);
        

        // Creating scales and axis
        let xScale = createXAxis(svg, data, width, height);
        let yScale = createYScale(data, height);
        
        let groups = createGroups(data, tips, yScale, xScale)
        createYAxis(groups, yScale);

        // Creating viz
        let colorScale = createColorScale() 

        createLines(groups, xScale);
        createCircles(groups, xScale, colorScale);
        drawLegend(colorScale, svg, width)
    })
}


/**
 * Creates tooltips to be used and returns an array of them.
 * 
 * @param {*} svg Selection of group element of the chart.
 */
function createTips(svg){
    let minTip = d3Tip().attr("class","d3-tip")
        .direction("w")
        .html(function(d){
            return getMinContents(d);
        });

    let meanTip = d3Tip().attr("class","d3-tip")
        .html(function(d){
            return getMiddleContents(d);
        });
    
    let maxTip = d3Tip().attr("class","d3-tip")
        .direction("e")
        .html(function(d){
            return getMaxContents(d);
        });
    
    let tips = [minTip, meanTip, maxTip];
    tips.forEach((tip) => svg.call(tip));

    return tips;
}

/**
 * Creates a color scale for the countries used.
 */
function createColorScale(){
    return d3.scaleOrdinal()
        .domain(["Québec","Suède","Moyenne OCDE"])
        .range(["#001F97","#FFCD00","#95C71B"]);
}

/**
 * Removes the other states not used in this dataset.
 *
 * @param {object[]} data The data to be used
 */
function removeOtherStates(data){
    var filtered = data.filter(function(d){
        if (d.Pays == 'Suede' || d.Pays =='Quebec' || d.pays == ''){
            return true;
        }
      return false;
    })
  
    return filtered;
}

/**
 * Transforms the data into percentage values (string to number).
 *
 * @param {object[]} data The data to be used
 */
function transformValues(data){
    data.forEach((d)=>{
        d.Valeur = parseFloat(d3.format(".2f")(d.Valeur * 100));
        d["Moyenne OCDE"] = parseFloat(d3.format(".2f")(parseFloat(d["Moyenne OCDE"])*100));
    })

    return data;
}

/**
 * Regroups the data by family situation.
 *
 * @param {object[]} data The data to be used
 */
function regroupBySituation(data){
    let groupedData = {}

    // Group by family situation
    for (entry in data){
        let situation = data[entry].Situation_familiale;

        if (!groupedData[situation]){
            groupedData[situation] = [];
        }
        groupedData[situation].push(data[entry]);
    }

    formattedData = []
    // Format into array of data (easier to use)
    for (situation in groupedData){
        let group = groupedData[situation]

        let tmp = group[0]
        tmp[tmp["Pays"]] = tmp["Valeur"]
        tmp[group[1]["Pays"]] = group[1]["Valeur"]

        delete tmp['Valeur']
        delete tmp['Pays']

        formattedData.push(tmp)
    }

    return formattedData;
}

/**
 * Creates the groups for the grouped bar chart and appends them to the graph.
 * Each group corresponds to a family situation.
 *
 * @param {object[]} data The data to be used
 * @param {*} tips Array of selection of tips div element.
 * @param {*} yScale The graph's y scale
 * @param {*} xScale The graph's x scale
 */
 function createGroups (data, tips, yScale, xScale) {
    return d3.select("#cfn-g").selectAll('g.situation_familiale')
        .data(data)
        .enter()
        .append('g')
        .attr('transform',function(d){return 'translate(0,'+ (yScale.bandwidth()/2 + yScale(d.Situation_familiale)) +')';})
        .attr('class','situation_familiale')
        .attr("id",function(d){return d.Situation_familiale})
        .on("mouseover", function(d){showTips(tips, this, d, xScale); selectGroup(this.id);})
        .on("mouseout", function(d){hideTips(tips, d); unselectGroup();})  
}

/**
 * Removes highlights.
 */
function unselectGroup(){
d3.selectAll('g.situation_familiale')
    .style('fill', "black")
}

/**
 * Highlights the group passed as argument.
 *
 * @param {*} group Selection of group element to highlight.
 */
function selectGroup(group){
d3.selectAll('g.situation_familiale')
    .style('fill', function(d){
        if(d.Situation_familiale == group) return "black";
        return 'grey';})
}

/**
 * Creates the X axis shown on the chart.
 *
 * @param {*} svg Selection of group element of the chart.
 * @param {Object[]} data Data used to create the x scale.
 * @param {number} width Max width of the scale
 * @param {number} height Height of the graph used to place the axis
 */
function createXAxis(svg, data, width, height){
    let minValue = d3.min(data, (d)=>{
            return d3.min([
                d.Quebec, 
                d.Suede, 
                d["Moyenne OCDE"]]);
        });

    let maxValue = d3.max(data, (d)=>{
            return d3.max([
                d.Quebec, 
                d.Suede,
                d["Moyenne OCDE"]]);
        });

    let xScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([0, width])

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(function(d){
            return d+'%';
        })
    
    svg.append("g")
        .attr("transform","translate(0," + height + ")")
        .call(xAxis)
        .attr("class","cfn-axis")

    return xScale;
}

/**
 * Creates the y scale used throughout the chart.
 *
 * @param {Object[]} data Data of differents groups used to build y scale.
 * @param {number} height Max height of the scale
 */
function createYScale(data, height){
    let yScale = d3.scaleBand()
        .domain(data.map(function(d){
            return d.Situation_familiale;
        }))
        .range([0, height])

    return yScale;
}

/**
 * Creates the Y axis shown on the chart.
 *
 * @param {*} groups Selection of group elements to which append the labels.
 * @param {*} yScale X scale to place the circles
 */
function createYAxis(groups, yScale){
    groups.append("text")
        .attr("transform", "translate(-240,0)")
        .text(function(d){return d.Situation_familiale;})
        .attr("class","cfn-axis")

    return yScale;
}

/**
 * Creates the lines shown on the chart.
 *
 * @param {*} groups Selection of group elements to which append the lines.
 * @param {*} xScale X scale to place the lines
 */
function createLines(groups, xScale){
    groups.append("line")
            .attr("x1", function(d){
                return xScale(getMin(d))
            })
            .attr("x2", function(d){
                return xScale(getMax(d))
            })
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke","grey")
            .attr("stroke-width","5px")
}

/**
 * Creates the circles shown on the chart.
 *
 * @param {*} groups Selection of group elements to which append the circles.
 * @param {*} xScale X scale to place the circles
 * @param {*} colorScale Color scale to assign fill color.
 */
function createCircles(groups, xScale, colorScale){
    // Circles for mean
    groups.append("circle")
        .attr("cx", function(d){
            return xScale(d["Moyenne OCDE"])
        })
        .attr("cy", 0)
        .attr("r", radius)
        .attr("opacity", 0.7)
        .attr("fill", colorScale("Moyenne OCDE"))

    // Circles for québec
    groups.append("circle")
            .attr("cx", function(d){return xScale(d.Quebec)})
            .attr("cy", 0)
            .attr("r",radius)
            .attr("opacity", 0.7)
            .attr("fill", colorScale("Québec"))

    // Circles for sweden
    groups.append("circle")
            .attr("cx", function(d){return xScale(d.Suede)})
            .attr("cy", 0)
            .attr("r",radius)
            .attr("opacity", 0.7)
            .attr("fill", colorScale("Suède"))       
}

/**
 * Gets the min value content to be shown in the tooltip.
 *
 * @param {object[]} data Containing the different values to evaluate.
 */
function getMinContents(data){
    let value = getMin(data);
    return getContentString(value);
}

/**
 * Gets the middle value content to be shown in the tooltip.
 *
 * @param {object[]} data Containing the different values to evaluate.
 */
function getMiddleContents(data){
    let value = getMiddle(data)
    return getContentString(value);
}

/**
 * Gets the max value content to be shown in the tooltip.
 *
 * @param {object[]} data Containing the different values to evaluate.
 */
function getMaxContents(data){
    let value = getMax(data);
    return getContentString(value);
}

/**
 * Gets the min value.
 *
 * @param {object[]} data Containing the different values to evaluate.
 */
function getMin(data){
    return d3.min([data.Quebec,data.Suede,data["Moyenne OCDE"]]);
}

/**
 * Gets the max value.
 *
 * @param {object[]} data Containing the different values to evaluate.
 */
function getMax(data){
    return d3.max([data.Quebec,data.Suede,data["Moyenne OCDE"]]);
}


/**
 * Gets the value in the middle (neither min or max)
 *
 * @param {object[]} data Containing the different values to evaluate.
 */
function getMiddle(data){
    let minValue = getMin(data);
    let maxValue = getMax(data);
    let value = [data.Quebec,data.Suede,data["Moyenne OCDE"]]
        .filter((value) => {return (value != minValue && value != maxValue)})[0];
    
    return value;
}

/**
 * Gets the content to be shown in the tooltip.
 *
 * @param {number} value Value to be shown.
 */
function getContentString(value){        
    return "<span>"+
                value + "%" +
            "</span><br>";
}

/**
 * Shows the tips.
 *
 * @param {*} tips Array of selection of the tips div element.
 * @param {*} object Selection of group element hovered.
 * @param {*} data Data used in the group element.
 * @param {*} xScale X scale used to position tips.
 */
function showTips(tips, object, data, xScale){
    //Min tip
    let lineLength = xScale(getMax(data)) - xScale(getMin(data))
    tips[0].offset([0,object.getBBox().width - lineLength - 3*radius])

    //Middle tip
    let distance_max_middle = xScale(getMax(data)) - xScale(getMiddle(data))
    let offset = object.getBBox().width/2 - distance_max_middle
    tips[1].offset([-radius, offset-radius])

    //Max tip
    tips[2].offset([0,radius])

    tips.forEach((tip)=>{
        tip.show(data, object)
    })
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
 * Draws the legend.
 *
 * @param {*} colorScale The color scale to use
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
function drawLegend (colorScale, g) {
    // For help, see : https://d3-legend.susielu.com/
  
    let legend = d3Legend.legendColor()
                    .orient("vertical")
                    .title("Légende")
                    .shape("circle")
                    .scale(colorScale)
  
    g.append("g")
      .attr("class","cfn-legend")
      .attr("transform",'translate(0,10)')
      .call(legend)
}