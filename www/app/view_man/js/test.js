_.go($('#test'), function(test){
  if(!test.length) return

  _.go(
    test,

    $.on('touchstart', '.img', function(e) {

    }),
    $.on('touchmove', '.img', function(e) {
    }),
    $.on('touchend', '.img', function(e) {
    })
  )
});