(function() {

  if (phantom.version.major >= 2) {
    var system = require('system');
    var url = system.args[1];
    var showConsoleLog = system.args[2] === 'true';
    var configScript = system.args[3];
  }
  else {
    var url = phantom.args[0];
    var showConsoleLog = phantom.args[1] === 'true';
    var configScript = phantom.args[2];
  }

  var page = require('webpage').create();
  configScript = configScript.replace(/['"]{2}/,"");
  
  if (configScript !== '') {
    try {
      require(configScript).configure(page);
    } catch(e) {
      console.error('Failed to configure phantom');
      console.error(e.stack);
      phantom.exit(1);
    }
  }

  var specTimingStart = Date.now(); // First spec timing might be inaccurate

  page.onCallback = function(data) {
    if(data.state === 'specDone') {
      var specDt = Date.now() - specTimingStart;
      if (specDt > 1000) {
        console.log('');
        console.log('Slow spec runtime: ', specDt, ' milliseconds');
        console.log(data.results.fullName);
        console.log('');
      }

      var stringifyStartTime0 = Date.now();
      console.log('jasmine_spec_result' + JSON.stringify([].concat(data.results)));
      var stringifyDt = Date.now() - stringifyStartTime0;

      if(stringifyDt > 5) {
        console.log('');
        console.log('Slow spec serialization: ', stringifyDt, ' milliseconds');
        console.log(data.results.fullName);
        console.log('');
      }

      specTimingStart = Date.now();
    } else if (data.state === 'suiteDone') {
      var suiteDt = Date.now() - specTimingStart;
      if (suiteDt > 1000) {
        console.log('');
        console.log('Slow suite runtime: ', suiteDt, ' milliseconds');
        console.log(data.results.fullName);
        console.log('');
      }

      var stringifyStartTime0 = Date.now();
      console.log('jasmine_suite_result' + JSON.stringify([].concat(data.results)));
      var stringifyDt = Date.now() - stringifyStartTime0;

      if(stringifyDt > 5) {
        console.log('');
        console.log('Slow suite serialization : ', stringifyDt, ' milliseconds');
        console.log(data.results.fullName);
        console.log('');
      }

      specTimingStart = Date.now();
    } else {
      console.log('done son!')

      var stringifyStartTime0 = Date.now();
      console.log('jasmine_done' + JSON.stringify(data.details));
      var stringifyDt = Date.now() - stringifyStartTime0;

      if(stringifyDt > 5) {
        console.log('');
        console.log('Slow done serialization : ', stringifyDt, ' milliseconds');
        console.log(Object.keys(data.details));
        console.log('');
      }

      phantom.exit(0);
    }
  };

  if (showConsoleLog) {
    page.onConsoleMessage = function(message) {
      console.log(message);
    };
  }

  page.open(url, function(status) {
    if (status !== "success") {
      phantom.exit(1);
    }
  });
}).call(this);
