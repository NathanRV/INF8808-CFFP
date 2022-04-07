//import { loadJsonFile } from 'load-json-file';
import d3 from "d3";
import { geoPath } from "d3-geo";
import albersUsa from "d3-geo/src/projection/albersUsa";

export function load() {
    /*var projection = albersUsa();

    var path = geoPath(projection);*/
    var quebec = require('./quebec.json');

    var svg = d3.select("body").append("svg").attr("alllo");

    //d3.select("body").append("p").text("allo");

    /*svg.selectAll("path")
        .data(quebec.features)
        .enter()
        .append("path")
        .attr("d", path);*/

}