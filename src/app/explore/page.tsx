"use client";

import { useState, useMemo } from "react";
import { useAllCampaigns } from "@/hooks/useCampaigns";
import CampaignCard from "@/components/CampaignCard";
import FilterBar, { FilterOptions } from "@/components/FilterBar";
import { getCampaignStatus, calculateDaysLeft } from "@/lib/utils";

export default function ExplorePage() {
  const { campaigns, isLoading } = useAllCampaigns();
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: "all",
    sortBy: "recent",
  });

  const filteredAndSortedCampaigns = useMemo(() => {
    let result = [...campaigns];

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((c) => {
        const status = getCampaignStatus(
          c.status,
          Number(c.deadline),
          c.totalRaised,
          c.fundingGoal
        ).toLowerCase();
        return status === filters.status;
      });
    }

    // Sort
    switch (filters.sortBy) {
      case "recent":
        result.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
        break;
      case "ending":
        result.sort((a, b) => {
          const daysA = calculateDaysLeft(Number(a.deadline));
          const daysB = calculateDaysLeft(Number(b.deadline));
          return daysA - daysB;
        });
        break;
      case "funded":
        result.sort((a, b) => Number(b.totalRaised) - Number(a.totalRaised));
        break;
      case "goal":
        result.sort((a, b) => Number(b.fundingGoal) - Number(a.fundingGoal));
        break;
    }

    return result;
  }, [campaigns, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Campaigns</h1>
        <p className="text-gray-600">
          Discover and support amazing projects on Base blockchain
        </p>
      </div>

      <FilterBar onFilterChange={setFilters} />

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading campaigns...</p>
        </div>
      ) : filteredAndSortedCampaigns.length > 0 ? (
        <div>
          <p className="text-gray-600 mb-4">
            Showing {filteredAndSortedCampaigns.length} campaign
            {filteredAndSortedCampaigns.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id.toString()} campaign={campaign} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg mb-4">
            {filters.search || filters.status !== "all"
              ? "No campaigns match your filters"
              : "No campaigns yet"}
          </p>
          {filters.search || filters.status !== "all" ? (
            <button
              onClick={() =>
                setFilters({ search: "", status: "all", sortBy: "recent" })
              }
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
