FROM openjdk:12-alpine

WORKDIR /code

COPY src/ .

#RUN apt update && apt install openjdk maven
RUN apk update && apk add maven

CMD [ "sh", "./run.sh" ]
