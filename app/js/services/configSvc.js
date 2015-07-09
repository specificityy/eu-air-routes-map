define(['services/services'], function(services) {

  return services.factory("configSvc", function() {
    var width = window.innerWidth,
      height = 600;

    var ret = {
      width: width,
      height: height,
      center: [width / 2, height / 2],

      notDestinationCircles: [],
      notDestinationLabels: [],
      airportNames: [],
      airportList: [],
      currentCoords: [],

      svg: d3.select('#map').append('svg')
        .attr({
          width: width,
          height: height,
          class: 'map'
        })
    };

    ret.poiGroup = ret.svg.append('g').attr('class', 'poi-group');


    return ret;

  });
});