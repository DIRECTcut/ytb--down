import express from 'express';
import path from 'path';
import apiRouter from './api.router';
import createVidsDir from '../helpers/createVidsDir';

const SERVER_PORT = process.env.PORT || 3000;
const app = express();

app.use('/api', apiRouter);
app.use(express.static(path.resolve('./public')));

createVidsDir();

app.listen(SERVER_PORT);

/* eslint-disable no-console */
console.log(`Server listening on port ${SERVER_PORT}...`);
/* eslint-enable no-console */

export default app;
