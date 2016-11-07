var wdk = require('wikidata-sdk')
var request = require('request')

/**
 * Augment tags  with additional name tags from Wikidata labels.
 * If no Wikidata exists the original tags are returned.
 */
function augmentTranslations(tags, cb) {
  if (!tags.wikidata) {
    cb(tags);
    return;
  };

  var url = wdk.getEntities({
    ids: tags.wikidata,
    properties: ['info', 'labels']
  });
  request.get(url, function(error, response, body) {
    if (error || response.statusCode != 200) {
      cb(tags);
      return;
    }

    var result = JSON.parse(body);
    var entity = result.entities[tags.wikidata];
    var newTags = {}
    for (var key in entity.labels) {
      var label = entity.labels[key];
      newTags["name:" + label.language] = label.value;
    }
    cb(Object.assign({}, tags, newTags));
  });
}

module.exports = augmentTranslations;
