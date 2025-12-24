import { Milestone } from "@/hooks/useCampaigns";
import { Check, Circle } from "lucide-react";

interface MilestoneTimelineProps {
  milestones: readonly Milestone[];
}


export default function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Project Milestones</h3>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex items-start">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center mr-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  milestone.released
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {milestone.released ? <Check size={20} /> : <Circle size={20} />}
              </div>
              {index < milestones.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    milestone.released ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            {/* Milestone content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">
                  Milestone {index + 1}
                  {milestone.released && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Released
                    </span>
                  )}
                </h4>
                <span className="text-sm font-medium text-primary-600">
                  {Number(milestone.percentage) / 100}% of funds
                </span>
              </div>
              <p className="text-gray-600 text-sm">{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
