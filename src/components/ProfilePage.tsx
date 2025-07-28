import { useState } from "react";
import {
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CameraIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  KeyIcon,
  TrashIcon,
  DevicePhoneMobileIcon,
  UserIcon,
  InformationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface ProfileFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange?: (value: string) => void;
  type?: string;
  className?: string;
  icon?: React.ReactNode;
}

const ProfileField = ({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  className = "",
  icon,
}: ProfileFieldProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="flex items-center text-sm font-medium text-neutral-n600 mb-2">
        {icon && <span className="mr-2 text-neutral-n500">{icon}</span>}
        {label}
      </label>
      {isEditing ? (
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-neutral-n900 placeholder-neutral-n500 focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/50 focus:border-primary-ui-blue-p500 hover:border-gray-300 transition-all duration-200"
            placeholder={`Enter your ${label.toLowerCase()}`}
          />
        </div>
      ) : (
        <p className="text-neutral-n900 py-3 px-1 text-base">{value}</p>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    jobTitle: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    bio: "Passionate about building great products and solving complex problems with clean, efficient code.",
    memberSince: "January 2023",
    plan: "Pro",
  });

  const [tempData, setTempData] = useState({ ...formData });

  const handleEdit = () => {
    setTempData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setFormData({ ...tempData });
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };

  const handleCancel = () => {
    setTempData({ ...formData });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-n100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            className="mr-4 p-3 hover:bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/50"
            aria-label="Go back"
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/')}
            
          >
            <ArrowLeftIcon className="h-6 w-6 text-neutral-n700" />
          </button>
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-primary-ui-blue-p600 mr-3" />
            <h1 className="text-3xl font-bold text-neutral-n900">
              Profile Settings
            </h1>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Cover Photo Section */}
          <div className="h-40 bg-gradient-to-br from-brand-gradient-blue via-brand-gradient-purple to-brand-gradient-cyan relative group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
            <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100">
              <CameraIcon className="h-5 w-5 text-white" />
            </button>

            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative group/avatar">
                <div className="h-32 w-32 rounded-3xl border-4 border-white bg-gradient-to-br from-neutral-n300 to-neutral-n400 flex items-center justify-center overflow-hidden shadow-2xl">
                  <UserCircleIcon className="h-28 w-28 text-neutral-n600" />
                </div>
                <button className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-200">
                  <CameraIcon className="h-8 w-8 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <h2 className="text-3xl font-bold text-neutral-n900 mb-2">
                  {formData.name}
                </h2>
                <div className="flex items-center text-neutral-n600 text-base mb-2">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-neutral-n500" />
                  {formData.email}
                </div>
                <div className="flex items-center text-neutral-n600 text-base">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-neutral-n500" />
                  {formData.jobTitle} at {formData.company}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-primary-ui-blue-p500 hover:bg-primary-ui-blue-p600 text-white rounded-2xl flex items-center justify-center font-medium shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/50"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" /> Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-neutral-n900 rounded-2xl flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-6 py-3 bg-white border border-gray-200 hover:border-primary-ui-blue-p500 hover:bg-primary-ui-blue-p50 text-neutral-n900 hover:text-primary-ui-blue-p600 rounded-2xl flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/50"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-2xl mr-4">
                    <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <CreditCardIcon className="h-5 w-5 text-green-600 mr-2" />
                      <p className="font-semibold text-neutral-n900 text-lg">
                        {formData.plan} Plan
                      </p>
                    </div>
                    <p className="text-neutral-n600">
                      Active • Next billing: Aug 22, 2024
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 text-primary-ui-blue-p600 hover:text-primary-ui-blue-p700 hover:bg-primary-ui-blue-p100 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/50">
                  Manage Subscription
                </button>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="flex items-center text-xl font-semibold text-neutral-n900 mb-6 pb-3 border-b border-gray-200">
                  <UserIcon className="h-6 w-6 text-primary-ui-blue-p600 mr-2" />
                  Personal Information
                </h3>
                <ProfileField
                  label="Full Name"
                  value={tempData.name}
                  isEditing={isEditing}
                  onChange={(value) => handleChange("name", value)}
                  icon={<UserCircleIcon className="h-4 w-4" />}
                />
                <ProfileField
                  label="Email Address"
                  value={tempData.email}
                  isEditing={isEditing}
                  type="email"
                  onChange={(value) => handleChange("email", value)}
                  icon={<EnvelopeIcon className="h-4 w-4" />}
                />
                <ProfileField
                  label="Location"
                  value={tempData.location}
                  isEditing={isEditing}
                  onChange={(value) => handleChange("location", value)}
                  icon={<MapPinIcon className="h-4 w-4" />}
                />
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="flex items-center text-xl font-semibold text-neutral-n900 mb-6 pb-3 border-b border-gray-200">
                  <BriefcaseIcon className="h-6 w-6 text-primary-ui-blue-p600 mr-2" />
                  Professional Information
                </h3>
                <ProfileField
                  label="Job Title"
                  value={tempData.jobTitle}
                  isEditing={isEditing}
                  onChange={(value) => handleChange("jobTitle", value)}
                  icon={<BriefcaseIcon className="h-4 w-4" />}
                />
                <ProfileField
                  label="Company"
                  value={tempData.company}
                  isEditing={isEditing}
                  onChange={(value) => handleChange("company", value)}
                  icon={<BuildingOfficeIcon className="h-4 w-4" />}
                />
                <div className="flex items-center text-neutral-n600 mt-6 px-1">
                  <CalendarIcon className="h-5 w-5 mr-3 text-neutral-n500" />
                  <span className="font-medium">
                    Member since {formData.memberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
              <h3 className="flex items-center text-xl font-semibold text-neutral-n900 mb-6 pb-3 border-b border-gray-200">
                <DocumentTextIcon className="h-6 w-6 text-primary-ui-blue-p600 mr-2" />
                About Me
              </h3>
              {isEditing ? (
                <div className="relative">
                  <textarea
                    value={tempData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-neutral-n900 placeholder-neutral-n500 focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/50 focus:border-primary-ui-blue-p500 hover:border-gray-300 transition-all duration-200 h-32 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <InformationCircleIcon className="absolute top-3 right-3 h-5 w-5 text-neutral-n400" />
                </div>
              ) : (
                <p className="text-neutral-n700 leading-relaxed text-base px-1">
                  {formData.bio}
                </p>
              )}
            </div>

            {/* Account Actions */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <h3 className="flex items-center text-xl font-semibold text-neutral-n900 mb-6 pb-3 border-b border-red-200">
                <ShieldCheckIcon className="h-6 w-6 text-red-600 mr-2" />
                Security & Account Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-6 py-4 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-2xl text-red-600 hover:text-red-700 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center">
                  <KeyIcon className="h-5 w-5 mr-3" />
                  Change Password
                </button>
                <button className="w-full text-left px-6 py-4 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-2xl text-red-600 hover:text-red-700 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center">
                  <TrashIcon className="h-5 w-5 mr-3" />
                  Delete Account
                </button>
                <button className="w-full text-left px-6 py-4 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-2xl text-red-600 hover:text-red-700 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center">
                  <DevicePhoneMobileIcon className="h-5 w-5 mr-3" />
                  Logout All Devices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
