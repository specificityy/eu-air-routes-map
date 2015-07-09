define(['services/services'], function(services) {

  return services.factory("highlightAirportSvc", function(configSvc, mapHelpersSvc) {

    var svc = {};


    //tooltip
    var tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip arrow-box')
      .style('opacity', 0);


    svc.backToNormal = function(d) {
      if (d)
        d3.select(this).transition().duration(65).ease('linear').attr('r', mapHelpersSvc.getRadius(d.destinations.length)).style('fill', '#3396DB');

      configSvc.svg.selectAll('.destination').remove();

      configSvc.notDestinationCircles.style('fill', '#3396DB');
      configSvc.notDestinationLabels.style('opacity', 0);

      tooltip.transition()
        .duration(100)
        .style('opacity', 0);
    };

    svc.highlightAirport = function(d) {
      // d3.select(this).transition().duration(100).ease('linear').attr('r', 7).style('fill', '#0097A7');

      if (d.destinations && d.destinations.length > 0) {

        var circleIds = labelIds = '';
        configSvc.airportNames.forEach(function(x) {
          if (configSvc.airRoutes[d.iataCode].indexOf(x) == -1)
            circleIds += ',#' + x;
          else
            labelIds += ',.' + x;
        });

        configSvc.notDestinationCircles = d3.selectAll(circleIds.substr(1)).style('fill', '#ccc');
        configSvc.notDestinationLabels = d3.selectAll(labelIds.substr(1)).style('opacity', 1);
        // arrangeLabelsSvc(labelIds.substr(1));
      }

      if (d3.event) {

        tooltip.html(d.name);

        configSvc.currentCoords = [d3.event.pageX, d3.event.pageY] //mapHelpersSvc.projection([d.longitude, d.latitude]);

        tooltip.style('left', (configSvc.currentCoords[0] - (parseInt(tooltip.style('width')) / 2)) + 'px')
          .style('top', (configSvc.currentCoords[1] - 54) + 'px');

        tooltip.transition()
          .duration(10)
          .style('opacity', 0.8);
      }

      // // ============================================
      // // uncomment this block to get a line drawn to each destination poi
      // // ============================================

      // configSvc.poiGroup.selectAll('path.destination')
      //   .data(d.destinations)
      //   .enter()
      //   .append("path")
      // // .transition()
      // .style("stroke", "blue")
      //   .attr("d", lineData)
      //   .attr("class", "destination");

      // var line = d3.svg.line()
      //   .x(function(point) {
      //     return point.x;
      //   })
      //   .y(function(point) {
      //     return point.y;
      //   })
      //   .interpolate("basis");


      // function lineData(d) {
      //   var points = [{
      //     x: configSvc.currentCoords[0],
      //     y: configSvc.currentCoords[1]
      //   }, {
      //     x: mapHelpersSvc.projection([d.longitude, d.latitude])[0],
      //     y: mapHelpersSvc.projection([d.longitude, d.latitude])[1]
      //   }];
      //   return line(points);
      // }

    };

    return svc;

  });
});