# Book review NodeJS TypeScript project
Book review backend web app using NodeJS with Express and MySQL database

requirements: installed mysql + mysql Workbench, username and password same as in ```database.json```,
globally installed ```db-migrate```

- used db-migrate commands: https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/
- used knex to build SQL queries: https://knexjs.org/guide/query-builder.html#knex

- to run server (for the first time) on ```http://localhost:3001```: 

```
npm install
db-migrate db:create booksdb -e initialize
npm start
```

- to run server (not for the first time) on ```http://localhost:3001```: 

```
npm start
```
