export declare class UserController {
    static signup(req: any, res: any, next: any): Promise<void>;
    static verifyUserEmailToken(req: any, res: any, next: any): Promise<void>;
    static resendVerificationEmail(req: any, res: any, next: any): Promise<void>;
    static login(req: any, res: any, next: any): Promise<void>;
    static sendResetPasswordOtp(req: any, res: any, next: any): Promise<void>;
    static verifyResetPasswordToken(req: any, res: any, next: any): void;
    static resetPassword(req: any, res: any, next: any): Promise<void>;
    static profile(req: any, res: any, next: any): Promise<void>;
    static updatePhoneNumber(req: any, res: any, next: any): Promise<void>;
    static updateUserProfile(req: any, res: any, next: any): Promise<void>;
    static getNewTokens(req: any, res: any, next: any): Promise<void>;
    static logout(req: any, res: any, next: any): Promise<void>;
}
