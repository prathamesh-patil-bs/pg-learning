const app = require('./src/app');
const pool = require('./src/pool');

pool.connect({
    host: 'localhost',
    port: 5432,
    user: 'pratham',
    password: '1234',
    database: 'socialnetwork'
}).then((res) => {
    app().listen(3005, () => {
        console.log('Listening on port 3005');
    });
}).catch((error) => console.log(error.message));