G.$form_$to_obj = function($parent) {
  return G.$inputs_$to_obj($.find($parent, '[name]'));
};

G.$inputs_$to_obj = _.reduce(function(obj, input) {
  return input.type == "radio" && !input.checked ? obj : obj[input.name] = $.val(input), obj;
}, {});

G.$form_$to_attrs = G.$form_$to_obj;

G.$notice_item_$close = __(
  $.remove_class('selected'),
  $.find('.detail'),
  $.remove
);

G.$this_targets = function(e) {
  this.$currentTarget = this.$cTarget = e.$currentTarget;
  this.$delegateTarget = this.$dTarget = e.$delegateTarget;
  this.target = e.target;
  return e;
};

G.$box_$update_view = (function() {
  return __(
    $,
    _.each(function(el) {
      var selector = el.getAttribute('_sel'),
        update = el.getAttribute('box_update'), update1 = el.getAttribute('box_update1'), update2 = el.getAttribute('box_update2'), update3 = el.getAttribute('box_update3'),
        updating = el.getAttribute('box_updating'), updating1 = el.getAttribute('box_updating1'), updating2 = el.getAttribute('box_updating2');

      var data = box.sel(selector);

      if (updating || updating1) data = G[updating || updating1](data);
      else if (updating2) data = G[updating2](data, $(el));

      if (update || update1) return G[update || update1]($(el), data);
      else if (update2) return G[update2](data, $(el));
      else if (update3) return G[update3]($(el), selector, data);

      return _update(el, data);
    })
  );

  function _update(el, data) {
    if (el.nodeName == 'INPUT') {
      if (el.type == 'radio') return el.checked = el.value == data;
      if (el.type == 'checkbox') return el.checked = data;
      return $.val(el, data);
    }
    if (el.nodeName == 'SELECT') return $.val(el, data);
    return $.html(el, data);
  }
})();

G.update_query_str = function(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  return uri.match(re) ? uri.replace(re, '$1' + key + "=" + value + '$2') : uri + separator + key + "=" + value;
};

G.query_str = function(search) {
  if (!search) return {};
  return search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
};