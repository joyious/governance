# governance
Tools for governance.

## Prerequisites

+ Docker

## Build

This will build the backend and frontend into docker images.

```
docker-compose build
```

## Run

Start the containers

```
docker-compose up -d
```

Stop them
```
docker-compose down
```

## More details

### Backend debugging

Fastapi provides pretty good api documentation, which is available at:

http://127.0.0.1:8000/docs

Start debugging backend using jupyter:
```
docker-compose exec backend jupyter lab --ip=0.0.0.0 --allow-root --NotebookApp.custom_display_url=http://127.0.0.1:8888
```

Check the output for the url to load in host browser, it would be something like:
```
http://127.0.0.1:8888/?token=aaf4150de3a1ef79fd2612d43144b2215488170412a4690a
```

Open the url in browser.

### Frontend

Frontend directory can be used as a standalone vue project, which can be run locally:
```
npm install
npm run serve
```
