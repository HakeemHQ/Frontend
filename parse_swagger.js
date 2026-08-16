const fs = require('fs');
const doc = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

const schemas = doc.components.schemas;
for (const key of Object.keys(schemas)) {
  if (key.includes('Document') && !key.includes('Command')) {
    console.log(key);
    console.log(JSON.stringify(schemas[key], null, 2));
  }
}
