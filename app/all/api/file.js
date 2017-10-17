
app.post('/api/file', upload.array('files', 5), function(req, res) {
  _.go(
    req.files,
    _.map((v)=>_.pick(v, ['originalname', 'mimetype', 'size', 'location'])),
    _.map((file) => $$.insert('files', file, '*')),
    (files) => res.json(files)
  )
});

app.get('/api/file', function(req, res) {
  _.go(
    $$.select([
      [['*', 'files', " where mimetype = 'video/mp4' "]],
      'files.subtitles'
    ]),
    (files) => res.json(files)
  )
});

app.post('/api/files/update', function(req, res) {
  _.go(
    $$.update('files', req.body, $.where(_.pick(req.body, 'id'))),
    (file) => res.json(file)
  )
});

app.post('/ps', function(req, res) {
  _.go(
    $.select_one('location', 'files', $.where({ id: 58 }), '*'),
    function(aa){
      if (aa.location == req.body.location) return res.send(true)
      res.send(false)
    }
  )
});