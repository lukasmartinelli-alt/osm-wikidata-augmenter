var wdk = require('wikidata-sdk')
var request = require('request')

function extractStatementIntQuantity(entity, claimId) {
    var claims = entity.claims[claimId];
    if(claims && claims.length > 0) {
        return parseInt(claims[0].mainsnak.datavalue.value.amount)
    }
    return undefined
}
// https://www.wikidata.org/wiki/Property:P1082
exports.augmentPopulation = function augmentPopulation(entity, tags) {
    var population = extractStatementIntQuantity(entity, "P1082")
    return Object.assign({}, tags, {"population": population});
}

// https://www.wikidata.org/wiki/Property:P2044
exports.augmentElevation = function augmentElevation(entity, tags) {
    var elevation = extractStatementIntQuantity(entity, "P2044")
    return Object.assign({}, tags, {"ele": elevation});
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
