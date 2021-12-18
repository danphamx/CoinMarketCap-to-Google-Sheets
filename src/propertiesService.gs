// Sets three properties of different types.
var documentProperties = PropertiesService.getDocumentProperties();
var scriptProperties = PropertiesService.getScriptProperties();
var userProperties = PropertiesService.getUserProperties();

// Stores you API key in userProperties so that others can not use it and it won't be visible to others in-code
function setKey(){
  var API_KEY = "api.key";
  var ui = SpreadsheetApp.getUi();
  var userProperties = PropertiesService.getUserProperties();
  var scriptValue = ui.prompt('Please provide your API key.' , ui.ButtonSet.OK);
  userProperties.setProperty(API_KEY, scriptValue.getResponseText());
}

function resetKey(){
  userProperties.deleteProperty(API_KEY);
}

function deleteAll(){
  userProperties.deleteAllProperties();
}

function getAPIKey(){
  var API_KEY = userProperties.getProperty("api.key");
  return API_KEY
}
