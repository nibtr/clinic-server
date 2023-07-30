import dotenv from 'dotenv'
dotenv.config()

const {
    PORT,
    HOST,
    HOST_URL,
    TOKEN_SECRET,
    TOKEN_EXPIRATION_TIME,
} = process.env


const config = {
    host: HOST,
    port: PORT,
    hostUrl: HOST_URL,
    jwtToken: TOKEN_SECRET,
    jwtExpirationTime: TOKEN_EXPIRATION_TIME,
}
export default config;