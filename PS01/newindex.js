var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var width2 = document.getElementById('svg2').clientWidth;
var height2 = document.getElementById('svg2').clientHeight;

var width3 = document.getElementById('svg3').clientWidth;
var height3 = document.getElementById('svg3').clientHeight;

var width4 = document.getElementById('svg4').clientWidth;
var height4 = document.getElementById('svg4').clientHeight;

var width5 = document.getElementById('svg5').clientWidth;
var height5 = document.getElementById('svg5').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var marginLeft3 = 100;
var marginTop3 = 100;

var marginLeft4 = 100;
var marginTop4 = 100;

var marginLeft5 = 100;
var marginTop5 = 100;

var nestedData = [];

var total;
var male;
var female;

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

var svg5 = d3.select('#svg5')
    .append('g')
    .attr('transform', 'translate(' + marginLeft5 + ',' + marginTop5 + ')');


var albersProjection = d3.geoAlbers()
    .scale(150000)
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate([(width/2), (height/2)]);


path = d3.geoPath()
    .projection(albersProjection);


var scaleX = d3.scaleBand().rangeRound([0, width3-2*marginLeft3]).padding(0.1);
var scaleY = d3.scaleLinear().range([height3-2*marginTop3, 0]);
var scaleY2 = d3.scaleLinear().range([height4-2*marginTop4, 0]);
var scaleY3 = d3.scaleLinear().range([height5-2*marginTop5, 0]);


queue()
    .defer(d3.json, "./Boston.json")
    .defer(d3.json, "./Orange.json")
    .defer(d3.csv, "./subway.csv")
    .defer(d3.csv, "./circle1.csv")
    .defer(d3.csv, "./subwaytotal.csv")
    .defer(d3.csv, "./subwaymale.csv")
    .defer(d3.csv, "./subwayfemale.csv")
    .await(function(err, mapData,lineData, populationData,circleData,totalData,maleData,femaleData){


        console.log(totalData,maleData,femaleData);

        svg.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "feature")
            .attr('fill','white')
            .attr('opacity', 0.6)
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
            .entries(totalData);

        console.log(nestedData);

        svg3.append("g")
            .attr('class','xaxis')
            .attr('transform','translate(0,'+ (height3-2*marginTop3) +')')
            .call(d3.axisBottom(scaleX));

        svg3.append("g")
            .attr('class', 'yaxis')
            .call(d3.axisLeft(scaleY));

        loadData = d3.nest()
            .key(function(d){return d.gender})
            .entries(maleData);

        console.log(loadData);

        svg4.append("g")
            .attr('class','xaxis')
            .attr('transform','translate(0,'+ (height4-2*marginTop4) +')')
            .call(d3.axisBottom(scaleX));

        svg4.append("g")
            .attr('class', 'yaxis2')
            .call(d3.axisLeft(scaleY2));

        sexData = d3.nest()
            .key(function(d){return d.gender})
            .entries(femaleData);

        console.log(sexData);

        svg5.append("g")
            .attr('class','xaxis')
            .attr('transform','translate(0,'+ (height5-2*marginTop5) +')')
            .call(d3.axisBottom(scaleX));

        svg5.append("g")
            .attr('class', 'yaxis3')
            .call(d3.axisLeft(scaleY3));


        var allData = 

        drawPoints(allData);

        console.log(drawPoints(nestedData,loadData,sexData));

    });

/*
function drawPoints(totalData,maleData,femaleData){


    scaleX.domain(totalData(function(d){return d.things;}));
    scaleY.domain([0, d3.max(totalData(function(d){return +d.totalnumber}))]);
    scaleY2.domain([0, d3.max(maleData(function(d){return +d.malenumber}))]);
    scaleY3.domain([0, d3.max(femaleData(function(d){return +d.femalenumber}))]);

    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));
    d3.selectAll('.yaxis2')
        .call(d3.axisLeft(scaleY2));
    d3.selectAll('.yaxis3')
        .call(d3.axisLeft(scaleY3));


    var rects = svg3.selectAll('.bars')
        .data(totalData, function(d){return d.things;});

    rects
        .transition()
        .duration(100)
        .attr('x',function(d){
            return scaleX(d.things);
        })
        .attr('y',function(d){
            return scaleY(+d.totalnumber);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height3-2*marginTop3 - scaleY(+d.totalnumber);
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
            return scaleY(+d.totalnumber);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height3-2*marginTop3 - scaleY(+d.totalnumber);
        });



    var rects2 = svg4.selectAll('.bars2')
        .data(pointData, function(d){return d.things;});

    rects2
        .transition()
        .duration(100)
        .attr('x',function(d){
            return scaleX(d.things);
        })
        .attr('y',function(d){
            return scaleY2(+d.malenumber);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height4-2*marginTop4 - scaleY2(+d.malenumber);
        })
        .attr('fill',"mediumturquoise");


    rects2
        .enter()
        .append('rect')
        .attr('class','bars2')
        .attr('fill',"mediumturquoise")
        .attr('id',function (d) {return d.things})
        .attr('x',function(d){
            return scaleX(d.things);
        })
        .attr('y',function(d){
            return scaleY2(+d.malenumber);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height4-2*marginTop4 - scaleY2(+d.malenumber);
        })


}
*/
