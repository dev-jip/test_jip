require('../all/app');

app.set('views', path.join(__dirname, './view'));
app.set('view engine', 'ejs');
app.locals._ = _;


// require('../../www/share/campaign_creator');

// require('../all/all');
// require('../all/api/file');

require('./route/main');

require('../all/api/file');

var server = app.listen(5000, function() {
  console.log('Express server listening on port ' + server.address().port);
});