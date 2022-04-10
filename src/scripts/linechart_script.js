export function load() {

        var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
        d3.csv('./PIB_habitant_1980-2021_sw_can_ocde.csv').then(function (data) {
                swedenData = getFilteredData(data, 'SWE');
                quebecData = getFilteredData(data, 'CAN');


        });
}


/**
 * Removes the other states not used in this dataset.
 *
 * @param {object[]} data The data to be used
 */
 function getFilteredData(data, country){
  var filtered = data.filter(function(d){
      if (d.LOCATION === country)
          return true;
      return false;
  });
  return filtered;
}