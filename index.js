var http = require('http'),
var ejs = require("ejs");
var fs = require("fs");

var express = require('express');
var app = express();

app.use("/", function(req, res,next) {
    
    var URL = req.url.split("/");
    
    if(URL.length >= 4){
        getMap( URL[1], URL[2] , URL[3] , URL[4],function(err,data){
            
            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            
            res.write(data);
            //data.pipe(res);
            res.end();
        });
        
    }else{
        next();
    }
});

app.use("/",function(req, res) {
    var indexFile = fs.readFileSync(__dirname + "/index.html");

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(ejs.render(indexFile.toString()));
    res.end();
});


httpProxy.createServer(function(req, res, proxy) {
    req.mainProxy = proxy;
    app(req, res);
}).listen(process.env.PORT, process.env.IP);


function getMap(s,z,x,y,callback){
    
    var savePath = __dirname + "/map_tiles/" + z + "-" + x + "-" + y;
    
    fs.exists(savePath, function (exists) {
        if(exists)
            fileFetch();
        else
            fetch();
    });

    function fileFetch(){
        fs.readFile(savePath, function(err,imagedata){
            if (err) throw err;
            callback(err,imagedata);
        });
    }
    
    function fetch(){
        var options = {
            host: s+'.tile.osm.org'
          , port: 80
          , path: "/" + z + "/" + x + "/" + y
        };
        
        http.get(options, function(res){
            var imagedata = '';
            res.setEncoding('binary');
        
            res.on('data', function(chunk){
                imagedata += chunk;
            });
        
            res.on('end', function(){
                fs.writeFile(savePath, imagedata, 'binary', function(err){
                    if (err) throw err;
                    fileFetch();
                });
            });
        
        });
    }
}