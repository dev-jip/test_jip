process.env.TZ = 'Asia/Seoul';
var express = require('express');
var app = global.app = express();

global._ = require('../../www/share/all/partial.js');
require('../../www/share/all/partial.contrib.js');
require('../../www/share/all/partial.util.js');
// global.ffmpeg = require('fluent-ffmpeg');

var AWS = global.AWS = require('aws-sdk');


var path = global.path = require('path');
var moment = global.moment = require('moment-timezone');
var fs = global.fs = require('fs');
app.js = {};

var session = app.js.session =  require('express-session');
const FileStore = require('session-file-store')(session);

var bodyParser = app.js.bodyParser = require('body-parser');

require('../../db/connection');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, '../../www'), app.locals.is_production_or_staging ? {
    maxage: '100d'
  } : void 0));


app.use(session({
  secret: 'keyboard cat',
  store: new FileStore({path: './db/session'}),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
const multer = require('multer');
const multerS3 = require('multer-s3');
AWS.config.region = 'ap-northeast-2';
AWS.config.update({
  accessKeyId: "AKIAIMI3SMNUAPKVMTDQ",
  secretAccessKey: "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"
});
const s3 = global.s3 = new AWS.S3();


//
// global.upload = multer({
//   storage: multer.diskStorage({
//         destination: './uploads/',
//         filename: function (req, file, cb){
//             // user shortid.generate() alone if no extension is needed
//             cb( null, Date.now() + file.originalname);
//         }
//     })
// });



global.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'iamami.aws.jip',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
});



var pg = require('../../db/partial_pg')(_, knex);
global._pg = pg._pg;
global.$ = pg.$;
global.$$ = pg.$$;
require('../../db/scheme');
require('./all');


// var command = ffmpeg();