var margin = {top: 10, right: 10, bottom: 100, left:100};
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
d3.json("data/revenues.json").then((data)=> {

	data.forEach((d)=>{

		d.revenue = +d.revenue;
	});

	console.log(data);

	var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
	
	var x = d3.scaleBand()
	.domain(data.map((d)=>{return d.month;}))
	.range([0, width])
	.paddingInner(0.3)
	.paddingOuter(0.3);

	var y = d3.scaleLinear()
	.domain([0,828])
	.range([height,0]);



	var rects = g.selectAll("rect").data(data);

	rects.enter().append("rect")
	.attr("x", (d)=>{ return x(d.month); })
	.attr("y", (d) => { return y(d.revenue); })
	.attr("width", x.bandwidth())
	.attr("height", (d)=>{ return height - y(d.revenue); })

	var bottomAxis = d3.axisBottom(x);
	g.append("g")
	.attr("class", "bottom axis")
	.attr("transform", "translate(0, " + height + ")")
	.call(bottomAxis)
	.selectAll("text")
	.attr("x", -5)
	.attr("y", 10)
	.attr("text-anchor", "end")
	.attr("transform", "rotate(-40)");

	var leftAxis = d3.axisLeft(y)
	.ticks(5)
	.tickFormat((d) => d + "m");
g.append("g")
	.attr("class", "left axis")
	.call(leftAxis);

	g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width / 2)
	.attr("y", height + 100)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("The world's tallest buildings");


	g.append("text")
	.attr("class", "y axis-label")
	.attr("x", -(height / 2))
	.attr("y", -60)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Height (m)");

});



	
