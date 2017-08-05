var Trader = require('../../exchanges/gemini.js');

var Gemini = new Trader({
  key: process.env.GEMINI_KEY,
  secret: process.env.GEMINI_SECRET,
  asset: 'hi',
  currency: 'usd'
});

type = 'getPortfolio';

switch(type){
  case 'getPortfolio':
    Gemini.getPortfolio(function(err, result){
      console.log("Portfolio test result ", err, result);
    });
  break;
}
