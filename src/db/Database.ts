import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
const knex = require('knex')

@Service()
export class Database {
    public  instance;

    constructor(
        @Inject('config:database') private cfg: Knex.Config
    ) {}

    async connect(): Promise<void> {
        this.instance = knex({...this.cfg})
    }
}
