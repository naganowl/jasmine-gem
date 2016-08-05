function PhantomReporter() {
  this.jasmineDone = function(details) {
    window.callPhantom({ state: 'jasmineDone', details: details });
  };

  this.specDone = function(results) {
    var safeResults = {
      id: results.id,
      status: results.status,
      fullName: results.fullName,
      description: results.description,
      pendingReason: results.pendingReason,
      failedExpectations: results.failedExpectations.map(ensureSafeExpectation),
      passedExpectations: results.passedExpectations.map(ensureSafeExpectation)
    };

    window.callPhantom({ state: 'specDone', results: safeResults });
  };

  this.suiteDone = function(results) {
    var safeResults = {
      id: results.id,
      status: results.status,
      fullName: results.fullName,
      description: results.description,
      failedExpectations: results.failedExpectations.map(ensureSafeExpectation)
    };

    window.callPhantom({ state: 'suiteDone', results: safeResults });
  }

  function ensureSafeExpectation(expectation) {
    var safeExpectation = {
      matcherName: expectation.matcherName,
      message: expectation.message,
      passed: expectation.passed,
      stack: expectation.stack,
      expected: ensureSafeObject(expectation.expected),
      actual: ensureSafeObject(expectation.actual)
    };

    return safeExpectation;
  }

  function ensureSafeObject(object) {
    switch (true) {
      case _.isElement(object): return '<element>';
      case _.isArray(object): return '<array>';
      case _.isObject(object): return '<object>';
      case _.isArguments(object): return '<arguments>';
      case _.isFunction(object): return '<function>';
      case _.isString(object): return '<string>';
      case _.isNumber(object): return '<number>';
      case _.isFinite(object): return '<finite>';
      case _.isBoolean(object): return '<boolean>';
      case _.isDate(object): return '<date>';
      case _.isRegExp(object): return '<reg-exp>';
      // case _.isError(object): return '<error>';
      case _.isNaN(object): return '<nan>';
      case _.isNull(object): return '<null>';
      case _.isUndefined(object): return '<undefined>';
      default: return '<unknown>';
    }
  }
}

jasmine.getEnv().addReporter(new PhantomReporter());
