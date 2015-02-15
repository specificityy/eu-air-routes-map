define(['services/services'], function(services) {

  return services.factory("arrangeLabelsSvc", function(configSvc) {

    return function arrangeLabels(selector) {
      selector = selector || '.place-label';
      var move = 1;
      while (move > 0) {
        move = 0;
        configSvc.svg.selectAll(selector)
          .each(function() {
            var that = this,
              a = this.getBoundingClientRect();
            configSvc.svg.selectAll(selector)
              .each(function() {
                if (this != that) {
                  var b = this.getBoundingClientRect();
                  if ((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
                    (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
                    // overlap, move labels
                    var dx = (Math.max(0, a.right - b.left) +
                        Math.min(0, a.left - b.right)) * 0.01,
                      dy = (Math.max(0, a.bottom - b.top) +
                        Math.min(0, a.top - b.bottom)) * 0.02,
                      tt = d3.transform(d3.select(this).attr("transform")),
                      to = d3.transform(d3.select(that).attr("transform"));
                    move += Math.abs(dx) + Math.abs(dy);

                    to.translate = [to.translate[0] + dx, to.translate[1] + dy];
                    tt.translate = [tt.translate[0] - dx, tt.translate[1] - dy];
                    d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                    d3.select(that).attr("transform", "translate(" + to.translate + ")");
                    a = this.getBoundingClientRect();
                  }
                }
              });
          });
      }
    }

  });
});