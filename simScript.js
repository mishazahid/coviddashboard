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
    .text(function(d) {
        var num;
        switch(d){
            case 100: num = "100"; break;
            case 1000: num = "1K"; break;
            case 10000: num = "10K"; break;
            case 50000: num = "50K"; break;
            case 100000: num = "100K"; break;
            case 1000000: num = "1000K"; break;
            case 3000000: num = "3000K"; break;
            case 10000000: num = "10000K"; break;
        }

        return "<"+ num;});



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
    .scale(180)
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
       // console.log(sliderVal)

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
        //console.log(cases)

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


    // console.log(n)


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
        .attr("fill",sliderChange("7"))
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave );




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



function sliderChange(a) {
   // console.log("a  "+a  )
    value = a;
    var val;
    //console.log("Value is" + value);
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

    })}

var time;
var counter = 0;

function startSim(){
    time =  setInterval(myTimer, 1200);
}

function stopSim(){
    clearInterval(time);
}

function myTimer() {
    counter++;
    if(counter==13){
        counter = 1;
        clearInterval(time);
    }
    a = counter.toString();
    document.getElementsByTagName("input")[0].value=a;
    sliderChange(a);
}

