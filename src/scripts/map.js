import { geoPath } from "d3-geo"
import { geoMercator } from "d3-geo"

const coordLineQuebec1 = {
    x1: 100,
    x2: 130,
    y1: 370,
    y2: 370
}

const coordLineQuebec2 = {
    x1: 130,
    x2: 140,
    y1: 370,
    y2: 310
}

const coordLineSweden1 = {
    x1: 140,
    x2: 160,
    y1: 60,
    y2: 10
}

const coordLineSweden2 = {
    x1: 160,
    x2: 180,
    y1: 10,
    y2: 10
}

const dimensionQuebec = {
    width: 395,
    height: 380
}

const dimensionSweden = {
    width: 272,
    height: 385
}

const textCoordQuebec = {
    x: 0,
    y: 375
}

const textCoordSweden = {
    x: 185,
    y: 15
}

export function load() {


    drawMap(require('./quebec.json'), "#001F97", [-49.708879, 51.75], "quebec", dimensionQuebec, coordLineQuebec1, coordLineQuebec2, textCoordQuebec, "1 542 056 km2")
    drawMap(require('./sweden.json'), "#FFCD00", [50, 61.0], "sweden", dimensionSweden, coordLineSweden1, coordLineSweden2, textCoordSweden, "450 295 km2")

    function drawMap(data, color, coordinate, place, dimension, coordLine1, coordLine2, textCoord, size) {

        d3.select("#" + place + "-map")
            .select("." + place + "-map-svg")
            .attr('width', dimension.width)
            .attr('height', dimension.height)

        d3.select("." + place + "-graph")
            .select('svg')
            .append('g')
            .attr('id', place + '-map-g')

        drawLine("." + place + "-graph", coordLine1)
        drawLine("." + place + "-graph", coordLine2)

        d3.select("." + place + "-graph")
            .select('svg')
            .append("text")
            .attr("x", textCoord.x)
            .attr("y", textCoord.y)
            .text(size)

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
            .style("width", String(dimension.width) + "px")
    }

    function drawLine(className, coord) {
        d3.select(className)
            .select('svg')
            .append('line')
            .attr("x1", coord.x1)
            .attr("y1", coord.y1)
            .attr("x2", coord.x2)
            .attr("y2", coord.y2)
            .attr("style", "stroke:black")
    }
}