

var svg = d3.select("#chart-area").append("svg")

	.attr("width", 400)

	.attr("height", 400);


    var circle = svg.append("circle")

	.attr("cx", 300)

	.attr("cy", 300)

	.attr("r", 100)

	.attr("fill", "green");


    var rect = svg.append("rect")

	.attr("x", 275)

	.attr("y", 275)

	.attr("width", 50)

	.attr("height", 50)

	.attr("fill","red");