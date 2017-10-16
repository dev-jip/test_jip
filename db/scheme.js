!function() {
  
  // _pg.scheme.add('file', {
  //   table_name: 'file',
  //   "*": 'url, width, height, ai_url, user_id, type, attached_type, attached_id',
  //   timestamps: ['created_at', 'updated_at']
  // }, {
  //   user: {
  //     name: 'user',
  //     f_key: 'user_id',
  //     type: 'belongs_to',
  //     '*': 'id, email, name, created_at',
  //     tail: $('where', $.and('users.name', 'dfg'))
  //   }
  // });
  _pg.scheme.add('files', {
    table_name: 'files',
    "*": 'id, originalname, mimetype, category, size, location, hash, created_at',
    jsonb: ['hash'],
    timestamps: ['created_at', 'updated_at'],
    tail: 'where parent_id is null'
  },
  {
    subtitles: {
      name: 'subtitles',
      f_key: 'parent_id',
      '*': 'id, location',
      type: 'has_many'
    }
  })

  _pg.scheme.add('subtitles', {
    table_name: 'files',
    "*": 'id, location',
    timestamps: ['created_at', 'updated_at'],
    tail: 'where parent_id is not null'
  })

}();