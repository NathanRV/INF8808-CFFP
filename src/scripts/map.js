import { geoPath } from "d3-geo"
import { geoMercator } from "d3-geo"

export function load() {

    drawMap(require('./quebec.json'), "#001F97", [-40.708879, 55.579611], "quebec")
    drawMap(require('./sweden.json'), "#FFCD00", [15.368631, 62.346091], "sweden")


    function drawMap(data, color, coordinate, place) {
        d3.select('#map')
            .select("." + place + "-map-svg")
            .attr('width', 800)
            .attr('height', 625)

        d3.select('.graph')
            .select('svg')
            .append('g')
            .attr('id', place + '-map-g')
            .attr('width', 800)
            .attr('height', 625)

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
    }

}