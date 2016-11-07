# Enrich OSM XML file with Wikidata

This tool parses an OSM XML file and looks up missing OSM values
in Wikidata and adds them as tags in the new modified OSM XML file.

*Work in Progress*

## Install

Clone repository and install.

```bash
npm install
```

## Usage

Download a XML extract and extract it.

```bash
wget http://download.geofabrik.de/europe/liechtenstein-latest.osm.bz2
bunzip2 liechtenstein-latest.osm.bz2
```

Now run the tool over the OSM XML to enrich it with Wikidata.
To see the changes specify the `--verbose` option.

```bash
node cli.js -i liechtenstein-latest.osm -o augmented-liechtenstein.osm --verbose
```

This will output changes.

```
Added population=16504 for relation 1155955
Added postal=9485–9498 for relation 1155955
Changed name:be-tarask=Швейцарыя to name:be-tarask=Швайцарыя for relation 51701
Changed name:bn=Switzerland to name:bn=সুইজারল্যান্ড for relation 51701
```
