var locale = require('./locale.json');

function LocaleManager() {
  this.getResponse = function(type,language) {
    response = locale[language][type]
    if (response == null) {
      return locale['en-US'].type
    }
    return response
  }
}

module.exports.LocaleManager = LocaleManager
