export declare class UserValidators {
    static signup(): import("express-validator").ValidationChain[];
    static verifyUserEmailToken(): import("express-validator").ValidationChain[];
    static login(): import("express-validator").ValidationChain[];
    static checkResetPasswordEmail(): import("express-validator").ValidationChain[];
    static verifyResetPasswordToken(): import("express-validator").ValidationChain[];
    static resetPassword(): import("express-validator").ValidationChain[];
    static verifyPhoneNumber(): import("express-validator").ValidationChain[];
    static verifyUserProfile(): import("express-validator").ValidationChain[];
    static userProfilePic(): import("express-validator").ValidationChain[];
}
