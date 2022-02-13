import mongoose from "mongoose";
import { Categories, MicroServiceNames, ProductMsg } from "@espressotrip-org/concept-common";

/** Product Interface */
export interface ProductAttrs {
    quantity: number;
    reserved: number;
    category: Categories;
    tags: Array<string>
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
    toPublisherMessage(product: ProductDoc): ProductMsg;
}

/** Extend mongoose document with product document values */
export interface ProductDoc extends mongoose.Document {
    id: string;
    quantity: number;
    category: Categories;
    reserved: number;
    tags: Array<string>
    title: string;
    price: number;
    description: string;
    orderId: string | null;
    userId: string;
    itemCode: string;
    version: number;
}
