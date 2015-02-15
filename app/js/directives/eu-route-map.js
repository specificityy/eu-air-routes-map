define(['angular', 'directives/directives'], function(angular, directives) {

  return directives.directive("euRouteMap", function(configSvc, mapZoomSvc, arrangeLabelsSvc) {

    // constants
    var airportNames = [],
      notDestinationCircles,
      notDestinationLabels,
      airportList = [],
      currentCoords;

    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {

        var projection = d3.geo.mercator()
          .center([20, 60.4])
          .rotate([9.4, 3])
          // .parallels([50, 60])
          // .scale(6000)
          // .translate([-((configSvc.width / 20) * 0.00000001), configSvc.height])
          .scale(configSvc.width);

        var path = d3.geo.path()
          .projection(projection);

        var diagonal = d3.svg.diagonal()
          .source(function(d) {
            return {
              "x": currentCoords[1],
              "y": currentCoords[0]
            };
          })
          .target(function(d) {
            console.log(d);
            return {
              "x": projection([d.longitude, d.latitude])[1],
              "y": projection([d.longitude, d.latitude])[0]
            };
          })
          .projection(function(d) {
            return [d.y, d.x];
          });

        //Function to generate line "path"
        var line = d3.svg.line()
          .x(function(point) {
            return point.x;
          })
          .y(function(point) {
            return point.y;
          })
          .interpolate("cardinal");


        function lineData(d) {
          var points = [{
            x: currentCoords[0],
            y: currentCoords[1]
          }, {
            x: projection([d.longitude, d.latitude])[0],
            y: projection([d.longitude, d.latitude])[1]
          }];
          return line(points);
        }


        //tooltip
        var tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip arrow-box')
          .style('opacity', 0);


        d3.json('app/js/data/eu-topo.json', function(error, world) {
          configSvc.poiGroup.append('path')
            .datum({
              type: 'Sphere'
            })
            .attr('class', 'sphere')
            .attr('d', path);

          configSvc.poiGroup.append('path')
            .datum(topojson.merge(world, world.objects.countries.geometries))
            .attr('class', 'land')
            .attr('d', path);

          configSvc.poiGroup.append('path')
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
              return a !== b;
            }))
            .attr('class', 'boundary')
            .attr('d', path);


          //Load airports data
          d3.json('app/js/data/eu-airports.json', function(airports) {
            airportList = airports;

            d3.json('app/js/data/eu-routes.json', function(routes) {
              airports.forEach(function(airport) {
                airport.destinationIds = routes[airport.iataCode];
                airport.destinations = airports.filter(function(el) {
                  return routes[airport.iataCode].indexOf(el.iataCode) > -1;
                });
              });

              var circleObjs = configSvc.poiGroup.selectAll('circle.airport-poi')
                .data(airports)
                .enter()
                .append('circle')
                .attr({
                  'cx': function(x) {
                    return projection([x.longitude, x.latitude])[0] - 50;
                  },
                  'cy': function(x) {
                    return projection([x.longitude, x.latitude])[1] - 50;
                  },
                  'r': function(x) {
                    return getRadius(x.destinations.length);
                  },
                  'class': 'airport-poi',
                  'id': function(x) {
                    airportNames.push(x.iataCode);
                    return x.iataCode;
                  }
                })


              .on('mouseover', function(ev) {
                highlightAirport.call(this, ev);
              }).on('mouseleave', function(ev) {
                backToNormal.call(this, ev);
              });

              circleObjs
                .transition()
                .delay(function(d, i) {
                  return i * 1.5;
                })
                .duration(100)
                .ease('bounce')
                .attr({
                  'cx': function(x) {
                    return projection([x.longitude, x.latitude])[0];
                  },
                  'cy': function(x) {
                    return projection([x.longitude, x.latitude])[1];
                  }
                });


              configSvc.poiGroup.selectAll("text.place-label")
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
                    return x.iataCode + ' place-label';
                  }
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


        function highlightAirport(ev) {
          d3.select(this).transition().duration(100).ease('linear').attr('r', 7).style('fill', '#0097A7');

          if (ev.destinations && ev.destinations.length > 0) {

            var circleIds = labelIds = '';
            airportNames.forEach(function(x) {
              if (ev.destinationIds.indexOf(x) == -1)
                circleIds += ',#' + x;
              else
                labelIds += ',.' + x;
            });

            notDestinationCircles = d3.selectAll(circleIds.substr(1)).style('fill', '#ccc');
            notDestinationLabels = d3.selectAll(labelIds.substr(1)).style('opacity', 1);
            // arrangeLabelsSvc(labelIds.substr(1));
          }

          tooltip.html(ev.name);

          currentCoords = projection([ev.longitude, ev.latitude]);

          tooltip.style('left', (currentCoords[0] - (parseInt(tooltip.style('width')) / 2)) + 'px')
            .style('top', (currentCoords[1] - 27) + 'px');

          tooltip.transition()
            .duration(10)
            .style('opacity', 0.8);

          var currentAirports = airportList.filter(function(x) {
            return labelIds.indexOf(x.iataCode) > -1;
          });



          // svg.selectAll('line.destination')
          //   .data(currentAirports)
          //   .enter()
          //   .append("line")
          //   .transition()
          //   .duration(500)
          //   .ease('bounce')
          //   .style("stroke", "black")
          //   .attr("x1", currentCoords[0])
          //   .attr("y1", currentCoords[1])
          //   .attr("x2", function(d) {
          //     return projection([d.longitude, d.latitude])[0];
          //   })
          //   .attr("y2", function(d) {
          //     return projection([d.longitude, d.latitude])[1];
          //   })
          //   .attr("class", "destination");



          // configSvc.poiGroup.selectAll('path.destination')
          //   .data(currentAirports)
          //   .enter()
          //   .append("path")
          // // .transition()
          // .style("stroke", "blue")
          //   .attr("d", lineData)
          //   .attr("class", "destination");








          // var cluster = d3.layout.tree().size(configSvc.width, configSvc.height);
          // var nodes = cluster.nodes(ev.destinations);

          // var mousePos = d3.mouse(this);
          // nodes.x = ev.latitude;
          // nodes.y = ev.longitude;

          // var links = cluster.links(nodes);

          // console.log(nodes);
          // // console.log(links);

          // configSvc.poiGroup.selectAll('path.destination')
          //   .data(links)
          //   .enter()
          //   .append('path')
          //   .attr({
          //     class: 'destination',
          //     fill: 'none',
          //     stroke: '#000',
          //     d: diagonal
          //   });
        }


        function backToNormal(ev) {
          d3.select(this).transition().duration(65).ease('linear').attr('r', getRadius(ev.destinations.length)).style('fill', '#3396DB');
          configSvc.svg.selectAll('.destination').remove();

          notDestinationCircles.style('fill', '#3396DB');
          notDestinationLabels.style('opacity', 0);

          tooltip.transition()
            .duration(100)
            .style('opacity', 0);
        }




      }
    }

  });

});