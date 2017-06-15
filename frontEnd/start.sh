#!/bin/bash
docker run --rm -p 127.0.0.1:8000:8000 --name mvnnweb --link mvnnserver:mvnnserver -v $PWD:/webapp -w /webapp -it node:8.1 npm run dev
