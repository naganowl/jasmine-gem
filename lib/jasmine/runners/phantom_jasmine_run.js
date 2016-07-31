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

  page.onCallback = function(data) {
    if(data.state === 'specDone') {
      var time0 = Date.now();
      console.log('jasmine_spec_result' + JSON.stringify([].concat(data.results)));
      var dt = Date.now() - time0;

      if(dt > 5) {
        console.log('');
        console.log('Slow spec: ', dt, ' milliseconds');
        console.log(data.results.fullName);
        console.log('');
      }
    } else if (data.state === 'suiteDone') {
      var time0 = Date.now();
      console.log('jasmine_suite_result' + JSON.stringify([].concat(data.results)));
      var dt = Date.now() - time0;

      if(dt > 5) {
        console.log('');
        console.log('Slow spec: ', dt, ' milliseconds');
        console.log(data.results.fullName);
        console.log('');
      }
    } else {
      console.log('jasmine_done' + JSON.stringify(data.details));
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
