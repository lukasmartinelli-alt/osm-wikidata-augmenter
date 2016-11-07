var osmread = require('osm-read');
var fs = require('fs');
var XMLWriter = require('xml-writer');

function transformXml(src, target, transformer) {
  if (!transformer) {
    transformer = {
      transformNode: function(n, cb) {
        return cb(n);
      },
      transformWay: function(w, cb) {
        return cb(w);
      },
      transformRelation: function(r, cb) {
        return cb(r);
      },
    }
  }
  var ws = fs.createWriteStream(target);
  ws.write('<?xml version="1.0" encoding="UTF-8"?>\n');
  ws.write('<osm version="0.6" generator="osm-augmenter">\n');
  osmread.parse({
    filePath: src,
    format: 'xml',
    endDocument: function() {
      //TODO: huge hack
      setTimeout(function() {
        ws.write('</osm>\n');
        ws.end();
      }, 10000);
    },
    bounds: function(bounds) {
      var xw = new XMLWriter();
      xw.startElement('bounds')
        .writeAttribute('minlat', bounds.minlat)
        .writeAttribute('minlon', bounds.minlon)
        .writeAttribute('maxlat', bounds.maxlat)
        .writeAttribute('maxlon', bounds.maxlon);
      xw.endElement();
      ws.write(xw.toString());
    },
    node: function(node) {
      transformer.transformNode(node, function(node) {
        var xw = new XMLWriter();
        xw.startElement('node')
        for (key in node) {
          if (key !== "tags") {
            xw.writeAttribute(key, node[key]);
          }
        }
        if (node.tags) {
          for (key in node.tags) {
            xw.startElement('tag')
              .writeAttribute("k", key)
              .writeAttribute("v", node.tags[key])
              .endElement();
          }
        }
        xw.endElement();
        ws.write(xw.toString());
        ws.write("\n");
      })
    },
    relation: function(way) {
      transformer.transformWay(way, function(way) {
        var xw = new XMLWriter();
        xw.startElement('way');
        for (key in way) {
          if (key !== "tags" && key !== "center" && key !== "nodeRefs") {
            xw.writeAttribute(key, way[key]);
          }
        }
        if (way.nodeRefs) {
          for (var i = 0, len = way.nodeRefs.length; i < len; i++) {
            xw.startElement('nd')
              .writeAttribute("ref", way.nodeRefs[i])
              .endElement();
          };
        }
        if (way.tags) {
          for (key in way.tags) {
            xw.startElement('tag')
              .writeAttribute("k", key)
              .writeAttribute("v", way.tags[key])
              .endElement();
          }
        }
        xw.endElement();
        ws.write(xw.toString());
        ws.write("\n");
      });
    },
    relation: function(relation) {
      transformer.transformRelation(relation, function(relation) {
        var xw = new XMLWriter();
        xw.startElement('relation');
        for (key in relation) {
          if (key !== "tags" && key !== "members") {
            xw.writeAttribute(key, relation[key]);
          }
        }
        if (relation.members) {
          for (var i = 0, len = relation.members.length; i < len; i++) {
            var member = relation.members[i];
            xw.startElement('member')
              .writeAttribute("type", member.type)
              .writeAttribute("ref", member.ref)
              .writeAttribute("role", member.role)
              .endElement();
          };
        }
        if (relation.tags) {
          for (key in relation.tags) {
            xw.startElement('tag')
              .writeAttribute("k", key)
              .writeAttribute("v", relation.tags[key])
              .endElement();
          }
        }
        xw.endElement();
        ws.write(xw.toString());
        ws.write("\n");
      });
    },
    error: function(msg) {
      //console.log('error: ' + msg);
    }
  });
}

module.exports = transformXml;
