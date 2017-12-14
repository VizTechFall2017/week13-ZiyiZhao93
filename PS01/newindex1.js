var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var width2 = document.getElementById('svg2').clientWidth;
var height2 = document.getElementById('svg2').clientHeight;

var width3 = document.getElementById('svg3').clientWidth;
var height3 = document.getElementById('svg3').clientHeight;

var width4 = document.getElementById('svg4').clientWidth;
var height4 = document.getElementById('svg4').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var marginLeft3 = 100;
var marginTop3 = 100;

var marginLeft4 = 100;
var marginTop4 = 100;

var sexData = [];

var clicked = true;

var womenData;
var menData;

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

var svg4 = d3.select('#svg4')
    .append('g')
    .attr('transform', 'translate(' + marginLeft4 + ',' + marginTop4 + ')');


var albersProjection = d3.geoAlbers()
    .scale(150000)
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate([(width/2), (height/2)]);


path = d3.geoPath()
    .projection(albersProjection);

var cityLookup = d3.map();

var colorScale = d3.scaleLinear().range(['white','white']);

var scaleX = d3.scaleBand().rangeRound([0, width3-2*marginLeft3]).padding(0.1);
var scaleY = d3.scaleLinear().range([height3-2*marginTop3, 0]);

var scaleX1 = d3.scaleBand().rangeRound([0, width4-2*marginLeft4]).padding(0.1);
var scaleY1 = d3.scaleLinear().range([height4-2*marginTop4, 0]);


queue()
    .defer(d3.json, "./Boston.json")
    .defer(d3.json, "./Orange.json")
    .defer(d3.csv, "./totalsubway.csv")
    .defer(d3.csv,"./subway3.csv")
    .defer(d3.csv, "./circle1.csv")
    .await(function(err, mapData,lineData, populationData,genderData,circleData){


        populationData.forEach(function(d){
            cityLookup.set(d.population);
        });


        colorScale.domain([0, d3.max(populationData.map(function(d){return +d.population}))]);

        svg.selectAll("path")               //make empty selection
            .data(mapData.features)          //bind to the features array in the map data
            .enter()
            .append("path")                 //add the paths to the DOM
            .attr("d", path)                //actually draw them
            .attr("class", "feature")
            .attr('fill',function(d){
                return colorScale(cityLookup.get(d.properties));
            })
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

        var loadData = nestedData.filter(function(d){return d.key == 'total'})[0].values;


        svg3.append("g")
            .attr('class','xaxis')
            .attr('transform','translate(0,'+ (height3-2*marginTop3) +')')
            .call(d3.axisBottom(scaleX));

        svg3.append("g")
            .attr('class', 'yaxis')
            .call(d3.axisLeft(scaleY));

        svg3.append('text')
            .text('Total')
            .attr('transform','translate(560, 100)')
            .attr('font-size', 15);

        sexData = d3.nest()
            .key(function (d) {return d.week})
            .entries(genderData);

        var incomeData = sexData.filter(function(d){return d.key == 'Mon.'})[0].values;

        svg4.append("g")
            .attr('class','xaxis1')
            .attr('transform','translate(0,'+ (height4-2*marginTop4) +')')
            .call(d3.axisBottom(scaleX1));

        svg4.append("g")
            .attr('class', 'yaxis1')
            .call(d3.axisLeft(scaleY1));

        svg4.selectAll('circles')
            .data(incomeData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints')
            .attr('cx',function(d){return scaleX1(d.things);})
            .attr('cy',function(d){return scaleY1(d.people)})
            .attr('r', 5)
            .attr('fill', "palevioletred");

        svg4.selectAll('circles')
            .data(incomeData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints')
            .attr('cx',function(d){return scaleX1(d.things);})
            .attr('cy',function(d){return scaleY1(d.people)})
            .attr('r', 5)
            .attr('fill', "mediumturquoise");


        drawPoints(loadData,'total',incomeData,'Mon.');

    });


function drawPoints(pointData){


    scaleX.domain(pointData.map(function(d){return d.things;}));
    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.number}))]);

    scaleX1.domain(pointData.map(function(d){return d.things;}));
    scaleY1.domain([0, d3.max(pointData.map(function(d){return +d.people}))]);


    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));

    d3.selectAll('.xaxis1')
        .call(d3.axisBottom(scaleX1));

    d3.selectAll('.yaxis1')
        .call(d3.axisLeft(scaleY1));


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
        .attr('fill',"mediumslateblue");


    rects
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('fill',"mediumslateblue")
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
        });


    d3.selectAll('w_dataPoints')
        .data(pointData)
        .attr('cx',function(d){return scaleX1(d.things);})
        .attr('cy',function(d){return scaleY1(d.people)});

    d3.selectAll('m_dataPoints')
        .data(pointData)
        .attr('cx',function(d){return scaleX1(d.things);})
        .attr('cy',function(d){return scaleY1(d.people)});


}
