'use strict';
var proxy = require('../index');
var os = require('os');

var ip = void 0,
    port = void 0;
if ( process.argv.length === 1 ) {
    var ipObj = os.networkInterfaces();
    for ( var ipClass in ipObj ){
        var arr = ipObj[ipClass];
        for ( var i = 0 ; i < arr.length ; i++ ) {  
            if ( arr[i].family === 'IPv4' && !arr[i].internal ) {  
                ip = arr[i].address;
                break;
            }
        }
    }
}else{
    try{
        ip = process.argv[1],
        port = process.argv[2];
    }catch(e){}
}

proxy.createProxyServer(ip , port);