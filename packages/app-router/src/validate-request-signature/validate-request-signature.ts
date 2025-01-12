import * as crypto from "crypto";

/**
 * Validates the requestId against your appSecret.
 * **The requestSignature should be validated for every request when recieving calls from the d.velop cloud.
 * Refer to the [d.velop basics tenant header section](https://developer.d-velop.de/dev/en/basics#tenant-header) for more information.**
 * @param {string} appSecret The secret generated for your app in the cloud-center
 * @param {string} systemBaseUri SystemBaseUri for the tenant (found in 'x-dv-baseuri'-header)
 * @param {string} tenantId ID for the tenant (found in 'x-dv-tenant-id'-header)
 * @param {string} requestSignature ID for the request (found in 'x-dv-sig-1'-header)
 * @returns {boolean}
 *
 * @example ```typescript
 * const valid: boolean = validateRequestSignature("ptuQ0b0BskmLLxXsjjhH9Su8ozTvZl6Z/5/HlaORoRg=", "https://header.example.com", "a12be5", "Zjcf28p5aQ6amtbs6s9b9cPyBPdziwUslR2DZqaGUTQ=");
 * console.log(valid); //true
 * ```
 */
export function validateRequestSignature(appSecret: string, systemBaseUri: string, tenantId: string, requestSignature: string): boolean {
  try {
    const binarySignatureSecret = Buffer.from(appSecret, "base64");
    const computedHmac = crypto.createHmac("sha256", binarySignatureSecret).update(systemBaseUri + tenantId);
    return crypto.timingSafeEqual(Buffer.from(requestSignature), Buffer.from(computedHmac.digest("base64")));
  } catch (e) {
    return false;
  }
}