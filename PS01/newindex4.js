var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var width2 = document.getElementById('svg2').clientWidth;
var height2 = document.getElementById('svg2').clientHeight;

var width3 = document.getElementById('svg3').clientWidth;
var height3 = document.getElementById('svg3').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var marginLeft3 = 100;
var marginTop3 = 100;

var nestedData = [];

var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg3 = d3.select('#svg3')
    .append('g')
    .attr('transform', 'translate(' + marginLeft3 + ',' + marginTop3 + ')');


var albersProjection = d3.geoAlbers()
    .scale(150000)
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate([(width/2), (height/2)]);


path = d3.geoPath()
    .projection(albersProjection);


var scaleX = d3.scaleBand().rangeRound([0, width3-2*marginLeft3]).padding(0.1);
var scaleY = d3.scaleLinear().range([height3-2*marginTop3, 0]);


queue()
    .defer(d3.json, "./Boston.json")
    .defer(d3.json, "./Orange.json")
    .defer(d3.csv, "./circle1.csv")
    .defer(d3.csv, "./totalsubway.csv")
    .await(function(err, mapData,lineData,circleData,populationData){

        svg.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "feature")
            .attr('fill','white')
            .attr('opacity', 0.5)
            .attr('stroke','black')
            .attr('stroke-width',.2);


        svg2.background = 'none';

        svg2.selectAll("path")               //make empty selection
            .data(lineData.features)          //bind to the features array in the map data
            .enter()
            .append("path")                 //add the paths to the DOM
            .attr("d", path)                //actually draw them
            .attr("class", "feature")
            .attr('stroke', 'orange')
            .attr('stroke-width', 2)
            .attr('fill','none');

        svg2.selectAll('circle')
            .data(circleData)
            .enter()
            .append("circle")
            .attr('cx', function (d) {return d.cx})
            .attr('cy',function (d) {return d.cy})
            .attr('r', 5)
            .attr('fill', 'orange')
            .on('mouseover', function (d) {
                d3.select(this).attr('r', 8).attr('fill', 'red');
                d3.select('.textbox').text(d.station);
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('r', 5).attr('fill', 'orange');
            });


        nestedData = d3.nest()
            .key(function(d){return d.gender})
            .entries(populationData);

        var loadData = nestedData.filter(function(d){return d.key == 'female'})[0].values;

        console.log(nestedData);

        svg3.append("g")
            .attr('class','xaxis')
            .attr('transform','translate(0,'+ (height3-2*marginTop3) +')')
            .call(d3.axisBottom(scaleX));

        svg3.append("g")
            .attr('class', 'yaxis')
            .call(d3.axisLeft(scaleY));

        drawPoints(loadData,'female');


    });

function drawPoints(pointData,gender){


    scaleX.domain(pointData.map(function(d){return d.things;}));
    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.number}))]);

    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));


    var rects = svg3.selectAll('.bars')
        .data(pointData, function(d){return d.things;});

    console.log(pointData);

    rects
        .transition()
        .duration(100)
        .attr('x',function(d){
            return scaleX(d.things);
        })
        .attr('y',function(d){
            return scaleY(+d.number);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height3-2*marginTop3 - scaleY(+d.number);
        })
        .attr('fill',"hotpink");

    rects
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('fill',"hotpink")
        .attr('id',function (d) {return d.things})
        .attr('x',function(d){
            return scaleX(d.things);
        })
        .attr('y',function(d){
            return scaleY(+d.number);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height3-2*marginTop3 - scaleY(+d.number);
        })

}

















