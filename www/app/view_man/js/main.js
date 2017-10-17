
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
    window.for_click = true;
  }),
  $.on('touchmove', function(e) {
    window.for_click = false;
    if(window.which_y < e.touches[0].clientY) return show();
    if(window.which_y > e.touches[0].clientY) return hide();
  })
);

var LS ={};
var LF = {};


LS.loading = _.t$('\
    #loading\
      div loading...\
  ');


LF.loading_and_video = __(
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
  $.append(LS.loading)
);

var ps = prompt("password");
if (ps == 3534){
_.go(
  $.get('/api/file'),
  LF.f = __(
    _.tap(function(files){
    Array.prototype.push.apply(box.sel('files'), files)
    }),
    LF.append_files = __(
    _sum(_.t('file', `
      .content[_sel="files->(#{{file.id}})"] 
        .item 
          .body
            .spec
              .originalname.spec[name=originalname] {{file.originalname}}
              .hash.spec[name=hash] {{file.hash && _go(file.hash, JSON.parse, _.join)}}
            .edit_option
              input[name=originalname type=text value="{{file.originalname}}"]
              input[name=hash type=text value="{{file.hash && _go(file.hash, JSON.parse, _.join)}}"]
          .option
            .edit edit
    `)),
    $.append_to('#main .contents'))),
  _.tap(
    $.find('input'),
    $.on('blur', function(e) {
      var ct = e.$currentTarget;
      var el_content = $.closest(ct, '.content');
      var box_content = box.sel(el_content);
      var name = $.attr(ct, 'name');
      var val1 = ct.value.trim();
      var val2 = name == "hash" ? _go(
        val1,
        _.split_s,
        _.super_compact, JSON.stringify) : val1;
      return _.go(
        { id: box_content.id },
        _tap(function(file){
          file[name] = val2;
          _.extend(box_content, file)
        }),
        _($.post, '/api/files/update'),
        function(){
          _go(
            el_content,
            $.find1('[name=' + name + ']'),
            $.text(val1)
          )
        })
    })
  )
);
}

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
            JSON.parse,
            _find(
              _(_.contains, search.hash)))),
          LF.append_files
        )
      if (search.originalname.length) return _go(
        box.sel('files'),
        _.tap(function(a){
          window.b = a
          console.log(/마마무/.test(a[0].originalname), a[0])
        }),
        _filter(__(
          _.v('originalname'),
          function(name) {
            return _find(search.originalname, function(s_name) {
              var reg = new RegExp(s_name, "i");
              return reg.test(name);
            })
          }
        )),
        LF.append_files
      )
      return _go(
        box.sel('files'),
        LF.append_files
      )
    }
  }),
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
          LF.f
        )
      }
    )
  }),
  _.if(function(){
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }, __(
    $.on('touchend', '#upload input', function(e) {
      e.stopPropagation();
      if(!window.for_click) return;
    }),
    $.on('touchend', '#upload', function(e) {
      if(!window.for_click) return;
      var ct = e.$currentTarget;
      $.trigger($.find1(ct, 'input'), 'click');
    }),
    $.on('touchend', '#edit', function(e) {
      if(!window.for_click) return;
      var el_contents = $1('#contents');
      if (!$.has_class(el_contents, 'on_edit')) return _go(
        el_contents,
        $.add_class('on_edit')
      );
      _go(
        el_contents,
        $.remove_class('on_edit')
      );
    }),
    $.on('touchend', '.content', function(e) {
      if( window.for_click ) return _go(
      e.$currentTarget,
      LF.loading_and_video,
      $.on('touchstart', '#loading', function(e) {
        _go(
          [$('#loading'), $1('#video')],
          $.remove
        )
      })
    )
  })
  )).else(__(
    $.on('click', '#upload input', function(e) {
      e.stopPropagation();
    }),
    $.on('click', '#upload', function(e) {
      var ct = e.$currentTarget;
      $.trigger($.find1(ct, 'input'), 'click');
    }),
    $.on('click', '#edit', function(e) {
      var el_contents = $1('#contents');
      if (!$.has_class(el_contents, 'on_edit')) return _go(
        el_contents,
        $.add_class('on_edit')
      );
      _go(
        el_contents,
        $.remove_class('on_edit')
      );
    }),
    $.on('click', '.content', function(e) {
      if ($.has_class($('#contents'), 'on_edit')) return;
      _go(
        e.$currentTarget,
        LF.loading_and_video,
        _.tap(function(){
          var elem = $1('video');
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
              elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            }
        }),
        $.on('click', 'video', function(e) {
          e.stopPropagation();
          var target = e.$currentTarget;
          var target_parent = $1('#video');
          return play(target, target_parent)
        }),
        $.on('webkitfullscreenchange', 'video', function() {
          if(!document.webkitFullscreenElement) return _go(
            [$1('#video'), $1('#loading')],
            $.remove
          )
        })
      )
  })
  )),


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