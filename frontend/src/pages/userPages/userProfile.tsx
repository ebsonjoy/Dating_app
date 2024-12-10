import React, { useEffect, useState } from "react";
import Navbar from "../../components/user/Navbar";
import { useGetUserProfileQuery } from "../../slices/apiUserSlice";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { setCredentials } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { useUpdateUserPersonalInfoMutation } from "../../slices/apiUserSlice";
import { useUpdateUserDatingInfoMutation } from "../../slices/apiUserSlice";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../../components/skeletonLoader';


const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const { data: userProfile, isLoading,refetch } = useGetUserProfileQuery(userId);
  const navigate = useNavigate(); 
  
  //Personal Info
  const [updateUserPersonalInfo] = useUpdateUserPersonalInfoMutation();
  const [name, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");

  //Dating info
  const [updateUserDatingInfo] = useUpdateUserDatingInfoMutation();
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
  const [showModal, setShowModal] = useState(false);
  const [imgIndex, setImgIndex] = useState<number[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


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
      dispatch(setCredentials({ ...res }));
        toast.success("Profile Updated Successfully");
        refetch()
        setEditPersonal(false);
      } catch (error) {
        console.log(error);

        toast.error("Failed to update profile");
      }
    }
  };

 

  useEffect(() => {
    if (userProfile) {
      //personal data
      setFirstName(userProfile.user.name || "");
      setEmail(userProfile.user.email || "");
      setMobileNumber(userProfile.user.mobileNumber || "");
      setDateOfBirth(userProfile.user.dateOfBirth || "");
      // Dating data
      setGender(userProfile.userInfo.gender || '')
      setLookingFor(userProfile.userInfo.lookingFor || '')
      setRelationship(userProfile.userInfo.relationship || '')
      setInterests(userProfile.userInfo.interests || '')
      setPlace(userProfile.userInfo.place || '')
      setCaste(userProfile.userInfo.caste || '')
      setOccupation(userProfile.userInfo.occupation || '')
      setEducation(userProfile.userInfo.education || '')
      setBio(userProfile.userInfo.bio || '')
      setSmoking(userProfile.userInfo.smoking || '')
      setDrinking(userProfile.userInfo.drinking || '')
      
      if (userProfile?.userInfo?.profilePhotos) {
        setProfilePhotos(userProfile.userInfo.profilePhotos); 
    }
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
    if (interests.includes(interest)) {
      setInterests( interests.filter((i) => i !== interest));
    } else if (interests.length < 5) {
      setInterests( [...interests, interest]);
    }
  };
  
  const [editPersonal, setEditPersonal] = useState(false);
  const [editDating, setEditDating] = useState(false);
  const handleImageChange = (index: number, newImage: File) => {
    console.log(index);
    console.log(newImage);
  
    const updatedPhotos = [...profilePhotos];
    console.log(updatedPhotos)
    updatedPhotos[index] = newImage;
    setProfilePhotos(updatedPhotos);
    setImgIndex(prevIndex => [...prevIndex, index])
  };

  
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
  
    if (!gender.trim()) newErrors.gender = "Gender is required.";
    if (!lookingFor.trim()) newErrors.lookingFor = "Looking for is required.";
    if (!relationship.trim()) newErrors.relationship = "Relationship type is required.";
    if (interests.length === 0) newErrors.interests = "At least one interest must be selected.";
    if (!location) newErrors.location = "Please enable location.";
  
    // Validate occupation to allow only text
    if (!occupation.trim()) {
      newErrors.occupation = "Occupation is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(occupation)) {
      newErrors.occupation = "Occupation must only contain letters.";
    }
  
    // Validate education to allow only text
    if (!education.trim()) {
      newErrors.education = "Education is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(education)) {
      newErrors.education = "Education must only contain letters.";
    }
  
    // Validate bio to allow only text
    if (!bio.trim()) {
      newErrors.bio = "Bio is required.";
    } else if (!/^[a-zA-Z\s.,!?']+$/.test(bio)) {
      newErrors.bio = "Bio must only contain letters and basic punctuation.";
    }

    if (!caste.trim()) {
      newErrors.caste = "caste is required.";
    } else if (!/^[a-zA-Z\s.,!?']+$/.test(caste)) {
      newErrors.caste = "caste must only contain letters and basic punctuation.";
    }
  
    if (!smoking.trim()) newErrors.smoking = "Smoking habit is required.";
    if (!drinking.trim()) newErrors.drinking = "Drinking habit is required.";
  
    // Validate profile photos
    if (profilePhotos.length === 0) {
      newErrors.profilePhotos = "profile photo must be uploaded.";
    } else if (profilePhotos.length !== 4) {
      newErrors.profilePhotos = "Exactly four profile photos must be uploaded.";
    }
  
    setErrors(newErrors);
    Object.keys(newErrors).forEach((field) => {
      setTimeout(() => {
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[field];
          return updatedErrors;
        });
      }, 4000);
    });
    return Object.keys(newErrors).length === 0;
  };
  

  const handleDatingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("gender", gender);
    formData.append("lookingFor", lookingFor);
    formData.append("relationship", relationship);
    formData.append("interests", interests.join(", "));
    formData.append("place", place);
    formData.append("caste", caste);
    formData.append("occupation", occupation);
    formData.append("education", education);
    formData.append("bio", bio);
    formData.append("smoking", smoking);
    formData.append("drinking", drinking);
    formData.append('imgIndex', imgIndex.join(','));
 
    profilePhotos.forEach((photo) => {
      if (photo instanceof File) {
        formData.append('profilePhotos', photo);
        console.log(photo);
        
      }
    });
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    try {
      await updateUserDatingInfo({ userId, data: formData }).unwrap();
      toast.success("Dating Info Updated Successfully");
      setEditDating(false);
      setImgIndex([])
       refetch();
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Failed to update dating info");
    }
  };
  if (isLoading) return <SkeletonLoader />;


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
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
              userProfile?.userInfo.profilePhotos[0]
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
            <div className="flex justify-end mt-4 w-full">
        <button
        onClick={() => navigate('/forgotPasswordRequesting')}
          type="button"
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          Change Password
        </button>
      </div>
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
              <>
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) =>
                setGender(e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Type</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
              </>
            ) : (
              <span>{userProfile?.userInfo.gender}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Looking For:</label>
            {editDating ? (
              <>
              <select
                id="relationship"
                name="relationship"
                value={lookingFor}
                onChange={(e) =>
                  setLookingFor(e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Type</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.lookingFor && (
        <span className="text-red-500 text-sm">{errors.lookingFor}</span>
      )}
              </>
            ) : (
              <span>{userProfile?.userInfo.lookingFor}</span>
            )}
          </div>

          {/* Interests Section with Modal */}
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Interests:</label>
            {editDating ? (
              <input
                type="text"
                name="interests"
                value={interests.join(", ")}
                readOnly
                onClick={() => setShowModal(true)} // Open modal on click
                className="border border-gray-300 rounded-md p-1 text-white"
              />
            ) : (
              <span>{userProfile?.userInfo.interests.join(", ")}</span>
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
                        interests.includes(interest)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleInterestClick(interest)}
                      disabled={
                        interests.length >= 5 &&
                        !interests.includes(interest)
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
                value={smoking}
                onChange={(e) => setSmoking(e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Smoking Habit</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <span>{userProfile?.userInfo.smoking}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Drinking Habit:</label>
            {editDating ? (
              <select
                name="smokingHabit"
                value={drinking}
                onChange={(e) => setDrinking(e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Driking Habit</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <span>{userProfile?.userInfo.drinking}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="font-medium">Relationship:</label>
            {editDating ? (
              <select
                name="smokingHabit"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)
                }
                className="border border-gray-300 rounded-md p-1 text-white"
              >
                <option value="">Select Relationship</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <span>{userProfile?.userInfo.relationship}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Education:</label>
              {editDating ? (
                <>
                <input
                  type="text"
                  name="phone"
                  value={education} // Bind input to state
                  onChange={(e) => setEducation(e.target.value)}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
            {errors.education && <span className="error-message">{errors.education}</span>}
                </>
              ) : (
                <span>{userProfile?.userInfo.education}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Occupation:</label>
              {editDating ? (
                <>
                <input
                  type="text"
                  name="phone"
                  value={occupation} // Bind input to state
                  onChange={(e) => setOccupation(e.target.value)}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
            {errors.occupation && <span className="error-message">{errors.occupation}</span>}
                </>
              ) : (
                <span>{userProfile?.userInfo.occupation}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Bio:</label>
              {editDating ? (
                <>
                <input
                  type="text"
                  name="phone"
                  value={bio} // Bind input to state
                  onChange={(e) => setBio(e.target.value)}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
            {errors.bio && <span className="error-message">{errors.bio}</span>}
                </>
              ) : (
                <span>{userProfile?.userInfo.bio}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Place:</label>
              {editDating ? (
                <input
                  type="text"
                  name="phone"
                  value={place} // Bind input to state
                  onChange={(e) => setPlace(e.target.value)}
                  className="border border-gray-300 rounded-md p-1 text-white" readOnly
                />
              ) : (
                <span>{userProfile?.userInfo.place}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-medium">Religion:</label>
              {editDating ? (
                <>
                <input
                  type="text"
                  name="phone"
                  value={caste} // Bind input to state
                  onChange={(e) => setCaste(e.target.value)}
                  className="border border-gray-300 rounded-md p-1 text-white"
                />
            {errors.caste && <span className="error-message">{errors.caste}</span>}
                </>
              ) : (
                <span>{userProfile?.userInfo.caste}</span>
              )}
            </div>


          {/* Image Upload Section */}
           <div className="grid grid-cols-4 gap-2 mt-4">
            {userProfile?.userInfo.profilePhotos.map((image:string, index:number) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Dating Image ${index + 1}`}
                  className="w-full h-30 object-cover rounded-lg"
                />
                <input                  
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const newImageURL =  e.target.files[0]
                      handleImageChange(index, newImageURL);
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ))}
          </div> 

          <div className="flex justify-between mt-4 w-full">
              {/* Toggle Edit Mode Button */}
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                onClick={() => setEditDating(!editDating)}
              >
                {editDating ? "Cancel" : "Update"}
              </button>

              {/* Save Button inside the form */}
              {editDating && (
                <button
                  type="submit" // Set this to submit the form
                  className="bg-green-500 text-white px-3 py-1 rounded-md"
                >
                  Save
                </button>
              )}
            </div>
        </div>
      </form>
      
    </div>
  );
};

export default ProfilePage;
