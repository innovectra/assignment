const sql = require('mssql');
const config = {
    server: 'sql.bsite.net\\MSSQL2016',
    database: 'stealthai_assignment',
    user: 'stealthai_assignment',
    password: 'Y4Ym#LpcvDV@H7d',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    connectionTimeout: 30000,
};
(async () => {
    let connection;
    try {
        await sql.connect(config);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    finally {
        connection?.close();
    }
})();
module.exports = { config };