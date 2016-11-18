'use strict';

var numify = function(ip) {
    ip = ip.split('.').map(function(n) {
        return parseInt(n, 10);
    });

    var result = 0 ,base = 1;
    
    for ( var i = ip.length-1; i >= 0; i-- ) {
        result += ip[i]*base;
        base *= 256;
    }
    // result = ip[0]*(1<<24) + ip[1]*(1<<16) + ip[2]*(1<<8) + ip[3];
    return result;
};

var responseBuffer = function(response){
    var offset = response.question.qname.length,
        length = 16 + offset;

    for ( var i = 0 ; i < response.answer.length ; i++ ){
        length += 14+response.answer[i].name.length;
    }

    var buf = Buffer.alloc(length);
    response.header.id.copy(buf,0,0,2);

    buf[2] = 0x00 | response.header.qr << 7 | response.header.opcode << 3 | response.header.aa << 2 | response.header.tc << 1 | response.header.rd;
    buf[3] = 0x00 | response.header.ra << 7 | response.header.z << 4 | response.header.rcode;

    buf.writeUInt16BE(response.header.qdcount, 4);
    buf.writeUInt16BE(response.header.ancount, 6);
    buf.writeUInt16BE(response.header.nscount, 8);
    buf.writeUInt16BE(response.header.arcount, 10);

    response.question.qname.copy(buf,12);
    response.question.qtype.copy(buf,12+offset,0,2);
    response.question.qclass.copy(buf,14+offset,0,2);

    offset += 16;

    for ( i = 0; i < response.answer.length ; i++ ) {
        response.answer[i].name.copy(buf,offset);

        offset += response.answer[i].name.length;
        
        buf.writeUInt16BE(response.answer[i].type , offset);
        buf.writeUInt16BE(response.answer[i].class , offset+2);
        buf.writeUInt32BE(response.answer[i].ttl , offset+4);
        buf.writeUInt16BE(response.answer[i].rdlength , offset+8);
        buf.writeUInt32BE(response.answer[i].rdata , offset+10);

        offset += 14;
    }

    return buf;
};
var resolve = function(qname , ttl , rdata){
    var result = [];
    for (var i = 0; i < rdata.length; i++) {
        var answer = {};
        answer.name = qname;
        answer.type = 1;
        answer.class = 1;
        answer.ttl = ttl;
        answer.rdlength = 4;
        answer.rdata = numify(rdata[i]);
        result.push(answer);
    }
    return result;
};
module.exports  = function response(request , ttl , rdata){
    var response = {};
    response.header = {};
    response.question = {};
    response.answer = resolve(request.question.qname , ttl , typeof rdata === 'string' ? [rdata] : rdata);

    response.header.id = request.header.id;

    response.header.qr = 1;
    response.header.opcode = 0;
    response.header.aa = 0;
    response.header.tc = 0;
    response.header.rd = 1;
    response.header.ra = 0;
    response.header.z = 0;
    response.header.rcode = 0;
    response.header.qdcount = 1;
    response.header.ancount = response.answer.length;
    response.header.nscount = 0;
    response.header.arcount = 0;

    response.question.qname = request.question.qname;
    response.question.qtype = request.question.qtype;
    response.question.qclass = request.question.qclass;

    return responseBuffer(response);
};

