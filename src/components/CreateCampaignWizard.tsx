"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateCampaign } from "@/hooks/useContribute";
import { validateCampaignForm } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CreateCampaignWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    metadataURI: "",
    fundingGoal: "",
    duration: "30",
    minContribution: "",
    maxContribution: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createCampaign, isPending, isConfirming, isSuccess } = useCreateCampaign();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Campaign created successfully!");
      router.push("/dashboard");
    }
  }, [isSuccess, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const validation = validateCampaignForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const validation = validateCampaignForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setStep(1);
      return;
    }

    await createCampaign(
      formData.title,
      formData.description,
      formData.metadataURI || "ipfs://",
      formData.fundingGoal,
      parseInt(formData.duration),
      formData.minContribution,
      formData.maxContribution
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-24 h-1 mx-2 ${
                    s < step ? "bg-primary-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? "text-primary-600" : "text-gray-600"}>
            Basic Info
          </span>
          <span className={step >= 2 ? "text-primary-600" : "text-gray-600"}>
            Details
          </span>
          <span className={step >= 3 ? "text-primary-600" : "text-gray-600"}>
            Review
          </span>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Campaign Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a catchy title for your campaign"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your campaign in detail (minimum 50 characters)"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length} characters
              </p>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metadata URI (optional)
              </label>
              <input
                type="text"
                name="metadataURI"
                value={formData.metadataURI}
                onChange={handleChange}
                placeholder="ipfs:// or https://"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Link to images or additional metadata
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Next Step
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Campaign Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Goal (ETH) *
              </label>
              <input
                type="number"
                name="fundingGoal"
                value={formData.fundingGoal}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.fundingGoal ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fundingGoal && (
                <p className="text-red-500 text-sm mt-1">{errors.fundingGoal}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Duration (days) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="365"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Contribution (ETH)
                </label>
                <input
                  type="number"
                  name="minContribution"
                  value={formData.minContribution}
                  onChange={handleChange}
                  step="0.001"
                  min="0"
                  placeholder="0.0 (no minimum)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Contribution (ETH)
                </label>
                <input
                  type="number"
                  name="maxContribution"
                  value={formData.maxContribution}
                  onChange={handleChange}
                  step="0.001"
                  min="0"
                  placeholder="0.0 (no maximum)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Review Your Campaign</h2>

          <div className="space-y-4 mb-6">
            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="text-lg font-semibold">{formData.title}</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-gray-700">{formData.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Funding Goal</h3>
                <p className="text-lg font-semibold">{formData.fundingGoal} ETH</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p className="text-lg font-semibold">{formData.duration} days</p>
              </div>
            </div>

            {(formData.minContribution || formData.maxContribution) && (
              <div className="grid grid-cols-2 gap-4">
                {formData.minContribution && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Min Contribution</h3>
                    <p className="text-lg font-semibold">{formData.minContribution} ETH</p>
                  </div>
                )}
                {formData.maxContribution && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Max Contribution</h3>
                    <p className="text-lg font-semibold">{formData.maxContribution} ETH</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Once created, you cannot modify the funding goal or deadline.
              Please review carefully before proceeding.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || isConfirming}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isPending || isConfirming ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
