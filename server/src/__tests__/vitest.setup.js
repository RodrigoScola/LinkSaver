import { app } from '../index';
import supertest from 'supertest';

import config from '../../knexfile.ts/index.js';
import { knex } from 'knex';

export const dbconnection = knex(config.development);

export const App = supertest(app);
