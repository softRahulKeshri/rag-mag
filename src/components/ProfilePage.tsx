import { useState } from 'react';
import { UserCircleIcon, PencilIcon, CheckIcon, XMarkIcon, EnvelopeIcon, BriefcaseIcon, CalendarIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ProfileFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange?: (value: string) => void;
  type?: string;
  className?: string;
}

const ProfileField = ({ label, value, isEditing, onChange, type = 'text', className = '' }: ProfileFieldProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-white">{value}</p>
      )}
    </div>
  );
};
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    bio: 'Passionate about building great products and solving complex problems with clean, efficient code.',
    memberSince: 'January 2023',
    plan: 'Pro'
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
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button className="mr-4 p-2 hover:bg-gray-800 rounded-full">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>
        
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header with cover photo and profile picture */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="h-24 w-24 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center overflow-hidden">
                <UserCircleIcon className="h-20 w-20 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Profile actions */}
          <div className="pt-16 px-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{formData.name}</h2>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  {formData.email}
                </div>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {formData.jobTitle} at {formData.company}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center text-sm font-medium"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" /> Save
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center text-sm font-medium"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" /> Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEdit}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center text-sm font-medium"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            {/* Account Status */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-400 mr-2" />
                  <div>
                    <p className="font-medium">{formData.plan} Plan</p>
                    <p className="text-sm text-gray-400">Active • Next billing: Aug 22, 2023</p>
                  </div>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Manage Subscription
                </button>
              </div>
            </div>
            
            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Personal Information</h3>
                <ProfileField 
                  label="Full Name" 
                  value={tempData.name} 
                  isEditing={isEditing}
                  onChange={(value) => handleChange('name', value)}
                />
                <ProfileField 
                  label="Email Address" 
                  value={tempData.email} 
                  isEditing={isEditing}
                  type="email"
                  onChange={(value) => handleChange('email', value)}
                />
                <ProfileField 
                  label="Location" 
                  value={tempData.location} 
                  isEditing={isEditing}
                  onChange={(value) => handleChange('location', value)}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Professional Information</h3>
                <ProfileField 
                  label="Job Title" 
                  value={tempData.jobTitle} 
                  isEditing={isEditing}
                  onChange={(value) => handleChange('jobTitle', value)}
                />
                <ProfileField 
                  label="Company" 
                  value={tempData.company} 
                  isEditing={isEditing}
                  onChange={(value) => handleChange('company', value)}
                />
                <div className="flex items-center text-gray-400 text-sm mt-6">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Member since {formData.memberSince}
                </div>
              </div>
            </div>
            
            {/* Bio */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">About</h3>
              {isEditing ? (
                <textarea
                  value={tempData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-300 whitespace-pre-line">{formData.bio}</p>
              )}
            </div>
            
            {/* Account Actions */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md text-red-400 hover:text-red-300 transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md text-red-400 hover:text-red-300 transition-colors">
                  Delete Account
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md text-red-400 hover:text-red-300 transition-colors">
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
