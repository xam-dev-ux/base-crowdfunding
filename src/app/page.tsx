"use client";

import Link from "next/link";
import { useAllCampaigns } from "@/hooks/useCampaigns";
import { usePlatformStats } from "@/hooks/useContract";
import CampaignCard from "@/components/CampaignCard";
import { formatEther } from "@/lib/utils";
import { ArrowRight, Target, Users, Shield } from "lucide-react";

export default function HomePage() {
  const { campaigns, isLoading } = useAllCampaigns();
  const { data: stats } = usePlatformStats();

  const featuredCampaigns = campaigns
    .filter((c) => c.status === 0)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Decentralized Crowdfunding
              <br />
              <span className="text-primary-200">on Base Blockchain</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Create, fund, and manage crowdfunding campaigns with transparency
              and security powered by blockchain technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center justify-center"
              >
                Start a Campaign
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-flex items-center justify-center"
              >
                Explore Campaigns
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats ? Number(stats[0]) : 0}
              </div>
              <div className="text-gray-600">Total Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats ? formatEther(stats[1]) : "0"} ETH
              </div>
              <div className="text-gray-600">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats ? Number(stats[2]) : 0}
              </div>
              <div className="text-gray-600">Successful Campaigns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Transparent</h3>
              <p className="text-gray-600">
                All transactions are recorded on the blockchain, ensuring complete
                transparency and security for all participants.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Milestone-Based Funding</h3>
              <p className="text-gray-600">
                Create campaigns with multiple milestones for gradual fund release,
                building trust with your backers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Driven</h3>
              <p className="text-gray-600">
                Join a community of creators and backers building the future on
                Base blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Campaigns</h2>
            <Link
              href="/explore"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              View All
              <ArrowRight className="ml-1" size={20} />
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading campaigns...</p>
            </div>
          ) : featuredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id.toString()} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 mb-4">No campaigns yet</p>
              <Link
                href="/create"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create the First Campaign
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Campaign?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of creators who have successfully funded their projects
            on our platform
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Launch Your Campaign
          </Link>
        </div>
      </section>
    </div>
  );
}
