module.exports = function(_, knex) {
  var omit_1 = data => _.omit(data, function(val, key) {
    return key == "_" || key.indexOf('__') == 0;
  });

  var omit_2 = data => _.map(_.wrap_arr(data), omit_1);

  function q(t) {
    if (t.match(/\(([^]*?)\)/)) {
      var $1 = RegExp.$1;
      return t.replace($1, q($1));
    }
    if (t.match(/\./)) return _.map(t.split('.'), q).join('.');
    return t == '*' ? t : '"' + t.replace(/"/g, '') + '"';
  }

  function make_select_func(data, returning) {
    return _.map(returning ? (_.reject(_.isArray(returning) ? returning : returning.split(/\s*,\s*/g), function(val) {
        return val == "_" || val.indexOf('__') == 0;
      })) :
        _.keys(omit_1(_.isArray(data) ? _.defaults.apply(null, [{}].concat(data)) : data))
      , q).join(',');
  }
  // 'count(*), max("s"."age")'.replace(/\((.*?)\)/g, '("$1")')
  function returning_func(data, returning) {
    var _returning = make_select_func(data, returning);
    return _returning == '' ? 'id' : _returning + ',id';
  }

  var _pg;
  var $ = _pg = function() {
    var args = _.flatten(arguments);
    return _.go(args,
      _.to_mr,
      _.args,
      _.flatten,
      _.reject(_.isUndefined),
      (v) => v.join(' '));
  };

  _pg.data_utc_date = function(data) {
    var map_obj =  _.map_object(function (val) {
      if (!_.isObject(val) || val.constructor !== Date) return val;
      return val.toUTCString();
    });
    return _.isArray(data) ? _.map(data, function(val) { return map_obj(val); }) : map_obj(data);
  };

  _pg.trx = (trx, tr_promise) => ({
    trx: trx,
    rollback: (msg) => {
      return new knex.Promise((rs) => {
        trx.rollback(msg);
        tr_promise.catch((err) => rs(err));
      });
    },
    commit: (data) => {
      trx.commit(data);
      return tr_promise.then(_.idtt);
    }
  });

  _pg.transaction = _.cb((cb1) => {
    var tr_promise;
    _.go(void 0,
      _.cb((cb2) => tr_promise = knex.transaction((trx) => cb2(trx))),
      (trx) => cb1(_pg.trx(trx, tr_promise)));
  });
  _pg.raw = (raw_query) => knex.raw(raw_query).then(_.identity);
  _pg.raw.trx = (raw_query, trx) => knex.raw(raw_query).transacting(trx.trx).then(_.identity);

  _pg.insert = _.pipe(
    _pg.insert_str = (table, data, returning) => {
      return _pg(knex(table).insert(omit_2(_pg.data_utc_date(data))).toString(),
        'returning', returning_func(data, returning))
    },
    _pg.i_u_d_raw_str = _.pipe(
      _pg.raw, _.property('rows'), v => v.length == 0 ? null : v.length == 1 ? v[0] : v));

  _pg.insert.trx = _.pipe(
    function() {
      return _.mr(_pg.insert_str.apply(null, _.initial(arguments)), _.last(arguments));
    },
    _pg.i_u_d_raw_trx_str = _.pipe(
      _pg.raw.trx,
      _.property('rows'),
      v => v.length == 0 ? null : v.length == 1 ? v[0] : v));

  _pg.update = _.pipe(
    _pg.update_str = (table, data, tail, returning) =>
      _pg(knex(table).update(omit_1(_pg.data_utc_date(data))).toString(), _pg.tail(tail),
        'returning', returning_func(data, returning)),
    _pg.i_u_d_raw_str);

  _pg.update.trx = _.pipe(
    function() {
      return _.mr(_pg.update_str.apply(null, _.initial(arguments)), _.last(arguments));
    },
    _pg.i_u_d_raw_trx_str);

  _pg.del = _.pipe(
    _pg.del_str = (table, tail, returning) => _pg('delete', 'from', table, _pg.tail(tail),
      'returning', returning_func({id: null}, returning)),
    _pg.i_u_d_raw_str);

  _pg.del.trx = _.pipe(
    function() {
      return _.mr(_pg.del_str.apply(null, _.initial(arguments)), _.last(arguments));
    },
    _pg.i_u_d_raw_trx_str);

  _pg.tail =
    _.If(_.pipe(
      v => _.isFunction(v) ? v() : v,
      v => _.isString(v) ? v : _pg.where(v)))
      .else(_.constant(''));

  _pg.column = _.pipe(columns => _.isArray(columns) ? columns.join(',') : columns);

  _pg.wrap = _.pipe(str => '(' + str + ')');

  _pg.or = remove_select__(knex.orWhere);
  _pg.and = remove_select__(knex.andWhere);

  _pg.where = function() { return _pg('where', _pg.and.apply(null, arguments)) };

  _pg.not = remove_select__(knex.whereNot);
  _pg.in = remove_select__(knex.whereIn);

  _pg.node = _.pipe((as, cols) =>
    _.map(_.isArray(cols) ? cols : cols.split(/\s*,\s*/g), val => q(as) + '.' + q(val)).join(', '));

  _pg.node_all = _.pipe(
    _.args,
    _(_.map, _, _.pipe((args) => _pg.node(args[0], args[1]))),
    _('join', ', '));

  _pg.node_as = _.pipe((as, cols, table, sep) =>
    _.map(_.isArray(cols) ? cols : cols.split(/\s*,\s*/g), val => q(as) + '.' + q(val) + ' as ' + q(table + sep + val)).join(', '));

  _pg.node_as_all = _.pipe(
    _.args,
    _(_.map, _, _.pipe((args) => _pg.node_as(args[0], args[1], args[2], args[3]))),
    _('join', ', '));

  _pg.select1 = _pg.select_one = _pg.find = _.pipe(
    _pg.select1_str = _pg.select_one_str = _pg.find_str = (columns, table, tail) =>
      _pg('select', make_select_func({}, _pg.column(columns)), 'from', table, _pg.tail(tail), 'limit 1'),
    _pg.raw, _.property('rows'), _.first);

  _pg.select = _pg.filter = _.pipe(
    _pg.select_str = _pg.filter_str = (columns, table, tail) =>
      _pg('select', make_select_func({}, columns), 'from', table, _pg.tail(tail)),
    _pg.raw, _.property('rows'));

  // ------------------------------------scheme----------------------------------------------------------

  var $$ = _pg.scheme = _.extend((name) => _pg.scheme._[name], { _: {} });
  _pg.s = _pg.scheme;
  _pg.scheme.add = (name, table, rels) => {
    if (!_pg.scheme._[name]) _pg.scheme._[name] = { table: {} };
    _pg.scheme._[name].name = name;
    _.extend(_pg.scheme._[name].table, table);
    _.each(_pg.scheme._[name].table.rels = rels, (rel) => {
      if (!_pg.scheme._[rel.name]) _pg.scheme._[rel.name] = { table: {}, name: rel.name };
      rel.table = _pg.scheme._[rel.name].table;
    });
  };
  _pg.scheme.virtuals = function(name, obj) {
    var s = _pg.scheme(name);
    if (!s.table.virtuals) return obj;
    return _.extend(obj, s.table.virtuals(_.omit(obj, '_')));
  };

  function _modifier(obj, keys, fn) {
    var cloned = _.clone(obj);
    _.each(keys, function(key) { cloned[key] = fn(cloned[key]); });
    return cloned;
  }

  _pg.scheme.insert = _.indent(
    _pg.scheme.insert_str = (scheme, data, returning) => {
      var date = (new Date()).toUTCString();
      var table = _pg.scheme(scheme).table;
      return _pg(knex(table.table_name).insert(_.map(_.wrap_arr(data), function(data) {
          if (table.jsonb) data = _modifier(data, table.jsonb, JSON.stringify);
          return _.extend(omit_1(_pg.data_utc_date(data)), _.object(table.timestamps, [date, date]));
        })).toString(),
        'returning', returning_func(data, returning));
    },
    _pg.i_u_d_raw_str,
    _pg.i_u_virtuals = function(rows) {
      var sname = this.arguments[0];
      return _.isArray(rows) ? _.each(rows, row => _pg.scheme.virtuals(sname, row)) : _pg.scheme.virtuals(sname, rows);
    });

  _pg.scheme.insert.trx = _.indent(
    function() {
      return _.mr(_pg.scheme.insert_str.apply(null, _.initial(arguments)), _.last(arguments));
    },
    _pg.i_u_d_raw_trx_str,
    _pg.i_u_virtuals);

  _pg.scheme.update = _.indent(
    _pg.scheme.update_str = (scheme, data, tail, returning) => {
      var date = (new Date()).toUTCString();
      var table = _pg.scheme(scheme).table;
      if (table.jsonb) data = _modifier(data, table.jsonb, JSON.stringify);
      return _pg(knex(table.table_name).update(_.extend(omit_1(_pg.data_utc_date(data)), _.object([table.timestamps[1]], [date]))).toString(),
        _pg.tail(tail), 'returning', returning_func(data, returning));
    },
    _pg.i_u_d_raw_str,
    _pg.i_u_virtuals);

  _pg.scheme.update.trx = _.indent(
    function() {
      return _.mr(_pg.scheme.update_str.apply(null, _.initial(arguments)), _.last(arguments));
    },
    _pg.i_u_d_raw_trx_str,
    _pg.i_u_virtuals);

  _pg.scheme.del = _.pipe(
    _pg.scheme.del_str = (scheme, tail, returning) => {
      return _pg('delete', 'from', _pg.scheme(scheme).table.table_name, _pg.tail(tail),
        'returning', returning_func({id: null}, returning));
    },
    _pg.i_u_d_raw_str);

  _pg.scheme.del.trx = _.pipe(
    function() {
      return _.mr(_pg.scheme.del_str.apply(null, _.initial(arguments)), _.last(arguments));
    },
    _pg.i_u_d_raw_trx_str);

  var push_squery = (arr, val) => _.go(
    _.map(val, _.pipe(_.idtt)),
    val => arr.push(val),
    _.constant(arr));

  _pg.scheme.join = _.pipe(
    _pg.scheme.squeries_group = _.Spread(
      _.map(_.pipe((squeries) =>
        _.reduce(_.wrap_arr(squeries), _.pipe((memo, squery) =>
          _.isArray(squery) ? push_squery(memo, squery) : memo.concat(_.map(squery.split('.'), (v) => ['*', v]))), [])))),
    function(squeries_group) {
      var columns = [];
      var inner_joins = [];

      var col_as_tail = squeries_group[0][0];
      var start_as = col_as_tail[1].split(/\s\s*as\s\s*/);
      if (!start_as[1]) start_as[1] = start_as[0];
      var start = _pg.scheme(start_as[0]);
      var cols = col_as_tail[0];

      columns.push([
        start.name, cols == '*' ? start['*'] || start.table['*'] : cols, start.name, '__']);

      var complete = {};
      _.each(squeries_group, (squeries) => {
        var right = start;
        var right_as = start_as;
        _.each(_.rest(squeries), (col_as_tail) => {
          var cols = col_as_tail[0];
          var tail = col_as_tail[2] || '';
          var left = right;
          var left_as = right_as;
          right_as = col_as_tail[1].split(/\s\s*as\s\s*/);
          if (!right_as[1]) right_as[1] = right_as[0];
          right = left.table.rels[right_as[0]];
          if (complete[right_as[1]]) return ;
          columns.push([
            right_as[1], cols == '*' ? right['*'] || right.table['*'] : cols, right_as[1], '__']);

          var inner_join = ['inner join', q(right.table.table_name), 'as', q(right_as[1]),
            'on',
            q(!right.poly && right.type.match(/has_/) ? right_as[1] : left_as[1]) + '.' + q(right.f_key), '=', q(!right.poly && right.type.match(/has_/) ? left_as[1] : right_as[1]) + "." +
            (!right.poly ? "id" : [right.poly.id, 'and', q(right_as[1]) + "." + q(right.poly.key), "='" +right.poly.val + "'"].join(' '))];
          if (tail) inner_join = inner_join.concat('and (', tail, ')');
          inner_joins.push(inner_join);
          complete[right_as[1]] = true;
        });
      });
      return _.go(
        _pg('select',
          _pg.node_as_all.apply(null, columns),
          'from', q(start.table.table_name), 'as', q(start.name), inner_joins,
          _pg(_.rest(arguments))
        ),
        _pg.raw,
        _.property('rows'),
        _.map((result) => {
          var result_obj = { _:{} };
          var _insert = (result, obj, table_name) => {
            return _.each(result, (val, key) => {
              if (key.indexOf(table_name+"__") == 0) obj[key.substr(table_name.length+2)] = val;
            });
          };
          _insert(result, result_obj, start.name);
          _pg.scheme.virtuals(start.name, result_obj);

          _.each(squeries_group, (squeries) => {
            var rel = result_obj._;
            var s = _pg.scheme(start.name);
            _.each(_.rest(squeries), (squerie) => {
              var keys = squerie[1].split(/\s\s*as\s\s*/);
              var key = keys[1] || keys[0];
              rel[key] = { _:{} };
              _insert(result, rel[key], key);
              _pg.scheme.virtuals(s.table.rels[key].name, rel[key]);
              rel = rel[key]._;
              s = _pg.s(s.table.rels[key].name);
            });
          });
          return result_obj;
        }));
    }
  );

  _pg.scheme.join_count = _.pipe(
    _pg.scheme.squeries_group,
    function(squeries_group) {
      var columns = [];
      var inner_joins = [];

      var col_as_tail = squeries_group[0][0];
      var start_as = col_as_tail[1].split(/\s\s*as\s\s*/);
      if (!start_as[1]) start_as[1] = start_as[0];
      var start = _pg.scheme(start_as[0]);
      var cols = col_as_tail[0];

      columns.push([
        start.name, cols == '*' ? start['*'] || start.table['*'] : cols, start.name, '__']);

      var complete = {};
      _.each(squeries_group, (squeries) => {
        var right = start;
        var right_as = start_as;
        _.each(_.rest(squeries), (col_as_tail) => {
          var cols = col_as_tail[0];
          var tail = col_as_tail[2] || '';
          var left = right;
          var left_as = right_as;
          right_as = col_as_tail[1].split(/\s\s*as\s\s*/);
          if (!right_as[1]) right_as[1] = right_as[0];
          right = left.table.rels[right_as[0]];
          if (complete[right_as[1]]) return ;
          columns.push([
            right_as[1], cols == '*' ? right['*'] || right.table['*'] : cols, right_as[1], '__']);

          var inner_join = ['inner join', q(right.table.table_name), 'as', q(right_as[1]),
            'on',
            q(!right.poly && right.type.match(/has_/) ? right_as[1] : left_as[1]) + '.' + q(right.f_key), '=', q(!right.poly && right.type.match(/has_/) ? left_as[1] : right_as[1]) + "." +
            (!right.poly ? "id" : [right.poly.id, 'and', q(right_as[1]) + "." + q(right.poly.key), "='" +right.poly.val + "'"].join(' '))];
          if (tail) inner_join = inner_join.concat('and (', tail, ')');
          inner_joins.push(inner_join);
          complete[right_as[1]] = true;
        });
      });
      return _.go(
        _pg('select',
          'count(*)',
          'from', q(start.table.table_name), 'as', q(start.name), inner_joins,
          _pg(_.rest(arguments))
        ),
        _pg.raw, _.val('rows'), _.first, _.val('count'), _(parseInt, _, 10));
    }
  );

  var pg_s_filters = [];
  _pg.scheme.select = _pg.scheme.filter = _.indent(
    _pg.scheme.squeries_group,
    pg_s_filters[0] = (squeries_group) => {
      var merged_squeries_group = {};
      _.each(squeries_group, (squeries) => {
        var current_merged = merged_squeries_group;
        var stable;
        _.each(squeries, (col_as_tail) => {
          var col = col_as_tail[0];
          var as = col_as_tail[1];
          var tail = col_as_tail[2];
          stable = stable ? stable.table.rels[as] : _pg.scheme(as);
          if (!current_merged[as]) {
            current_merged[as] = { col_stable_tail: [
              col != '*' ? col : stable['*'] || stable.table['*'] || '*',
              stable,
              tail || stable.tail || stable.table.tail], _: {} };

            current_merged = current_merged[as]._;
            return;
          }

          if (col != '*') current_merged[as].col_stable_tail[0] = col;
          if (tail) current_merged[as].col_stable_tail[2] = tail;
          current_merged = current_merged[as]._;
        })
      });
      return merged_squeries_group[_.keys(merged_squeries_group)[0]];
    },
    pg_s_filters[1] = _pg._filter_ready = (start_squery, key) => {
      var scheme = start_squery.col_stable_tail[1];
      return _.mr(start_squery, start_squery.col_stable_tail[0], scheme, start_squery.col_stable_tail[2],
        scheme.table.table_name, _.reduce(start_squery._, (mem, rel, key) => {
          var rel2 = scheme.table.rels[key];
          if (rel2.type != 'belongs_to') return mem;
          return mem.concat(rel2.f_key);
        }, []), key);
    },
    (start_squery, cols, scheme, tail, table_name, f_keys) => _.mr(start_squery,
      _pg.filter(_pg(cols + (cols !== '*' && f_keys.length ? ',' + f_keys.join(',') : '')), table_name, tail)),
    pg_s_filters[2] = (start_squery, start_results) => {
      if (!_.size(start_squery._))
        return _.each(start_results, v => _pg.scheme.virtuals(start_squery.col_stable_tail[1].name, v));
      return _.go(
        _.mr(start_squery, start_results),
        function recur(start_squery, start_results) {
          _.each(start_results, v => _pg.scheme.virtuals(start_squery.col_stable_tail[1].name, v));

          if (!_.size(start_squery._) || !start_results.length) return ;
          return _.each(start_squery._, _.pipe(
            pg_s_filters[1],
            (start_squery2, cols, scheme, tail, table_name, f_keys, key) => {
              var where_in, arr, pluck, ids = ['id'], and = {};
              if (scheme.poly && scheme.poly.id) ids.push(scheme.poly.id);

              var columns = cols == '*' ? '*' : cols.split(/\s*,\s*/).concat(f_keys).concat(ids);
              if (scheme.type == 'has_many') {
                _.isArray(columns) && columns.push(scheme.f_key);
                if (scheme.poly && scheme.poly.id) {
                  pluck = _.compact(_.pluck(start_results, scheme.f_key));
                  if (!pluck.length) return ;
                  and[scheme.poly.key] = scheme.poly.val;
                  where_in = _pg(_pg.in(scheme.poly.id, pluck), 'and', _pg.and(and));
                  arr = [_.groupBy, scheme.f_key, _.last(ids), true];
                } else {
                  pluck = _.compact(_.pluck(start_results, 'id'));
                  if (!pluck.length) return ;
                  where_in = _pg.in(scheme.f_key, pluck);
                  arr = [_.groupBy, _.last(ids), scheme.f_key, true];
                }
              } else if (scheme.type == 'has_one') {
                _.isArray(columns) && columns.push(scheme.f_key);
                if (scheme.poly && scheme.poly.id) {
                  pluck = _.compact(_.pluck(start_results, scheme.f_key));
                  if (!pluck.length) return ;
                  and[scheme.poly.key] = scheme.poly.val;
                  where_in = _pg(_pg.in(scheme.poly.id, pluck), 'and', _pg.and(and));
                  arr = [_.indexBy, scheme.f_key, _.last(ids), false];
                } else {
                  pluck = _.compact(_.pluck(start_results, 'id'));
                  if (!pluck.length) return ;
                  where_in = _pg.in(scheme.f_key, pluck);
                  arr = [_.indexBy, _.last(ids), scheme.f_key, false];
                }
              } else if (scheme.type == 'belongs_to') {
                pluck = _.compact(_.pluck(start_results, scheme.f_key));
                if (!pluck.length) return ;
                if (scheme.poly && scheme.poly.id) {
                  and[scheme.poly.key] = scheme.poly.val;
                  where_in = _pg(_pg.in(scheme.poly.id, pluck), 'and', _pg.and(and));
                } else where_in =  _pg.in('id', pluck);
                arr = [_.indexBy, scheme.f_key, _.last(ids), false];
              }

              return _.go(
                _pg.filter(_pg.column(_.isArray(columns) ? _.uniq(columns) : columns), table_name,
                  _pg('where', where_in, tail && _.go(tail, _('replace', 'where', 'and')))),
                (list) => {
                  var group_or_index = arr[0](list, arr[2]);
                  return recur(start_squery._[key], _.reduce(start_results, (mem, val) =>
                      mem.concat((val._ = val._ || {})[key] = group_or_index[val[arr[1]]] || (arr[3] ? [] : {}))
                    , []));
                });
            }));
        },
        _.always(start_results)
      );
    }
  );

  _pg.scheme.select_one = _pg.scheme.find = _.pipe(
    _pg.scheme.squeries_group,
    pg_s_filters[0],
    pg_s_filters[1],
    (start_squery, cols, scheme, tail, table_name, f_keys) => _.mr(start_squery,
      _pg.filter(_pg(cols + (cols !== '*' && f_keys.length ? ',' + f_keys.join(',') : '')), table_name,
        tail && _.go(tail, _('replace', /limit [0-9]+|limit null/, ''), tail => tail + ' limit 1'))),
    pg_s_filters[2],
    _.first
  );

  _pg.scheme.load = (list, deep, squeries_group) => {
    var is_list = _.isArray(list);
    if (!is_list) list = [list];
    return _.go(
      squeries_group || deep,
      _pg.scheme.squeries_group,
      pg_s_filters[0],
      pg_s_filters[1],
      _.Spread(_.idtt, _.always(_.compact(_[squeries_group ?  'deep_pluck' : 'idtt'](list, deep)))),
      pg_s_filters[2],
      _.always(list),
      is_list ? _.idtt : _.first
    );
  };

  function remove_select__(func) {
    return _.pipe(function() {
      return func.apply(knex, arguments).toString().replace('select * where ', '');
    });
  }

  return {
    _pg: _pg,
    $: $,
    $$: $$
  };
};

