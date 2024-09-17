to generate public key and certificate
1. Create a config file - localhost.cof
2. run the following command 
```bash
openssl req -x509 \
  -out ssl-localhost/localhost.crt \
  -keyout ssl-localhost/localhost.key \
  -newkey rsa:2048 -nodes -sha256 -days 365 \
  -config localhost.conf
```
where
```
Argument	Description
req -x509	generate X.509 certificate
-out ssl-localhost/localhost.crt	name of output certificate file
-keyout ssl-localhost/localhost.key	name of output key file
-newkey rsa:2048	create new certificate request and a new private key using algorithm RSA and key size of 2048 bits
-nodes	No DES encryption. The generated private key will not be encrypted
-sha256	Use the SHA256 message digest to sign the request
-days 365	Certificate is valid for 365 days
-config localhost.conf	Name of config file
```

View the contents of your certificate:
```bash
openssl x509 -noout -text -in ssl-localhost/localhost.crt
```
