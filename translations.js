var wdk = require('wikidata-sdk')
var request = require('request')

/**
 * Augment tags  with additional name tags from Wikidata labels.
 * If no Wikidata exists the original tags are returned.
 */
function augmentTranslations(entity, tags) {
    var newTags = {}
    for (var key in entity.labels) {
      var label = entity.labels[key];
      newTags["name:" + label.language] = label.value;
    }
    return Object.assign({}, tags, newTags);
}

module.exports = augmentTranslations;
