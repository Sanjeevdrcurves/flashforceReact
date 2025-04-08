import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner"; // Notifications

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const TeamDistribution = ({ team, setTeam, setActiveTab, onClose, loadAllTeams }) => {
  const { companyId, userId } = useSelector((state) => state.AuthReducerKey);

  // Fetch existing distribution data from the backend when team.teamId changes.
  useEffect(() => {
    if (team.teamId) {
      fetch(`${API_URL}/Team/GetTeamDistribution/${team.teamId}`)
        .then((res) => res.json())
        .then((data) => {
          // Expected data: { teamId, distributionType, weights: { [userId]: weight, ... }, channel }
          setTeam((prev) => ({
            ...prev,
            distributionType: data.distributionType,
            weights: data.weights,
            channel: data.channelName, // update channel if provided from backend
          }));
        })
        .catch((err) =>
          console.error("Error fetching team distribution:", err)
        );
    }
  }, [team.teamId, setTeam]);

  // Initialize weights state from team.weights if available, otherwise empty.
  const [weights, setWeights] = useState(() => {
    let initialWeights = {};
    team.members.forEach((member) => {
      if (team.weights && team.weights[member.userId] !== undefined) {
        initialWeights[member.userId] = team.weights[member.userId];
      } else {
        initialWeights[member.userId] = "";
      }
    });
    return initialWeights;
  });

  // Update weights state if new team members are added or if team.weights changes.
  useEffect(() => {
    const newWeights = {};
    team.members.forEach((member) => {
      newWeights[member.userId] =
        team.weights && team.weights[member.userId] !== undefined
          ? team.weights[member.userId]
          : "";
    });
    setWeights(newWeights);
  }, [team.weights, team.members]);

  const handleWeightChange = (memberId, value) => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue) && value !== "") return; // Allow empty input
    const newWeights = { ...weights, [memberId]: value };

    // Sum only numeric values (treat empty strings as 0)
    const totalFilled = Object.values(newWeights).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );

    if (totalFilled > 100) {
      toast.error("Total weight cannot exceed 100%");
      return;
    }
    setWeights(newWeights);
  };

  // Compute even distribution weights keyed by member.userId.
  const computeEvenWeights = () => {
    const evenWeight = parseFloat((100 / team.members.length).toFixed(2));
    const evenWeights = {};
    team.members.forEach((member) => {
      evenWeights[member.userId] = evenWeight;
    });
    return evenWeights;
  };

  // Function to update the weights (and channel) in the backend.
  const updateWeightages = () => {
    if (team.distributionType === "weighted") {
      // Check that all team members have a weight value.
      const missingWeight = team.members.some(
        (member) =>
          weights[member.userId] === "" || weights[member.userId] === null
      );
      if (missingWeight) {
        toast.error("Please fill in weight for all team members");
        return;
      }
      // Check total weight.
      const totalFilled = Object.values(weights).reduce(
        (acc, val) => acc + (Number(val) || 0),
        0
      );
      if (totalFilled > 100) {
        toast.error("Total weight cannot exceed 100%");
        return;
      }
    }

    const evenWeights = computeEvenWeights();

    // Create an array of objects: { userId, weight }
    const finalWeightsArr = team.members.map((member) => {
      let weight =
        team.distributionType === "even"
          ? evenWeights[member.userId]
          : Number(weights[member.userId]);
      return { userId: member.userId, weight };
    });

    fetch(`${API_URL}/Team/UpdateTeamDistribution`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: team.teamId,
        distributionType: team.distributionType,
        channel: team.channel, // Include selected channel
        modifiedBy: userId,
        weights: finalWeightsArr,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Optionally update team state with new weights.
        setTeam((prev) => ({
          ...prev,
          weights: weights,
          distributionType: team.distributionType,
          channel: team.channel,
        }));
        toast.success("Weights updated successfully");
        // Close the popup.
        if (onClose) onClose();
        // Reload teams using the provided loadAllTeams function.
        if (loadAllTeams) loadAllTeams();
      })
      .catch((error) => {
        console.error("Error updating weights:", error);
        toast.error("There was an error updating the weights.");
      });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Channel Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Channel
        </label>
        <select
          className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
          value={team.channel || ""}
          onChange={(e) => setTeam({ ...team, channel: e.target.value })}
        >
          <option value="">Select Channel</option>
          <option value="Social Media">Social Media</option>
          <option value="Call">Call</option>
          <option value="SMS">SMS</option>
        </select>
      </div>
      {/* Distribution Type Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Distribution Type
        </label>
        <select
          className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
          value={team.distributionType}
          onChange={(e) =>
            setTeam({ ...team, distributionType: e.target.value })
          }
        >
          <option value="even">Even Distribution</option>
          <option value="weighted">Weighted Distribution</option>
        </select>
      </div>

      {/* Weighted Distribution Inputs */}
      {team.distributionType === "weighted" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {team.members.map((member) => (
            <div
              key={member.userId}
              className="p-4 rounded-lg shadow-md border-green-300 transition transform hover:scale-105"
            >
              <label className="block text-gray-800 font-semibold">
                {member.name}
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                value={weights[member.userId] || ""}
                onChange={(e) =>
                  handleWeightChange(member.userId, e.target.value)
                }
                placeholder="%"
                min="0"
                max="100"
              />
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 transition transform hover:scale-105"
          onClick={() => setActiveTab(1)}
        >
          Back
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition transform hover:scale-105"
          onClick={updateWeightages}
        >
          Save & Finish
        </button>
      </div>
    </div>
  );
};

export default TeamDistribution;
