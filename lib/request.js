'use strict';

var bitSlice = function(b, offset, length) {
    return (b >>> (7-(offset+length-1))) & ~(0xff << length);
};

var domainify = function(qname) {
    var parts = [];

    for (var i = 0; i < qname.length && qname[i];) {
        var length = qname[i],
            offset = i+1;
        parts.push(qname.slice(offset,offset+length).toString());
        i = offset+length;
    }

    return parts.join('.');
};
module.exports = function request(buf) {
    var header = {},
        question = {},
        b = buf.slice(2,3).toString('binary', 0, 1).charCodeAt(0);

    header.id = buf.slice(0,2);
    header.qr = bitSlice(b,0,1);
    header.opcode = bitSlice(b,1,4);
    header.aa = bitSlice(b,5,1);
    header.tc = bitSlice(b,6,1);
    header.rd = bitSlice(b,7,1);

    b = buf.slice(3,4).toString('binary', 0, 1).charCodeAt(0);

    header.ra = bitSlice(b,0,1);
    header.z = bitSlice(b,1,3);
    header.rcode = bitSlice(b,4,4);

    header.qdcount = buf.slice(4,6);
    header.ancount = buf.slice(6,8);
    header.nscount = buf.slice(8,10);
    header.arcount = buf.slice(10, 12);

    question.qname = buf.slice(12, buf.length-4);
    question.qtype = buf.slice(buf.length-4, buf.length-2);
    question.qclass = buf.slice(buf.length-2, buf.length);

    return {header:header, question:question , domain: domainify(question.qname)};
};

