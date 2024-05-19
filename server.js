import http from 'http'
import {config} from 'dotenv';

config();

import app from './app/app.js'

const server = http.createServer(app);

server.listen(process.env.PORT || 3001, () => console.log("Server is running on port " + process.env.PORT || 3001))