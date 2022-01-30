import mongoose from "mongoose";

/** Product Interface */
export interface ProductAttrs {
    quantity: number;
    title: string;
    price: number;
    description: string;
    orderId?: string | null;
    userId: string;
    itemCode: string;
}

/** Static build method to model */
export interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attributes: ProductAttrs): ProductDoc;
}

/** Extend mongoose document with product document values */
export interface ProductDoc extends mongoose.Document {
    quantity: number;
    title: string;
    price: number;
    description: string;
    orderId: string | null;
    userId: string;
    itemCode: string;
    version: number;
}
