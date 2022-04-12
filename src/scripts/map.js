import { geoPath } from "d3-geo"
import { geoMercator } from "d3-geo"

const coordLineQuebec1 = {
    x1: 100,
    x2: 130,
    y1: 410,
    y2: 410
}

const coordLineQuebec2 = {
    x1: 130,
    x2: 140,
    y1: 410,
    y2: 350
}

const coordLineSwedenInit1 = {
    x1: 145,
    x2: 165,
    y1: 60,
    y2: 10
}

const coordLineSwedenInit2 = {
    x1: 165,
    x2: 185,
    y1: 10,
    y2: 10
}

const coordLineSwedenFinal1 = {
    x1: 200,
    x2: 220,
    y1: 60,
    y2: 10
}

const coordLineSwedenFinal2 = {
    x1: 220,
    x2: 240,
    y1: 10,
    y2: 10
}

const coordLineSwedenPicto1 = {
    x1: 19,
    x2: 30,
    y1: 340,
    y2: 410
}

const coordLineSwedenPicto2 = {
    x1: 30,
    x2: 80,
    y1: 410,
    y2: 410
}

const coordLineQuebecPicto1 = {
    x1: 430,
    x2: 440,
    y1: 20,
    y2: 80
}

const coordLineQuebecPicto2 = {
    x1: 430,
    x2: 390,
    y1: 20,
    y2: 20
}

const coordPictoSweden = {
    x: 0,
    y: 180,
}

const coordPictoQuebec = {
    x: 420,
    y: 90,
}

const dimensionQuebecInit = {
    width: 395,
    height: 420
}

const dimensionQuebecFinal = {
    width: 460,
    height: 420
}

const dimensionSwedenInit = {
    width: 280,
    height: 420
}

const dimensionSwedenFinal = {
    width: 340,
    height: 420
}

const textCoordQuebec = {
    x: 0,
    y: 415
}

const textCoordSwedenInit = {
    x: 192.5,
    y: 15.5
}

const textCoordSwedenFinal = {
    x: 247.5,
    y: 15.5
}

const textCoordPictoQuebec = {
    x: 230,
    y: 22.5
}

const textCoordPictoSweden = {
    x: 87.5,
    y: 415
}

const textCoordLegend = {
    x: 20,
    y: 17.5
}

const coordSwedenInit = [50, 61.0]
const coordSwedenFinal = [45, 61.0]

const populationQuebec = 8.485
const populationSweden = 10.35

const personIconPath = "M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z"

export function load() {

    var svgQuebec = createCountrySvg("quebec", dimensionQuebecInit)
    var svgSweden = createCountrySvg("sweden", dimensionSwedenInit)

    d3.select(".quebec-graph").style("margin-left", String(-dimensionQuebecInit.width / 2) + "px")
    d3.select(".sweden-graph").style("margin-right", String(-dimensionSwedenInit.width / 2) + "px")

    drawPictogram(svgQuebec, populationQuebec, coordPictoQuebec, "quebec", coordLineQuebecPicto1, coordLineQuebecPicto2, "8,485 millions habitants", textCoordPictoQuebec)
    drawMap(svgQuebec, "quebec", "1 542 056 km2", textCoordQuebec, [-49.708879, 53.75], require('./quebec.json'), "#001F97", coordLineQuebec1, coordLineQuebec2, dimensionQuebecInit.width)


    drawPictogram(svgSweden, populationSweden, coordPictoSweden, "sweden", coordLineSwedenPicto1, coordLineSwedenPicto2, "10,35 millions habitants", textCoordPictoSweden)
    drawMap(svgSweden, "sweden", "450 295 km2", textCoordSwedenInit, coordSwedenInit, require('./sweden.json'), "#FFCD00", coordLineSwedenInit1, coordLineSwedenInit2, dimensionSwedenInit.width)

    drawLegend()

    var ticking = false

    window.addEventListener('scroll', function(e) {

        console.log(this.document.documentElement.scrollTop)
        const posScroll = this.document.documentElement.scrollTop

        if (posScroll > 0 && posScroll < 875) {

            d3.select(".sweden-graph")
                .style("display", "block")
                .style("position", "fixed")
                .style("right", String(50 - 15 * posScroll / 875) + "%")
                .style("top", String(950 - posScroll) + "px")

            d3.select(".quebec-graph")
                .style("left", String(50 - 15 * posScroll / 875) + "%")

        } else if (posScroll >= 875) {

            d3.select(".sweden-graph")
                .style("right", "35%")
                .style("top", "80px")

        } else {

            d3.select(".sweden-graph").style("display", "none")

        }

        if (!ticking) {
            window.requestAnimationFrame(function() {
                ticking = false;
            });
        }

        ticking = true;
    });

    function createCountrySvg(place, dimension) {
        const svg = d3.select("." + place + "-object")
            .append('svg')
            .attr("class", "." + place + "-map-svg")
            .attr("width", dimension.width)
            .attr("height", dimension.height)
        return svg
    }

    function drawLegend() {
        var svg = d3.select(".legend-picto")
            .append("svg")
            .attr("width", 165)
            .attr("height", 25)

        var person = svg.append("defs")
            .append("g")
            .attr("id", "personIconLegend")

        person.append("path")
            .attr("d", personIconPath)
            .attr("transform", "translate(0, 0) scale(3)")

        data = d3.range(1)

        var container = svg.append("g")

        container.selectAll("use")
            .data(data)
            .enter()
            .append("use")
            .attr("xlink:href", "#personIconLegend")
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', "black")

        var g = svg.append("g")

        drawText(g, textCoordLegend, "= 1 million d'habitants")
    }

    function drawMap(svg, place, size, textCoord, coordMap, data, color, coordLine1, coordLine2, width) {

        var g = svg.append('g')
            .attr('id', place + '-map-g')

        drawText(g, textCoord, size)

        var projection = geoMercator()
            .center(coordMap)
            .scale(700)

        var path = geoPath().projection(projection)

        d3.select("#" + place + "-map-g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", color)
            .style("stroke", color)

        d3.select("#" + place + "-title")
            .style("width", String(width) + "px")

        drawLine(svg, coordLine1, "")
        drawLine(svg, coordLine2, "")
    }

    function drawPictogram(svg, population, coordPicto, place, coordLine1, coordLine2, size, textCoord) {

        const nbPerson = Math.floor(population) + 1

        var person = svg.append("defs")
            .append("g")
            .attr("id", place + "personIcon")


        person.append("path")
            .attr("d", personIconPath)
            .attr("transform", "translate(" + String(coordPicto.x) + ", " + String(coordPicto.y) + ") scale(3)")

        var y = d3.scaleBand()
            .range([0, 150])
            .domain(d3.range(Math.round(nbPerson / 2)));

        var x = d3.scaleBand()
            .range([0, 50])
            .domain(d3.range(2));

        data = d3.range(nbPerson);

        var container = svg.append("g")
            .attr("class", "picto-country")

        container.selectAll("use")
            .data(data)
            .enter()
            .append("use")
            .attr("xlink:href", "#" + place + "personIcon")
            .attr("id", function(d) { return "id" + d; })
            .attr('x', function(d) { return x(d % 2); })
            .attr('y', function(d) { return y(Math.floor(d / 2)); })
            .attr('fill', "black")

        drawLine(svg, coordLine1, "picto-country")
        drawLine(svg, coordLine2, "picto-country")

        var g = svg.append('g')
            .attr("class", "picto-country")


        drawText(g, textCoord, size)
    }

    function drawText(g, coord, text) {
        g.append("text")
            .attr("x", coord.x)
            .attr("y", coord.y)
            .text(text)
    }

    function drawLine(svg, coord, className) {
        var line = svg.append('line')
            .attr("x1", coord.x1)
            .attr("y1", coord.y1)
            .attr("x2", coord.x2)
            .attr("y2", coord.y2)
            .attr("style", "stroke:black")
        if (className != "") line.attr("class", className)
    }
}