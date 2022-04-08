import { stratify } from "d3-hierarchy";

export function load(){
  
// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg = d3.select("#treemap")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Read data
  d3.csv('./Tab3-Structure_fiscale_2020.csv').then(function(data) {
    let swedenData = getSweden(data);
    swedenData = createHierarchy(swedenData);
    let root = d3.stratify().id(function(d){return d.Name}).parentId(function(d){return d.parentId})(swedenData);
    root.sum(function (d) { return d.Value; })
    console.log(root)
    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
    d3.treemap()
      .size([width, height])
    (root)
    console.log(root);
    const color = d3.scaleOrdinal()
      .domain(["Impôts sur le revenu des particuliers",
      "Impôts sur les bénéfices des sociétés", 
      "Cotisations sociales", "Impôts sur les salaires",
      "Impôts sur le patrimoine","Impôts sur la consommation",
      "Autres impôts"
      ])
      .range(["#F8B195","#F67280","#C06C84","#6C5B7B","#355C7D","#99B898", "#2A363B"])
    // use this information to add rectangles:
 svg
    .selectAll("rect")
    .data(root.children)
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return (d.x1 - d.x0 + 100); })
      .attr('height', function (d) { return (d.y1 - d.y0 + 100); })
      .style("stroke", "black")
      .style("fill", function (d) { return color(d.id)})


    // and to add the text labels
    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.id})
        .attr("font-size", "14px")
      .attr("fill", "white")
    
    svg
    .selectAll("vals")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+35})    // +20 to adjust position (lower)
       .text(function (d) {
         return Math.round(d.value * 100) + '%'
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
 function getSweden(data){
  var filtered = data.filter(function(d){
      if (d.Country == 'Suede')
          return true;
      return false;
  });
  return filtered;
}

function createHierarchy(data){
  let hierarchyData = [{Name: 'Sweden' , Value: null, parentId:null}]
  for(let i = 0; i < data.length; i++){
    hierarchyData.push({Name: data[i].Indicator, Value: data[i].Value, parentId:'Sweden'});
  }
  console.log(hierarchyData);
  return hierarchyData;
}

/**
 * Removes the other states not used in this dataset.
 *
 * @param {object[]} data The data to be used
 */
 function getQuebec(data){
  console.log(data);
  var filtered = data.filter(function(d){
      if (d.Country == 'Quebec')
          return true;
      return false;
  });
  console.log(filtered);
  return filtered;
}

