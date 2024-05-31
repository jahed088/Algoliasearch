
const csvToJson = require('convert-csv-to-json');
const restaurantList = require('./restaurants_list.json');
const fs = require("fs");

let restaurantInfoCsv = './dataset/restaurants_info.csv'
let restaurantInfo = csvToJson.getJsonFromCsv(restaurantInfoCsv)

let fullDataset = JSON.stringify(restaurantInfo.map(x => Object.assign(x, restaurantList.find(y => y.objectID == x.objectID))));
fs.writeFile("./dataset/full-dataset.json", fullDataset, (error) => {
  if (error) {
    throw error;
  }
  console.log("data.json written correctly");
})
