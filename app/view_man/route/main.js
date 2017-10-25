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
  _(G.$res_$klass, null, "view_man"),
  G.$res_$render
));

app.get('/test', ___(
  _.t$(`
    #test
      .talk
      .wrapper
        .first_box
          .product[_id="product_1"]
            h2 product_1
          .product[_id="product_2"]
            h2 product_2
          .product[_id="product_3"]
            h2 product_3
          .product[_id="product_4"]
            h2 product_4
          .product[_id="product_5"]
            h2 product_5
          .product[_id="product_6"]
            h2 product_6
          .product[_id="product_7"]
            h2 product_7
          .product[_id="product_8"]
            h2 product_8
      .wrapper
        .second_box
          .img[_id="img_1" draggable=false]
            h2 img_1
          .img[_id="img_2" draggable=false]
            h2 img_2
          .img[_id="img_3" draggable=false]
            h2 img_3
          .img[_id="img_4" draggable=false]
            h2 img_4
          .img[_id="img_5" draggable=false]
            h2 img_5
          .img[_id="img_6" draggable=false]
            h2 img_6
          .img[_id="img_7" draggable=false]
            h2 img_7
          .img[_id="img_8" draggable=false]
            h2 img_8
  `),
  _.tap(function(){
    this.box = _.box({files: []})
  }),
  _(G.$res_$klass, null, "test"),
  G.$res_$render
))