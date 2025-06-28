/**
 * User-facing services for frontend
 * These services connect to the actual backend APIs
 */

// Product catalog services
export { userProductService } from "./userProductService";
export { userCategoryService } from "./userCategoryService";
export { userAuthorService } from "./userAuthorService";
export { userPublisherService } from "./userPublisherService";
export { userReviewService } from "./userReviewService";
export { userComposeService } from "./userComposeService";

// Commerce services
export { userCartService } from "./userCartService";
export { userOrderService } from "./userOrderService";
export { userPaymentService } from "./userPaymentService";
export { userPromotionService } from "./userPromotionService";
export { userVoucherService } from "./userVoucherService";
