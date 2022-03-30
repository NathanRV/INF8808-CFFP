/*
* Functions used to draw the viz related to CFN (charge fiscale nette)
*
*/
import d3Tip from 'd3-tip'

export function load(){
    let margin = {top: 10, right: 30, bottom: 30, left: 250};
    let width = 1200 - margin.left - margin.right;
    let height = 800 - margin.top - margin.bottom;

    let svg = d3.select("#cfn-chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");   


    let minTip = d3Tip().attr("class","d3-tip")
        .offset([-10,20])
        .html(function(d){
            return getMinContents(d);
        });

    let meanTip = d3Tip().attr("class","d3-tip")
        .offset([90,20])
        .html(function(d){
            return getMeanContents(d);
        })
    
    let maxTip = d3Tip().attr("class","d3-tip")
        .offset([0,20])
        .html(function(d){
            return getMaxContents(d);
        })
    
    let tips = [minTip, meanTip, maxTip]
    tips.forEach((tip) => svg.call(tip))

    d3.csv("./Charge_fiscale_nette_2020.csv").then( function(data){
        data = removeOtherStates(data);
        data = transformValues(data);

        xScale = createXAxis(svg, data, width, height);
        yScale = createYAxis(svg, data, height);
        
        data = regroupBySituation(data);

        lines = createLines(svg, tips, data, xScale, yScale);
        createCircles(svg, tips, data, xScale, yScale);
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
        tmp["Valeur_" + tmp["Pays"]] = tmp["Valeur"]
        tmp["Valeur_" + group[1]["Pays"]] = group[1]["Valeur"]

        delete tmp['Valeur']
        delete tmp['Pays']

        formattedData.push(tmp)
    }

    return formattedData;
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

    let xAxis = svg.append("g")
        .attr("transform","translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .style("font-size", "15px")
        .style("font-weight", "bold")
    

    return xScale;
}


function createYAxis(svg, data, height){

    let yScale = d3.scaleBand()
        .domain(data.map(function(d){
            return d.Situation_familiale;
        }))
        .range([0, height])

    let yAxis = svg.append("g")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale))
        .style("font-size", "15px")
        .style("font-weight", "bold")
    

    return yScale;
}

function createLines(svg, tips, data, xScale, yScale){
    svg.selectAll(".cfn-line")
        .data(data)
        .enter()
        .append("line")
            .attr("x1", function(d){
                return xScale(getMin(d))
            })
            .attr("x2", function(d){
                return xScale(getMax(d))
            })
            .attr("y1", function(d){ return yScale(d.Situation_familiale) + yScale.bandwidth()/2})
            .attr("y2", function(d){ return yScale(d.Situation_familiale) + yScale.bandwidth()/2})
            .attr("stroke","grey")
            .attr("stroke-width","5px")
            .on("mouseover", function(d){showTipsLine(tips, this, d, xScale)})
            .on("mouseout", function(d){hideTips(tips, this, d)})  
}

function createCircles(svg, tips, data, xScale, yScale){
    radius = 10

    svg.selectAll(".cfn-circle")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function(d){
            return xScale(d["Moyenne OCDE"])
        })
        .attr("cy", function(d){ return yScale(d.Situation_familiale) + yScale.bandwidth()/2})
        .attr("r", radius)
        .attr("fill", "grey")
        .on("mouseover", function(d){showTipsMean(tips, this, d, xScale)})
        .on("mouseout", function(d){hideTips(tips, this, d)})  

    svg.selectAll(".cfn-circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d){
                return xScale(d3.min([d.Valeur_Quebec, d.Valeur_Suede]))
            })
            .attr("cy", function(d){ return yScale(d.Situation_familiale) + yScale.bandwidth()/2})
            .attr("r",radius)
            .attr("fill",function(d){
                // TODO implement colorscale
                if (d3.min([d.Valeur_Quebec, d.Valeur_Suede]) == d.Valeur_Quebec){
                    return "blue";
                }
                return "yellow";
            })
            .on("mouseover", function(d){showTipsMin(tips, this, d, xScale)})
            .on("mouseout", function(d){hideTips(tips, this, d)})  

    svg.selectAll(".cfn-circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d){
                return xScale(d3.max([d.Valeur_Quebec, d.Valeur_Suede]))
            })
            .attr("cy", function(d){ return yScale(d.Situation_familiale) + yScale.bandwidth()/2})
            .attr("r", radius)
            .attr("fill",function(d){
                // TODO implement colorscale
                if (d3.max([d.Valeur_Quebec, d.Valeur_Suede]) == d.Valeur_Quebec){
                    return "blue";
                }
                return "yellow";
            })         
            .on("mouseover", function(d){showTipsMax(tips, this, d, xScale)})
            .on("mouseout", function(d){hideTips(tips, this, d)})  
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
    return d3.min([data.Valeur_Quebec,data.Valeur_Suede,data["Moyenne OCDE"]]);
}

function getMax(data){
    return d3.max([data.Valeur_Quebec,data.Valeur_Suede,data["Moyenne OCDE"]]);
}

function getMiddle(data){
    let minValue = getMin(data);
    let maxValue = getMax(data);
    let value = [data.Valeur_Quebec,data.Valeur_Suede,data["Moyenne OCDE"]]
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
        case data.Valeur_Quebec:
            return "Québec"
        case data.Valeur_Suede:
            return "Suède"
        case data["Moyenne OCDE"]:
            return "Moyenne OCDE"
    }
}

function showTipsLine(tips, object, data, xScale){
    //Min tip
    tips[0].offset([10,
        -object.getTotalLength()/2 - 40
        ])
    //Mean tip
    tips[1].offset([-10,
        (xScale(getMiddle(data)) - xScale(getMin(data))) - object.getTotalLength()/2
        ])
    //Max tip
    tips[2].offset([10,
        object.getTotalLength()/2 + 40
        ])

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
        tip.hide(data, object)
    })
}