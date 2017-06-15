#!/bin/bash
rm -rf node_modules

docker run --rm -v $PWD:/webapp -w /webapp node:8.1 npm install

cd public/static/dependencies
bash link.sh
cd -

docker run --rm -p 127.0.0.1:8000:8000 --name mvnnweb --link mvnnserver:mvnnserver -v $PWD:/webapp -w /webapp -it node:8.1 npm run dev
