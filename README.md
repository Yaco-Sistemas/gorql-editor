# GORQL Editor

GORQL Editor helps creating SPARQL queries over a defined set of data.

Site: www.gorql.com

## Requirements

[Node.js](http://www.nodejs.org/) 0.6.17 or higher

Dependencies are listed in the *package.json* file, and can be installed
using [npm](https://npmjs.org/).

## Development deployment

```bash
git clone git://github.com/Yaco-Sistemas/gorql-editor.git
cd gorql-editor
npm install -d
cd public/javascripts/
make all
cd ../../
node --debug app.js
```

And now you can open http://localhost:3010/ in your favourite browser :)

## Documentation

There is some documentation in **spanish** in the **docs** folder, it's built 
with [Sphinx](http://sphinx-doc.org/) so you will need it to generate the
output files.
