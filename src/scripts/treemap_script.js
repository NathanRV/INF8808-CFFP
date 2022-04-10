import d3Tip from 'd3-tip';


export function load(){
  
// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 550 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;


// append the svg object to the body of the page
var swedenSVG = d3.select("#swedenTreeMap")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
  
  var quebecSVG = d3.select('#quebecTreeMap').append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

  // Read data
  d3.csv('./Tab3-Structure_fiscale_2020.csv').then(function(data) {
    let swedenData = getFilteredData(data, 'Suede');
    swedenData = createHierarchy(swedenData,'Sweden');
    let quebecData = getFilteredData(data, 'Quebec');
    quebecData = createHierarchy(quebecData, 'Quebec');

    var tooltipSweden = d3.select("#swedenTreeMap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "d3-tip")

    var tooltipQuebec = d3.select("#quebecTreeMap")
    .append("div")
    .style("opacity", 0)
    .attr("class", "d3-tip")


    let quebecRoot = d3.stratify().id(function (d) { return d.Name }).parentId(function (d) { return d.parentId })(quebecData);
    quebecRoot.sum(function (d) { return d.Value; });

    let root = d3.stratify().id(function(d){return d.Name}).parentId(function(d){return d.parentId})(swedenData);
    root.sum(function (d) { return d.Value; })

     // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      if(d.parent.id === 'Sweden'){
        tooltipSweden
        .html(d.id + ' : ' + Math.round(100 * d.value) + ' % <br>' + 999 + ' G $')
        .style("opacity", 1)
        .style("left", d3.mouse(this)[0]+70 + "px")
        .style("top", d3.mouse(this)[1]+"px")
        let data = quebecData.filter((element)=>{return d.id === element.Name});
        tooltipQuebec
        .html(data[0].Name + ' : ' + Math.round(100 * data[0].Value) + ' % <br>' + 999 + ' G $')
        .style("opacity", 1)
        .style("left", d3.mouse(this)[0]+70 + "px")
        .style("top", d3.mouse(this)[1]+"px")
      }
        
      if(d.parent.id === 'Quebec'){
        tooltipQuebec
        .html(d.id + ' : ' + Math.round(100 * d.value) + ' % <br>' + 999 + ' G $')
        .style("opacity", 1)
        .style("left", d3.mouse(this)[0]+70 + "px")
        .style("top", d3.mouse(this)[1]+"px") 
        let data = swedenData.filter((element)=>{return d.id === element.Name});
        tooltipSweden
        .html(data[0].Name + ' : ' + Math.round(100 * data[0].Value) + ' % <br>' + 999 + ' G $')
        .style("opacity", 1)
        .style("left", d3.mouse(this)[0]+70 + "px")
        .style("top", d3.mouse(this)[1]+"px")
      }
    }

    var mousemove = function(d) {
      if(d.parent.id === 'Sweden')
        tooltipSweden
              .style("left", d3.mouse(this)[0]+70 + "px")
              .style("top", d3.mouse(this)[1]+"px")
      if(d.parent.id === 'Quebec')
        tooltipQuebec
        .style("left", d3.mouse(this)[0]+70 + "px")
        .style("top", d3.mouse(this)[1]+"px")
    }

    var mouseleave = function(d) {
        tooltipSweden
            .style("opacity", 0)
        tooltipQuebec
          .style("opacity", 0)
    }

    d3.treemap()
      .tile(d3.treemapSquarify)
      .size([width, height])
      .paddingInner(3)
      (root)
    
    d3.treemap()
      .tile(d3.treemapSquarify.ratio(0.9))
      .size([width, height])
      .paddingInner(3)
      (quebecRoot)
    
    const color = d3.scaleOrdinal()
      .domain([
      "Impôts sur le revenu des particuliers",
      "Impôts sur les bénéfices des sociétés", 
      "Cotisations sociales",
      "Impôts sur les salaires",
      "Impôts sur le patrimoine",
      "Impôts sur la consommation",
      "Autres impôts"
      ])
      .range(["#F8B195","#F67280","#C06C84","#6C5B7B","#355C7D","#99B898", "#2A363B"])
    // use this information to add rectangles:
    swedenSVG
      .selectAll("rect")
      .data(root.children)
      .enter()
      .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function (d) { return color(d.id)})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


      // and to add the text labels
      swedenSVG
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
          .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
          .text(function(d){   
            if(getTextWidth(d.id,d.x1 - d.x0, d.y1 - d.y0 ) )
              return d.id
            else 
              return '';})
          .attr("font-size", "14px")
        .attr("fill", "white")
       
      swedenSVG
      .selectAll("vals")
      .data(root.leaves())
      .enter()
      .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
        .text(function (d) {
          if(getTextWidth(Math.round(d.value * 100) + '%',d.x1 - d.x0, d.y1 - d.y0 ) )
            return Math.round(d.value * 100) + '%'
          else 
            return '';
        })
        .attr("font-size", "16px")
      .attr("fill", "white")
    
      quebecSVG
      .selectAll("rect")
      .data(quebecRoot.children)
      .enter()
      .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function (d) { return color(d.id)})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

      // and to add the text labels
      quebecSVG
        .selectAll("text")
        .data(quebecRoot.leaves())
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
          .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
          .text(function(d){ 
            if(getTextWidth(d.id,d.x1 - d.x0, d.y1 - d.y0 ) )
              return d.id
            else 
              return '';
          })
          .attr("font-size", "14px")
        .attr("fill", "white")
      
      quebecSVG
      .selectAll("vals")
      .data(quebecRoot.leaves())
      .enter()
      .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
        .text(function (d) {
          if(getTextWidth(Math.round(d.value * 100) + '%',d.x1 - d.x0, d.y1 - d.y0 ) )
            return Math.round(d.value * 100) + '%'
          else 
          return '';
        })
        .attr("font-size", "16px")
      .attr("fill", "white")
  });
}


/**
 * Removes the other states not used in this dataset.
 *
 * @param {object[]} data The data to be used
 */
 function getFilteredData(data, country){
  var filtered = data.filter(function(d){
      if (d.Country === country)
          return true;
      return false;
  });
  return filtered;
}

function createHierarchy(data, countryName) {
  let hierarchyData = [{Name: countryName , Value: null, parentId:null}]
  for(let i = 0; i < data.length; i++){
    hierarchyData.push({Name: data[i].Indicator, Value: data[i].Value, parentId: countryName});
  }
  return hierarchyData;
}


function getTextWidth(text, width, height) {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  const metrics = context.measureText(text);
  let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  return width > metrics.width && height > actualHeight;
}



