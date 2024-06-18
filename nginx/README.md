Для работы с TLS (HTTPS) нужно иметь сертификат.
Так как нам достаточно самоподписного сертификата, создаем его:

```bash
openssl genrsa -out key.pem 1024
openssl req -new -key key.pem -out cert-req.pem
openssl x509 -req -extfile <(printf "subjectAltName=IP:192.168.0.102") -in cert-req.pem -signkey key.pem -out cert.pem

```

subjectAltName (SAN) - содержит IP адреса, для которых предназначен сертификат.
То есть, если сертификат будет использоваться для неизвестного IP, то будет ошибка, на этапе проверки протоколом TLS.
Можно указать было этот адрес при создании как Common Name (CN), но я не проверял.