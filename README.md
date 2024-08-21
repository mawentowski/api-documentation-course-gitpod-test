Incorporate Mermaid:
https://github.com/mermaidjs/mermaid-live-editor

todo:
open spec add server pointing to proxxy server
Documentation website load
Mock server
basic client
restaurant pos app
docker container where can run curl requests

## API Documentation Course

```shell
# will also build if local images not there, otherwise it will build from local images
docker-compose up
docker-compose down
# this is to rebuild images, rarely need
docker-compose up --build

# restart one container, handle if make a change locally
docker restart api-documentation-course-swagger-editor-1

```

Log openapi into swagger editor.

<!-- ## Update postman

Find docker host IP:

```shell
docker info
``` -->

## Manual instructions

# README

## Prerequisites

## Swagger Editor

https://hub.docker.com/r/stoplight/prism

```shell
npm i swagger-editor
```

### Install Prism

View docker docs:
https://hub.docker.com/r/stoplight/prism

```shell
docker pull stoplight/prism
docker run --init --rm -v $(pwd):/tmp -p 4010:4010 stoplight/prism:4 mock -h 0.0.0.0 "/tmp/openapi.yml"
```

Docker compose:

Use prism as part of a docker compose file to aid development environment portability:

```shell
version: '3.9'
services:
  prism:
    image: stoplight/prism:4
    command: 'mock -h 0.0.0.0 /tmp/api.oas3.yml'
    volumes:
      - ./api.oas3.yml:/tmp/api.oas3.yml:ro
    ports:
      # Serve the mocked API locally as available on port 8080
      - '8080:4010'
```

Local:

```shell
npm install --global @stoplight/prism-cli
# Print usage info for testing
prism --help
```

### Run Swagger UI

https://hub.docker.com/r/stoplight/prism

Pull the docker image:

```shell
docker pull swaggerapi/swagger-ui
```

With the command below, the current working directory ($(pwd)) on the host machine will be mounted to the /tmp directory inside the container. This allows you to access files in your local working directory from within the container. The Swagger UI running inside the container can then access the Swagger/OpenAPI specification file (`openapi.yml`) located in the mounted directory.

```shell
docker run -d -p 8000:8000 -e PORT=8000 -v $(pwd):/tmp -e SWAGGER_JSON=/tmp/openapi.yml  swaggerapi/swagger-ui
```

### Run Swagger Editor

To use the docker image in DockerHub:

```shell
docker pull swaggerapi/swagger-editor
```

Run the following command to start a container based on the swaggerapi/swagger-editor image, and the Swagger Editor interface becomes accessible in your web browser at http://localhost. You can then edit your Swagger/OpenAPI specification file (swagger.json) using the Swagger Editor running inside the container. Any changes you make will be reflected in the mounted volume (./swagger.json) on your local filesystem.

```shell
# docker run -d -p 80:8080 -v $(pwd):/tmp -e SWAGGER_FILE=/tmp/openapi.yml swaggerapi/swagger-editor
docker run -d -p 80:80 -e PORT=80 -v $(pwd):/tmp -e SWAGGER_FILE=/tmp/openapi.yml swaggerapi/swagger-editor

# can create a script that makes running this simpler:
# would need to stop the container.
# docker run -d -p 80:80 -e PORT=80 -v $(pwd)/chapters:/tmp -e SWAGGER_FILE=/tmp/ch1.yml swaggerapi/swagger-editor
```

This will run Swagger Editor (in detached mode) on port 80 on your machine, so you can open it by navigating to http://localhost in your browser.

## Run mock server using Prism

```shell
prism mock -p 8080 ./openapi.yml
prism proxy -p 4040 api/openapi.yaml http://localhost:8080/
```

## Mongo DB

Start a mongo server instance

```shell
docker run --name pos-db -d -p 27017:27017 mongo:latest
# pos-db-new is the name of the container
docker run --name pos-db-new -d -p 3306:3306 mongo:latest
```

Docker-compose

```yml
# Use root/example as user/password credentials
version: "3.1"

services:
  mongo:
    image: mongo
    ADD  MORE IN THE FILE
```

Install in API server
npm install mongoose --save

#### Going it the DB container

Go into container

```shell
# list containers
ps
# add container ID
docker exec -it dcaa3e60df81 bash



```

#### Add path to mongosh binary for session

```shell
export PATH="$PATH:/usr/bin/mongosh"
# Connect via. Mongosh:
mongosh # connects to mongodb://127.0.0.1:27017
# Commands here: https://www.mongodb.com/developer/products/mongodb/cheat-sheet/#connect-via-
show dbs
# prints the current database
db
# use the pos-db.
use <database_name>
```

DONT DO
Alternatively add it to bash_profile/rc

```shell
# Go it current working directory and the bashrc should be there:
cd ~
ls
# Add the Directory to PATH:
echo 'export PATH="$PATH:/usr/bin/mongosh"' >> ~/.bashrc
# Alternatively open the file with nano
# install nano to edit bashrc later:
apt-get install nano
nano .bashrc
source ~/.bashrc
# test mongo cli:
mongosh --version
```

=======

Alternatively, provide the path to the mongo distributable in the command.

#### Query the database

```shell
use my_database

db.createCollection("users")

db.users.insertOne({ name: "John Doe", age: 30 })

db.users.find()

db.users.updateOne({ name: "John Doe" }, { $set: { age: 31 } })

db.users.find()

db.users.deleteOne({ name: "John Doe" })

db.users.find()

show dbs
```

NoSQL booster for mongoDB:
mongodb://localhost:27017

### MYSQL DB

```shell
docker exec -it d94610e86026d84090e74daa2a6e1e9f0e2c1256b9de18277bd3b9860cad41fc bash
export PATH="$PATH:/usr/bin/mariadb"



# Connect via. Mongosh:
mongosh # connects to mongodb://127.0.0.1:27017
# Commands here: https://www.mongodb.com/developer/products/mongodb/cheat-sheet/#connect-via-
show dbs
# prints the current database
db
# use the pos-db.
use <database_name>
```

## API Styleguide

https://docs.stoplight.io/docs/spectral/674b27b261c3c-overview

## Diagrams

Install the Mermaid VS Code extension

## Two way editor

https://www.apicur.io/studio/docs/getting-started-using-docker

## Try these two platform (docker compose)

https://github.com/apicurio/apicurio-studio
https://github.com/Apicurio/apicurio-studio/blob/master/distro/docker-compose/Readme.md

<!-- Stoplight studio does have the styleguide and visual editor feature -->

## Spectral rules / styleguide

https://meta.stoplight.io/docs/spectral/674b27b261c3c-overview

https://stoplight.io/api-style-guides-guidelines-and-best-practices?utm_source=github.com&utm_medium=referral&utm_campaign=github_repo_spectral&_ga=2.50481132.436312531.1713591071-444182859.1713563872



## Email




Congratulations on your purchase of the Mastering API Documentation - Live Virtual Training Course! 🎉

This 6-part series runs every Friday from 03 October 2024 to 19 December 2024.  2024 Fall-Winter Class Schedule

Each course session is approximately 90 minutes long, running from 10:00am to 11:30am PT. Please check your timezone here for local time. 

## What you should do now

BrightTALK is the webinar software we are using to run the course. 
You need to Sign up for a BrightTALK account at https://www.brighttalk.com/. This saves your details to BrightTALK so you can register for the different classes of course on the platform (*more on that in  second)
Each session has it's own URL that is both used to register for the class and also for you to access the class on the day of the class. You must register for each class indivudally by clicking the individual URLs below and clicking Reigster (signing in if you arent alreadyt signed in.) Once you register for a class, brighttalk remembers you signed up for it for your account.

Class #1: 03 October 2024
🔗 [Class #1 - Registeration and Day-of class link]: https://www.brighttalk.com/webcast/9273/620143
Class #2: 17 October 2024
🔗 [Class #2 - Registeration and Day-of class link]: https://www.brighttalk.com/webcast/9273/620185
Class #2: 31 October 2024
🔗 [Class #3 - Registeration and Day-of class link]: https://www.brighttalk.com/webcast/9273/620186
Class #2: 14 November 2024
🔗 [Class #4 - Registeration and Day-of class link]: https://www.brighttalk.com/webcast/9273/620195
Class #2: 05 December 2024
🔗 [Class #5 - Registeration and Day-of class link]: https://www.brighttalk.com/webcast/9273/620202
Class #2: 19 December 2024
🔗 [Class #6 - Registeration and Day-of class link]: https://www.brighttalk.com/webcast/9273/620203

Remmeberr: The previous linkjs are ALSO the links that you will use to join the class the DAY OF THE CLASS.

## What to expect coming up to the course

Shortly before the course begins, you'll receieve an email with a link to a list of prerequisites to complete before attending the course, for example, download softrware, cloning course preositories, and accessing the coruse Discord chanenl where ytou can ask for help.

Part of this package will be a passcode you must enter on the day of the first class to verify youi are a payiong custoemr. Passcodes fopr the toher classes will be sent porior to those class dates.

Questions / Comments?
Feel free to contact Mark with any questions or to request a refund:
mark.wentowski@docsgeek.io



======





### Welcome to the Mastering API Documentation - Live Virtual Training Course! 🎉

Thank you for purchasing our course! This 6-part series runs every Friday from October 3, 2024, to December 19, 2024.

#### 2024 Fall-Winter Class Schedule

Each session is approximately 90 minutes long, running from 10:00 am to 11:30 am PT. Please check your local timezone [here](https://www.timeanddate.com/worldclock/converter.html).

#### What You Should Do Now

We'll be using BrightTALK as our webinar platform. Please follow these steps to get started:

1. **Sign Up for BrightTALK**: Create an account at [BrightTALK](https://www.brighttalk.com/). This will save your details so you can register for each session.

2. **Register for Each Class**: Each session has a unique URL for registration and access. Click the links below to register and sign in if needed. BrightTALK will remember your registration.

**Class #1: October 3, 2024**
  🔗 [Registration and Access Link](https://www.brighttalk.com/webcast/9273/620143)

**Class #2: October 17, 2024**
  🔗 [Registration and Access Link](https://www.brighttalk.com/webcast/9273/620185)

**Class #3: October 31, 2024**
  🔗 [Registration and Access Link](https://www.brighttalk.com/webcast/9273/620186)

**Class #4: November 14, 2024**
  🔗 [Registration and Access Link](https://www.brighttalk.com/webcast/9273/620195)

**Class #5: December 5, 2024**
  🔗 [Registration and Access Link](https://www.brighttalk.com/webcast/9273/620202)

**Class #6: December 19, 2024**
  🔗 [Registration and Access Link](https://www.brighttalk.com/webcast/9273/620203)

Remember: These links are also used to join the class on the day of the session.

### What to Expect Leading Up to the Course

Before the course begins, you'll receive an email with a list of prerequisites, including software downloads, cloning course repositories, and joining the course's Discord channel for help and discussions.

This package will also include a passcode for verifying your enrollment on the first day. Additional passcodes for subsequent classes will be sent prior to each session.

### Questions or Comments?

If you have any questions or need assistance, feel free to contact Mark at:
📧 mark.wentowski@docsgeek.io