require('dotenv').config({ path: './.env' });

const configureMiddleware = require('./app/middleware/server.middleware')
const configureRoutes = require('./app/routes/server.routes')
const configureMongodb = require('./app/database/mongoDb');

const app = require('express')();

configureMiddleware(app);
configureRoutes(app);
configureMongodb();


const PORT = process.env.PORT || process.env.LOCAL_PORT

app.listen(PORT, () => {
    console.log(`TEMU listening on port ${PORT}`)
})