'use strict';
var proxy = require('../index');
var os = require('os');

var ip = void 0,
    port = void 0;

console.log('use : ' , process.argv);

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
}else if ( process.argv.length === 2 ) {
    ip = process.argv[1];
}else if( process.argv.length === 3 ){
    ip = process.argv[1];
    port = process.argv[2];
}else{
    console.log('arguments invalid. please use `dnsproxy[,ip[,port]]`');
}

proxy(ip , port);