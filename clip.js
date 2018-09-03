let Clipper = require('image-clipper')
let sizeOf = require('image-size')
let cheerio = require('cheerio')
let fs = require('fs')
let zipFile = require('./make-zip.js')

let tplHtml = require('./make-html.js')

let $ = cheerio.load(tplHtml)

Clipper.configure({
    canvas: require('canvas')
});

let serial = (funs)=>funs.reduce((promise,fun,index)=>promise.then(()=>fun(index)),Promise.resolve())

function clip(path){
    console.log(path)

    let dimensions = sizeOf(path)
    let itemHeight = dimensions.height/4

    Clipper(path,function(){
        let that = this

        function task(i){
            return new Promise((resolve,reject)=>{
                that.crop(0,itemHeight*i,dimensions.width,itemHeight)
                .quality(100)
                .toFile(`./dist/images/${i}.jpg`,()=>{
                    that.reset()
                    resolve(i)
                });
            })
        }

        let count = [1,2,3,4];
        let tasks = count.map(index=>(index)=>task(index))

        serial(tasks).then(()=>{
            let html = '';
            count.forEach((item,index)=>{
                html += `<img src="./images/${index}.jpg" />` 
            })
            $('.wrap').html(html)
            // console.info($.html());
            fs.writeFile('./dist/index.html',$.html(),'utf8',(result)=>{
                zipFile()
            })
        })
    })
}

module.exports = clip