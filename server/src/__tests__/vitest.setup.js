import { app } from '../index';
import supertest from 'supertest';

import config from '../../knexfile.cjs';
import { knex } from 'knex';

export const dbconnection = knex(config.development);

export const App = supertest(app);
