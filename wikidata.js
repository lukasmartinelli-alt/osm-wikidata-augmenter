var wdk = require('wikidata-sdk')
var request = require('request')

function extractStatementString(entity, claimId) {
    var claims = entity.claims[claimId];
    if(claims && claims.length > 0) {
        return claims[0].mainsnak.datavalue.value;
    }
    return undefined
}

function extractStatementIntQuantity(entity, claimId) {
    var claims = entity.claims[claimId];
    if(claims && claims.length > 0) {
        return parseInt(claims[0].mainsnak.datavalue.value.amount)
    }
    return undefined
}
// https://www.wikidata.org/wiki/Property:P281
exports.augmentPostal = function augmentPostal(entity, tags) {
    var postal = extractStatementString(entity, "P281")
    if (postal) return Object.assign({}, tags, {"wikidata:P281": postal});
    return tags;
}

// https://www.wikidata.org/wiki/Property:P1082
exports.augmentPopulation = function augmentPopulation(entity, tags) {
    var population = extractStatementIntQuantity(entity, "P1082")
    if (population) return Object.assign({}, tags, {"wikidata:P1082": population});
    return tags;
}

// https://www.wikidata.org/wiki/Property:P2044
exports.augmentElevation = function augmentElevation(entity, tags) {
    var elevation = extractStatementIntQuantity(entity, "P2044")
    if (elevation) return Object.assign({}, tags, {"wikidata:P2044": elevation});
    return tags;
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
