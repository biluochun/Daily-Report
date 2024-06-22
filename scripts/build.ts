import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';
// yarn data
(async () => {
  const csvFile = path.join(__dirname, './BTC-ETF.csv');
  const jsonArray = await csv().fromFile(csvFile);
  // console.log(jsonArray);
  const keyMap: Record<string, string> = {
    日期: 'date',
    // 'BlackRock（贝莱德）': 'BlackRock',
    // 'Grayscale（灰度）': 'Grayscale',
    // 'Fidelity（富达）': 'Fidelity',
    // 'ARK 21Shares（木头姐）': 'ARK 21Shares',
    // 'WisdomTree（美国）': 'WisdomTree US',
    // 'WisdomTree（全球）': 'WisdomTree Global',
    // 'Franklin Templeton（富兰克林邓普顿）': 'Franklin Templeton',
  };
  jsonArray.forEach((data) => {
    delete data['日变动率'];
    delete data['总计'];
    for (const key in data) {
      let newKey = keyMap[key];
      if (newKey) {
        data[newKey] = data[key];
        delete data[key];
      } else {
        newKey = key;
      }
      if (newKey === 'date') continue;
      data[newKey] = parseFloat(data[newKey].replace(/,/g, '')) || 0;
    }
  });
  const output = path.join(__dirname, '../public/BTC-ETF.json');
  fs.writeFileSync(output, JSON.stringify(jsonArray));
})();
