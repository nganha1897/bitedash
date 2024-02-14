import { DevEnvironment } from './environment.dev';
import { ProdEnvironment } from './environment.prod';

export interface Environment {
    db_uri: string,
    jwt_secret_key: string,
    jwt_refresh_secret_key: string,
    sendgrid?: {
        api_key: string,
        email_from: string,
    },
    redis?: {
        username?: string,
        password?: string,
        host: string,
        port: number
    },
    cloudinary?: {
        cloud_name?: string,
        api_key: string,
        api_secret: string
    }
};

export function getEnvironmentVariables() {
    if(process.env.NODE_ENV === 'production') {
        return ProdEnvironment;
    }
    return DevEnvironment;
}