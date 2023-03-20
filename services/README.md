Cirtana Dev-Docs
===

# Architecture

The design of Cirtana chatbot is based on micro-service architecture.

All service has a local and public configurations.

An nginx reverse proxy is used to switch from public to private configuration for each service is run on its own (thus different ports).


## Dependencies :
require nodemon to ensure that services are restarted after code change for the case of nodejs services
```bash
    npm install -g nodemon
```
