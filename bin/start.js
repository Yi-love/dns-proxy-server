#!/usr/bin/env node
'use strict';
var proxy = require('../index');
var os = require('os');

var ip = void 0,
    port = void 0;

if ( process.argv.length === 2 ) {
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
}else if ( process.argv.length === 3 ) {
    ip = process.argv[2];
}else if( process.argv.length === 4 ){
    ip = process.argv[2];
    port = process.argv[3];
}else{
    console.log('arguments invalid. please use `dnsproxy[,ip[,port]]`');
}

proxy.createProxyServer(ip , port);