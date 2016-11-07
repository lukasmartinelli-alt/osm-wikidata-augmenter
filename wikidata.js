var wdk = require('wikidata-sdk')
var request = require('request')

// https://www.wikidata.org/wiki/Property:P2044
function augmentElevation(entity, tags) {
    var claims = entity.claims["P2044"];
    if(claims && claims.length > 0) {
        var elevation = parseInt(claims[0].mainsnak.datavalue.value.amount)
        return Object.assign({}, tags, {"ele": elevation});
    } else {
        return tags;
    }
}

function queryWikidata(id, cb) {
  if(!id) return null
  var url = wdk.getEntities({
    ids: id,
    properties: ['info', 'labels', 'statements']
  });
  request.get(url, function(error, response, body) {
    if (error || response.statusCode != 200) {
      return null
    }
    var result = JSON.parse(body);
    var entity = result.entities[id];
    cb(entity);
  });
}

exports.queryWikidata = queryWikidata;
exports.augmentElevation = augmentElevation;
