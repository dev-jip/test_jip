app.get('/', ___(
  _.t$(`
    #menu
      #upload
        input[type="file" multiple]
      #search
        input[type="text"]
      #edit
    #main
      .wrapper
        .contents#contents
  `),
  _.tap(function(){
    this.box = _.box({files: []})
  }),
  _(G.$res_$klass, null, "page_test"),
  G.$res_$render
));