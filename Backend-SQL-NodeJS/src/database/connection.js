import sql from 'mssql';

const dbSettings = {
    user: 'cparedes',
    password: '12345',
    server:'localhost',
    database: 'DbPrueba',
    options:{
        encrypt: false,
        trustServerCertificate: true,
    }
}

export const getConecction = async ()=>{
    try {
        const pool = await sql.connect(dbSettings);
        console.log('Conexión a base de datos correcta')
        return pool;
    } catch (error) {
        console.error(error);
    }
}
