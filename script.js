d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(data){

  var margin = { top: 30, right: 30, bottom: 70, left:70 }

  var height = 400 - margin.top - margin.bottom,
      width = 600 - margin.left - margin.right

  var parser = d3.time.format("%M:%S")

  // use the parser like this:
  // var t0 = parser.parse("3:36")

  var fastestTime = parser.parse(data[0].Time)

  function secondsBehind(time){
    //time(int) in miliseconds
    return time - fastestTime
  }

  var points = data.map(function(d, i){
    // merge seconds behind into a new object
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
          .domain([points[points.length-1].secBehind, 0])
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
          .style('fill', function(point, i){
            if(point.Doping){
              return '#E55558'
            } else {
              return '#454644'
            }
          })
          .attr('cx', function(point, i){
            return xScale(point.secBehind)
          })
          .attr('cy', function(point, i){
            return yScale(point.Place)
          })

          .attr('r', 5)

          // color circle depending if point has doping allegation

          .on('mouseover', function(point) {
            var ttStr = `<div> \
              <div>${point.Name}(${point.Nationality})</div> \
              <div>Year: ${point.Year}, Time: ${point.Time}</div>\
              <div> ${point.Doping}</div> \
              <div> <a href='${point.URL}'>source</a></div>\
            </div>`

            tooltip.style('opacity', .9)

            tooltip.html(ttStr)

            tempColor = this.style.fill;
            d3.select(this)
                .style('opacity', .5)
        })

        .on('mouseout', function(point) {
            d3.select(this)
                .style('opacity', 1)
        })


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


  var xAxisAttrs = hGuide.node().getBBox()
  var xAxisWidth = width - margin.left - margin.right

  var xAxisLoc = (d3.transform(hGuide.attr("transform")).translate);
  var xLabel = d3.select("svg").append("text")      // text label for the x axis
  // .attr("x", width/2 + margin.left)
  // .attr("y", height + margin.bottom  )
    .attr('transform', 'translate(' + (xAxisAttrs.x+(xAxisAttrs.width/2)+margin.left) + ', ' + (xAxisLoc[1] + xAxisAttrs.height + 10 ) + ')')
    .style("text-anchor", "middle ")
    .text("Minutes Behind");

  var yAxisAttrs = vGuide.node().getBBox();
  var yAxisHeight = yAxisAttrs.height
  var yAxisLoc = (d3.transform(hGuide.attr("transform")).translate);

  console.log(yAxisAttrs)

  var yLabel = d3.select("svg").append("text")
    // .attrs('transform', 'translate(' + (yAxisAttrs.y+(yAxisAttrs.height/2)+margin.top) + ', ' + (yAxisLoc[0] + yAxisAttrs.width - 20) + ')')
    // .attr('transform', 'translate(' + 0 +', '+margin.top + yAxisHeight/2 + ')' )
    // .attr('transform', 'translate(0, ' + (margin.top + yAxisAttrs.height/2) + ')+rotate(-90)')
    // .attr('transform', yAxisTransform)
    .attr('transform', 'translate('+ (margin.left - yAxisAttrs.width - 10) + ',' + (margin.top + yAxisAttrs.height/2) + ')rotate(-90)')

    .style("text-anchor", "middle ")
    .text("Rank")


  var tooltip = d3.select('body').append('div')
    .classed('tooltip',  true)

})
