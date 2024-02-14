/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import * as mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    status: string;
    created_at: Date;
    updated_at: Date;
    restaurant_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    user_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    address: any;
    order: string;
    total: number;
    grandTotal: number;
    deliveryCharge: number;
    payment_status: boolean;
    payment_mode: string;
    instruction?: string;
    payment_id?: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    status: string;
    created_at: Date;
    updated_at: Date;
    restaurant_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    user_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    address: any;
    order: string;
    total: number;
    grandTotal: number;
    deliveryCharge: number;
    payment_status: boolean;
    payment_mode: string;
    instruction?: string;
    payment_id?: string;
}> & {
    status: string;
    created_at: Date;
    updated_at: Date;
    restaurant_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    user_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    address: any;
    order: string;
    total: number;
    grandTotal: number;
    deliveryCharge: number;
    payment_status: boolean;
    payment_mode: string;
    instruction?: string;
    payment_id?: string;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    status: string;
    created_at: Date;
    updated_at: Date;
    restaurant_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    user_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    address: any;
    order: string;
    total: number;
    grandTotal: number;
    deliveryCharge: number;
    payment_status: boolean;
    payment_mode: string;
    instruction?: string;
    payment_id?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    status: string;
    created_at: Date;
    updated_at: Date;
    restaurant_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    user_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    address: any;
    order: string;
    total: number;
    grandTotal: number;
    deliveryCharge: number;
    payment_status: boolean;
    payment_mode: string;
    instruction?: string;
    payment_id?: string;
}>> & mongoose.FlatRecord<{
    status: string;
    created_at: Date;
    updated_at: Date;
    restaurant_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    user_id: {
        prototype?: mongoose.Types.ObjectId;
        cacheHexString?: unknown;
        generate?: {};
        createFromTime?: {};
        createFromHexString?: {};
        createFromBase64?: {};
        isValid?: {};
    };
    address: any;
    order: string;
    total: number;
    grandTotal: number;
    deliveryCharge: number;
    payment_status: boolean;
    payment_mode: string;
    instruction?: string;
    payment_id?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default _default;
