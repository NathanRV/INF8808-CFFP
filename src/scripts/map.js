import { geoPath } from "d3-geo"
import { geoMercator } from "d3-geo"

export function load() {

    drawMap(require('./quebec.json'), "#001F97", [-40.708879, 51.75], "quebec", 285, 380)
    drawMap(require('./sweden.json'), "#FFCD00", [50, 60.5], "sweden", 170, 372)

    function drawMap(data, color, coordinate, place, width, height) {

        d3.select("#" + place + "-map")
            .select("." + place + "-map-svg")
            .attr('width', width)
            .attr('height', height)

        d3.select("." + place + "-graph")
            .select('svg')
            .append('g')
            .attr('id', place + '-map-g')

        var projection = geoMercator()
            .center(coordinate)
            .scale(700)

        var path = geoPath().projection(projection)

        d3.select("#" + place + '-map-g')
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", color)
            .style("stroke", color)

        d3.select("." + place + "-flag-svg")
            .style("width", "20px")

        d3.select("#" + place + "-title")
            .style("width", String(width) + "px")
    }
}