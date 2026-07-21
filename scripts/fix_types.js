const fs = require('fs');

let code = fs.readFileSync('/root/projects/ads/outfits.json', 'utf8');

const varNames = [...code.matchAll(/const (\w+)\s*=/g)].map(m => m[1]);
if (varNames.length === 0) {
    console.error("No variables found!");
    process.exit(1);
}

let evalCode = code + '\nmodule.exports = { ' + varNames.join(', ') + ' };';

let obj;
try {
  const m = new module.constructor();
  m.paths = module.paths;
  m._compile(evalCode, 'virtual-module');
  obj = m.exports;
} catch (e) {
  console.error("Error evaluating code:", e);
  process.exit(1);
}

let output = '';
for (const [key, array] of Object.entries(obj)) {
  if (Array.isArray(array) && array.length > 0) {
    const typeVal = array[0].type;
    if (typeVal) {
      for (const item of array) {
        // If we want it right after name, we can recreate the object.
        // But simply setting item.type will put it at the end if it doesn't exist.
        // To maintain order similar to user's:
        if (!item.hasOwnProperty('type')) {
           const newItem = { name: item.name, type: typeVal };
           for (const [k, v] of Object.entries(item)) {
               if (k !== 'name' && k !== 'type') {
                   newItem[k] = v;
               }
           }
           // update array
           array[array.indexOf(item)] = newItem;
        }
      }
    }
  }
  
  output += `const ${key} = ` + JSON.stringify(array, null, 2) + ';\n\n';
}

fs.writeFileSync('/root/projects/ads/outfits.json', output.trim() + '\n');
console.log('Success! Modified ' + varNames.length + ' arrays.');
