/**
 * Created by piljung on 2017. 3. 21..
 */
// partial x donjs
!function(_, $) {
  $.isolatedScroll = function(el) {
    el = $1(el);
    function eventCb(e) {
      var delta = (e.originalEvent && e.originalEvent.wheelDelta) || e.deltaY || -e.detail || e.wheelDelta ,
        bottomOverflow = this.scrollTop + $.outerHeight(this) - this.scrollHeight >= 0,
        topOverflow = this.scrollTop <= 0;

      if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) e.preventDefault();
    }
    $.on(el, 'DOMMouseScroll', eventCb);
    $.on(el, 'mousewheel', eventCb);
    return el;
  };

  $.component = $.ui = {
    infinite_scroll: function(container, opt, _t_each_template_func) {
      container = $1(container);
      if (!container) return ;
      var mc_is_items_1st = $.find(container, '.mc_is_item');

      var L = { _lists: [], _showed_lists: [] };

      var _option = _.extend({
        data: { limit: 20 },
        real_data: _.noop,
        is_card: true,
        image_width_percent: 100,
        min_row: 4,
        src_403: 'https://s3.marpple.co/s/5/homedeco/img/*.png'
      }, _.isFunction(opt) ? opt() : opt);

      var _item_width = $.outerWidth(mc_is_items_1st[0], true) || (_.isNumeric(_option.width) ? _option.width : ($.width(container) * parseInt(_option.width)/100));
      var _column = Math.floor($.width(container) / _item_width);
      for (var _last_line_bottoms = []; _last_line_bottoms.length < _column; _last_line_bottoms.push(0));
      var _min_bottom = 0;
      var _max_bottom = 0;

      var _page = mc_is_items_1st.length ? 0 : -1;
      var _limit = Math.max(_option.data.limit, _column * _option.min_row);
      console.log(_option.target)
      if (!!_option.target && _option.target != window) {
        var scroll_target = $.isolatedScroll(_option.target);
        var _client_height = scroll_target.clientHeight;
      } else {
        var scroll_target = window;
        var _client_height = window.innerHeight;
      }
      var _before_scroll_top = $.scrollTop(scroll_target);

      var _is_loading = false;
      var _is_last = false;
      var _last_area = {};
      return _.go(
        mc_is_items_1st,
        _.if(_.always(mc_is_items_1st.length), __(
          _option['mc_is_items setting top_left'] = ___(
            _.each(__(
              function(mc_is_item, index) {
                this.index = index;
                var mc_img_wrap = $.find1(mc_is_item, '.mc_img_wrap');
                return _.mr(mc_img_wrap ? {
                  width: parseInt(mc_img_wrap.getAttribute('width')),
                  height: parseInt(mc_img_wrap.getAttribute('height'))
                } : {}, $.appendTo(mc_is_item, container), mc_img_wrap);
              },
              _.cb(function(img_info, mc_is_item, mc_img_wrap, cb) {
                var args = _.initial(arguments);
                if (!mc_img_wrap || !_option.is_card || (img_info.width && img_info.height))
                  return cb.apply(null, args);
                var img = new Image();
                img.onload = img.onerror = function next(e) {
                  cb(_.mr({ width: img.naturalWidth, height: img.naturalHeight },
                    mc_is_item, mc_img_wrap, e.type == 'load' ? img.src : null));
                };
                img.src = _.go(mc_img_wrap, $.find1('img'), $.attr('src'));
              }),
              function(img_info, mc_is_item, mc_img_wrap, src) {
                var top = Math.min.apply(Math, _last_line_bottoms);
                var index_of = _.index_of(_last_line_bottoms, top);
                $.css(mc_is_item, {
                  top: top, left: index_of % _column * _item_width
                });
                $.addClass(mc_is_item, 'visible');
                if (mc_img_wrap) {
                  $.css(mc_img_wrap, { width : _option.image_width_percent + '%' });
                  if (_option.is_card) $.css(mc_img_wrap, {
                    'padding-bottom': img_info.height * _option.image_width_percent / img_info.width + '%'
                  });
                  if (src) _.go(mc_img_wrap, $.find1('img'), $.attr('src', src));
                }
                _last_line_bottoms[index_of] += $.outerHeight(mc_is_item, true);
              }
            )),
            function(mc_is_items) {
              _max_bottom = Math.max.apply(Math, _last_line_bottoms);
              _min_bottom = Math.min.apply(Math, _last_line_bottoms);
              $.css(container, { height: _max_bottom });
              L._showed_lists.push(L._lists[_page] = {
                list: mc_is_items,
                start: $.position(mc_is_items[0]).top,
                end: _max_bottom,
                offset: _page
              });
            }
          ))
        ),
        function() {
          _option['function ajax_call~'] = __(
            function () {
              _is_loading = true;
              return $.get(_option.url, _.extend({}, _option.data, _option.real_data(), { offset: _limit * (++_page), limit: _limit}));
            },
            _.if(_.property('length'), __(
              function (results) {
                var box_sel = window.box.sel(container);
                if (_.isArray(box_sel)) window.box.set(container, box_sel.concat(results));
                return results;
              },
              _t_each_template_func, $.el,
              _option['mc_is_items setting top_left']
            )).else(function () {
              _is_last = true;
              --_page;
            }),
            function () { _is_loading = false; }
          );
        },
        function() { return 0; },
        function initialize(___i) {
          if (___i > 10) return scroll_target;
          if (_client_height * 1.5 < _min_bottom) return scroll_target;
          return _.go(null,
            __(
              _option['function ajax_call~'],
              _.if(function() { return (_client_height * 1.5 >= _min_bottom); },
                __(function() { return ___i+1; }, initialize)
              ).else(_.always(scroll_target))
            ));
        },
        function() {
          var now_scroll_top = $.scrollTop(scroll_target);
          _.extend(_last_area, scroll_area(now_scroll_top, now_scroll_top + (scroll_target.clientHeight || _client_height)));
          $.off(scroll_target, 'scroll.ui_infinite_scroll');
          return function() {
            if (_is_loading) return ;
            var now_scroll_top = $.scrollTop(scroll_target);
            var is_down = _before_scroll_top < now_scroll_top;
            var _area = scroll_area(_before_scroll_top = now_scroll_top, now_scroll_top + (scroll_target.clientHeight || _client_height));
            if (is_down && !_is_last && now_scroll_top +(scroll_target.clientHeight || _client_height)*4/3 > _min_bottom)
              return _.go(null, _option['function ajax_call~']);
            if (!L._showed_lists.length
              || (_area.start === _last_area.start && _area.end === _last_area.end)
            ) return ;
            _is_loading = true;
            var f1 = _.first(L._showed_lists).offset;
            var e1 = _.last(L._showed_lists).offset;
            var f2 = _area.start;
            var e2 = _area.end > -1 ? _area.end : _page;
            var new_showed_lists = [];
            if (is_down) _.each(L._lists.slice(f1, e2 + 1), function(val) {
              var offset = val.offset;
              if (f2 <= offset && offset <= e1) new_showed_lists.push(val);
              else if (offset < f2) $.remove(val.list);
              else if (offset > e1) {
                $.append(container, val.list);
                new_showed_lists.push(val)
              }
            });
            else _.each(L._lists.slice(f2, e1 + 1), function(val) {
              var offset = val.offset;
              if (f1 <= offset && offset <= e2) new_showed_lists.push(val);
              else if (offset > e2) $.remove(val.list);
              else if (offset < f1) {
                $.append(container, val.list);
                new_showed_lists.push(val);
              }
            });
            L._showed_lists = new_showed_lists.sort(function(x, y) {
              return x.offset > y.offset;
            });
            _.extend(_last_area, _area);
            _is_loading = !_is_loading;
          };
        },
        _.tap(function(scroll_handler) {
          $.on(scroll_target, 'scroll.ui_infinite_scroll', scroll_handler)
        }),
        function(scroll_handler) {
          return {
            handler: scroll_handler,
            scroll_target: scroll_target
          }
        }
      );

      function scroll_area(top, bottom) {
        return {
          start: _.findIndex(L._lists, function(b) {
            return b.start <= top && top <= b.end;
          }),
          end: _.findLastIndex(L._lists, function(b) {
            return b.start <= bottom && bottom <= b.end;
          })
        };
      }
    },

    pagination: function(container, opt, _t_each_template_func) {
      var container = $1(container);
      if (!container) return ;
      var mc_pgn_wrap = $.find1(container, '.mc_pgn_wrap');
      var pagination = $.find1(container, '.mc_pagination');
      var _t_pagination = _.t('page, max_page', '\
      .pagination-wrap[style="visibility:hidden;"]\
        button.prev[type=button]\
        input.page_num[type=number value={{page}} min=1 max={{max_page}}]\
        span.slash \
        span.max {{max_page}}\
        button.next[type=button]\
        .message');

      var L = { lists: {} };

      var _option = _.extend({
        data: { limit: 20 },
        real_data: _.noop,
        is_memoize: false,
        is_url_state: true,
        render_server: true,
        scroll_top: true,
        total_count: function() {
          return window.box.sel('pagination_total_count') || 1;
        },
        paging_animate: $.html,
      }, _.isFunction(opt) ? opt() : opt);

      var pgn_items = window.box.sel(container);
      var timeout;
      return _.go(
        container,
        _.tap(__(
          _.spread(_option.get_page = function() {
            var offset = _option.is_url_state ? parseInt(G.query_str(location.search).offset) : 0;
            return !!offset ? (offset / _option.data.limit) + 1 : 1;
          }, _option.total_count),
          function(page, total_count) {
            return _.mr(page, Math.max(Math.ceil(total_count/_option.data.limit), 1));
          }),
          _.all(_.always(pagination), _t_pagination),
          $.html
        ),
        _.tap(function() {
          var message = $.find1(pagination, '.message');
          var page_num = $.find1(pagination, 'input.page_num');
          var n_p_button = $.find(pagination, 'button');

          $.on(page_num, 'change', _.throttle(__(
            function() {
              var page = parseInt($.val(page_num));
              $.text(message, '');
              if (parseInt(page_num.max) >= page && 1 <= page) {
                page_num.dataset =  page_num.dataset || {};
                page_num.dataset.before_val = page;
                return page;
              }
              page_num.dataset = page_num.dataset || {};
              $.val(page_num, page_num.dataset.before_val);
              $.text(message, _.i('잘못된 페이지 입니다.'));
            },
            _.all(
              _option['function ajax_call~2'] = _.if(_.is_numeric, __(
                function(page) {
                  _option.data.offset = page ? (page - 1) * _option.data.limit : 0;
                  return _.mr(page, L.lists[page]);
                },
                _.tap(function() {
                  if (_option.scroll_top) $.scrollTop(window, $.offset(container).top - 50);
                  timeout = setTimeout(function() {
                    $.append(container, '<div class="mc_pgn_container_loading"><div class="page_loader"></div></div>');
                  }, 200);
                }),
                _.if(function(page, results) {
                  return _option.is_memoize && results && results.length;
                }, function(page, results) {
                  return results;
                }).else(__(
                  function(page) {
                    return _.mr(page, $.get(_option.url, _.extend({}, _option.data, _option.real_data())));
                  },
                  function(page, results) {
                    if (_.isArray(pgn_items)) window.box.set(container, results);
                    return L.lists[page] = results;
                  }
                )),
                _.tap(function() {
                  clearTimeout(timeout);
                }),
                _t_each_template_func, $.el,
                _.all(_.always(mc_pgn_wrap), function(el) { return el == null ? '' : el; }, _.always(container)),
                _option.paging_animate,
                _.always(container),
                $.find('.mc_pgn_container_loading'),
                $.remove,
                _.always(n_p_button),
                $.removeClass('ing')
              )),
              _.if(_.is_numeric, function(page) {
                if (_option.is_url_state) window.history.replaceState({
                  state: page
                }, null, G.update_query_str(location.href, 'offset', _option.data.offset));
              }))
          ), 400));
          $.on(n_p_button, 'click', function(e) {
            var current_button = e.$currentTarget;
            if ($.hasClass(current_button, 'ing')) return ;
            var is_next = $.hasClass(current_button, 'next');
            var done_page = is_next ? parseInt(page_num.max) : 1;
            var page = parseInt($.val(page_num));
            $.text(message, '');
            if (page == done_page) return $.text(message, _.i((is_next ? '마지막' : '맨 앞') + ' 페이지 입니다.'));
            $.addClass(n_p_button, 'ing');
            $.val(page_num, page + (is_next ? 1 : -1));
            $.trigger(page_num, 'change');
          });

          var pagination_wrap = $.find(pagination, '.pagination-wrap');
          if (_option.render_server) return $.css(pagination_wrap, {visibility:'visible'});
          return _.go(parseInt($.val(page_num)), _option['function ajax_call~2'], function() {
            $.css(pagination_wrap, {visibility:'visible'});
          });
        })
      );
    }
  };

  // util
  $.safety_children = function f(el, sel) {
    return arguments.length == 1 ? _(f, _, el) : $.children(el, sel)[0] || $.appendTo($.hide($.el(_.t('', '  ' + sel)())), el);
  };
  $.remove_delegate_target = function(e) {
    return $.remove(e.$delegateTarget), e;
  };

  $.selectable = __(
    _.val('$currentTarget'),
    _.tap($.siblings('.selected'), $.remove_class('selected')),
    $.add_class('selected'));

  $.delegate_hide = __(
    _.val('$delegateTarget'),
    $.hide);
  $.stop_propagation = _tap(function(e){e.stopPropagation()});

  $.key_code = function(num) {
    return function() {
      return _.if(__(_.v('keyCode'), _.is_equal(num)), _.pipe(arguments))
    };
  };

  $.is_enter = $.key_code(13);

  $.body_fixed = function(is_addclass) {
    var $body = $1('body');
    if (is_addclass) {
      var top = $.scrollTop(window);
      $.css($.addClass($body, 'fixed'), {
        top: -top
      });
    } else {
      var top = $.offset($body).top;
      $.css($.removeClass($body, 'fixed'), {
        top: 'auto'
      });
      $.scrollTop($body, -top);
    }
  };

  !function(_routes) {
    var $body = $1('body');
    var $finder = _.s$('\
          > div.don_ui_page[page_ns="{{$.ns}}"][page_id="{{$.id}}"][page_name="{{$.name}}"][page_index="{{$.index}}"]');

    function popstate() {
      if (!history.state) return _.go(__, off_event, hide_prev_page);
      var state = history.state;
      _routes[state.ns].index = state.index;
      _routes[state.ns].states[state.index] = state;
      show_current_page();
    }

    function off_event() {
      _.each(_routes, function(route) {
        _.each(route.pages, function(page) {
          if (page.infi) $.off(page.infi.scroll_target, 'scroll.ui_infinite_scroll');
          $.off(window, 'scroll.last_scroll_top');
        });
      });
    }

    function show_current_page() {
      if (!history.state) return;
      var state = history.state;
      var route = _routes[state.ns];
      var $parent = route.$parent;
      var _page = route.pages[state.name];
      return _.go($parent,
        _.tap(function() {
          _.each(_routes, function(_route) {
            if (_route != route) _.each(_route.$switch, __($1, $.show));
          });
          _.each(route.$switch, __($1, $.hide));
        }),
        $.find1($finder(state)),
        _.tap(off_event, _(hide_prev_page, true)),
        _.if(_.tap(function() {
          /* 인피니티 스크롤 이벤트 살리기 */
          if (_page.infi) $.on(_page.infi.scroll_target, 'scroll.ui_infinite_scroll', _page.infi.handler);
        })).else(__(
          _(_page.t, state.data),
          _($.append, $.el(_.go(state, _.t$('\
            .don_ui_page[page_id={{$.id}} page_ns={{$.ns}} page_name={{$.name}} page_index={{$.index}}]')))),
          $.appendTo($parent),
          _.tap(_page.appended || _.identity),
          _.tap(_page.inifinite || _.noop, function(infi) {
            _page.infi = infi;
            _page.last_scroll_top = 0;
            _page.last_scroll_top_handler = function() {
              _page.last_scroll_top = $.scrollTop(window);
            };
          })
        )),
        $.show, $.add_class('is_show' + (route.is_modal ? ' fixed' : '')),
        _.tap(function($don_ui_page) {
          if (route.is_modal) $.isolatedScroll($.find1($don_ui_page, '>.page >.body'));
        }),
        _.tap(_(_.defer, function() {
          $.scrollTop(window, route.is_modal ? _routes.scroll_top : _page.last_scroll_top);
          $.body_fixed(route.is_modal);
          if (route.is_modal) return ;
          $.scrollTop(window, _page.last_scroll_top);
          $.on(window, 'scroll.last_scroll_top', _page.last_scroll_top_handler);
        })));
    }

    function hide_prev_page(is_not_work) {
      $.remove_class($.hide($1('div.don_ui_page.is_show')), 'is_show');
      if (is_not_work) return ;
      _.each(_routes, function(route) {
        _.each(route.$switch, function(select) {
          $.show($1(select));
        });
        if ($.hasClass($body, 'fixed')) $.body_fixed(false);
      });
      $.scrollTop(window, _routes.scroll_top);
    }

    function next_data(ns, name, id) {
      var _ns = _routes[ns];
      var state = _ns.states[_ns.index+1];
      return state && state.name == name && state.id == id && state.data;
    }

    function page_push(ns, name, id, data, url) {
      var route = _routes[ns];
      var states = route.states;
      var state = {
        id: id,
        ns: ns,
        name: name,
        data: data,
        url: url,
        index: history.state && history.state.ns == ns ? history.state.index + 1 : 0
      };
      if (history.state && states.length > (state.index) && !$.find1(route.$parent, $finder(state))) {
        _.each(_.rest(states, state.index), function(state) {
          $.remove($.find1(route.$parent, $finder(state)));
        });
        states.length = state.index;
      }
      route.index = state.index;
      states[state.index] = state;
      history.pushState(state, null, url);
      show_current_page();
    }

    $.page = {
      init: function(routes) {
        _.each(_.extend(_routes, routes), function(route, ns) {
          route.states = [];
          route.index = (history.state && history.state.ns == ns) ? history.state.index : undefined;
          if (route.index !== undefined) route.states[route.index] = history.state;
        });
        _routes.scroll_top = $.scrollTop(window);
        $.on(window, 'scroll.bottom', function() {
          if (!history.state) _routes.scroll_top = $.scrollTop(window);
        });
        popstate();
        _.defer(function() { window.onpopstate = popstate; });
      },
      back: function() { history.back(); },
      hide: function() { if (history.state) history.go(-(history.state.index + 1)); },
      go: function(ns, name_or_next, id_or_noback, data_func) {
        var next = _.identity;
        if (arguments.length == 4) return _.go(__,
          _.or(_(next_data, ns, name_or_next, id_or_noback), _(data_func, ns, name_or_next, id_or_noback)),
          _(page_push, ns, name_or_next, id_or_noback));
        if (name_or_next) next = name_or_next;

        var route = _routes[ns];
        if (route.index === undefined) {
          if (id_or_noback || !_.find(_routes, function(route, ns2) { return ns != ns2 && $.find1(route.$parent, '> .don_ui_page.is_show'); }))
            return next();
          hided = _.callback(function(cb) {
            window.onpopstate = function() { window.onpopstate = popstate; cb(); };
          });
          $.page.hide();
          return _.go(__, hided, next);
        }

        var hided = false;
        if ($.find1(route.$parent, '> .don_ui_page.is_show[page_ns="'+ ns +'"]'))
          return route.index > 0 ? history.go(-route.index) : void 0;
        else if (!id_or_noback && _.find(_routes, function(route) { return $.find1(route.$parent, '> .don_ui_page.is_show') })) {
          hided = new Promise(function(rs) {
            window.onpopstate = function() { window.onpopstate = popstate; rs(); };
          });
          $.page.hide();
        }

        return _.go(hided,
          function() {
            var range = _.range(route.index + 1);
            if (!_.every(_.first(route.states, route.index +1))) return _.each(range, function(i) {
              return _.callback(function(next) {
                if (route.states[i]) {
                  var state = route.states[i];
                  history.pushState(state, null, state.url);
                  if (route.index == i) show_current_page();
                  next();
                } else {
                  window.onpopstate = function() {
                    window.onpopstate = popstate;
                    var state = history.state;
                    _routes[ns].states[state.index] = state;
                    if (route.index == i) show_current_page();
                    next();
                  };
                  history.go(1);
                }
              })();
            }); else _.each(range, function(i) {
              var state = route.states[i];
              history.pushState(state, null, state.url);
              if (route.index == i) show_current_page();
            });
          });
      }
    };
  }({});
}(_, $);