_.or = function() {
  var fns = arguments;
  return function() {
    return function f(res, i) {
      if (i == fns.length) return;
      return _.go(res, fns[i], function(res) {
        return res || _.go(_.mr(res, i+1), f);
      });
    }(_.to_mr(arguments), 0);
  }
};

__.debug = function() {
  var args = arguments;
  var i = 0;
  var new_args = _.reduce(args, function(memo, arg) {
      return memo.concat(arg, _.Hi('debug-----' + ++i))
    }, []);
  return _.pipe.apply(null, new_args);
}

_.debug = function() {
  var args = _.rest(arguments);
  args.unshift(_.Hi('~~~~~~~~~~lets git it~~~~~~~~~~~~'));
  return __.debug.apply(null, args)(_.first(arguments))
};

_.join = function(a) {
  return a.join(' ');
}

_.split_s = function(a) {
  return a.split(/\s+/g)
}

_.super_compact = function(a) {
  return _.map(_.compact(a), function(v) {
    return !/^\s+$/.test(v)
  })
}