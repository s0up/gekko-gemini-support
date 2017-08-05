const GeminiAPI = require('gemini-api');

var util = require('../core/util.js');
var _ = require('lodash');
var moment = require('moment');
//var log = require('../core/log');
var async = require('async');

var Trader = function(config) {
 _.bindAll(this);
 if(_.isObject(config)) {
   this.key = config.key;
   this.secret = config.secret;
   this.asset = config.asset.toLowerCase();
   this.currency = config.currency.toLowerCase();
   this.market = this.asset + this.currency;
 }
 this.name = 'Gemini';
 this.gemini = new GeminiAPI.default();
 this.gemini.key = this.key
 this.gemini.secret = this.secret
}

Trader.prototype.retry = function(method, args) {
  var wait = +moment.duration(10, 'seconds');
  log.debug(this.name, 'returned an error, retrying..');

  var self = this;

  // make sure the callback (and any other fn)
  // is bound to Trader
  _.each(args, function(arg, i) {
    if(_.isFunction(arg))
      args[i] = _.bind(arg, self);
  });

  // run the failed method again with the same
  // arguments after wait
  setTimeout(
    function() { method.apply(self, args) },
    wait
  );
}

Trader.prototype.getPortfolio = function(callback) {
  var self = this;
  var portfolio = [];
  var args = _.toArray(arguments);

  self.gemini.getMyAvailableBalances().then(function(result){
    for(item of result){
      portfolio.push({name: item.currency, amount: parseFloat(item.amount)});
    }

    return callback(null, portfolio);
  }).catch(function(e){
    return self.retry(self.getPortfolio, args);
  });
}

module.exports = Trader;
