+var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');

var marginLeft = 100;
var marginTop = 100;

var sexData = [];

var clicked = true;

var womenData;
var menData;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var scaleX = d3.scaleBand().rangeRound([0, 600]).padding(0.1);
var scaleY = d3.scaleLinear().range([400, 0]);


d3.csv('./subway3.csv', function(dataIn){

    sexData = d3.nest()
        .key(function(d){return d.week})
        .entries(dataIn);

    var loadData = sexData.filter(function(d){return d.key == 'Mon.'})[0].values;


    console.log(sexData);
    console.log(loadData);


    scaleX.domain(loadData.map(function(d){return d.things;}));
    scaleY.domain([0, d3.max(loadData.map(function(d){return +d.people}))]);

    svg.append("g")
        .attr('transform','translate(0,400)')
        .attr('class','xaxis')
        .call(d3.axisBottom(scaleX));

    svg.append("g")
        .attr('class','yaxis')
        .call(d3.axisLeft(scaleY));

    svg.append('text')
        .text('People on the Orange Line every day')
        .attr('transform','translate(300, -50)')
        .style('text-anchor','middle');


    svg.selectAll('circles')
        .data(loadData)
        .enter()
        .append('circle')
        .attr('class','w_dataPoints')
        .attr('cx',function(d){return scaleX(d.things);})
        .attr('cy',function(d){return scaleY(d.people)})
        .attr('r', 5)
        .attr('fill', "palevioletred");

    svg.selectAll('circles')
        .data(loadData)
        .enter()
        .append('circle')
        .attr('class','m_dataPoints')
        .attr('cx',function(d){return scaleX(d.things);})
        .attr('cy',function(d){return scaleY(d.people)})
        .attr('r', 5)
        .attr('fill', "mediumturquoise");

    drawPoints(loadData);

});


function drawPoints(loadData){

    scaleX.domain(loadData.map(function(d){return d.things;}));
    scaleY.domain([0, d3.max(loadData.map(function(d){return +d.people}))]);


    d3.selectAll('w_dataPoints')
        .data(loadData)
        .attr('cx',function(d){return scaleX(d.things);})
        .attr('cy',function(d){return scaleY(d.people)});

    d3.selectAll('m_dataPoints')
        .data(loadData)
        .attr('cx',function(d){return scaleX(d.things);})
        .attr('cy',function(d){return scaleY(d.people)});



}

function buttonClicked(){

    if(clicked == true){
        drawPoints(loadData);
        clicked = false;
    }



}


