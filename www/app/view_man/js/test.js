_.go($('#test'), function(test){
  if(!test.length) return

  _.go(
    test,
    $.on('touchstart', '.img', function(e) {
      $.text($1('.talk'), $.text($1('.talk')) + ' start')
    }),
    $.on('touchmove', '.img', function(e) {
      $.text($1('.talk'), $.text($1('.talk')) + ' move')
    })
  )

})