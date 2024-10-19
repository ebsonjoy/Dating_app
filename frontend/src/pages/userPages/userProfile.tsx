import React, { useEffect, useState } from "react";
import Navbar from "../../components/user/Navbar";
import { useGetUserProfileQuery } from "../../slices/apiUserSlice";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useUpdateUserPersonalInfoMutation } from "../../slices/apiUserSlice";
import { useUpdateUserDatingInfoMutation } from "../../slices/apiUserSlice";
import { toast } from "react-toastify";
const PROFILE_IMAGE_DIR_PATH = "http://localhost:5000/UserProfileImages/";

interface UserProfile {
  name: string;
  email: string;
  mobileNumber: string;
  profileImage: string;
  //   dateOfBirth:Date
}

interface DatingInfo {
  gender: string;
  lookingfor: string;
  relationship: string;
  interests: string[];
  smokingHabit: string;
  drinkingHabit: string;
  images: string[];
  occupation: string;
  bio: string;
  education: string;
  place: string;
  caste: string;
}

const ProfilePage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const { data: userProfile, isLoading } = useGetUserProfileQuery(userId);
  const [updateUserDatingInfo] = useUpdateUserDatingInfoMutation();
  const [updateUserPersonalInfo] = useUpdateUserPersonalInfoMutation();

  //Personal Info
  const [name, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");

  //Dating info

  const [gender, setGender] = useState<string>('');
  const [lookingFor, setLookingFor] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [place, setPlace] = useState<string>('');
  const [caste, setCaste] = useState<string>('');
  const [occupation, setOccupation] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [smoking, setSmoking] = useState<string>('');
  const [drinking, setDrinking] = useState<string>('');
  const [profilePhotos, setProfilePhotos] = useState<File[]>([]);

  



  const handlePersonalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editPersonal) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      formData.append("dateOfBirth", dateOfBirth);

      try {
        const res = await updateUserPersonalInfo({
          userId,
          data: formData,
        }).unwrap();

        toast.success("Profile Updated Successfully");
        setEditPersonal(false);
      } catch (error) {
        console.log(error);

        toast.error("Failed to update profile");
      }
    }
  };

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.user.name || "");
      setEmail(userProfile.user.email || "");
      setMobileNumber(userProfile.user.mobileNumber || "");
      setDateOfBirth(userProfile.user.dateOfBirth || "");
    }
  }, [userProfile]);

  const availableInterests = [
    "Gym",
    "Movies",
    "Reading",
    "Music",
    "Photography",
    "Sports",
    "Travel",
    "Cooking",
    "Yoga",
    "Blogging",
    "Dancing",
    "Gaming",
  ];
  const handleInterestClick = (interest: string) => {
    if (datingInfo.interests.includes(interest)) {
      setDatingInfo({
        ...datingInfo,
        interests: datingInfo.interests.filter((i) => i !== interest),
      });
    } else if (datingInfo.interests.length < 5) {
      setDatingInfo({
        ...datingInfo,
        interests: [...datingInfo.interests, interest],
      });
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<UserProfile>({
    name: "john",
    email: "john.doe@example.com",
    mobileNumber: "123-456-7890",
    // dateOfBirth:14/08/2000
    profileImage: "https://via.placeholder.com/150", // Placeholder profile image
  });

  const [datingInfo, setDatingInfo] = useState<DatingInfo>({
    gender: "Male",
    lookingfor: "Female",
    relationship: "Long-term relationship",
    interests: ["Gym", "Traveling", "Movies"],
    smokingHabit: "No",
    drinkingHabit: "Yes",
    occupation: "Engineer",
    bio: "Love traveling and exploring new cultures.",
    education: "Degree",
    place: "Kochi",
    caste: "Hindu",
    images: [
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
      "https://via.placeholder.com/100",
    ],
  });

  const [editPersonal, setEditPersonal] = useState(false);
  const [editDating, setEditDating] = useState(false);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleDatingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatingInfo({ ...datingInfo, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index: number, newImage: string) => {
    const updatedImages = [...datingInfo.images];
    updatedImages[index] = newImage;
    setDatingInfo({ ...datingInfo, images: updatedImages });
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImageURL = URL.createObjectURL(e.target.files[0]);
      setPersonalInfo({ ...personalInfo, profileImage: newImageURL });
    }
  };

  const handleUpdatePersonalInfo = () => {
    setEditPersonal(false);
    // Add logic to save updated personal info
  };

  const handleUpdateDatingInfo = () => {
    setEditDating(false);
    // Add logic to save updated dating info
  };

  const handleDatingSubmit = () => {
    // setEditDating(false);
    // Add logic to save updated dating info
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <Navbar />

      {/* Personal Information Form */}
      <form
        onSubmit={handlePersonalSubmit} // Attach form submission handler here
        className="w-full bg-white shadow-md p-4 mt-10 rounded-lg mx-auto max-w-4xl"
      >
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

        <div className="flex flex-col items-center space-y-4">
          {/* Profile Image */}
          <img
            src={
              PROFILE_IMAGE_DIR_PATH + userProfile?.userInfo.profilePhotos[0]
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />

          {/* Personal Information Fields */}
          <div className="space-y-2 w-full">
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Name:</label>
              {editPersonal ? (
                <input
                  type="text"
                  name="name"
                  value={name} // Bind input to state
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
              ) : (
                <span>{userProfile?.user?.name}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Email:</label>
              {editPersonal ? (
                <input
                  type="email"
                  name="email"
                  value={email} // Bind input to state
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
              ) : (
                <span>{userProfile?.user?.email}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Phone:</label>
              {editPersonal ? (
                <input
                  type="text"
                  name="phone"
                  value={mobileNumber} // Bind input to state
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
              ) : (
                <span>{userProfile?.user?.mobileNumber}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              {/* Date of Birth Field */}
              <label className="font-medium">Date of Birth:</label>
              {editPersonal ? (
                <input
                  type="date" // Use date input type for Date of Birth
                  name="dateOfBirth"
                  value={dateOfBirth} // Bind input to state
                  onChange={(e) => setDateOfBirth(e.target.value)} // Change handler
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
              ) : (
                <span>{userProfile?.user?.dateOfBirth}</span> // Display Date of Birth when not editing
              )}
            </div>

            {/* Save and Update buttons */}
            <div className="flex justify-between mt-4 w-full">
              {/* Toggle Edit Mode Button */}
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                onClick={() => setEditPersonal(!editPersonal)}
              >
                {editPersonal ? "Cancel" : "Update"}
              </button>

              {/* Save Button inside the form */}
              {editPersonal && (
                <button
                  type="submit" // Set this to submit the form
                  className="bg-green-500 text-white px-3 py-1 rounded-md"
                >
                  Save
                </button>
              )}
            </div>

            {/* Change Password Button */}
            <button
              type="button"
              className="bg-red-500 text-white px-3 py-1 rounded-md mt-4"
            >
              Change Password
            </button>
          </div>
        </div>
      </form>

      {/* Dating Information Form */}
      <form
        onSubmit={handleDatingSubmit}
        className="w-full bg-white shadow-md p-4 mt-6 rounded-lg mx-auto max-w-4xl"
      >
        <h2 className="text-xl font-semibold mb-4">Dating Information</h2>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Gender:</label>
            {editDating ? (
              <select
                id="gender"
                name="gender"
                value={datingInfo.gender}
                onChange={(e) =>
                  setDatingInfo({
                    ...datingInfo,
                    gender: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Type</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <span>{datingInfo.gender}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Looking For:</label>
            {editDating ? (
              <select
                id="relationship"
                name="relationship"
                value={datingInfo.lookingfor}
                onChange={(e) =>
                  setDatingInfo({
                    ...datingInfo,
                    lookingfor: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Type</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <span>{datingInfo.lookingfor}</span>
            )}
          </div>

          {/* Interests Section with Modal */}
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Interests:</label>
            {editDating ? (
              <input
                type="text"
                name="interests"
                value={datingInfo.interests.join(", ")}
                readOnly
                onClick={() => setShowModal(true)} // Open modal on click
                className="border border-gray-300 rounded-md p-1 text-white"
              />
            ) : (
              <span>{datingInfo.interests.join(", ")}</span>
            )}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Select Interests (Up to 5)</h3>
                <div className="interests-box">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className={`interest-button ${
                        datingInfo.interests.includes(interest)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleInterestClick(interest)}
                      disabled={
                        datingInfo.interests.length >= 5 &&
                        !datingInfo.interests.includes(interest)
                      }
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="close-modal"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Smoking, Drinking, and Other Details */}
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Smoking Habit:</label>
            {editDating ? (
              <select
                name="smokingHabit"
                value={datingInfo.smokingHabit}
                onChange={(e) =>
                  setDatingInfo({
                    ...datingInfo,
                    smokingHabit: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Smoking Habit</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <span>{datingInfo.smokingHabit}</span>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {datingInfo.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Dating Image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const newImageURL = URL.createObjectURL(
                        e.target.files[0]
                      );
                      handleImageChange(index, newImageURL);
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-1 rounded-md"
              onClick={() => setEditDating(!editDating)}
            >
              {editDating ? "Save" : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
