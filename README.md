# URL Shortener

## Description
This web application allows generating a short URL that will redirect to the original URL provided. The short URL will be valid for :mins: minutes, after which it will be automatically deleted from the system. This mechanism ensures temporary and secure access to the generated links.

## Use
#### Clone the repository
```bash
git clone https://github.com/Leonardo-Antonio/shorter-url.git
```
#### Requirements
- Go 1.19+
#### Run
```bash
go mod tidy && TTL_MINS_URLS=5 PORT=9001 go run *.go
```

## Screenshots
![Screenshot](/assets/image.png)