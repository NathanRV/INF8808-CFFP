const width = 530
const height = 400
const lineChartText = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

export function load() {
    var div = d3.select(".text-container")
        .style("width", String(width) + "px")
        .style("height", String(height) + "px")
        .style("background", "red")
        .style("position", "fixed")
        .style("right", String(window.innerWidth / 2 + 45) + "px")
        .style("top", "250px")
        .style("display", "none")

    var ticking = false

    window.addEventListener('scroll', function (e) {

        const windowWidth = this.window.innerWidth
        const posScroll = document.documentElement.scrollTop
        console.log(posScroll)

        if (posScroll > 2700 && posScroll < 3100) {

            div.style("display", "block")
            div.style("opacity", String((posScroll - 2700) / 4) + "%")


        } else if (posScroll >= 3100 && posScroll < 3300) {

            div.style("display", "block")

        } else if (posScroll >= 3300 && posScroll < 3600) {

            div.style("display", "block")
            div.style("opacity", String(-(posScroll - 3600) / 3) + "%")

        } else if (posScroll >= 3600 && posScroll < 3650) {

            div.style("display", "none")

        } else if (posScroll >= 3650 && posScroll < 3950) {

            div.style("display", "block")
            div.style("height", "300px")
            div.style("width", "1100px")
            div.style("left", "50%")
            div.style("margin-left", "-525px")
            div.style("position", "absolute")
            div.style("top", "4615px")
            div.style("opacity", String((posScroll - 3650) / 3) + "%")

        } else if (posScroll >= 3950 && posScroll < 4200) {

            div.style("display", "block")

        } else if (posScroll >= 4200 && posScroll < 4900) {

            div.style("display", "block")
            div.style("opacity", String(-(posScroll - 4900) / 7) + "%")

        } else if (posScroll >= 5100 && posScroll < 5400) {

            div.style("display", "block")
            div.style("top", "6100px")
            div.style("opacity", String((posScroll - 5100) / 3) + "%")

        } else if (posScroll >= 5400 && posScroll < 5700) {

            div.style("display", "block")

        } else if (posScroll >= 5700 && posScroll < 6300) {

            div.style("opacity", String(-(posScroll - 6300) / 6) + "%")

        } else if (posScroll >= 6300 && posScroll < 6600) {

            div.style("top", "7265px")
            div.style("width", "1080px")
            div.style("opacity", String((posScroll - 6300) / 3) + "%")

        } else {
            div.style("display", "block")
        }

        if (!ticking) {
            window.requestAnimationFrame(function () {
                ticking = false;
            });
        }

        ticking = true;
    });
}