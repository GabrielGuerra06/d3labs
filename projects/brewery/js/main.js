var margin = {top: 10, right: 10, bottom: 100, left:200};
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
d3.json("data/revenues.json").then((data)=> {

	data.forEach((d)=>{

		d.revenue = +d.revenue;
	});

	console.log(data);

	var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right + 100)
	.attr("height", height + margin.top + margin.bottom)


    var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
	
	var x = d3.scaleBand()
	.domain(data.map((d)=>{return d.month;}))
	.range([0, width])
	.paddingInner(0.3)
	.paddingOuter(0.3);

	var y = d3.scaleLinear()
	.domain([0,50000])
	.range([height,0]);



	var rects = g.selectAll("rect").data(data);

	rects.enter().append("rect")
	.attr("x", (d)=>{ return x(d.month); })
	.attr("y", (d) => { return y(d.revenue); })
	.attr("width", x.bandwidth())
	.attr("height", (d)=>{ return height - y(d.revenue); })
	.attr("fill", "yellow");


	var bottomAxis = d3.axisBottom(x);
	g.append("g")
	.attr("class", "bottom axis")
	.attr("transform", "translate(0, " + height + ")")
	.call(bottomAxis)
	.selectAll("text")
	.attr("x", 15)
	.attr("y", 10)
	.attr("text-anchor", "end")
	.attr("font-size", "15px")
	.attr("fill", "white");

	var leftAxis = d3.axisLeft(y)
	.tickFormat((d) => "$ " + d + "k");
g.append("g")
	.attr("class", "left axis")
	.call(leftAxis)
	.attr("font-size", "15px")
	.attr("fill", "white");

g.selectAll(".left.axis .tick text")
	.attr("fill", "white");

	g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width / 2)
	.attr("y", height + 50)
	.attr("font-size", "30px")
	.attr("text-anchor", "middle")
	.attr("fill", "white")
	.text("Month");


	g.append("text")
	.attr("class", "y axis-label")
	.attr("x", -(height / 2))
	.attr("y", -100)
	.attr("font-size", "30px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.attr("fill", "white")
	.text("Revenue (dlls.)");

});



	
