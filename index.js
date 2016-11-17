'use strict';

var dgram = require('dgram');
var dns = require('dns');

var request = require('./lib/request');
var response = require('./lib/response');

var server = dgram.createSocket('udp4');

var respond = function(rinfo){
    return function(rq , address){
        var buf = response(rq , 1 , address);
        server.send(buf, 0, buf.length, rinfo.port, rinfo.address);
    };
};

exports.createProxyServer = function(ip , port){
    server.on('message' , function(msg , rinfo){
        var rq = request(msg) , 
            rs = respond(rinfo);
        dns.lookup( rq.domain , function(err , address , family){
            if ( address !== void 0 ) {
                console.log('address: ' , address);
                return rs(rq , address);
            }else{
                dns.resolve4(rq.domain, function(error, addresses){
                    console.log('dns resolve4 server...');
                    if ( addresses === void 0 ) {
                        return console.log('missing...' , rq.domain);
                    }
                    console.log('address*: ' , addresses);
                    return rs(rq , addresses);
                });
            }
        });
    });
    server.on('error' , function(err){
        console.log('server error: ', err.stack);
    });
    server.on('listening' , function(){
        var address = server.address();
        console.log('server listening: ' ,address.address,':',address.port);
    });
    server.bind({port:port || 53,address:ip || '8.8.8.8'});
};