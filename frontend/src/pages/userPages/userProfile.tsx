import React, { useState } from "react";
import Navbar from "../../components/user/Navbar";
import { useGetUserProfileQuery } from "../../slices/apiUserSlice";
import { RootState } from '../../store'; 
import { useSelector } from "react-redux";
import {useUpdateUserProfileMutation} from "../../slices/apiUserSlice"
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
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth); 
  const userId = userInfo?._id;
  const { data: userProfile, isLoading } = useGetUserProfileQuery(userId);

console.log(userProfile)


const availableInterests = [
  'Gym', 'Movies', 'Reading', 'Music', 'Photography', 'Sports',
  'Travel', 'Cooking', 'Yoga', 'Blogging', 'Dancing', 'Gaming'
];
const handleInterestClick = (interest: string) => {
  if (datingInfo.interests.includes(interest)) {
    setDatingInfo({
      ...datingInfo,
      interests: datingInfo.interests.filter(i => i !== interest),
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
    name: 'john',
    email: "john.doe@example.com",
    mobileNumber: "123-456-7890",
    // dateOfBirth:14/08/2000
    profileImage: "https://via.placeholder.com/150", // Placeholder profile image
  });

  const [datingInfo, setDatingInfo] = useState<DatingInfo>({
    gender: "Male",
    lookingfor:'Female',
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <Navbar />
      {/* Personal Information Section */}
      <section className="w-full bg-white shadow-md p-4 mt-10 rounded-lg mx-auto max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={personalInfo.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          
          <div className="space-y-2 w-full">
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Name:</label>
              {editPersonal ? (
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
              ) : (
                <span>{personalInfo.name}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Email:</label>
              {editPersonal ? (
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
              ) : (
                <span>{personalInfo.email}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Phone:</label>
              {editPersonal ? (
                <input
                  type="text"
                  name="phone"
                  value={personalInfo.mobileNumber}
                  onChange={handlePersonalInfoChange}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
              ) : (
                <span>{personalInfo.mobileNumber}</span>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                onClick={() => setEditPersonal(!editPersonal)}
              >
                {editPersonal ? "Save" : "Update"}
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded-md">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dating Information Section */}
      <section className="w-full bg-white shadow-md p-4 mt-6 rounded-lg mx-auto max-w-4xl">
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

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Relationship Interest:</label>
            {editDating ? (
              <select
                id="relationship"
                name="relationship"
                value={datingInfo.relationship}
                onChange={(e) =>
                  setDatingInfo({
                    ...datingInfo,
                    relationship: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-1 text-white" 
              >
                <option value="">Select Type</option>
                <option value="Long-term relationship">Long-Term</option>
                <option value="Short-term relationship">Short-Term</option>
              </select>
            ) : (
              <span>{datingInfo.relationship}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
  <label className="font-medium">Interests:</label>
  {editDating ? (
    <input
      type="text"
      name="interests"
      value={datingInfo.interests.join(", ")}
      readOnly
      onClick={() => setShowModal(true)}  // Open modal on click
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
            className={`interest-button ${datingInfo.interests.includes(interest) ? 'selected' : ''}`}
            onClick={() => handleInterestClick(interest)}
            disabled={datingInfo.interests.length >= 5 && !datingInfo.interests.includes(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setShowModal(false)} className="close-modal">
        Save
      </button>
    </div>
  </div>
)}


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

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Drinking Habit:</label>
            {editDating ? (
              <select
                name="drinkingHabit"
                value={datingInfo.drinkingHabit}
                onChange={(e) =>
                  setDatingInfo({
                    ...datingInfo,
                    drinkingHabit: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Drinking Habit</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <span>{datingInfo.drinkingHabit}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Occupation:</label>
            {editDating ? (
              <input
                type="text"
                name="occupation"
                value={datingInfo.occupation}
                onChange={handleDatingInfoChange}
                className="border border-gray-300 rounded-md p-1 text-white"
              />
            ) : (
              <span>{datingInfo.occupation}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Bio:</label>
            {editDating ? (
              <input
                type="text"
                name="bio"
                value={datingInfo.bio}
                onChange={handleDatingInfoChange}
                className="border border-gray-300 rounded-md p-1 text-white"
              />
            ) : (
              <span>{datingInfo.bio}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">education:</label>
            {editDating ? (
              <input
                type="text"
                name="education"
                value={datingInfo.education}
                onChange={handleDatingInfoChange}
                className="border border-gray-300 rounded-md p-1 text-white"
              />
            ) : (
              <span>{datingInfo.education}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">place:</label>
            {editDating ? (
              <input
                type="text"
                name="place"
                value={datingInfo.place}
                onChange={handleDatingInfoChange}
                className="border border-gray-300 rounded-md p-1 text-white"
              />
            ) : (
              <span>{datingInfo.place}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">caste:</label>
            {editDating ? (
              <input
                type="text"
                name="place"
                value={datingInfo.caste}
                onChange={handleDatingInfoChange}
                className="border border-gray-300 rounded-md p-1 text-white"
              />
            ) : (
              <span>{datingInfo.caste}</span>
            )}
          </div>
          {/* Images Section */}
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
              className="bg-blue-500 text-white px-3 py-1 rounded-md"
              onClick={() => setEditDating(!editDating)}
            >
              {editDating ? "Save" : "Update"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
