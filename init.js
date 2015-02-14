var width = 960,
  height = 960,
  center = [width / 2, height / 2],
  airportNames = [],
  notDestinationCircles,
  notDestinationLabels,
  airportList = [];

var projection = d3.geo.mercator()
  .center([20, 60.4])
  .rotate([9.4, 3])
  // .parallels([50, 60])
  // .scale(6000)
  // .translate([-((width / 20) * 0.00000001), height])
  .scale(width);

var zoom = d3.behavior.zoom()
  .scaleExtent([1, 10])
  .scale(1)
  .on('zoom', zoomed);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g');

var g = svg.append('g');
var arcGroup = g.append('g');

svg
  .call(zoom)
  .call(zoom.event);


var diagonal = d3.svg.diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });

svg.append('defs').append('marker')
  .attr('id', 'arrowhead')
  .attr('refX', 6 + 3) /*must be smarter way to calculate shift*/
  .attr('refY', 2)
  .attr('markerWidth', 6)
  .attr('markerHeight', 4)
  .attr('orient', 'auto')
  .append('path')
  .attr('d', 'M 0,0 V 4 L6,2 Z'); //this is actual shape for arrowhead


//tooltip
var tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);


d3.json('eu-topo.json', function(error, world) {
  g.append('path')
    .datum({
      type: 'Sphere'
    })
    .attr('class', 'sphere')
    .attr('d', path);

  g.append('path')
    .datum(topojson.merge(world, world.objects.countries.geometries))
    .attr('class', 'land')
    .attr('d', path);

  g.append('path')
    .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
      return a !== b;
    }))
    .attr('class', 'boundary')
    .attr('d', path);


  //Load airports data
  d3.json('eu-airports.json', function(airports) {
    airportList = airports;

    d3.json('eu-routes.json', function(routes) {
      airports.forEach(function(airport) {
        airport.destinations = routes[airport.iataCode];
      });


      g.selectAll("text")
        .data(airports)
        .enter()
        .append("text")
        .text(function(x) {
          return x.name;
        })
        .attr({
          "text-anchor": "left",
          x: function(x) {
            return projection([x.longitude, x.latitude])[0] + 10;
          },
          y: function(x) {
            return projection([x.longitude, x.latitude])[1] + 5;
          },
          "font-family": "Helvetica",
          "font-size": 11,
          "fill": "#2f2f2f",
          "z-index": '1000',
          "opacity": 0,
          'class': function(x) {
            return x.iataCode;
          }
        });

      g.selectAll('circle')
        .data(airports)
        .enter()
        .append('circle')
        .attr({
          'cx': function(x) {
            return projection([x.longitude, x.latitude])[0];
          },
          'cy': function(x) {
            return projection([x.longitude, x.latitude])[1];
          },
          'r': function(x) {
            return getRadius(x.destinations.length);
          },
          'class': 'airport-poi',
          'id': function(x) {
            airportNames.push(x.iataCode);
            return x.iataCode;
          }
        }).style('fill', '#3396DB')


      .on('mouseover', function(ev) {

        d3.select(this).transition().duration(100).ease('linear').attr('r', 7).style('fill', '#0097A7');

        if (ev.destinations && ev.destinations.length > 0) {

          var circleIds = labelIds = '';
          airportNames.forEach(function(x) {
            if (ev.destinations.indexOf(x) == -1)
              circleIds += ',#' + x;
            else
              labelIds += ',.' + x;
          });

          notDestinationCircles = d3.selectAll(circleIds.substr(1)).style('fill', '#ccc');
          notDestinationLabels = d3.selectAll(labelIds.substr(1)).style('opacity', 1);
        }

        tooltip.transition()
          .duration(100)
          .style('opacity', .9);
        tooltip.html('<strong>' + ev.name + '</strong>')
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');




        var currentAirports = airportList.filter(function(x) {
          return labelIds.indexOf(x.iataCode) > -1;
        });

        // you can build the links any way you want - e.g., if you have only
        //  certain items you want to draw paths between
        // Alterntively, it can be created automatically based on the data
        links = [];

        currentAirports.forEach(function(x) {
          links.push({
            type: "LineString",
            coordinates: [
              [ev.longitude, ev.latitude],
              [x.longitude, x.latitude]
            ]
          });
        });

        drawConnections();

      }).on('mouseleave', function(ev) {
        d3.select(this).transition().duration(65).ease('linear').attr('r', getRadius(ev.destinations.length)).style('fill', '#3396DB');

        notDestinationCircles.style('fill', '#3396DB');
        notDestinationLabels.style('opacity', 0);

        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      });


    });

  });

});

function getRadius(x) {
  var min = 3;

  var ret = Math.sqrt(x);

  if (ret < min)
    ret = min;
  else if (ret > (min * 1.5))
    ret = min * 1.5;

  return ret;
}

function zoomed() {
  g.attr('transform', 'translate(' + zoom.translate() + ')scale(' + zoom.scale() + ')');
}

d3.select(self.frameElement).style('height', height + 'px');

// Simplest possible buttons
svg.selectAll('.button')
  .data(['zoom_in', 'zoom_out'])
  .enter()
  .append('rect')
  .attr('x', function(d, i) {
    return 10 + 50 * i
  })
  .attr({
    y: 10,
    width: 40,
    height: 20,
    class: 'button'
  })
  .attr('id', function(d) {
    return d
  })
  .style('fill', function(d, i) {
    return i ? 'red' : 'green'
  })

// Control logic to zoom when buttons are pressed, keep zooming while they are
// pressed, stop zooming when released or moved off of, not snap-pan when
// moving off buttons, and restore pan on mouseup.

var pressed = false;
d3.selectAll('.button').on('mousedown', function() {
  pressed = true;
  disableZoom();
  zoomButton(this.id === 'zoom_in')
}).on('mouseup', function() {
  pressed = false;
}).on('mouseout', function() {
  pressed = false;
})
svg.on('mouseup', function() {
  svg.call(zoom);
});

function disableZoom() {
  svg.on('mousedown.zoom', null)
    .on('touchstart.zoom', null)
    .on('touchmove.zoom', null)
    .on('touchend.zoom', null);
}

function zoomButton(zoom_in) {
  var scale = zoom.scale(),
    extent = zoom.scaleExtent(),
    translate = zoom.translate(),
    x = translate[0],
    y = translate[1],
    factor = zoom_in ? 1.3 : 1 / 1.3,
    target_scale = scale * factor;

  // If we're already at an extent, done
  if (target_scale === extent[0] || target_scale === extent[1]) {
    return false;
  }
  // If the factor is too much, scale it down to reach the extent exactly
  var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
  if (clamped_target_scale != target_scale) {
    target_scale = clamped_target_scale;
    factor = target_scale / scale;
  }

  // Center each vector, stretch, then put back
  x = (x - center[0]) * factor + center[0];
  y = (y - center[1]) * factor + center[1];

  // Transition to the new view over 100ms
  d3.transition().duration(100).tween('zoom', function() {
    var interpolate_scale = d3.interpolate(scale, target_scale),
      interpolate_trans = d3.interpolate(translate, [x, y]);
    return function(t) {
      zoom.scale(interpolate_scale(t))
        .translate(interpolate_trans(t));
      zoomed();
    };
  }).each('end', function() {
    if (pressed) zoomButton(zoom_in);
  });
}



//=====================

// --- Helper functions (for tweening the path)
var lineTransition = function lineTransition(path) {
  path.transition()
  //NOTE: Change this number (in ms) to make lines draw faster or slower
  .duration(5500)
    .attrTween("stroke-dasharray", tweenDash)
    .each("end", function(d, i) {
      ////Uncomment following line to re-transition
      //d3.select(this).call(transition); 

      //We might want to do stuff when the line reaches the target,
      //  like start the pulsating or add a new point or tell the
      //  NSA to listen to this guy's phone calls
      //doStuffWhenLineFinishes(d,i);
    });
};
var tweenDash = function tweenDash() {
  //This function is used to animate the dash-array property, which is a
  //  nice hack that gives us animation along some arbitrary path (in this
  //  case, makes it look like a line is being drawn from point A to B)
  var len = this.getTotalLength(),
    interpolate = d3.interpolateString("0," + len, len + "," + len);

  return function(t) {
    return interpolate(t);
  };
};


// --- Add paths
// Format of object is an array of objects, each containing
//  a type (LineString - the path will automatically draw a greatArc)
//  and coordinates 
var links = [];


function drawConnections() {
  // Standard enter / update 
  var pathArcs = arcGroup.selectAll(".arc")
    .data(links);

  console.log(arcGroup.selectAll(".arc"));

  //enter
  pathArcs.enter()
    .append("path").attr({
      'class': 'arc'
    }).style({
      fill: 'none',
    });

  //update
  pathArcs.attr({
    //d is the points attribute for this path, we'll draw
    //  an arc between the points using the arc function
    d: path
  })
    .style({
      stroke: '#0000ff',
      'stroke-width': '2px'
    })
  // Uncomment this line to remove the transition
  .call(lineTransition);

  //exit
  // pathArcs.exit().remove();
}