let fs = require('fs')
let html = fs.readFileSync('./tpl/tpl.html','utf-8')

module.exports = html;