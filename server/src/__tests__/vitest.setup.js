import { app } from 'src';
import {  supabase } from 'src/datbase/Table';
import supertest from 'supertest';


export const dbconnection = supabase;

export const App = supertest(app);
