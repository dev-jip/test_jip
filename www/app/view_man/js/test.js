_.go($('#test'), function(test){
  if(!test.length) return

  _.go(
    test,

    $.on('touchstart', '.img', function(e) {
console.log('aa')
    }),
    $.on('touchmove', '.img', function(e) {
    }),
    $.on('touchend', '.img', function(e) {
    })
  )
});