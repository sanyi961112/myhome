import { Pool } from 'pg';
//'localhost' ha dev, 'db' ha docker prod
const connectionString = 'postgresql://postgres:postgres@localhost:5432/myhome';
const pool = new Pool({
    connectionString: connectionString,
});

async function query(queryString, paramList){
    return pool.query(queryString, paramList);
}

module.exports =
    {
        query: query
    };
