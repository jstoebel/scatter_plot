d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(data){

  var margin = { top: 30, right: 30, bottom: 40, left:70 }

  var height = 400 - margin.top - margin.bottom,
      width = 600 - margin.left - margin.right,
      barWidth = 50,
      barOffset = 5;

  var parser = d3.time.format("%M:%S")

  // use the parser like this:
  // var t0 = parser.parse("3:36")

  var fastestTime = parser.parse(data[0].Time)

  function secondsBehind(time){
    //time(int) in miliseconds
    return time - fastestTime
  }

  var points = data.map(function(d, i){
    //[secondsBehind, place]
    var point = {secBehind: secondsBehind(parser.parse(d.Time))}
    for (var attr in d){ point[attr] = d[attr] }
    return point
  })

  //ranking reverse order (1st at top, last on bottom)
  var yScale = d3.scale.linear()
          .domain([1, data.length])
          .range([0, height])

  var xScale = d3.time.scale()
          // [the most seconds behind, the le]
          .domain([points[points.length-1].x, 0])
          .range([0, width])
          // .domain([d3.min(quarters), d3.max(quarters)])

  var myChart = d3.select("#chart").append('svg')
      .style('background', '#E7E0CB')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .selectAll('circle').data(points)
        .enter().append('circle')
            .style('fill', '#619CFF')
            .attr('cx', function(point, i){
              console.log(point )
              return xScale(point.secBehind)
            })
            .attr('cy', function(point, i){
              return yScale(point.Place)
            })

            .attr('r', 5)

  var vGuideScale = d3.scale.linear()
          .domain([0, data.length])
          .range([0, height])

  var vAxis = d3.svg.axis()
      .scale(vGuideScale)
      .orient('left')
      .ticks(10)

  var vGuide = d3.select('svg').append('g')
      vAxis(vGuide)
      vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      vGuide.selectAll('path')
          .style({ fill: 'none', stroke: "#000"})
      vGuide.selectAll('line')
          .style({ stroke: "#000"})

  var hGuideScale = d3.scale.linear()
          .domain([0, data.length])
          .range([0, width])

  var hAxis = d3.svg.axis()
      .orient("bottom")
      .scale(xScale)
      .ticks(5)
      .tickFormat(d3.time.format('%M:%S'));

  var hGuide = d3.select('svg').append('g')
      hAxis(hGuide)
      hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
      hGuide.selectAll('path')
          .style({ fill: 'none', stroke: "#000"})
      hGuide.selectAll('line')
          .style({ stroke: "#000"})

  var tooltip = d3.select('body').append('div')
    .classed('tooltip',  true)

})
