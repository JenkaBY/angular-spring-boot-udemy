## HTTPS

To generate key pair use the command:
```bash
keytool -genkeypair -alias luv2code -keystore src/main/resources/luv2code-keystore.p12 -keypass secret -storeType PKCS12 -storepass secret -keyalg RSA -keysize 2048 -validity 365 -dname "C=US, ST=Pennsylvania, L=Philadelphia, O=luv2code, OU=Training Backend, CN=localhost" -ext "SAN=dns:localhost"
```
after running the command, the key pair will be stored under the resource directory.

```bash
Argument	Description
-genkeypair	Generates a key pair
-alias	Alias name of the entry to process
-keystore	Name of output keystore file
-keypass	Key password
-storeType	Keystore type
-storepass	Keystore password
-keyalg	Key algorithm name
-keysize	Key bit size
-validity	Validity number of days
-dname	Distinguished name
-ext	Add the given X.509 extension
```

To verify the generated key pair use
```bash
keytool -list -v -alias luv2code -keystore src/main/resources/luv2code-keystore.p12 -storepass secret
```