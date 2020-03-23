const jsonexport = require('jsonexport');
const filenamifyUrl = require('filenamify-url');
const path = require('path')
const fs = require('fs')
var contacts = [{
    name: 'Bob',
    lastname: 'Smith',
    family: {
        name: 'Peter',
        type: 'Father'
    }
 },{
    name: 'James',
    lastname: 'David',
    family:{
        name: 'Julie',
        type: 'Mother'
    }
 },{
    name: 'Robert',
    lastname: 'Miller',
    family: null,
    location: [1231,3214,4214]
 },{
    name: 'David',
    lastname: 'Martin',
    nickname: 'dmartin'
 }];

async function createFile(url, data) {
    let fileName = filenamifyUrl(url)
    fileName += '.csv'
    const localPath = path.join(__dirname, '../public/files/') + fileName
    jsonexport(data, function (err, csv) {
        if (err) return console.log(err);
        fs.writeFileSync(localPath, '\ufeff' + csv, { encoding: 'UTF8' });
    });
    return fileName
}

module.exports = {
    createFile
}