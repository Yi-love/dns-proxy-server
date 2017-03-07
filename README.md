# dns-proxy-server
dns proxy server

dns server depend `os` , `dns` , `dgram` module on  Node.js environment。use `dgram` module create proxy server , 
`lookup()` function  and `resolve4()` funtion will be resolve domain to ipv4. 
dns proxy server depend on operation system configuration files (e.g. `/etc/hosts` or `hosts`).

### why
you to develop a program on your computer. want to test on mobile phones. 
you should running `dnsproxy` in the computer ,and change mobile `dns` to the computer `ipv4`.

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

### ttl(Time To Live)

* `local hosts` : `1` second;
* `net dns` : `30` seconds.

### example

```
 dnsproxy
 //or
 dnsproxy  8.8.8.8
 //or
 dnsproxy 8.8.8.8 53
```


### MAC
please use `sudo`.

eq:
```
 sudo dnsproxy
```