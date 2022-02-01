import mongoose from "mongoose";
import { ProductAttrs, ProductDoc, ProductModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ProductMsg } from "@espressotrip-org/concept-common";

/**
 * Product model that uses update-if-current version incrementation
 */
const productSchema = new mongoose.Schema(
    {
        quantity: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
            default: null,
        },
        itemCode: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);
/** Replace the __v with version  && use the update-if-current plugin*/
productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

/** Static schema functions */
/**
 * Static function to build product
 * @param attributes
 */
productSchema.statics.build = function (attributes: ProductAttrs): ProductDoc {
    return new Product(attributes);
};

productSchema.statics.toPublisherMessage = function (product: ProductDoc): ProductMsg {
    return {
        id: product.id,
        price: product.price,
        itemCode: product.itemCode,
        userId: product.userId,
        title: product.title,
        description: product.description,
        orderId: product.orderId,
        version: product.version,
    };
};

/** Create model from schema */
const Product = mongoose.model<ProductDoc, ProductModel>("Product", productSchema);
export { Product };
