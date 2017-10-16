G.$rrn = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
};

G.$res_$klass = (title, klass, body) => {
  return { title: title, klass: klass, body: body }
};

G.$res_$render = function(render_obj, res) {
  var box = this.box || _.box({});
  (res && res.render ? res : this.arguments[1]).render('index', _.extend(render_obj, {
    box: box.stringify()
  }));
};

G.$res_$json = function(value, res) {
  var _res = res || this.arguments[1];
  _res.set('Content-Type', 'application/json');
  _res.json(value);
  return res;
};

G.$save_$user_in_session = function(user) {
  return user ? this.arguments[0].session.user = user : null;
};

G.$save_$seller_in_session = function(seller) {
  return seller ? this.arguments[0].session.seller = seller : null;
};

G.$projection_$update = function(attrs) {
  return $$.update('projection', _.omit(attrs, ['id', 'user_id']), _.pick(attrs, 'id'));
};

G.$query_$projection_check = req => {
  const
    offset = req.query.offset || '0',
    limit = req.query.limit || '5',
    sort = req.query.sort || 'id',
    direction = req.query.direction || 'desc',
    campaign_id = req.query.campaign_id,
    name = req.query.name ? req.query.name.trim() : '',
    email = req.query.email ? req.query.email.trim() : '',
    number = req.query.number ? req.query.number.trim() : '',
    date = req.query.date,
    start = req.query.start ? parseInt(req.query.start) : '',
    end = req.query.end ? parseInt(req.query.end) : '';

  let
    where = 'where status = \'ordered\'',
    sub_where = date ? `where ${date} between'${(new Date(start)).toUTCString()}' and '${(new Date(end)).toUTCString()}'` : '',
    tail = `order by ${sort} ${direction} offset ${offset} limit ${limit}`;

  if (campaign_id) where += ` and campaign_ids \\? '${campaign_id}'`;
  if (name) where += ` and (orderer_name like '%${name}%' or id in (select projection_id from shipping where receiver_name like '%${name}%'))`;
  if (number) where += ` and (orderer_mobile like '%${number}%' or id in (select projection_id from shipping where receiver_mobile like '%${number}%'))`;
  if (email) where += ` and orderer_email like '%${email}%'`;

  return _.mr(where, tail, sub_where, { campaign_id, name, email, number, date, start, end, sort, direction, offset, limit });
};

G.$query_$campaign_list = req => {
  const
    offset = req.query.offset || 0,
    limit = req.query.limit || 20,
    filter = req.query.filter || 'all',
    sort = req.query.sort,
    direction = req.query.direction,
    date = req.query.date,
    start = req.query.start ? parseInt(req.query.start) : '',
    end = req.query.end ? parseInt(req.query.end) : '',
    tail = `order by ${sort || 'id'} ${direction || 'asc'} offset ${offset} limit ${limit}`;

  let where = '';

  if (filter === 'public') where = $.where({ is_public: true });
  else if (filter === 'successful') where = 'where goal <= current_quantity';

  if (date) where = `${where ?  where+' and': 'where'} ${date} between '${(new Date(start)).toUTCString()}' and '${(new Date(end)).toUTCString()}'`;
  return _.mr($(where, tail), where, { offset, limit, filter, sort, direction, date, start, end } );
};

G.$select_one_$projection = where =>
  $$.select_one([
    [['*', 'projection', where]],
    ['projection', 'user_products.product'],
    ['projection', 'user_products.shipping'],
    ['projection', 'projection_payments'],
    ['projection', 'shippings']
  ]);

G.$delete_$needless_shipping = _.tap(
  up => `delete from shipping where projection_id = ${up.projection_id} and not id in 
  (select id from shipping where id in 
  (select shipping_id from user_product where projection_id = ${up.projection_id}))`,
  $.raw
);

G.make_sid = function(n) {
  return _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", n).join('')
};

G.curation_join_tables = function(cc_id, bpc_id) {
  return [
    'campaign.product_color',
    cc_id ? 'campaign.type_category' : 'campaign',
    bpc_id ? ['campaign.product_color', ['id', 'type_category2']] : 'campaign'
  ];
};

G.curation_join_on = function(cc_id, bpc_id, search, is_curation) {
  if (!search) return $(
    $('and', $.and({
      'campaign.is_public': true, 'campaign.is_curation': !!is_curation
    })),
    $('and', $.and(bpc_id ? 'product_color.is_cate_first' : 'product_color.is_first', true)),
    cc_id ? $('and', $.and('type_category.category_id', cc_id)) : '',
    bpc_id ? $('and', $.and('type_category2.category_id', bpc_id)) : ''
  );
  return $(
    $('and', $.and({
      'campaign.is_public': true, 'campaign.is_curation': !!is_curation
    })),
    $('and', $.and(bpc_id ? 'product_color.is_cate_first' : 'product_color.is_first', true)),
    $('and', '(campaign.name ilike \'%' + search + '%\'', 'or', 'campaign.description ilike \'%' + search + '%\')')
  );
};

G.$make_category_list = _.sum(_.t('q_name, cc_id, category', '\
  li.c_item\
    a[q_name={{q_name}} is_search={{category.id == cc_id}} href="#" type=button data-id="{{category.id}}"] {{category.name}}\
'));