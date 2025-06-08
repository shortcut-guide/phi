// backend/controllers/productController.ts
import { cMessages } from "@/b/config/consoleMessage.ts";
import { uploadImagesToImgur } from "@/b/services/imgurService";
import { upsertProduct } from "@/b/models/ProductModel";
import { validateProduct } from "@/b/utils/validateProduct";
/**
 * Parse and extract image and product data from the request
 */
async function parseRequestBody(request) {
    const body = await request.json();
    if (typeof body !== "object" || body === null) {
        throw new Error("Invalid request body: expected an object");
    }
    const { image_base64_list, ...productData } = body;
    return { image_base64_list, productData };
}
/**
 * Merge product data with image URLs into Product type
 */
function buildProduct(productData, imageUrls) {
    return {
        ...productData,
        ec_data: {
            ...(productData.ec_data ?? {}),
            images: imageUrls,
        },
    };
}
export const POST = async ({ request }) => {
    try {
        const { image_base64_list, productData } = await parseRequestBody(request);
        const imageUrls = await uploadImagesToImgur(image_base64_list);
        const product = buildProduct(productData, imageUrls);
        if (!validateProduct(product)) {
            return new Response(JSON.stringify({ status: "error", message: cMessages[2] }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        await upsertProduct(product);
        return new Response(JSON.stringify({ status: "success", message: cMessages[1] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("[POST /product] Error:", error);
        return new Response(JSON.stringify({ status: "error", message: cMessages[4] }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
