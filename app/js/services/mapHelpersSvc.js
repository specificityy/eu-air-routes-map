define(['services/services'], function(services) {

  return services.factory("mapHelpersSvc", function(configSvc) {

    var svc = {};

    svc.getRadius = function(x) {
      var min = 3;
      var ret = Math.sqrt(x);

      if (ret < min)
        ret = min;
      else if (ret > (min * 1.5))
        ret = min * 1.5;

      return ret;
    };

    svc.projection = d3.geo.mercator()
      .center([20, 60.4])
      .rotate([9.4, 3])
    // .parallels([50, 60])
    // .scale(6000)
    // .translate([-((configSvc.width / 20) * 0.00000001), configSvc.height])
    .scale(configSvc.width);



    return svc;

  });
});