# dns-proxy-server
dns proxy server

dns server depend `os` , `dns` , `dgram` module on  Node.js eenvironment。use `dgram` module create proxy server , 
`lookup()` function  and `resolve4()` funtion will be resolve domain to ipv4.

```
 npm install dns-proxy-server -g
```

### cmd

```
  dnsproxy[ ip[ port]]
```

### arguments

* `ip` : ipv4 address , default depend on system.
* `port`: dns server bind the port if provide, default `53`.

### example

```
 dnsproxy
 //or
 dnsproxy  8.8.8.8
 //or
 dnsproxy 8.8.8.8 53
```