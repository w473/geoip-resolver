# geoip resolver
Simple service to serve GEOIP data based on GEOLITE by MAXMIND

ation

```bash
$ npm ci
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# tests coverage
$ npm run test:cov
```

## Docker images:
ghcr.io/w473/geoip-resolver:latest

and

ghcr.io/w473/geoip-resolver:TAG

e.g.

ghcr.io/w473/geoip-resolver:0.0.1

## SECURITY
Microservice is designed to work in Kubernetes cluster
with [Istio](https://istio.io/)

### Authentication:
JWT
Istio should protect microservice

### Authorization
Microservice is looking for header with payload of JWT
- by default "x-authz"
- can be switch env variable AUTHORIZATION_HEADER
