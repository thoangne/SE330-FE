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
