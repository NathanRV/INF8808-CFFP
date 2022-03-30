/*
* Functions used to draw the viz related to CFN (charge fiscale nette)
*
*/
import d3Tip from 'd3-tip'

let radius = 10

export function load(){
    let margin = {top: 10, right: 30, bottom: 30, left: 250};
    let width = 1200 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    let svg = d3.select("#cfn-chart")
        .append("svg")
            .attr("id","cfn-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("id","cfn-g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");   


    let minTip = d3Tip().attr("class","d3-tip")
        .direction("w")
        .html(function(d){
            return getMinContents(d);
        });

    let meanTip = d3Tip().attr("class","d3-tip")
        .html(function(d){
            return getMeanContents(d);
        })
    
    let maxTip = d3Tip().attr("class","d3-tip")
        .direction("e")
        .html(function(d){
            return getMaxContents(d);
        })
    
    let tips = [minTip, meanTip, maxTip]
    tips.forEach((tip) => svg.call(tip))

    d3.csv("./Charge_fiscale_nette_2020.csv").then( function(data){
        data = removeOtherStates(data);
        data = transformValues(data);

        xScale = createXAxis(svg, data, width, height);
        yScale = createYScale(data, height);
        
        data = regroupBySituation(data);
        console.log(data)
        groups = createGroups(data, tips, yScale)
        createYAxis(groups, yScale);

        lines = createLines(groups, xScale);
        createCircles(groups, xScale);
    })
}


function removeOtherStates(data){
    var filtered = data.filter(function(d){
        if (d.Pays == 'Suede' || d.Pays =='Quebec' || d.pays == ''){
            return true;
        }
      return false;
    })
  
    return filtered;
}

function transformValues(data){
    data.forEach((d)=>{
        d.Valeur = d3.format(".2f")(d.Valeur * 100);
        d["Moyenne OCDE"] = d3.format(".2f")(parseFloat(d["Moyenne OCDE"])*100);
    })

    return data;
}

function regroupBySituation(data){
    let groupedData = {}

    for (entry in data){
        let situation = data[entry].Situation_familiale;

        if (!groupedData[situation]){
            groupedData[situation] = [];
        }
        groupedData[situation].push(data[entry]);
    }

    formattedData = []

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
 * Each group corresponds to an act.
 *
 * @param {object[]} data The data to be used
 * @param {*} y The graph's y scale
 */
 function createGroups (data, tips, y) {
    return d3.select("#cfn-g").selectAll('g.situation_familiale')
        .data(data)
        .enter()
        .append('g')
        .attr('transform',function(d){return 'translate(0,'+ (y.bandwidth()/2 + y(d.Situation_familiale)) +')';})
        .attr('class','situation_familiale')
        .attr("id",function(d){return d.Situation_familiale})
        .on("mouseover", function(d){showTips(tips, this, d, xScale); selectGroup(this.id);})
        .on("mouseout", function(d){hideTips(tips, this, d); unselectGroup();})  
  }

  function unselectGroup(group){
    d3.selectAll('g.situation_familiale')
        .style('fill', "black")
  }

  function selectGroup(group){
    d3.selectAll('g.situation_familiale')
        .style('fill', function(d){
            if(d.Situation_familiale == group) return "black";
            return 'grey';})
  }

function createXAxis(svg, data, width, height){
    let minValue = d3.min(data, (d)=>{
            return parseFloat(d["Valeur"]);
        });

    let maxValue = d3.max(data, (d)=>{
            return parseFloat(d["Valeur"]);
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
        .style("font-size", "15px")
        .style("font-weight", "bold")
    

    return xScale;
}

function createYScale(data, height){
    let yScale = d3.scaleBand()
        .domain(data.map(function(d){
            return d.Situation_familiale;
        }))
        .range([0, height])

    return yScale;
}

function createYAxis(groups, yScale){
    groups.append("text")
        .attr("transform", "translate(-240,0)")
        .text(function(d){return d.Situation_familiale;})
        .style("font-size", "15px")
        .style("font-weight", "bold")

    return yScale;
}

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

function createCircles(groups, xScale){

    groups.append("circle")
        .attr("cx", function(d){
            return xScale(d["Moyenne OCDE"])
        })
        .attr("cy", 0)
        .attr("r", radius)
        .attr("opacity", 0.7)
        .attr("fill", "#95C71B")

    groups.append("circle")
            .attr("cx", function(d){return xScale(d.Quebec)})
            .attr("cy", 0)
            .attr("r",radius)
            .attr("opacity", 0.7)
            .attr("fill","#001F97")

    groups.append("circle")
            .attr("cx", function(d){return xScale(d.Suede)})
            .attr("cy", 0)
            .attr("r",radius)
            .attr("opacity", 0.7)
            .attr("fill","#FFCD00")       
}

function getMinContents(data){
    let value = getMin(data);
    return getContentString(value);
}

function getMeanContents(data){
    let value = getMiddle(data)
    return getContentString(value);
}

function getMaxContents(data){
    let value = getMax(data);
    return getContentString(value);
}

function getMin(data){
    return d3.min([data.Quebec,data.Suede,data["Moyenne OCDE"]]);
}

function getMax(data){
    return d3.max([data.Quebec,data.Suede,data["Moyenne OCDE"]]);
}

function getMiddle(data){
    let minValue = getMin(data);
    let maxValue = getMax(data);
    let value = [data.Quebec,data.Suede,data["Moyenne OCDE"]]
        .filter((value) => {return (value != minValue && value != maxValue)})[0];
    
    return value;
}

function getContentString(value){
    // let state = getState(data, value)

    let tooltipString =
        "<span style='font-weight: bold'>"+
            // "<b>" + state +" : </b>"+ 
            value + "%" +
        "</span><br>"
    return tooltipString;
}

function getState(data, value){
    switch(value){
        case data.Quebec:
            return "Québec"
        case data.Suede:
            return "Suède"
        case data["Moyenne OCDE"]:
            return "Moyenne OCDE"
    }
}

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

function showTipsMean(tips, object, data, xScale){
    //Min tip
    tips[0].offset([10,
        -(xScale(getMiddle(data)) - xScale(getMin(data)))
        ])
    //Mean tip
    tips[1].offset([-10,
        0
        ])
    //Max tip
    tips[2].offset([10,
        (xScale(getMax(data)) - xScale(getMiddle(data)))
        ])

    tips.forEach((tip)=>{
        tip.show(data, object)
    })
}

function showTipsMin(tips, object, data, xScale){
    //Min tip
    tips[0].offset([10,
        0
        ])
    //Mean tip
    tips[1].offset([-10,
        (xScale(getMiddle(data)) - xScale(getMin(data)))
        ])
    //Max tip
    tips[2].offset([10,
        (xScale(getMax(data)) - xScale(getMin(data)))
        ])

    tips.forEach((tip)=>{
        tip.show(data, object)
    })
}

function showTipsMax(tips, object, data, xScale){
    //Min tip
    tips[0].offset([10,
        -(xScale(getMax(data)) - xScale(getMin(data)))
        ])
    //Mean tip
    tips[1].offset([-10,
        -(xScale(getMax(data)) - xScale(getMiddle(data)))
        ])
    //Max tip
    tips[2].offset([10,
        0
        ])

    tips.forEach((tip)=>{
        tip.show(data, object)
    })
}

function hideTips(tips, object, data){
    tips.forEach((tip)=>{
        tip.offset([0,0])
        tip.hide(data, object)
    })
}