import express    from 'express';
import path from 'path';
import apiRouter  from './api.router';

const SERVER_PORT = process.env.PORT || 3000;
const app         = express();

app.use('/api', apiRouter);
app.use(express.static(path.resolve('./public')))

app.listen(SERVER_PORT);

console.log(`Server listening on port ${SERVER_PORT}...`);

export default app;
