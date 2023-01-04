import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers'
import * as express from 'express';
import config = require("config")
import { Container } from "typedi"
import { Database } from "./db/Database"

Container.set([
    { id: 'config:database', value: config.get('database') },
    { id: 'config:authorization', value: config.get('authorization') },
])
useContainer(Container)

import {UserController} from "./controllers/Data/User/UserController";
import {BookController} from "./controllers/Data/Book/BookController";
import {GenreController} from "./controllers/Data/Genre/GenreController";
import {AuthorController} from "./controllers/Data/Author/AuthorController";
import {ReviewController} from "./controllers/Data/Review/ReviewController";
import {CollectionController} from "./controllers/Data/Collection/CollectionController";
import {AuthController} from "./controllers/Auth/AuthController";
import {CustomErrorHandler} from "./middleware/ErrorHandler";
import {Authorization} from "./middleware/Authorization";
import {UrlEncoder} from "./middleware/UrlEncoder";
import {Logger} from "./middleware/Logger";

const db: Database = Container.get(Database)

db.connect().then(() => {
    console.log('DB connection successful')
    const app: express.Express = createExpressServer({
        cors: true,
        controllers: [
            UserController,
            BookController,
            GenreController,
            AuthorController,
            ReviewController,
            CollectionController,
            AuthController,
        ],
        middlewares: [
            UrlEncoder,
            Logger,
            Authorization,
            CustomErrorHandler
        ],
        defaultErrorHandler: false,
    })

    app.listen(3001)
    console.log('Server running on port 3001...')
})
