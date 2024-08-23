## Todo:

Server steps:
DONE Connect postman api to your server generated api not the other one
DONE Run Prism in a proxy mode, where the tool sits in between the client and the server.
DONE prism proxy -p 8081 api/openapi.yaml http://localhost:8080/

====

DONE Pagination
DONE Move use cases out of OpenAPI into 'best-practices-by-endpoint"
DONE Database schema
DONE Security schema

Read book:
DONE generate api server using swagger codegen
preesntation open source tool try creating template.
api workflow spec
api styleguide using spectral -- maybe also render this

## Maybes:

DONE rename operations
Docusaurus so you can add tabs, also supports api docs
Response headers, how do clients use?
Staff user roles that can change specific statuses?
They would need a way to login to the KDS
tools for updating descriptions in code annotations
user login to change details, maybe use clerk.

## Ports

May want to run everything from the API server instead of the separate OpenAPI repo.
or you have a course folder with a Docker file.

ports:
Swagger Editor: 80:80
Swagger UI: 8000:8000 -- needs to be based on the server-generated file. the api server spins up swagger ui. need to separate it from the API server? --- but its good they are connected

Prism proxy - 8081 --- Prism ignores the OpenAPI servers element
API server: 8080

on API server:
npm run start

prism proxy -p 8081 api/openapi.yaml http://localhost:8080/

Change baseUrl in Postman to the proxy 8081

MongoDB: 27017:27017⁠
https://hub.docker.com/_/mongo

# remove servers from openAPI- THE sdk adds this

Make vscode file for mermaid and swagger viewer

HTTP:
Port 80: Default port for HTTP web servers.
Port 8080: Common alternative port for HTTP web servers, often used during development.
Port 8000: Another alternative port for HTTP web servers.
HTTPS:
Port 443: Default port for HTTPS secure web servers.
Port 8443: Common alternative port for HTTPS secure web servers.
SSH:
Port 22: Default port for SSH (Secure Shell) servers, used for remote access to servers.
FTP:
Port 21: Default port for FTP (File Transfer Protocol) servers, used for transferring files.
SMTP:
Port 25: Default port for SMTP (Simple Mail Transfer Protocol) servers, used for sending emails.
DNS:
Port 53: Default port for DNS (Domain Name System) servers, used for translating domain names to IP addresses.
MySQL:
Port 3306: Default port for MySQL database servers.
PostgreSQL:
Port 5432: Default port for PostgreSQL database servers.
MongoDB:
Port 27017: Default port for MongoDB database servers.
Redis:
Port 6379: Default port for Redis key-value store servers.

Github repos:
https://designapis.com/ ch10/01.yml.

## API improvments

Dont need to..get refer to it diffetnly in the functions
Get all for patrons




@import url(https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap);


items:
    $ref: "#/components/schemas/Order"