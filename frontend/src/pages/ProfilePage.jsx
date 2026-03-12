import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Trash2 } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, deleteAccount } =
    useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);

  // 📸 Profile Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      await updateProfile({
        profilePic: base64Image,
      });
    };
  };

  // 🗑 Delete Account
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    deleteAccount();
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">

        <div className="bg-base-300 rounded-xl p-6 space-y-8">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-zinc-400">
              Your profile information
            </p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">

            <div className="relative">

              <img
                src={
                  selectedImg ||
                  authUser?.profilePic ||
                  "/avatar.png"
                }
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer
                transition-all duration-200
                ${
                  isUpdatingProfile
                    ? "animate-pulse pointer-events-none"
                    : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />

                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>

            </div>

            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click camera icon to update photo"}
            </p>

          </div>

          {/* User Info */}
          <div className="space-y-6">

            {/* Full Name */}
            <div className="space-y-1.5">

              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>

              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>

            </div>

            {/* Email */}
            <div className="space-y-1.5">

              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>

              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>

            </div>

          </div>

          {/* Account Info */}
          <div className="bg-base-300 rounded-xl p-6">

            <h2 className="text-lg font-medium mb-4">
              Account Information
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt?.split("T")[0]}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span>Status</span>
                <span className="text-green-500">
                  Active
                </span>
              </div>

            </div>

          </div>

          {/* Delete Button */}
          <div className="flex justify-center pt-4">

            <button
              onClick={handleDeleteAccount}
              className="btn btn-error flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete Account
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;