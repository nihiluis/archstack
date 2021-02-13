FROM golang:1.15 as builder

ENV APP_USER app
ENV APP_HOME /go/src/app

RUN groupadd $APP_USER && useradd -m -g $APP_USER -l $APP_USER
RUN mkdir -p $APP_HOME && chown -R $APP_USER:$APP_USER $APP_HOME

USER $APP_USER
WORKDIR $APP_HOME

RUN mkdir ../core-api

COPY ./workspace-api .
COPY ./core-api ../core-api

WORKDIR $APP_HOME

RUN go mod download
RUN go mod verify
RUN go build -o app

FROM debian:buster

ENV APP_USER app
ENV APP_HOME /go/src/app

RUN groupadd $APP_USER && useradd -m -g $APP_USER -l $APP_USER
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

COPY --chown=0:0 --from=builder $APP_HOME/app $APP_HOME

USER $APP_USER
CMD ["./app"]
