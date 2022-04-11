import { select } from "d3"
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

const populationQuebec = 8.485
const populationSweden = 10.35

export function load() {

    drawMap(require('./quebec.json'), "#001F97", [-49.708879, 51.75], "quebec", dimensionQuebec, coordLineQuebec1, coordLineQuebec2, textCoordQuebec, "1 542 056 km2")
    drawMap(require('./sweden.json'), "#FFCD00", [50, 61.0], "sweden", dimensionSweden, coordLineSweden1, coordLineSweden2, textCoordSweden, "450 295 km2")

    drawPictogram("quebec", 200, 300, populationQuebec)
    drawPictogram("sweden", 200, 300, populationSweden)

    function drawPictogram(place, width, height, population) {

        const nbPerson = Math.floor(population) + 1

        var svg = d3.select("." + place + "-pictogram")
            .append('svg')
            .attr("width", width)
            .attr("height", height)

        var person = svg.append("defs")
            .append("g")
            .attr("id", "personIcon")

        person.append("path")
            .attr("d", "M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z")
            .attr("transform", "translate(0,0) scale(3)")


        var y = d3.scaleBand()
            .range([0, 150])
            .domain(d3.range(Math.round(nbPerson / 2)));

        var x = d3.scaleBand()
            .range([0, 50])
            .domain(d3.range(2));

        data = d3.range(nbPerson);

        var container = svg.append("g")

        console.log(container.selectAll("use")
            .data(data)
            .enter().append("use")
            .attr("xlink:href", "#personIcon")
            .attr("id", function(d) { return "id" + d; })
            .attr('x', function(d) { return x(d % 2); })
            .attr('y', function(d) { return y(Math.floor(d / 2)); })
            .attr('fill', "black"))
    }

    function drawMap(data, color, coordinate, place, dimension, coordLine1, coordLine2, textCoord, size) {

        d3.select("." + place + "-map-svg")
            .attr('width', dimension.width)
            .attr('height', dimension.height)
            .append('g')
            .attr('id', place + '-map-g')
            .append("text")
            .attr("x", textCoord.x)
            .attr("y", textCoord.y)
            .text(size)

        drawLine("." + place + "-graph", coordLine1)
        drawLine("." + place + "-graph", coordLine2)

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