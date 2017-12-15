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

var clicked = true;

var nestedData = [];

var womenData;
var menData;

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

var scaleX1 = d3.scaleBand().rangeRound([0, width4-2*marginLeft4]);
var scaleY1 = d3.scaleLinear().range([height4-2*marginTop4, 0]);


queue()
    .defer(d3.json, "./Boston.json")
    .defer(d3.json, "./Orange.json")
    .defer(d3.csv, "./totalsubway.csv")
    .defer(d3.csv,"./subway4.csv")
    .defer(d3.csv, "./circle.csv")
    .await(function(err, mapData,lineData, populationData,genderData,circleData){


        populationData.forEach(function(d){
            cityLookup.set(d.population);
        });


        colorScale.domain([0, d3.max(populationData.map(function(d){return +d.population}))]);

        svg.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "feature")
            .attr('fill',function(d){
                return colorScale(cityLookup.get(d.properties));
            })
            .attr('stroke','black')
            .attr('stroke-width',.2);


        svg2.background = 'none';

        svg2.selectAll("path")
            .data(lineData.features)
            .enter()
            .append("path")
            .attr("d", path)
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
            .attr('data-toggle',"tooltip")
            .attr('title', function(d){
                return d.station;
        })
           .on('mouseover', function (d) {
                d3.select(this).attr('r', 8).attr('fill', 'red');
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('r', 5).attr('fill', 'orange');
            });

        $('[data-toggle="tooltip"]').tooltip();

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
            .attr('font-size', 15)
            .attr('fill','mediumslateblue')
            .attr('font-family', '\'Raleway\', sans-serif');


        womenData = genderData.filter(function (d) {return d.sex == 'women'  });
        menData = genderData.filter(function (d) {return d.sex == 'men'  });

        svg4.append("g")
            .attr('class','xaxis1')
            .attr('transform','translate(0,'+ (height4-2*marginTop4) +')')
            .call(d3.axisBottom(scaleX1));

        svg4.append("g")
            .attr('class', 'yaxis1')
            .attr('tranform', 'translate(0,'+(marginLeft4)+')')
            .call(d3.axisLeft(scaleY1));


        svg4.selectAll('circles')
            .data(womenData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints');

        svg4.selectAll('circles')
            .data(menData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints');

        svg4.append('text')
            .text('read a book')
            .attr('transform','translate(10, 280)')
            .attr('font-size', 10)
            .attr('fill','black');

        svg4.append('text')
            .text('listen to music')
            .attr('transform','translate(85, 280)')
            .attr('font-size', 10)
            .attr('fill','black');

        svg4.append('text')
            .text('play game')
            .attr('transform','translate(170, 280)')
            .attr('font-size', 10)
            .attr('fill','black');

        svg4.append('text')
            .text('social media')
            .attr('transform','translate(240, 280)')
            .attr('font-size', 10)
            .attr('fill','black');

        svg4.append('text')
            .text('chat')
            .attr('transform','translate(335, 280)')
            .attr('font-size', 10)
            .attr('fill','black');

        svg4.append('text')
            .text('wondering')
            .attr('transform','translate(400, 280)')
            .attr('font-size', 10)
            .attr('fill','black');

        svg4.append('text')
            .text('take a rest')
            .attr('transform','translate(475, 280)')
            .attr('font-size', 10)
            .attr('fill','black');


        drawCharts(loadData);

        drawPoints(menData,womenData);


    });


function drawCharts(pointData){


    scaleX.domain(pointData.map(function(d){return d.things;}));
    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.number}))]);


    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));



    var rects = svg3.selectAll('.bars')
        .data(pointData, function(d){return d.things;});


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


}

function buttonClicked_1(){

    if (clicked == true){
        svg4.selectAll('circle')
            .remove();

        var womenData_monday;
        womenData_monday = womenData.filter(function(d){
            return d.week == 'Mon.';
        });

        var menData_monday;
        menData_monday = menData.filter(function(d){
            return d.week == 'Mon.';
        });

        svg4.selectAll('circles')
            .data(womenData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints');

        svg4.selectAll('circles')
            .data(menData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints');



        drawPoints(menData_monday, womenData_monday);
    }
}

function buttonClicked_2(){

    if (clicked == true){
        svg4.selectAll('circle')
            .remove();

        var womenData_monday;
        womenData_monday = womenData.filter(function(d){
            return d.week == 'Tue.';
        });

        var menData_monday;
        menData_monday = menData.filter(function(d){
            return d.week == 'Tue.';
        });

        svg4.selectAll('circles')
            .data(womenData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints');

        svg4.selectAll('circles')
            .data(menData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints');

        drawPoints(menData_monday, womenData_monday);
    }
}


function buttonClicked_3(){

    if (clicked == true){
        svg4.selectAll('circle')
            .remove();

        var womenData_monday;
        womenData_monday = womenData.filter(function(d){
            return d.week == 'Wed.';
        });

        var menData_monday;
        menData_monday = menData.filter(function(d){
            return d.week == 'Wed.';
        });

        svg4.selectAll('circles')
            .data(womenData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints');

        svg4.selectAll('circles')
            .data(menData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints');

        drawPoints(menData_monday, womenData_monday);
    }
}

function buttonClicked_4(){

    if (clicked == true){
        svg4.selectAll('circle')
            .remove();

        var womenData_monday;
        womenData_monday = womenData.filter(function(d){
            return d.week == 'Thu.';
        });

        var menData_monday;
        menData_monday = menData.filter(function(d){
            return d.week == 'Thu.';
        });

        svg4.selectAll('circles')
            .data(womenData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints');

        svg4.selectAll('circles')
            .data(menData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints');

        drawPoints(menData_monday, womenData_monday);
    }
}

function buttonClicked_5(){

    if (clicked == true){
        svg4.selectAll('circle')
            .remove();

        var womenData_monday;
        womenData_monday = womenData.filter(function(d){
            return d.week == 'Fri.';
        });

        var menData_monday;
        menData_monday = menData.filter(function(d){
            return d.week == 'Fri.';
        });

        svg4.selectAll('circles')
            .data(womenData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints');

        svg4.selectAll('circles')
            .data(menData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints');

        drawPoints(menData_monday, womenData_monday);
    }
}

function buttonClicked_6(){

    if (clicked == true){
        svg4.selectAll('circle')
            .remove();

        var womenData_monday;
        womenData_monday = womenData.filter(function(d){
            return d.week == 'Sat.';
        });

        var menData_monday;
        menData_monday = menData.filter(function(d){
            return d.week == 'Sat.';
        });

        svg4.selectAll('circles')
            .data(womenData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints');

        svg4.selectAll('circles')
            .data(menData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints');

        drawPoints(menData_monday, womenData_monday);
    }
}

function buttonClicked_7(){

    if (clicked == true){
        svg4.selectAll('circle')
            .remove();

        var womenData_monday;
        womenData_monday = womenData.filter(function(d){
            return d.week == 'Sun.';
        });

        var menData_monday;
        menData_monday = menData.filter(function(d){
            return d.week == 'Sun.';
        });

        svg4.selectAll('circles')
            .data(womenData)
            .enter()
            .append('circle')
            .attr('class','w_dataPoints');

        svg4.selectAll('circles')
            .data(menData)
            .enter()
            .append('circle')
            .attr('class','m_dataPoints');

        drawPoints(menData_monday, womenData_monday);
    }
}



function drawPoints(pointData1, pointData2){

    scaleX1.domain(pointData1.map(function(d){return d.thingnumber;}));
    scaleY1.domain([0, d3.max(pointData1.map(function(d){return +d.people}))]);

    d3.selectAll('.xaxis1')
        .call(d3.axisBottom(scaleX1));

    d3.selectAll('.yaxis1')
        .call(d3.axisLeft(scaleY1));

    svg4.selectAll('.w_dataPoints')
        .data(pointData2)
        .attr('cx',function(d){
            return scaleX1(+d.thingnumber);})
        .attr('cy',function(d){return scaleY1(+d.people)})
        .attr('r', 5)
        .attr('fill', 'hotpink');

    svg4.selectAll('.m_dataPoints')
        .data(pointData1)
        .attr('cx',function(d){
            return scaleX1(+d.thingnumber);
        })
        .attr('cy',function(d){
            return scaleY1(+d.people);
        })
        .attr('r',5)
        .attr('fill', 'royalblue');




}



