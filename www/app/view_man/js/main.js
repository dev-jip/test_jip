
var hide = _.throttle(__(_.c('#menu'), $1, $.hide), 1000, { trailing: false })
var show = _.throttle(__(_.c('#menu'), $1, $.css({display: "flex"})), 1000, { trailing: false })

_.go(
  $1(window),
  $.on('wheel', function(e) {
    if (e.deltaY > 0) return hide();
    $1('#menu input[type="text"]').focus();
    return show();
  }),
  $.on('touchstart', function(e) {
    window.which_y = e.touches[0].clientY;
  }),
  $.on('touchmove', function(e) {
    if(window.which_y < e.touches[0].clientY) return show()
    if(window.which_y > e.touches[0].clientY) return hide()
  })
);

var lo ={};
lo.f = {};
_.go(
  $.get('/api/file'),
  lo.f = __(
    _.tap(function(files){
    Array.prototype.push.apply(box.sel('files'), files)
    }),
    lo.append_files = __(
    _sum(_.t('file', `
      .content[_sel="files->(#{{file.id}})"] 
        .item 
          .body
            .spec
              .originalname.spec[name=originalname] {{file.originalname}}
              .hash.spec[name=hash] {{file.hash && _.join(file.hash)}}
            .edit_option
              input[name=originalname type=text value="{{file.originalname}}"]
              input[name=hash type=text value="{{file.hash && _.join(file.hash)}}"]
          .option
            .edit edit
    `)),
    $.append_to('#main .contents')))
);

_.go(
  $1('#view_man'),
  $.on('keydown', '#search input', function(e) {
    if (e.keyCode == 32 || e.keyCode == 13) {
      $.remove($('.content'));

      var search = _go(
        _.split_s(e.$currentTarget.value),
        _.partition(function(v){
          return /#/.test(v)
        }),
        function(p){
          return { hash : p[0], originalname: _.super_compact(p[1]) }
        }
      );
      if (search.hash.length && search.originalname.length) return;

      if (search.hash.length) return _go(
          box.sel('files'),
          _filter(__(
            _.v('hash'),
            _find(
              _(_.contains, search.hash)))),
          lo.append_files
        )
      if (search.originalname.length) return _go(
        box.sel('files'),
        _filter(__(
          _.v('originalname'),
          function(name) {
            _find(search.originalname, function(s_name) {
              var reg = new RegExp(s_name, "i");
              return reg.test(name);
            })
          }
        )),
        lo.append_files
      )
      return _go(
        box.sel('files'),
        lo.append_files
      )
    }
  }),
  // $.on('click', '#upload input', function(e) {
  //   e.stopPropagation();
  // }),
  // $.on('click', '#upload', function(e) {
  //   var ct = e.$currentTarget;
  //   $.trigger($.find1(ct, 'input'), 'click');
  // }),
  $.on('change', '[type="file"]', function(e) {
    var data = new FormData();
    _.each(e.$currentTarget.files, function(file){
      data.append('files', file);
    });

    _.go(
      $.upload(data, {
        progress: function(a){
          console.log(a)
        }
      }),
      function(res){
        _go(
          res,
          _.wrap_arr,
          lo.f
        )

      }
    )

  }),
  // $.on('click', '.edit', function(e) {
  //   e.stopPropagation();
  //   var ct = e.$currentTarget;
  //   var el_content = $.closest(ct, '.content');
  //   var box_content = box.sel(el_content);
  //   if ($.has_class(el_content, 'on_edit')) {
  //     return _.go(
  //       el_content,
  //       $.find('.edit_option input'),
  //       __(
  //         function(els){
  //           return _.mr(_map(els, $.attr('name')), _map(els, $.val)) },
  //         _.object,
  //         _(_.set, _, 'hash', function(hash){
  //           return JSON.stringify(_.split_s(hash))}),
  //         _(_.extend, _, {id: box_content.id})
  //       ),
  //       _($.post, '/api/files/update'),
  //       _(_.extend, box_content),
  //       function(file){
  //         _go(
  //           el_content,
  //           $.find('.spec'),
  //           _each(function(v){
  //             $.text(v, file[$.attr(v, 'name')])
  //           })
  //         );
  //         _go(
  //           el_content,
  //           $.remove_class('on_edit')
  //         );
  //       }
  //     )
  //   }
  //   return _go(
  //     el_content,
  //     $.add_class('on_edit'),
  //   )
  // }),
  $.on('click', '.content', function(e) {
    var ct = e.$currentTarget;
    // if (!$.has_class(ct, 'clicked')) {
    //   return _go(ct,
    //     $.add_class('clicked'),
    //     $.siblings('.clicked'),
    //     $.remove_class('clicked'))
    // }
    if ($1('#video')) {
      $.remove($1('#video'))
    }
    _.go(
      ct,
      box.sel,
      _.t$(`
        .video#video
          .body
            video[autoplay]
              source[src="{{$.location}}" type="{{$.mimetype}}"]
              {{_.go($._.subtitles, `, _.if(_.l('$.length'), _.t$(`
              track[kind="subtitles" srclang="en" label="English" default src="{{$[0].location}}" ]
              `)),`)}}
      `),
      $.append_to($1('#main')),
      $.add_class('selected'),
      _.tap(function(){
        var elem = $1('video');
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
          }
          _go(
            $1('body'),
            $.append(_.t$(`
              #loading
                div loading...
            `))
          )

          $1('video').onloadstart = function(e) {
            $.remove($('#loading'));
          }
      }),
      $.on('click', 'video', function(e) {
        e.stopPropagation()
        var target = e.$currentTarget;
        var target_parent = $1('#video');
        return play(target, target_parent)
      }),
      $.on('webkitfullscreenchange', 'video', function() {
        if(!document.webkitFullscreenElement) return $.remove($1('#video'))
      })
    )
  })

);
_.go(
  window,
  $.on('keydown', function(e){
    var target_parent = $1('#video')
    var target = $.find1($1('#video'), 'video')
    if (target) {
      if (e.keyCode == 32) {
        return play(target, target_parent)
      }
      if (e.keyCode == 27) {
        return $.remove(target_parent)
      }
    }
  })
)



function play(target, target_parent) {
  if($.has_class(target_parent, 'play')) {
    $.remove_class(target_parent, 'play');
    target.pause()
    return;
  }
  $.add_class(target_parent, 'play');
  target.play()
  return;
}