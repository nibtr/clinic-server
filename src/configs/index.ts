import dotenv from 'dotenv'
dotenv.config()

const {
    PORT,
    HOST,
    HOST_URL,
    TOKEN_SECRET,
    TOKEN_EXPIRATION_TIME,
    SQL_USER,
    SQL_PASSWORD,
    SQL_SERVER,
    SQL_DATABASE,
    SENDINBLUE_API_KEY,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    ETHEREAL_USERNAME,
    ETHEREAL_PASSWORD
} = process.env
const sqlEncrypt = process.env.SQL_ENCRYPT === 'true'

const config = {
    host: HOST,
    port: PORT,
    hostUrl: HOST_URL,
    jwtToken: TOKEN_SECRET,
    jwtExpirationTime: TOKEN_EXPIRATION_TIME,
    sendinblueApiKey: SENDINBLUE_API_KEY,
    adminUsername: ADMIN_USERNAME,
    adminPassword: ADMIN_PASSWORD,
    etherealUsername: ETHEREAL_USERNAME,
    etherealPassword: ETHEREAL_PASSWORD,
    sqlConfig: {
        user: SQL_USER,
        password: SQL_PASSWORD,
        server: SQL_SERVER,
        database: SQL_DATABASE,
        options: {
            encrypt: sqlEncrypt
            // trustedConnection: true,
            // trustServerCertificate: true,
        }
    }
}
export default config;