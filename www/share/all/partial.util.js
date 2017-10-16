_.$ = function(val) { return function() { return $(val) }; };
_.location = {};
_.location.href = function(url) {
  var t_url = _.s$(url);
  return function($) {
    location.href = t_url($);
  }
};
_.redirect = function(url, fn) {
  if (!arguments.length) return _.if(function() { location.reload() });
  return function(res) {
    if (!res) return (fn || _(_.loge, 'result: ' + res))();
    window.location.href = /\?$/.test(url) ? _.reduce(res, function(m, v, k) { return v ? m += '&'+k+'='+v : m }, url) : _.s$(url)(res);
  };
};
_.confirm = function(msg, yes_fn, no_fn) {
  var f = _.if(function() { return confirm(msg) }, yes_fn);
  return no_fn ? f.else(no_fn) : f;
};
_.test = function() {
  var fails = _.constant([]), all = _.constant([]), fna = _.constant([fails(), all()]);
  return _.go.async([_.constant('------------Start------------'), _.log, _.constant(arguments),
    _(_.map, _, function(f, k) {
      return _.If(__.async(all, _.m('push', k + ' ----> success')))
        .else(__.async(fna, _(_.map, _, __.async(_.identity, _.m('push', k + ' ----> fail')))))(f());
    }),
    _.constant('------------Fail-------------'), _.log,
    fails, _(_.each, _, __.async(_.identity, _.error)),
    _.constant('------------All--------------'), _.log,
    all, _(_.each, _, __.async(_.identity, _.log)),
    _.constant('------------End--------------'), _.log]);
};

_.commify = G.$commify = function(n) {
  var reg = /(^[+-]?\d+)(\d{3})/;
  n += '';
  while (reg.test(n))
    n = n.replace(reg, '$1' + ',' + '$2');
  return n;
};


// G.$cid = function(attrs) {
//   return attrs.id ? '(#'+attrs.id+')' : _.isString(attrs.cid) ? '($.cid==`'+attrs.cid+'`)' : '($.cid=='+attrs.cid+')';
// };

G.$cid = function(attrs) {
  if (arguments.length == 2)
    return attrs[arguments[1]+'_id'] ? _.isString(attrs[arguments[1]+'_id']) ? '(#`'+attrs[arguments[1]+'_id']+'`)' : '(#'+attrs[arguments[1]+'_id']+')'
    : _.isString(attrs[arguments[1]+'_cid']) ? '($.cid==`'+attrs[arguments[1]+'_cid']+'`)' : '($.cid=='+attrs[arguments[1]+'_cid']+')';

  return attrs.id ? '(#'+attrs.id+')' :
    _.isString(attrs.cid = attrs.cid || _.unique_id('c')) ?
      '($.cid==`'+attrs.cid+'`)' : '($.cid=='+attrs.cid+')';
};

G.thumbnail = G.thumb = function(url, thumb) {
  if(!url || !thumb) return url;
  return url.replace(/\/(original|150|500|600)\//, '/' + thumb + '/');
};

G.to_150 = function(url) {
  if(!url) return url;
  return url && url.replace(/(.[^/.]+$)$/, "_150x0$1");
};

G.date_yy_mm_dd = function(date) {
  return date ? moment(date).format('YY-MM-DD') : '-';
};

G.$und = function(target) {
  return target === undefined ? 'undefined' : target;
};

G.$location = function(format) {
  var location = document.location;
  return _.extend(location, {
    params: (function() {
      if (!format) return {};
      var splitedFormat = format.split('/');
      var splitedPathname = location.pathname.split('/');
      var params = {};
      _.each(splitedFormat, function(val, index) {
        if (val[0] === ':') {
          params[val.substr(1)] = splitedPathname[index];
        }
      });
      return params;
    })(),
    query: (function() {
      if (!location.search) return {};
      return location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    })()
  });
};

G.$replace_to_p = function(str, h1) {
  return _.go(
    str.split(/\n/),
    _.sum(_.t$('\
      {{_.go($, ', _.if(h1 ? _.t$('\
        h1 {{$}}\
      ') : _.t$('\
        p {{$}}\
      ')).else(_.t$('\
        br\
      ')),')}}\
      ')))
};