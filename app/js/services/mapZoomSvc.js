define(['services/services'], function(services) {

  return services.factory("mapZoomSvc", function(configSvc) {

    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 2])
      .scale(1)
      .on('zoom', zoomed);

    configSvc.svg
      .call(zoom)
      .call(zoom.event);

    function zoomed() {
      configSvc.poiGroup.attr('transform', 'translate(' + zoom.translate() + ')scale(' + zoom.scale() + ')');
    }

    d3.select(self.frameElement).style('height', configSvc.height + 'px');

    // // Simplest possible buttons
    // configSvc.svg.selectAll('.button')
    //   .data(['zoom_in', 'zoom_out'])
    //   .enter()
    //   .append('rect')
    //   .attr('x', function(d, i) {
    //     return 10 + 50 * i
    //   })
    //   .attr({
    //     y: 10,
    //     width: 40,
    //     height: 20,
    //     class: 'button'
    //   })
    //   .attr('id', function(d) {
    //     return d;
    //   })
    //   .style('fill', function(d, i) {
    //     return i ? 'red' : 'green'
    //   })

    // // Control logic to zoom when buttons are pressed, keep zooming while they are
    // // pressed, stop zooming when released or moved off of, not snap-pan when
    // // moving off buttons, and restore pan on mouseup.

    // var pressed = false;
    // var that = this;
    // d3.selectAll('.zoom-btn').on('mousedown', function() {
    //   that.pressed = true;
    //   disableZoom();
    //   zoomButton(this.id === 'zoom_in')
    // }).on('mouseup', function() {
    //   that.pressed = false;
    // }).on('mouseout', function() {
    //   that.pressed = false;
    // })
    // configSvc.svg.on('mouseup', function() {
    //   configSvc.svg.call(zoom);
    // });

    // function disableZoom() {
    //   configSvc.svg.on('mousedown.zoom', null)
    //     .on('touchstart.zoom', null)
    //     .on('touchmove.zoom', null)
    //     .on('touchend.zoom', null);
    // }

    // function zoomButton(zoom_in) {
    //   var scale = zoom.scale(),
    //     extent = zoom.scaleExtent(),
    //     translate = zoom.translate(),
    //     x = translate[0],
    //     y = translate[1],
    //     factor = zoom_in ? 1.3 : 1 / 1.3,
    //     target_scale = scale * factor;

    //   // If we're already at an extent, done
    //   if (target_scale === extent[0] || target_scale === extent[1]) {
    //     return false;
    //   }
    //   // If the factor is too much, scale it down to reach the extent exactly
    //   var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
    //   if (clamped_target_scale != target_scale) {
    //     target_scale = clamped_target_scale;
    //     factor = target_scale / scale;
    //   }

    //   // Center each vector, stretch, then put back
    //   x = (x - configSvc.center[0]) * factor + configSvc.center[0];
    //   y = (y - configSvc.center[1]) * factor + configSvc.center[1];

    //   // Transition to the new view over 100ms
    //   d3.transition().duration(100).tween('zoom', function() {
    //     var interpolate_scale = d3.interpolate(scale, target_scale),
    //       interpolate_trans = d3.interpolate(translate, [x, y]);
    //     return function(t) {
    //       zoom.scale(interpolate_scale(t))
    //         .translate(interpolate_trans(t));
    //       zoomed();
    //     };
    //   }).each('end', function() {
    //     if (that.pressed) zoomButton(zoom_in);
    //   });
    // }




  });
});