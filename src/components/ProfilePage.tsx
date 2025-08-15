import React, { useState } from "react";
import { UserProfile } from "../App";

interface ProfilePageProps {
  userProfile: UserProfile;
  onLogout?: () => void;
  onUpdatePreferences?: (
    prefs: Partial<UserProfile>
  ) => Promise<{ error?: string } | void>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  onLogout,
  onUpdatePreferences,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // States for editing preferences
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefs, setPrefs] = useState({
    investmentPreference: userProfile.investmentPreference || "",
    communicationPreference: userProfile.communicationPreference || "",
    financialGoals: userProfile.financialGoals || [],
  });

  // States for editing profile info
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileEdit, setProfileEdit] = useState({
    name: userProfile.name || "",
    occupation: userProfile.occupation || "",
    location: userProfile.location || "",
    age: userProfile.age ? String(userProfile.age) : "",
    dateOfBirth: userProfile.dateOfBirth || "",
    gender: userProfile.gender || "",
    maritalStatus: userProfile.maritalStatus || "",
    phone: userProfile.phone || "",
    socialLinks: {
      linkedin: userProfile.socialLinks?.linkedin || "",
      github: userProfile.socialLinks?.github || "",
    },
  });

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Logout handlers
  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) onLogout();
  };

  // Preferences change handlers
  const handlePrefChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalsChange = (idx: number, value: string) => {
    setPrefs((prev) => {
      const goals = [...prev.financialGoals];
      goals[idx] = value;
      return { ...prev, financialGoals: goals };
    });
  };

  const handleAddGoal = () =>
    setPrefs((prev) => ({
      ...prev,
      financialGoals: [...prev.financialGoals, ""],
    }));

  const handleRemoveGoal = (idx: number) => {
    setPrefs((prev) => {
      const goals = [...prev.financialGoals];
      goals.splice(idx, 1);
      return { ...prev, financialGoals: goals };
    });
  };

  const handleSavePrefs = async () => {
    setSaving(true);
    setSaveMsg(null);
    if (onUpdatePreferences) {
      const result = await onUpdatePreferences({
        investmentPreference: prefs.investmentPreference,
        communicationPreference: prefs.communicationPreference,
        financialGoals: prefs.financialGoals,
      });
      if (result && result.error) {
        setSaveMsg("Failed to save: " + result.error);
      } else {
        setSaveMsg("Preferences updated!");
        setEditingPrefs(false);
      }
    }
    setSaving(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    if (onUpdatePreferences) {
      const result = await onUpdatePreferences({
        name: profileEdit.name,
        occupation: profileEdit.occupation,
        location: profileEdit.location,
        age: profileEdit.age ? parseInt(profileEdit.age) || undefined : undefined,
        dateOfBirth: profileEdit.dateOfBirth,
        gender: profileEdit.gender,
        maritalStatus: profileEdit.maritalStatus,
        phone: profileEdit.phone,
        socialLinks: profileEdit.socialLinks,
      });

      if (result && (result as any).error) {
        setSaveMsg("Failed to save: " + (result as any).error);
      } else {
        setSaveMsg("Profile updated!");
        setEditingProfile(false);
      }
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b pb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mr-6">
              {userProfile.name ? userProfile.name[0] : "?"}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{userProfile.name}</h2>
              <p className="text-gray-600">{userProfile.occupation || "Occupation not set"}</p>
              <p className="text-gray-500">{userProfile.location || "Location not specified"}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setEditingProfile(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Age:</span> {userProfile.age || "Not provided"}</p>
            <p><span className="font-semibold">Date of Birth:</span> {userProfile.dateOfBirth || "Not provided"}</p>
            <p><span className="font-semibold">Gender:</span> {userProfile.gender || "Not provided"}</p>
            <p><span className="font-semibold">Marital Status:</span> {userProfile.maritalStatus || "Not specified"}</p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Email:</span> {userProfile.email || "Not provided"}</p>
            <p><span className="font-semibold">Phone:</span> {userProfile.phone || "Not provided"}</p>
            {userProfile.socialLinks?.linkedin && (
              <p>
                <span className="font-semibold">LinkedIn:</span>{" "}
                <a className="text-blue-600 underline" href={userProfile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                  {userProfile.socialLinks.linkedin}
                </a>
              </p>
            )}
            {userProfile.socialLinks?.github && (
              <p>
                <span className="font-semibold">GitHub:</span>{" "}
                <a className="text-blue-600 underline" href={userProfile.socialLinks.github} target="_blank" rel="noreferrer">
                  {userProfile.socialLinks.github}
                </a>
              </p>
            )}
          </div>
        </section>

        {/* Financial Info */}
        <section className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Super</p>
              <p className="text-lg text-blue-700 font-bold">
                ₹{userProfile.currentSuper?.toLocaleString() || "0"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Contribution</p>
              <p className="text-lg text-blue-700 font-bold">
                ₹{userProfile.monthlyContribution?.toLocaleString() || "0"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Annual Income</p>
              <p className="text-lg text-green-600 font-bold">
                ₹{userProfile.annualIncome?.toLocaleString() || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Tolerance</p>
              <p className="text-lg text-gray-800">{userProfile.riskTolerance || "Not provided"}</p>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-800">Preferences & Goals</h3>
            {onUpdatePreferences && (
              <button
                type="button"
                onClick={() => setEditingPrefs(true)}
                className="px-4 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold"
              >
                Edit Preferences
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Investment Preference:</span> {userProfile.investmentPreference || "Not specified"}</p>
            <p><span className="font-semibold">Communication Preference:</span> {userProfile.communicationPreference || "Not specified"}</p>
          </div>
          <div className="mt-3">
            <h4 className="font-semibold text-gray-700 mb-1">Financial Goals:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {userProfile.financialGoals?.length
                ? userProfile.financialGoals.map((goal, idx) => <li key={idx}>{goal}</li>)
                : <li>No goals set</li>}
            </ul>
          </div>
        </section>

        {/* Security */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Security Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Two-Factor Authentication:</span> {userProfile.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
            <p><span className="font-semibold">Last Login:</span> {userProfile.lastLogin || "Unknown"}</p>
          </div>
        </section>
      </div>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmLogout();
                  window.location.href = "/";
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {editingPrefs && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Preferences</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Preference</label>
              <input
                type="text"
                name="investmentPreference"
                value={prefs.investmentPreference}
                onChange={handlePrefChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Communication Preference</label>
              <input
                type="text"
                name="communicationPreference"
                value={prefs.communicationPreference}
                onChange={handlePrefChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Financial Goals</label>
              {prefs.financialGoals.map((goal, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleGoalsChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddGoal}
                className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
              >
                Add Goal
              </button>
            </div>
            {saveMsg && (
              <div
                className={`mb-2 text-center font-medium ${
                  saveMsg.includes("Failed") ? "text-red-600" : "text-green-600"
                }`}
              >
                {saveMsg}
              </div>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setEditingPrefs(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePrefs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                Name: "name",
                Occupation: "occupation",
                Location: "location",
                Age: "age",
                "Date of Birth": "dateOfBirth",
                Gender: "gender",
                "Marital Status": "maritalStatus",
                Phone: "phone",
              }).map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={(profileEdit as any)[key] || ""}
                    onChange={(e) =>
                      setProfileEdit((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              ))}

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={profileEdit.socialLinks.linkedin}
                  onChange={(e) =>
                    setProfileEdit((p) => ({
                      ...p,
                      socialLinks: { ...p.socialLinks, linkedin: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  type="text"
                  value={profileEdit.socialLinks.github}
                  onChange={(e) =>
                    setProfileEdit((p) => ({
                      ...p,
                      socialLinks: { ...p.socialLinks, github: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            {saveMsg && (
              <div
                className={`mb-2 text-center font-medium ${
                  saveMsg.includes("Failed") ? "text-red-600" : "text-green-600"
                }`}
              >
                {saveMsg}
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
