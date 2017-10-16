// window.is_mobile_size = function() {
//   return $.width($('html')) < 1025;
// };
//
// !function(){
//   if (!$1('body.page_test')) return ;
//   $.page.init({
//     "p1": {
//       $parent: $1('#pages'),
//       // is_modal: !is_mobile_size(),
//       $switch: [$1('#index > :not(.header)')],
//       pages: {
//         "p1_1": {
//           t: _.t('data', '\
//           .page.page1_1\
//             .header\
//               .buttons\
//                 button.close[type=button] 닫기\
//                 button.btn1_1_1[type=button] 1_1_1열기\
//                 button.btn1_1_2[type=button] 1_1_2열기\
//             .body\
//               #inifini_test.mc_is_container[_sel="files"]\
//             .pages\
//             .footer')
//         },
//         "p1_1_1": {
//           t: _.t('data', '\
//           .page.page1_1_1\
//             .header\
//               .buttons\
//                 button.back[type=button] 이전\
//                 button.close[type=button] 닫기\
//             .body\
//               #home_campaign_list.mc_pgn_container[_sel="campaigns"]\
//                 .mc_pgn_wrap\
//                 .mc_pagination\
//             .pages\
//             .footer')
//         },
//         "p1_1_2": {
//           t: _.t('data', '\
//           .page.page1_1_2\
//             .header\
//               .buttons\
//                 button.back[type="button"] 이전\
//                 button.close[type="button"] 닫기\
//             .body\
//               .mp_table\
//                 .thead\
//                   div 아이디\
//                   div 이름\
//                   div 타입\
//                 .mp_tbody2.mc_is_container[_sel="products2"]\
//             .pages\
//             .footer')
//         }
//       }
//     },
//     'p1_1' : {
//       $parent: $1('#pages'),
//       pages: {
//         "p1_1_1": {
//           t: _.t('data', '\
//           .page.page1_1_1\
//             .header\
//               .buttons\
//                 button.back[type=button] 이전\
//                 button.close[type=button] 닫기\
//             .body\
//               #home_campaign_list.mc_pgn_container[_sel="campaigns"]\
//                 .mc_pgn_wrap\
//                 .mc_pagination\
//             .pages\
//             .footer')
//         }
//       }
//     },
//     'p1_2' : {
//       $parent: $1('#pages'),
//       pages: {
//         "p1_1_2": {
//           t: _.t('data', '\
//           .page.page1_1_2\
//             .header\
//               .buttons\
//                 button.back[type="button"] 이전\
//                 button.close[type="button"] 닫기\
//             .body\
//               .mp_table\
//                 .thead\
//                   div 아이디\
//                   div 이름\
//                   div 타입\
//                 .mp_tbody2.mc_is_container[_sel="products2"]\
//             .pages\
//             .footer')
//         }
//       }
//     },
//     'p2': {
//       $parent: $1('#pages'),
//       $switch: is_mobile_size() ? [ '#index > .body'] : [],
//       is_modal: !is_mobile_size(),
//       pages: {
//         "p2_1": {
//           scroll_body: '>.page >.body',
//           t: _.t('data', '\
//           .page.page2_1\
//             .header\
//               .buttons\
//                 button.close[type="button"] 닫기\
//             .body\
//               .mp_table\
//                 .thead\
//                   div 아이디\
//                   div 이름\
//                   div 타입\
//                 .mp_tbody.mc_is_container[_sel="products"]\
//             .pages\
//             .footer')
//         }
//       }
//     }
//   });
//
//   function data(data) {
//     return Promise.resolve(data);
//   }
//
//   _.go($1('body.page_test'),
//     $.on('click', '.page.page1 > .header .buttons > button.on1_1', function() {
//       var id= 1;
//       $.page.go('p1', function() {
//         return $.page.go('p1', 'p1_1', id, function() {
//           return id;
//         });
//       });
//     }),
//     $.on('click', '.page.page1_1 > .header .buttons > button.close', function() {
//       $.page.hide();
//     }),
//     $.on('click', '.page.page1_1 > .header .buttons > button.btn1_1_1', function() {
//       return $.page.go('p1', 'p1_1_1', 2, function() {
//         return data({ name: 'p1_1_1입니다!' });
//       });
//
//       $.page.go('p1_1', function() {
//         return $.page.go('p1_1', 'p1_1_1', 1, function() {
//           return data({ name: 'p2입니다!' });
//         });
//       }, true);
//     }),
//
//     $.on('click', '.page.page1_1 > .header .buttons > button.btn1_1_2', function() {
//       return $.page.go('p1', 'p1_1_2', 2, function() {
//         return data({ name: 'p1_1_2입니다!' });
//       });
//
//       $.page.go('p1_2', function() {
//         return $.page.go('p1_2', 'p1_1_2', 1, function () {
//           return data({name: 'p2입니다!'});
//         });
//       }, true);
//     }),
//
//     $.on('click', '.page1_1_1 > .header .buttons > button.close', function() {
//       $.page.hide();
//     }),
//     $.on('click', '.page1_1_1 > .header .buttons > button.back', function() {
//       $.page.back();
//     }),
//
//     $.on('click', '.page1_1_2 > .header .buttons > button.close', function() {
//       $.page.hide();
//     }),
//     $.on('click', '.page1_1_2 > .header .buttons > button.back', function() {
//       $.page.back();
//     }),
//
//     $.on('click', '.page.page1 > .header .buttons > button.on1_2', function() {
//       return $.page.go('p2', function() {
//         return $.page.go('p2', 'p2_1', 1, function() {
//           return data({ name: 'p2입니다!' });
//         });
//       });
//     }),
//     $.on('click', '.page2_1 >.header .buttons button.close', function() {
//       $.page.hide();
//     })
//   );
// }();

var hide = _.throttle(__(_.c('#menu'), $1, $.hide), 1000, { trailing: false })
var show = _.throttle(__(_.c('#menu'), $1, $.css({display: "flex"})), 1000, { trailing: false })

_.go(
  $1(window),
  $.on('wheel', function(e) {
    if (e.deltaY > 0) return hide();
    $1('#menu input[type="text"]').focus();

    return show();
  })
)
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
          name => _find(search.originalname, function(s_name) {
            var reg = new RegExp(s_name, "i");
            return reg.test(name);
          })
        )),
        lo.append_files
      )
      return _go(
        box.sel('files'),
        lo.append_files
      )
    }
  }),
  $.on('click', '#upload input', function(e) {
    e.stopPropagation();
  }),
  $.on('click', '#upload', function(e) {
    var ct = e.$currentTarget;
    $.trigger($.find1(ct, 'input'), 'click');
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
          lo.f
        )

      }
    )

  }),
  $.on('click', '.edit', function(e) {
    e.stopPropagation();
    var ct = e.$currentTarget;
    var el_content = $.closest(ct, '.content');
    var box_content = box.sel(el_content);
    if ($.has_class(el_content, 'on_edit')) {
      return _.go(
        el_content,
        $.find('.edit_option input'),
        __(
          function(els){
            return _.mr(_map(els, $.attr('name')), _map(els, $.val)) },
          _.object,
          _(_.set, _, 'hash', function(hash){
            return JSON.stringify(_.split_s(hash))}),
          _(_.extend, _, {id: box_content.id})
        ),
        _($.post, '/api/files/update'),
        _(_.extend, box_content),
        function(file){
          _go(
            el_content,
            $.find('.spec'),
            _each(function(v){
              $.text(v, file[$.attr(v, 'name')])
            })
          );
          _go(
            el_content,
            $.remove_class('on_edit')
          );
        }
      )
    }
    return _go(
      el_content,
      $.add_class('on_edit'),
    )
  }),
  $.on('click', '.content', function(e) {
    var ct = e.$currentTarget;
    if ($.has_class(ct, 'on_edit')) return;
    if ($1('.selected')) {
      $.remove($1('.selected'))
    }
    _.go(
      ct,
      box.sel,
      _.t$(`
        .modal
          .blocking
          .video
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
      }),
      $.on('click', 'video', function(e) {
        e.stopPropagation()
        var target = e.$currentTarget;
        var target_parent = $.closest(target, '.video');
        return play(target, target_parent)
      }),
      // $.on('click', '.blocking', __(
      //   $.stop_propagation,
      //   $.remove_delegate_target)),
      $.on('mouseenter', '.video', __(
        _.v('$currentTarget'),
        _.all(
          __(
            $.find1('video'),
            _.l('$.controls = true')
          ),
          __(
            $.find1('.cancel'),
            $.show
          )
        )
      )),
      $.on('mouseleave', '.video', __(
        _.v('$currentTarget'),
        _.all(
          __(
            $.find1('video'),
            _.l('$.controls = false')
          ),
          __(
            $.find1('.cancel'),
            $.hide
          )
        )
      ))
    )
  })

);
_.go(
  window,
  $.on('keydown', function(e){
    var target_parent = $1('.selected')
    var target = $.find1($1('.selected'), 'video')
    if (target) {
      if (e.keyCode == 32) {
        return play(target, target_parent)
      }
      if (e.keyCode == 27) {
        return $.remove(target_parent)
      }
    }
  })
  // $.on('click', function(e){
  //   var target = $1('.selected');
  //   console.log(_.contains(e.path, target));
  //   if (target && !_.contains(e.path, target)) return _go(
  //     $1('.selected'),
  //     $.hide
  //   )
  // })
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


