export declare class Jwt {
    static jwtSign(payload: any, userId: any, expires_in?: string): string;
    static jwtVerify(token: string): Promise<any>;
    static jwtSignRefreshToken(payload: any, userId: any, expires_in?: string, redis_ex?: number): Promise<string>;
    static jwtVerifyRefreshToken(refeshToken: string): Promise<any>;
    private static gen_secret_key;
}
