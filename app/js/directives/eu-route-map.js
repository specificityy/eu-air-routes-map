define(['angular', 'directives/directives'], function(angular, directives) {

  return directives.directive("euRouteMap", function(configSvc, mapZoomSvc, arrangeLabelsSvc, highlightAirportSvc, mapHelpersSvc) {

    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {

        var path = d3.geo.path()
          .projection(mapHelpersSvc.projection);

        var diagonal = d3.svg.diagonal()
          .source(function(d) {
            return {
              "x": configSvc.currentCoords[1],
              "y": configSvc.currentCoords[0]
            };
          })
          .target(function(d) {
            console.log(d);
            return {
              "x": mapHelpersSvc.projection([d.longitude, d.latitude])[1],
              "y": mapHelpersSvc.projection([d.longitude, d.latitude])[0]
            };
          })
          .projection(function(d) {
            return [d.y, d.x];
          });


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
            configSvc.airportList = airports;

            scope.$emit('airportsLoaded', {});

            d3.json('app/js/data/eu-routes.json', function(routes) {
              configSvc.airRoutes = routes;
              configSvc.airportList.forEach(function(airport) {
                airport.destinations = configSvc.airportList.filter(function(el) {
                  return routes[airport.iataCode].indexOf(el.iataCode) > -1;
                });
              });

              var circleObjs = configSvc.poiGroup.selectAll('circle.airport-poi')
                .data(configSvc.airportList)
                .enter()
                .append('circle')
                .attr({
                  'cx': function(x) {
                    return mapHelpersSvc.projection([x.longitude, x.latitude])[0] - 50;
                  },
                  'cy': function(x) {
                    return mapHelpersSvc.projection([x.longitude, x.latitude])[1] - 50;
                  },
                  'r': function(x) {
                    return mapHelpersSvc.getRadius(x.destinations.length);
                  },
                  'class': 'airport-poi',
                  'id': function(x) {
                    configSvc.airportNames.push(x.iataCode);
                    return x.iataCode;
                  }
                })


              .on('mouseover', function(d) {
                highlightAirportSvc.highlightAirport.call(this, d);
              }).on('mouseleave', function(d) {
                highlightAirportSvc.backToNormal.call(this, d);
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
                    return mapHelpersSvc.projection([x.longitude, x.latitude])[0];
                  },
                  'cy': function(x) {
                    return mapHelpersSvc.projection([x.longitude, x.latitude])[1];
                  }
                });


              configSvc.poiGroup.selectAll("text.place-label")
                .data(configSvc.airportList)
                .enter()
                .append("text")
                .text(function(x) {
                  return x.name;
                })
                .attr({
                  "text-anchor": "left",
                  x: function(x) {
                    return mapHelpersSvc.projection([x.longitude, x.latitude])[0] + 10;
                  },
                  y: function(x) {
                    return mapHelpersSvc.projection([x.longitude, x.latitude])[1] + 5;
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

              configSvc.poiGroup.on('click', function() {
                highlightAirportSvc.backToNormal();
              });

              arrangeLabelsSvc();

            });

          });

        });

      }
    }

  });

});