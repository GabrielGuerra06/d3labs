

d3.json("data/buildings.json").then((data)=> {

	data.forEach((d)=>{

		d.height = +d.height;
	});

	console.log(data);
	
	var svg = d3.select("#chart-area").append("svg")

	.attr("width", 500)

	.attr("height", 500);

	
	var x = d3.scaleBand()

	.domain(data.map((d)=>{return d.name;}))

	.range([0, 400])

	.paddingInner(0.3)

	.paddingOuter(0.3);

	var y = d3.scaleLinear()

	.domain([0,828])

	.range([400,0]);

	var color = d3.scaleOrdinal()
	.domain(data.map((d) => { return d.name; }))
	.range(d3.schemeSet3);

    var buildings = svg.selectAll("rect").data(data);

	buildings.enter().append("rect")
	.attr("x", (d)=>{return x(d.name);})
	.attr("y", (d) => { return y(d.height); })
	.attr("width", x.bandwidth)
	.attr("height", (d)=>{return 400 - y(d.height);})
	.attr("fill",(d) => color(d.name));
});



	
