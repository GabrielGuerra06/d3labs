

d3.json("data/buildings.json").then((data)=> {

	data.forEach((d)=>{

		d.height = +d.height;
	});

	console.log(data);
	
	var svg = d3.select("#chart-area").append("svg")

	.attr("width", 800)

	.attr("height", 800);


    var buildings = svg.selectAll("rect").data(data);

	buildings.enter().append("rect")
	.attr("x", (d, i)=>{return (i*50)+25;})
	.attr("y", (d) => { return 800 - d.height; })
	.attr("width", 40)
	.attr("height", (d)=>{return d.height;})
	.attr("fill","blue");
});



	
