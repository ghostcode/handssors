var Clipper = require('image-clipper');
Clipper.configure({
    canvas: require('canvas')
});


function clip(path){
    console.log(path)
    Clipper(path,function(){
        this.crop(0,0,200,200)
        .toFile('./dist/test.jpg',function(){
            console.log('saved')
        })
    })
}

module.exports = clip