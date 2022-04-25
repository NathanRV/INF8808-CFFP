const rpfText = "La répartition des prélèvements fiscaux montre où les impôts prélevés dans les différents états seront acheminés. Cela varie considérablement d'un état à un autre, et aussi d'une année à l'autre, mais voici ce qu'il en est pour l'année 2020."
    + "<br><br>" + "Par exemple, en Suède, plus de la moitié des recettes fiscales (50,1 %) ont été perçues par l'administration fédérale, contre moins d'un tiers (31.5 %) au Québec. Dans le même sens, 37% des recettes fiscales ont servi à garnir les coffres des administrations locales en Suède, en comparaison avec seulement 9.1% au Québec. Au niveau de la sécurité sociale, c'est assez semblable, avec 12.6 % pour la Suède et 9.8 % pour le Québec."
    + "<br><br>" + "Là où ça diffère particulièrement entre ces deux états, c'est au niveau du prélèvement d'impôts au niveau provincial au Québec, qui représente presque la moitié (49.6 %) des recettes fiscales totales de cet état. En Suède,  il n'y a pas de niveau provincial, d'où la différence marquée dans les répartitions. On note aussi que la Suède compte elle aussi un niveau propre à elle, soit le supranational, représentant l'Union Européenne. Cependant, la proportion des prélèvements fiscaux au niveau supranational est presque négligeable, représentant uniquement 0.3 %."
    + "<br><br>" + "Bref, on observe des différences intéressantes lorsqu'on compare les proportions des prélèvements fiscaux de ces 2 états."
    + "<br><br>" + '<a href="https://cffp.recherche.usherbrooke.ca/wp-content/uploads/2022/01/Bilan2022.pdf" target="_blank"> Source </a>'

const cfnText = "La charge fiscale nette (CFN) est un indicateur servant à décrire le fardeau fiscale d'un particulier selon la situation de son ménage. Sa situation est décrite par la composition familiale, c'est-à-dire : "
    + "<br>&nbsp&nbsp&nbsp&nbsp&nbspcélibataire, couple sans enfants, famille monoparentale et famille biparentale; "
    + "<br>&nbsp&nbsp&nbsp&nbsp&nbspainsi que le niveau des revenus tirés de salaires en pourcentage du salaire moyen."
    + "<br><br>" + "Elle est calculée de la manière suivante :" + "<br>" + "CFN = [IR + CSP - PRP]/(R)" + "<br>" + "où R&nbsp&nbsp&nbsp&nbsp&nbspreprésente le revenu du particulier;"
    + "<br>" + "&nbsp&nbsp&nbsp&nbsp&nbspIR&nbsp&nbsp&nbsp&nbspreprésente la somme des impôts sur le revenu des particuliers;" + "<br>" + "&nbsp&nbsp&nbsp&nbsp&nbspCSP représente la somme des cotisations de sécurité sociale à la charge du particulier;"
    + "<br>" + "&nbsp&nbsp&nbsp&nbsp&nbspPRP représente les prestations reçues par le particulier." + "<br><br>" + '<a href="https://cffp.recherche.usherbrooke.ca/wp-content/uploads/2018/12/cr_2016-04_charge_fiscale_nette.pdf" target="_blank"> Source </a>'

const lineChartText = "Le produit intérieur brute (PIB) par habitant est un indicateur servant à décrire le pouvoir d'achat d'un habitant. Le produit intérieur brute par habitant peut augmenter lorsque la main d'oeuvre devient plus effiace. "
    + "<br> Avec l'avènement de la technologie, la productivité d'un individu a significativement augmenter."
    + "<br><br>" + "Ainsi, on s'attend à avoir une croissance dans cet indicateur tant qu'il a des avancements technologiques."
    + "Les industries au sein de l'économie d'un pays vont affecter le produit intérieur brute si les tendances mondiales commencent à changer. Par exemple, si un pays exploite beaucoup de pétrole, une transition vers l'énergie renouvelable va diminuer les revenus pétroliers et par association le PIB par habitant. "
    + "<br><br>" + '<a href="https://www.thebalance.com/gdp-per-capita-formula-u-s-compared-to-highest-and-lowest-3305848" target="_blank"> Source </a>'

const treeMapText = "Les structures fiscales d'un pays vont décrire comment les impots sont collectés par le gouvernement. "
    + "Chaque pays va définir un manière différente de collecter les impots selon les jurisdictions. La Suède et le Québec ont des répartitions très similaires l'une à l'autre. Cela peut être un indicateur de la mentalité de la population pour l'investissement publique ou la collecte des impots. "
    '<a href="https://cffp.recherche.usherbrooke.ca/wp-content/uploads/2022/01/Bilan2022.pdf" target="_blank"> Source </a>'

const treeMapTitle = "Structure Fiscale"
export function load() {
    var div = d3.select(".text-container")
        .style("width", "530px")
        .style("height", "400px")
        .style("position", "fixed")
        .style("right", String(window.innerWidth / 2 + 45) + "px")
        .style("top", "250px")
        .style("display", "none")
        .html(lineChartText)

    var ticking = false

    window.addEventListener('scroll', function (e) {

        const posScroll = document.documentElement.scrollTop

        // viz 2
        if (posScroll > 2700 && posScroll < 3150) {

            textUpdaterViz2()
            div.style("opacity", String((posScroll - 2700) / 4.5) + "%")


        } else if (posScroll >= 3150 && posScroll < 3250) {

            textUpdaterViz2()
            div.style("opacity", "100%")

        } else if (posScroll >= 3250 && posScroll < 3600) {

            textUpdaterViz2()
            div.style("opacity", String(-(posScroll - 3600) / 3.5) + "%")

        } else if (posScroll >= 3600 && posScroll < 3650) {

            div.style("display", "none")

            // viz 3
        } else if (posScroll >= 3650 && posScroll < 4000) {

            textUpdaterViz3()
            div.style("opacity", String((posScroll - 3650) / 3.5) + "%")

        } else if (posScroll >= 4000 && posScroll < 4200) {

            textUpdaterViz3()
            div.style("opacity", "100%")

        } else if (posScroll >= 4200 && posScroll < 4900) {

            textUpdaterViz3()
            div.style("opacity", String(-(posScroll - 4900) / 7) + "%")


            // viz 4
        } else if (posScroll >= 4900 && posScroll < 5250) {

            textUpdaterViz4()
            div.style("opacity", String((posScroll - 4900) / 3.5) + "%")

        } else if (posScroll >= 5250 && posScroll < 5450) {

            textUpdaterViz4()
            div.style("opacity", "100%")

        } else if (posScroll >= 5450 && posScroll < 6100) {

            textUpdaterViz4()
            div.style("opacity", String(-(posScroll - 6100) / 6.5) + "%")

            // viz 5
        } else if (posScroll >= 6100 && posScroll < 6400) {

            textUpdaterViz5()
            titleUpdaterViz5()
            div.style("opacity", String((posScroll - 6100) / 3) + "%")

        } else if (posScroll >= 6400) {
            textUpdaterViz5()
            div.style("opacity", "100%")

        } else {
            div.style("display", "none")
        }

        if (!ticking) {
            window.requestAnimationFrame(function () {
                ticking = false;
            });
        }

        ticking = true;
    });

    function textUpdaterViz2() {
        div.style("display", "block")
        div.style("position", "fixed")
        div.style("right", String(window.innerWidth / 2 + 45) + "px")
        div.style("margin-right", "0px")
        div.style("top", "250px")
        div.style("width", "530px")
        div.style("height", "400px")
        div.html(lineChartText)
    }

    function textUpdaterViz3() {
        div.style("display", "block")
        div.style("height", "300px")
        div.style("width", "1100px")
        div.style("right", "50%")
        div.style("margin-right", "-575px")
        div.style("position", "absolute")
        div.style("top", "4615px")
        div.html(rpfText)
    }

    function textUpdaterViz4() {
        div.style("display", "block")
        div.style("top", "5900px")
        div.html(cfnText)
    }

    function textUpdaterViz5() {
        div.style("display", "block")
        div.style("top", "7100px")
        div.style("width", "1080px")
        div.style("margin-right", "-552px")
        div.html(treeMapText)
    }
}
