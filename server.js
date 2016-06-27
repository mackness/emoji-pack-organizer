/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const request = require('request');
var firebase = require("firebase");

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/ra*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist-react/index.html')));
    res.end();
  });
} else {
  //production
  app.use(express.static(__dirname + '/dist-react'));
  app.get('/ra*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist-react/index.html'));
  });
}
//serializer route
const serializer = require('./router/serializer');
app.use('/serializer', serializer);

//route other request to ember app
app.use('*', function(req, res) {
  var url = 'http://localhost:4200' + req.baseUrl;
  var r = null;
  if(req.method === 'POST') {
     r = request.post({uri: url, json: req.body});
  } else {
     r = request(url);
  }

  req.pipe(r).on('error', function(err) {
    console.log("that's an error: ", err);
  }).pipe(res);
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
