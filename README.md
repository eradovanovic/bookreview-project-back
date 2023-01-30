# Book review NodeJS TypeScript project
Book review backend web app using NodeJS with Express and MySQL database

requirements: installed mysql + mysql Workbench, username and password same as in ```database.json```

- to run server (for the first time) on ```http://localhost:3001```: 

```
npm install
MYSQL_FLAGS="-CONNECT_WITH_DB" db-migrate db:create booksdb
db-migrate up
npm start
```

- to run server (not for the first time) on ```http://localhost:3001```: 

```
npm start
```
