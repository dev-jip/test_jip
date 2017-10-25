_.go($('#test'), function(test){
  if(!test.length) return
  var a = {x: 0, y: 0};
  var b;
  _.go(
    test,
    $.on('touchstart', '.img', function(e) {
      $.attr(e.$currentTarget, { draggable: true })
      // a.x = e.touches[0].clientX
      // a.y = e.touches[0].clientY
      // b = false;
      // $.text($1('.talk'), $.text($1('.talk')) + ' start')
    }),
    $.on('touchmove', '.img', function(e) {
      // if (b) return
      // if (a.y != e.touches[0].clientY && a.x == e.touches[0].clientX) {
      //   b = true;
      //   $.attr(e.$currentTarget, { draggable: true })
      // }
      // $.text($1('.talk'), $.text($1('.talk')) + ' move')
    }),
    $.on('touchend', '.img', function(e) {
      $.attr(e.$currentTarget, { draggable: false })
    })
  )

})