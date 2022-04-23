export function load() {

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 10, bottom: 10, left: 10 },
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
  d3.csv('./Tab3-Structure_fiscale_2020.csv').then(function (data) {
    let swedenData = getFilteredData(data, 'Suede');
    let quebecData = getFilteredData(data, 'Quebec');

    var tooltipSweden = createTooltip("#swedenTreeMap")
    var tooltipQuebec = createTooltip("#quebecTreeMap")



    let quebecRoot = d3.stratify().id(function (d) { return d.Name }).parentId(function (d) { return d.parentId })(quebecData);
    quebecRoot.sum(function (d) { return d.Value; });

    let swedenRoot = d3.stratify().id(function (d) { return d.Name }).parentId(function (d) { return d.parentId })(swedenData);
    swedenRoot.sum(function (d) { return d.Value; })

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
      if (d.parent.id === 'Suede') {
        tooltipSweden
          .html(d.id + ' : ' + Math.round(100 * d.value) + ' % ')
          .style("opacity", 1)
          .style("left", d3.mouse(this)[0] + 70 + "px")
          .style("top", d3.mouse(this)[1] + "px")
        let data = quebecData.filter((element) => { return d.id === element.Name });
        tooltipQuebec
          .html(data[0].Name + ' : ' + Math.round(100 * data[0].Value) + ' % ')
          .style("opacity", 1)
          .style("left", d3.mouse(this)[0] + 70 + "px")
          .style("top", d3.mouse(this)[1] + "px")
      }
      if (d.parent.id === 'Quebec') {
        tooltipQuebec
          .html(d.id + ' : ' + Math.round(100 * d.value) + ' % ')
          .style("opacity", 1)
          .style("left", d3.mouse(this)[0] + 70 + "px")
          .style("top", d3.mouse(this)[1] + "px")
        let data = swedenData.filter((element) => { return d.id === element.Name });
        tooltipSweden
          .html(data[0].Name + ' : ' + Math.round(100 * data[0].Value) + ' % ')
          .style("opacity", 1)
          .style("left", d3.mouse(this)[0] + 70 + "px")
          .style("top", d3.mouse(this)[1] + "px")
      }
      d3.selectAll(".treemap-tile").style('opacity', function (data) {
        return d.id === data.id ? 1 : 0.5
      });
    }
    var mousemove = function (d) {
      if (d.parent.id === 'Sweden')
        tooltipSweden
          .style("left", d3.mouse(this)[0] + 70 + "px")
          .style("top", d3.mouse(this)[1] + "px")
      if (d.parent.id === 'Quebec')
        tooltipQuebec
          .style("left", d3.mouse(this)[0] + 70 + "px")
          .style("top", d3.mouse(this)[1] + "px")
    }

    var mouseleave = function (d) {
      tooltipSweden
        .style("opacity", 0)
      tooltipQuebec
        .style("opacity", 0)
      d3.selectAll("rect")
        .style('opacity', 1);
    }

    d3.treemap()
      .tile(d3.treemapSquarify)
      .size([width, height])
      .paddingInner(3)
      (swedenRoot)

    d3.treemap()
      .tile(d3.treemapSquarify.ratio(0.9))
      .size([width, height])
      .paddingInner(3)
      (quebecRoot)

    const color = createColorScale();

    swedenSVG
      .selectAll("rect")
      .data(swedenRoot.children)
      .enter()
      .append("rect")
      .attr("class", "treemap-tile")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "black")
      .style("fill", function (d) { return color(d.id) })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

    swedenSVG
      .selectAll("text")
      .data(swedenRoot.leaves())
      .enter()
      .append("text")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .attr("x", function (d) { return d.x0 + 5 })
      .attr("y", function (d) { return d.y0 + 20 })
      .text(function (d) {
        if (outputText(d.id, d.x1 - d.x0, d.y1 - d.y0))
          return d.id;
      })
      .attr("font-size", "14px")
      .attr("fill", "white")

    swedenSVG
      .selectAll("vals")
      .data(swedenRoot.leaves())
      .enter()
      .append("text")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .attr("x", function (d) { return d.x0 + 5 })
      .attr("y", function (d) { return d.y0 + 35 })
      .text(function (d) {
        if (outputText(d.id, d.x1 - d.x0, d.y1 - d.y0))
          return Math.round(d.value * 100) + '%';
      })
      .attr("font-size", "16px")
      .attr("fill", "white")

    quebecSVG
      .selectAll("rect")
      .data(quebecRoot.children)
      .enter()
      .append("rect")
      .attr("class", "treemap-tile")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "black")
      .style("fill", function (d) { return color(d.id) })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

    quebecSVG
      .selectAll("text")
      .data(quebecRoot.leaves())
      .enter()
      .append("text")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .attr("x", function (d) { return d.x0 + 5 })
      .attr("y", function (d) { return d.y0 + 20 })
      .text(function (d) {
        if (outputText(d.id, d.x1 - d.x0, d.y1 - d.y0))
          return d.id;
      })
      .attr("font-size", "14px")
      .attr("fill", "white")

    quebecSVG
      .selectAll("vals")
      .data(quebecRoot.leaves())
      .enter()
      .append("text")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
      .attr("y", function (d) { return d.y0 + 35 })    // +20 to adjust position (lower)
      .text(function (d) {
        if (outputText(d.id, d.x1 - d.x0, d.y1 - d.y0))
          return Math.round(d.value * 100) + '%';
      })
      .attr("font-size", "16px")
      .attr("fill", "white")
  });

  d3.select(".treemapContainer")
    .style("position", "absolute")
    .style("left", "50%")
    .style("margin-left", String(-width - margin.left) + "px")
    .style("top", "6700px")
}


/**
 * Removes the other states not used in this dataset.
 *
 * @param {object[]} data The data to be used
 */
function getFilteredData(data, country) {
  var filtered = data.filter(function (d) {
    if (d.Country === country)
      return true;
    return false;
  });
  filtered = createHierarchy(filtered, country);
  return filtered;
}

/** Creating treemap hierarchy
 * 
 * @param {*} data The data to be used to create hierarchy
 * @param {*} countryName The country that the data belongs to
 * @returns Data structure with proper hierarchy for treemap.
 */
function createHierarchy(data, countryName) {
  let hierarchyData = [{ Name: countryName, Value: null, parentId: null }]
  for (let i = 0; i < data.length; i++) {
    hierarchyData.push({ Name: data[i].Indicator, Value: data[i].Value, parentId: countryName });
  }
  return hierarchyData;
}

/** Determine whether the text will fit inside the treemap element.
 * 
 * @param {*} text The text that will be contained inside the treemap element
 * @param {*} width The width of the treemap element
 * @param {*} height The height of the treemap element
 * @returns The output text for the treemap element
 */
function outputText(text, width, height) {
  const canvas = outputText.canvas || (outputText.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  const metrics = context.measureText(text);
  let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  if (width > metrics.width && height > actualHeight)
    return true;
  return false;
}

/** Create a color scale to be used to create treemap elements.
 * 
 * @returns a D3 color scale.
 */
function createColorScale() {
  return d3.scaleOrdinal()
    .domain([
      "Impôts sur le revenu des particuliers",
      "Impôts sur les bénéfices des sociétés",
      "Cotisations sociales",
      "Impôts sur les salaires",
      "Impôts sur le patrimoine",
      "Impôts sur la consommation",
      "Autres impôts"
    ])
    .range(["#e17c05", "#5f4690", "#38a6a5", "#edad08", "#1d6996", "#0f8554", "#cc503e"])
}


/** Create the D3 Tooltip element.
 * 
 * @param {*} elementId The HTML id for the tooltip creation.
 * @returns A D3 tooltip
 */
function createTooltip(elementId) {
  return d3.select(elementId)
    .append("div")
    .style("opacity", 0)
    .attr("class", "d3-tip")
}