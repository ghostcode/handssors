let http = require('http')
let fs = require('fs')
let url = require('url')
let path = require('path')
let Busboy = require('busboy');
let clip = require('./clip.js')

http.createServer(function(req,res){
    let pathname = url.parse(req.url,true).pathname
    console.info(pathname)
    if(pathname == '/' && req.method.toLowerCase() == 'get'){
        fs.readFile('./index.html',function(error,content){
            if (error) {
                if(error.code == 'ENOENT') {
                    fs.readFile('./404.html', function(error, content) {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(content, 'utf-8');
                    });
                }else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    res.end();
                }
            }else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            }
        })
    }else if(pathname == '/upload' && req.method.toLowerCase() == 'post'){
        let busboy = new Busboy({ 
            headers: req.headers,
            limits:{
                fileSize: 6*1024*1024
            }
        });

        let saveTo = '';

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          saveTo = path.join(__dirname,'uploadfile',filename);
          file.pipe(fs.createWriteStream(saveTo));
        });

        busboy.on('finish', function() {
          clip(saveTo)
          res.writeHead(200, { 'Connection': 'close' });
          res.end("That's all folks!");
        });

        return req.pipe(busboy);
    }
    
}).listen(9000);
console.log('Server running at http://127.0.0.1:9000/');