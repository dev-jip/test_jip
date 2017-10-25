_.go($('#test'), function(test){
  if(!test.length) return

  // _.go(
  //   test,
  //   $.on('touchstart', '.img', function(e) {
  //     console.log(e)
  //   }),
  //   $.on('touchmove', '.img', function(e) {
  //     // console.log(e)
  //   })
  // )

  _.go(
    test,
    // $.on('dragstart', '.img', function(e) {
    //   console.log('aaa')
    // }),
    // _.hi,
    $.on('click', '.img', function(e) {
      console.log('ddddddd')
    })
  )
})