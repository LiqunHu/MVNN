MVPN
=========================
This is a restful web project.<br/>
Mysql + Vue2 + node + nginx Project.

=========================

Installation
------------
You should have a docker environment. Then everything will be done. :)

Usage
-----
docker to create database <br/>
./database.sh
mysql port 33306
redis port 6379

export NODE_ENV=test # for set NODE_ENV<br/>

server: npm install; npm run start<br/>
web: cd frontEnd; cnpm install; npm run dev<br/>
static link: cd public/dependencies; bash link.sh<br/>

for db create:
node init-db.js; node init-data.js

-----
http://localhost you will have the web home.
