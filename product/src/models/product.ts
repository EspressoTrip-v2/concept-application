import mongoose from "mongoose";
import { ProductAttrs, ProductDoc, ProductModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { MicroServiceNames, ProductMsg } from "@espressotrip-org/concept-common";

/**
 * Product model that uses update-if-current version incrementation
 */
const productSchema = new mongoose.Schema(
    {
        quantity: {
            type: Number,
            required: true,
        },
        reserved: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
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
            default: "",
        },
        itemCode: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            virtuals: true,
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

/** Set temporary analytics object on creation */
productSchema.post("save", async function () {
    productSchema.virtual("analytics").get(function () {
        return {
            serviceName: MicroServiceNames.PRODUCT_SERVICE,
            dateSent: new Date().toISOString(),
        };
    });
});

/** Static schema functions */
/**
 * Static function to build product
 * @param attributes
 */
productSchema.statics.build = function (attributes: ProductAttrs): ProductDoc {
    return new Product(attributes);
};

/** Create model from schema */
const Product = mongoose.model<ProductDoc, ProductModel>("Product", productSchema);
export { Product };
