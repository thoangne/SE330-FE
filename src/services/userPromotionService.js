import httpClient from "./httpClient";

/**
 * Service for user promotion operations
 * Handles user rank and tier multiplier system
 * Uses httpClient for authorized requests
 */
export const userPromotionService = {
  // Get all promotions/tiers
  async getAllPromotions() {
    try {
      const response = await httpClient.get("/promotions");
      return response.data;
    } catch (error) {
      console.error("Error fetching all promotions:", error);
      throw error;
    }
  },

  // Get user rank information (helper method)
  async getUserRankInfo(userPoints) {
    try {
      const promotions = await this.getAllPromotions();

      // Sort promotions by points required (ascending)
      const sortedPromotions = promotions.sort((a, b) => a.point - b.point);

      // Find the highest rank the user qualifies for
      let userRank = sortedPromotions[0]; // Default to lowest rank

      for (const promotion of sortedPromotions) {
        if (userPoints >= promotion.point) {
          userRank = promotion;
        } else {
          break;
        }
      }

      return userRank;
    } catch (error) {
      console.error("Error calculating user rank:", error);
      throw error;
    }
  },

  // Get promotion by rank
  async getPromotionByRank(rank) {
    try {
      const promotions = await this.getAllPromotions();
      return promotions.find((p) => p.rank === rank);
    } catch (error) {
      console.error(`Error fetching promotion for rank ${rank}:`, error);
      throw error;
    }
  },

  // Get user's current tier multiplier based on their points
  async getUserTierMultiplier(userPoints) {
    try {
      console.log(
        "🏆 PromotionService: Getting tier multiplier for points:",
        userPoints
      );

      const userRank = await this.getUserRankInfo(userPoints);
      const tierMultiplier = userRank.tierMultiplier || 1;

      console.log("🏆 PromotionService: User tier info:", {
        rank: userRank.rank,
        tierMultiplier,
        pointsRequired: userRank.point,
      });

      return {
        success: true,
        data: {
          rank: userRank.rank,
          tierMultiplier,
          pointsRequired: userRank.point,
          userPoints,
        },
      };
    } catch (error) {
      console.error(
        "🏆 PromotionService: Error getting tier multiplier:",
        error
      );
      return {
        success: false,
        data: { tierMultiplier: 1 }, // Default multiplier
        message: "Không thể lấy thông tin hạng thành viên, sử dụng mặc định",
      };
    }
  },

  // Get user's complete promotion/tier information
  async getUserPromotionInfo(userPoints) {
    try {
      console.log(
        "🏆 PromotionService: Getting complete promotion info for points:",
        userPoints
      );

      const promotions = await this.getAllPromotions();
      const sortedPromotions = promotions.sort((a, b) => a.point - b.point);

      // Find current tier
      let currentTier = sortedPromotions[0]; // Default to lowest tier
      for (const promotion of sortedPromotions) {
        if (userPoints >= promotion.point) {
          currentTier = promotion;
        } else {
          break;
        }
      }

      // Find next tier
      const nextTier = sortedPromotions.find((p) => p.point > userPoints);

      const result = {
        currentTier: {
          rank: currentTier.rank,
          tierMultiplier: currentTier.tierMultiplier,
          pointsRequired: currentTier.point,
        },
        nextTier: nextTier
          ? {
              rank: nextTier.rank,
              tierMultiplier: nextTier.tierMultiplier,
              pointsRequired: nextTier.point,
              pointsNeeded: nextTier.point - userPoints,
            }
          : null,
        userPoints,
        allTiers: sortedPromotions,
      };

      console.log("🏆 PromotionService: Complete promotion info:", result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(
        "🏆 PromotionService: Error getting promotion info:",
        error
      );
      return {
        success: false,
        data: {
          currentTier: { rank: "BRONZE", tierMultiplier: 1, pointsRequired: 0 },
          nextTier: null,
          userPoints: userPoints || 0,
          allTiers: [],
        },
        message: "Không thể lấy thông tin khuyến mãi",
      };
    }
  },

  // Get tier multiplier for user
  async getTierMultiplier(userId) {
    try {
      const response = await httpClient.get(
        `/user/promotion/multiplier/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching tier multiplier for user ${userId}:`,
        error
      );
      throw error;
    }
  },

  // Get user's rank based on spending
  async getUserRank(userId) {
    try {
      const rankInfo = await this.getUserRankInfo(userId);
      return {
        rank: rankInfo.rank,
        total_spent: rankInfo.total_spent,
        tier_multiplier: rankInfo.tier_multiplier,
        next_tier_requirement: rankInfo.next_tier_requirement,
      };
    } catch (error) {
      console.error("Error determining user rank:", error);
      throw error;
    }
  },

  // Format rank display
  formatRankDisplay(rank) {
    const rankNames = {
      BRONZE: "Đồng",
      SILVER: "Bạc",
      GOLD: "Vàng",
      PLATINUM: "Bạch kim",
      DIAMOND: "Kim cương",
    };

    return rankNames[rank] || rank;
  },

  // Calculate tier multiplier benefit
  calculateTierBenefit(amount, tierMultiplier) {
    if (!tierMultiplier || tierMultiplier <= 1) return 0;
    return amount * (tierMultiplier - 1);
  },
};
