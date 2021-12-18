/**
 * @OnlyCurrentDoc
 */

function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🪄 CMC API')
    .addItem('👨‍💻 Run Query', 'writeCMCDataToGSheet')
    .addItem('🔑 Set API key', 'setKey')
    .addItem('🗑️ Delete API key', 'resetKey')
    .addItem('🗑️ Delete all credentials', 'deleteAll')
  .addToUi();
}

/* COINMARKETCAP API ENDPOINT */
COINMARKETCAP_ENDPOINT_ROOT = 'http://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
//COINMARKETCAP_ENDPOINT_ROOT = 'http://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'; //debug only (sandbox)

/**
 * Retrieves CoinMarketCap (CMC) data using a user-supplied API Key
 *
 * @param {String} parameters the parameters to append to the end of the API call
 * @customfunction
 */  
function queryCoinMarketCapEndpoint(PARAMETERS){
  var parameters = '&limit=5000&convert=USD'
  var API_KEY = getAPIKey(); // production

  // TODO: add Error handling if theres no API Key provided

  /*
    This URL can be customized per https://coinmarketcap.com/api/documentation/v1/#section/Authentication 
    Note that I use sandbox when debugging, so as to not use too much of my API Quota ^_^
    */
  var url = COINMARKETCAP_ENDPOINT_ROOT + '?CMC_PRO_API_KEY=' + API_KEY + parameters // production
  //var url = COINMARKETCAP_ENDPOINT_ROOT + '?CMC_PRO_API_KEY=' + 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c' + parameters // debug only (sandbox)

  var response = UrlFetchApp.fetch(url);
  var data = JSON.parse(response.getContentText());
  return data.data;
  
}


/**
 * writes data to Spreadsheet
 *
 * @param {String} 
 * @customfunction
 */  
function writeCMCDataToGSheet(){
  var data = queryCoinMarketCapEndpoint();

  var dataToBeWritten = []
  
  for (let i = 0; i < data.length; i++) {

  /* Each returned quote will appear in this format, so I'll save them each as variables
      "price": 0.9148712703385975,
			"volume_24h": 491,
			"volume_change_24h": 0.11313724252753987,
			"percent_change_1h": 0.33687451774101307,
			"percent_change_24h": 0.28253543499155875,
			"percent_change_7d": 0.5249652378502574,
			"market_cap": 0.8817250949959594,
			"market_cap_dominance": 7396,
			"fully_diluted_market_cap": 0.043550889842898455,
			"last_updated": "2021-12-18T06:34:18.136Z"
      */

    var symbol = data[i].symbol;
    var name = data[i].name;
    var price = data[i].quote.USD.price;
    var volume_24h = data[i].quote.USD.volume_24h;
    var volume_change_24h = data[i].quote.USD.volume_change_24h;
    var percent_change_1h = data[i].quote.USD.percent_change_1h;
    var percent_change_24h = data[i].quote.USD.percent_change_24h;
    var percent_change_7d = data[i].quote.USD.percent_change_7d;
    var market_cap = data[i].quote.USD.market_cap;
    var market_cap_dominance = data[i].quote.USD.market_cap_dominance;
    var fully_diluted_market_cap = data[i].quote.USD.fully_diluted_market_cap;
    var last_updated = data[i].quote.USD.last_updated;

    /* 
    Now that I have my data, save each "row" to an Array, which is the format Google Sheets needs it to be in 
      */

    dataToBeWritten.push([symbol,name,price,volume_24h,volume_change_24h,percent_change_1h,percent_change_24h,percent_change_7d,
    market_cap,market_cap_dominance,fully_diluted_market_cap,last_updated])

  }

  /* 
    Now that I have my data in an Array, write it to my Google Spreadsheet
    hattip: https://spreadsheet.dev/reading-from-writing-to-range-in-google-sheets-using-apps-script
    */

  var countDataRows = data.length + 1;
  SpreadsheetApp.getActive().getRange("ImportedData!A2:L"+countDataRows).setValues(dataToBeWritten)

}
