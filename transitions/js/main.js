var margin = {top: 10, right: 10, bottom: 100, left:200};
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var flag = true;

var svg = d3.select("#chart-area")

.append("svg")

	.attr("width", width + margin.left + margin.right)

	.attr("height", height + margin.top + margin.bottom)

	var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleBand().range([0, width]).padding(0.2);
var y = d3.scaleLinear().range([height, 0]);

var xAxisGroup = g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "left axis");

var yLabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -100)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("fill", "white")
    .text("Revenue");

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text("Month");


d3.json("data/revenues.json").then((data)=> {

	data.forEach((d)=>{

		d.revenue = +d.revenue;
		d.profit = +d.profit;
	});

    d3.interval(( ) => {

        var newData = flag ? data : data.slice(1);
    
        update(newData);
    
        flag = !flag;
    
    }, 1000);

    update(data);
}).catch((error) => {
    console.log(error);
});

function update(data) {
    var value = flag ? "revenue" : "profit";

	x.domain(data.map((d) => { return d.month; }));
    y.domain([0, d3.max(data, (d) => { return d[value]; })]);

	var bottomAxis = d3.axisBottom(x);
    var leftAxis = d3.axisLeft(y).tickFormat((d) => "$ " + d + "k");

	xAxisGroup.call(bottomAxis)
	.selectAll("text")
	.attr("x", 15)
	.attr("y", 10)
	.attr("text-anchor", "end")
	.attr("font-size", "15px")
	.attr("fill", "white");

yAxisGroup.call(leftAxis)
	.selectAll("text")
	.attr("font-size", "15px")
	.attr("fill", "white");

    var rects = g.selectAll("rect").data(data, (d) => d.month);
    rects.exit().remove();


    rects.attr("x", (d) => { return x(d.month); })
        .attr("y", (d) => { return y(d[value]); })
        .attr("width", x.bandwidth())
        .attr("height", (d) => { return height - y(d[value]); })
        .attr("fill", "yellow");

	rects.enter().append("rect")
	.attr("x", (d) => { return x(d.month); })
	.attr("y", (d) => { return y(d[value]); })
	.attr("width", x.bandwidth())
	.attr("height", (d) => { return height - y(d[value]); })
	.attr("fill", "yellow");

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);
}




	
