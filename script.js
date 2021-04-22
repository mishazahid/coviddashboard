// Options

function showReadMe(){
    document.getElementsByClassName('alert')[0].style.display='block';
}


var gray=false;
function grayScale(){
    //console.log("working GRAY")
    if(gray==true){
        document.getElementsByTagName("html")[0].style.filter = "grayscale(0)";
        gray=false;
        document.getElementById('grayScale').innerText="View in Gray Scale";
    }
    else{
        document.getElementsByTagName("html")[0].style.filter = "grayscale(1)";
        gray=true;
        document.getElementById('grayScale').innerText="View in Color Mode";
    }

}

// Legend

//make color as re the possible domain
var colorScale = d3.scaleThreshold()
    .domain([100,1000, 10000, 50000, 100000, 1000000, 3000000,10000000])
    .range(d3.schemeBlues[8]);


var svg = d3.select(".scale"),
    width = +svg.attr("width");

var legend = svg.selectAll(".legend")
    .data([100,1000, 10000, 50000, 100000, 1000000, 3000000,10000000])//hard coding the labels as the datset may have or may not have but legend should be complete.
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// draw legend colored rectangles
legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d){return colorScale(d)});

// draw legend text
legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return "<"+ d;});



// Map

var countryCode = "AUS";


var tooltipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// The svg
var svg = d3.select("#worldMap"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(170)
    .center([0,70])
    .translate([width / 2, height / 3.5]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([100,1000, 10000, 50000, 100000, 1000000, 3000000,10000000])
    .range(d3.schemeBlues[8]);

var n; var x;

//  console.log(csv_data);

function render(data){
    n = d3.nest()
        .key(function (d){ return d.code; })
        .entries(data);
}


function type(d){
    d.jan = +d.jan;
    d.feb = +d.feb;
    d.mar = +d.mar;
    d.apr = +d.apr;
    d.may = +d.may;
    d.jun = +d.jun;
    d.jul = +d.jul;
    d.aug = +d.aug;
    d.sep = +d.sep;
    d.oct = +d.oct;
    d.nov = +d.nov;
    d.dec = +d.dec;

    return d;
}

d3.csv("monthlyData.csv", type, render);

// Load external data and boot
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .await(ready);

function ready(error, topo) {

    let mouseOver = function(d) {

        //   console.log(d.properties.name)

        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .5)
            .style("cursor","hand")
        d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "black")

        // console.log(d)

        var sliderVal = document.getElementById("slider").value;
        var cases;
        console.log(sliderVal)

        function myFunction(item){
            //   console.log(d.id)
            if(item.key==d.id){
                //   console.log(item.values[0].nov)
                //   val = item.values[0].nov

                switch (sliderVal) {

                    case "1": cases = item.values[0].jan;
                        break;
                    case "2": cases = item.values[0].feb
                        break;
                    case "3": cases = item.values[0].mar
                        break;
                    case "4": cases = item.values[0].apr
                        break;
                    case "5": cases = item.values[0].may
                        break;
                    case "6": cases = item.values[0].jun
                        break;
                    case "7": cases = item.values[0].jul
                        break;
                    case "8": cases = item.values[0].aug
                        break;
                    case "9": cases = item.values[0].sep
                        break;
                    case "10": cases = item.values[0].oct
                        break;
                    case "11": cases = item.values[0].nov
                        break;
                    case "12": cases = item.values[0].dec
                        break;

                }
            }
        }

        n.forEach(myFunction)

        // tooltipDiv.html("<b style='font-size: 16px'>"+d.properties.name + "</br>"+
        //     "</b> <span style='color: red;font-weight: bold' >"+ cases + " Cases </span>")
        console.log(cases)

        tooltipDiv.transition()
            .duration(200)
            .style("opacity", .9);
        tooltipDiv.html("<b style='font-size: 16px;font-weight:bolder;'>"+d.properties.name + "</br>"+
            "</b> <span id='casesNum' style='color: #196dde;font-weight: bold; font-size: 14px' >"+ cases + " Cases </span>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }

    let mouseLeave = function(d) {
        d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .8)
        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "transparent")

        d3.select(".tooltip").transition()
            .duration(500)
            .style("opacity", 0);
    }

    let click = function(d){
        d3.select("#lineGraph").selectAll("*").remove();
        d3.select("#countryStats").selectAll("*").remove();
        countryCode = d.id;
        load();
        loadCountryStats();
        d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "transparent")
        console.log("clicked", d.id)
        //   console.log(countryCode)
    }
    console.log(n)


    // Draw the map
    svg.append("g")
        .selectAll("#worldMap path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            //    console.log(data)
            var val = 0;

            function myFunction(item){
                if(item.key==d.id){
                    //      console.log(item.values[0].nov)
                    val = item.values[0].jul
                }
            }

            n.forEach(myFunction)
            // console.log(d.total)
            return colorScale(val);
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
        .on("click",click);


    d3.select("#slider").on("change", function change() {
        var value = this.value;
        var val;
        d3.selectAll("#sliderMap path").style("fill", function(d) {

            //    console.log(value);

            function myFunction(item){
                //   console.log(d.id)
                if(item.key==d.id){
                    //   console.log(item.values[0].nov)
                    //   val = item.values[0].nov

                    switch (value) {

                        case "1": val = item.values[0].jan;
                            break;
                        case "2": val = item.values[0].feb
                            break;
                        case "3": val = item.values[0].mar
                            break;
                        case "4": val = item.values[0].apr
                            break;
                        case "5": val = item.values[0].may
                            break;
                        case "6": val = item.values[0].jun
                            break;
                        case "7": val = item.values[0].jul
                            break;
                        case "8": val = item.values[0].aug
                            break;
                        case "9": val = item.values[0].sep
                            break;
                        case "10": val = item.values[0].oct
                            break;
                        case "11": val = item.values[0].nov
                            break;
                        case "12": val = item.values[0].dec
                            break;

                    }


                }
            }

            n.forEach(myFunction)

            // console.log(val);
            return colorScale(val);

        })});
}


// Line Graph

function load() {
    // prompt("Hello");
    d3.select("#lineGraph").selectAll("*").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 520 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#lineGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .on("mouseover",function(d){
            d3.selectAll(".grid line").style('stroke-opacity','0.7');
        })
        .on("mouseout",function(d){
            d3.selectAll(".grid line").style('stroke-opacity','0');
        });

    var y = d3.scaleLinear().range([height, 0]);
    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(5)
    }

    //Read the data
    d3.csv("lineGraph.csv",

        // When reading the csv, I must format variables:
        function (d) {

            if(d.countryterritoryCode==countryCode){

                return {

                    date: d3.timeParse("%Y-%m-%d")(d.date), value: d.cases, code: d.countryterritoryCode
                }}
        },

        // Now I can use this dataset:
        function (data) {

            console.log(data);
            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) {
                    return d.date;
                }))
                .range([0, width]);
            xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")").attr('stroke-width', 0.25).attr("class", "xAxis")
                .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));

            // text label for the x axis
            svg.append("text")
                .attr("transform",
                    "translate(" + (width/2) + " ," +
                    (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .style("fill","#050543")
                .style("font","12px sans-serif")
                .text("Date (2020)");


            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return +d.value;
                })])
                .range([height, 0]);

            // add the Y gridlines
            svg.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                )

            yAxis = svg.append("g")
                .call(d3.axisLeft(y)).attr('stroke-width', 0);

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .attr("class","yLabel")
                .style("text-anchor", "middle")
                .style("fill","#050543")
                .style("font","12px sans-serif")
                .text("New Cases");


            // Add a clipPath: everything out of this area won't be drawn.
            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0);

            // Add brushing
            var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
                .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

            // Create the line variable: where both the line and the brush take place
            var line = svg.append('g')
                .attr("clip-path", "url(#clip)")

            // Add the line
            line.append("path")
                .datum(data)
                .attr("class", "line")  // I add the class line to be able to modify this line later on.
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.date)
                    })
                    .y(function (d) {
                        return y(d.value)
                    })

                )

            // Add the brushing
            line
                .append("g")
                .attr("class", "brush")
                .call(brush);

            // A function that set idleTimeOut to null
            var idleTimeout

            function idled() {
                idleTimeout = null;
            }

            // A function that update the chart for given boundaries
            function updateChart() {

                // What are the selected boundaries?
                extent = d3.event.selection

                // If no selection, back to initial coordinate. Otherwise, update X axis domain
                if (!extent) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                    x.domain([4, 8])
                } else {
                    x.domain([x.invert(extent[0]), x.invert(extent[1])])
                    line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                }

                // Update axis and line position
                xAxis.transition().duration(1000).call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d/%m")))
                line
                    .select('.line')
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.date)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })

                    )
            }

            // If user double click, reinitialize the chart
            svg.on("dblclick", function () {
                x.domain(d3.extent(data, function (d) {
                    return d.date;
                }))
                xAxis.transition().call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")))
                line
                    .select('.line')
                    .transition()
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.date)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })

                    )
            });

        })

}

function loadDeaths() {
    // prompt("Hello");
    d3.select("#lineGraph").selectAll("*").remove();
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 520 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#lineGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("lineGraph.csv",

        // When reading the csv, I must format variables:
        function (d) {

            if(d.countryterritoryCode==countryCode){

                return {

                    date: d3.timeParse("%Y-%m-%d")(d.date), value: d.deaths, code: d.countryterritoryCode
                }}
        },

        // Now I can use this dataset:
        function (data) {

            console.log(data);
            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) {
                    return d.date;
                }))
                .range([0, width]);
            xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")").attr('stroke-width', 0.25).attr("class", "xAxis")
                .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));

            // text label for the x axis
            svg.append("text")
                .attr("transform",
                    "translate(" + (width/2) + " ," +
                    (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .style("fill","#050543")
                .style("font","12px sans-serif")
                .text("Date (2020)");



            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return +d.value;
                })])
                .range([height, 0]);
            yAxis = svg.append("g")
                .call(d3.axisLeft(y)).attr('stroke-width', 0);

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .attr("class","yLabel")
                .style("text-anchor", "middle")
                .style("fill","#050543")
                .style("font","12px sans-serif")
                .text("New Deaths");


            // Add a clipPath: everything out of this area won't be drawn.
            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0);

            // Add brushing
            var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
                .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

            // Create the line variable: where both the line and the brush take place
            var line = svg.append('g')
                .attr("clip-path", "url(#clip)")

            // Add the line
            line.append("path")
                .datum(data)
                .attr("class", "line")  // I add the class line to be able to modify this line later on.
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.date)
                    })
                    .y(function (d) {
                        return y(d.value)
                    })

                )

            // Add the brushing
            line
                .append("g")
                .attr("class", "brush")
                .call(brush);

            // A function that set idleTimeOut to null
            var idleTimeout

            function idled() {
                idleTimeout = null;
            }

            // A function that update the chart for given boundaries
            function updateChart() {

                // What are the selected boundaries?
                extent = d3.event.selection

                // If no selection, back to initial coordinate. Otherwise, update X axis domain
                if (!extent) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                    x.domain([4, 8])
                } else {
                    x.domain([x.invert(extent[0]), x.invert(extent[1])])
                    line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                }

                // Update axis and line position
                xAxis.transition().duration(1000).call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d/%m")))
                line
                    .select('.line')
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.date)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })

                    )
            }

            // If user double click, reinitialize the chart
            svg.on("dblclick", function () {
                x.domain(d3.extent(data, function (d) {
                    return d.date;
                }))
                xAxis.transition().call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")))
                line
                    .select('.line')
                    .transition()
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.date)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })

                    )
            });

        })

}


// Stats

function loadCountryStats() {
    //Read the data
    d3.csv("countryStats.csv",

        // When reading the csv, I must format variables:
        function (d) {

            if (d.countryterritoryCode == countryCode) {

                return {
                    totalCases: d.totalCases, totalDeaths: d.totalDeaths, country: d.country
                }
            }
        },

        // Now I can use this dataset:
        function (data) {
            console.log(data);
            d3.select("#countryStats").append("div")
                .data(data)
                .html(function(d){
                    return "<div id='countryName'>"+d.country+"</div>"+
                        "<div id='countryNumbers'>" + "<pre class='tab'>"+
                        "<div style='float:left;width:50%'><span class='countryLabel'>CASES </span>"+
                        "<span class='countryNumber' >" + d.totalCases + "</span>" + "</div>" +
                        "<div style='float:right;width:50%'><span class='countryLabel'>DEATHS </span>"+
                        "<span class='countryNumber' id='red'>" + d.totalDeaths + "</span>"+ "</pre>"+
                        "</div>"


                })
        });
}


// Bar Graph

function barGraphLoad(value) {

    console.log(value);

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 550 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#barGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .style('pointer-events','all');

    // Initialize the X axis
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "myXaxis")

    // Initialize the Y axis
    var y = d3.scaleLinear()
        .range([height, 0]);
    var yAxis = svg.append("g")
        .attr("class", "myYaxis")


    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    // A function that create / update the plot for a given variable:
    function update(selectedVar) {

        // Parse the Data
        d3.csv("topStats.csv", function (data) {

            //  console.log(data)

            // X axis
            x.domain(data.map(function (d) {
                return d.code;
            }))
            xAxis.transition().duration(1000).call(d3.axisBottom(x))

            // Add Y axis
            y.domain([0, d3.max(data, function (d) {
                return +d[selectedVar]
            })]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            // variable u: map data to existing bars
            var u = svg.selectAll("#barGraph rect")
                .data(data)

            // update bars
            u
                .enter()
                .append("rect")
                .merge(u)
                .on("mouseover",function (d){
                    d3.select(this).attr("fill","#84BADA");

                    tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        //.html((d.code) + "<br>"  + (d[selectedVar]));
                        .html("<b style='font-size: 16px;font-family:sans-serif'>"+(d.code) + "</br>"+
                            "</b> <span id='casesNum' style='color: #196dde;font-family:sans-seriffont-size: 14px' >"+(d[selectedVar]));
                })
                .on("mouseout", function(d){ tooltip.style("display", "none");
                    d3.select(this).attr("fill","#3566A5")})
                .transition()
                .duration(1000)
                .attr("x", function (d) {
                    return x(d.code);
                })
                .attr("y", function (d) {
                    return y(d[selectedVar]);
                })
                .attr("width", x.bandwidth())
                .attr("height", function (d) {
                    return height - y(d[selectedVar]);
                })
                .attr("fill", "#3566A5")


        })

    }

    d3.select("#casesBtn").on("click", function change() {
        update('cases')
    });

    d3.select("#deathsBtn").on("click", function change() {
        update('cases')
    });


    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'Cases';
    button.className = 'button button1';

    button.onclick = function() {
        update('cases');
    };

    var container = document.getElementById('barGraphBtns');
    container.appendChild(button);


    var button1 = document.createElement('button');
    button1.type = 'button';
    button1.innerHTML = 'Deaths';
    button1.className = 'button button2';

    button1.onclick = function() {
        update('deaths');
    };


    container.appendChild(button1);


    // Initialize plot
    update('cases')
}

