/*
*    main.js
*/


var margin = { top: 10, right: 10, bottom: 100, left: 100 };
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


var x = d3.scaleLog()
    .domain([142, 150000])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, 90])
    .range([height, 0]);

var area = d3.scaleLinear()
    .domain([2000, 1400000000])
    .range([25 * Math.PI, 1500 * Math.PI]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");


g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per capita ($)");

g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy (Years)");

var yearLabel = g.append("text")
    .attr("class", "year-label")
    .attr("x", width - 50)
    .attr("y", height - 10)
    .attr("font-size", "40px")
    .attr("text-anchor", "end")
    .text("1800");


    var tip = d3.tip().attr("class", "d3-tip").html((d) => {
        return `
            <strong>Country:</strong> ${d.country}<br>
            <strong>Continent:</strong> ${d.continent}<br>
            <strong>Income:</strong> ${d3.format("$,.0f")(d.income)}<br>
            <strong>Life Expectancy:</strong> ${d.life_exp}<br>
            <strong>Population:</strong> ${d3.format(",.0f")(d.population)}
        `;
    });
    g.call(tip);

    var formattedData, yearIndex = 0, interval, isPlaying = false, continentFilter = "all";


d3.json("data/data.json").then(function(data) {
     formattedData = data.map((year) => {
        return year["countries"].filter((country) => {
            var dataExists = (country.income && country.life_exp);
            return dataExists;
        }).map((country) => {
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            country.population = +country.population;
            return country;
        });
    });

    var continents = Array.from(new Set(formattedData.flatMap((year) => year.map((d) => d.continent))));
    continents.forEach((continent) => {
        d3.select("#continent-filter").append("option").attr("value", continent).text(continent);
    });

    $("#year-slider").slider({
        min: 0,
        max: formattedData.length - 1,
        step: 1,
        slide: (event, ui) => {
            yearIndex = ui.value;
            update(formattedData[yearIndex]);
        }
    });

    d3.select("#play-pause").on("click", () => {
        if (isPlaying) {
            clearInterval(interval);
            d3.select("#play-pause").text("Play");
        } else {
            interval = setInterval(step, 1000);
            d3.select("#play-pause").text("Pause");
        }
        isPlaying = !isPlaying;
    });

    d3.select("#reset").on("click", () => {
        yearIndex = 0;
        update(formattedData[yearIndex]);
        $("#year-slider").slider("value", yearIndex);
    });

    d3.select("#continent-filter").on("change", function() {
        continentFilter = this.value;
        update(formattedData[yearIndex]);
    });


    update(formattedData[0]);
}).catch(function(error) {
    console.log(error);
});

function step() {
    yearIndex = (yearIndex + 1) % formattedData.length;
    update(formattedData[yearIndex]);
    $("#year-slider").slider("value", yearIndex);
}


function update(data) {
    var filteredData = continentFilter === "all" ? data : data.filter((d) => d.continent === continentFilter);

    var xAxisCall = d3.axisBottom(x)
        .tickValues([400, 4000, 40000])
        .tickFormat(d3.format("$"));
    xAxisGroup.call(xAxisCall);

    var yAxisCall = d3.axisLeft(y);
    yAxisGroup.call(yAxisCall);

    var circles = g.selectAll("circle").data(filteredData, (d) => d.country);
    circles.exit().transition().duration(500).attr("r", 0).remove();


		circles.transition().duration(500)
        .attr("cx", (d) => x(d.income))
        .attr("cy", (d) => y(d.life_exp))
        .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI))
        .attr("fill", (d) => color(d.continent));

        circles.enter().append("circle")
        .attr("cx", (d) => x(d.income))
        .attr("cy", (d) => y(d.life_exp))
        .attr("r", 0)
        .attr("fill", (d) => color(d.continent))
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .transition().duration(500)
        .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));


    yearLabel.text(data[0].year);
}