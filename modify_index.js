const fs = require('fs');

const fillBlank6th = require('./fillBlankData.js').fillBlank6th;
const fillBlank7th = require('./fillBlankData.js').fillBlank7th;
const fillBlank8th = require('./fillBlankData.js').fillBlank8th;

let indexHtml = fs.readFileSync('index.html', 'utf-8');

// Inject the FILL_BLANK data into the gameQuestions object within index.html
const easyPos = indexHtml.indexOf('EASY: {');
if (easyPos !== -1) {
    const insertStr = `FILL_BLANK: {
        grade6: ${JSON.stringify(fillBlank6th, null, 12)},
        grade7: ${JSON.stringify(fillBlank7th, null, 12)},
        grade8: ${JSON.stringify(fillBlank8th, null, 12)}
    },
    `;
    indexHtml = indexHtml.slice(0, easyPos) + insertStr + indexHtml.slice(easyPos);
}

fs.writeFileSync('index.html', indexHtml, 'utf-8');
console.log("Injected FILL_BLANK into index.html gameQuestions");
