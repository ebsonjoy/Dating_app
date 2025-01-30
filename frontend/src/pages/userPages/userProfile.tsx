import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setCredentials } from "../../slices/authSlice";
import { 
  useGetUserProfileQuery, 
  useUpdateUserPersonalInfoMutation,
  useUpdateUserDatingInfoMutation,
  useGetPresignedUrlsMutation 
} from "../../slices/apiUserSlice";
import { toast } from "react-toastify";
import Navbar from "../../components/user/Navbar";
import SkeletonLoader from '../../components/skeletonLoader';
import { RootState } from "../../store";
import { AppDispatch } from "../../store";
import axios from "axios";

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const userId = userInfo?._id;
  const { data: userProfile, isLoading, refetch } = useGetUserProfileQuery(userId!,{skip:!userId});

  // State management
  const [updateUserPersonalInfo] = useUpdateUserPersonalInfoMutation();
  const [updateUserDatingInfo] = useUpdateUserDatingInfoMutation();
  const [getPresignedUrls] = useGetPresignedUrlsMutation();
  
  // Personal Info States
  const [name, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");

  // Dating Info States
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
  const [profilePhotos, setProfilePhotos] = useState<File[] >([]);
  const [showModal, setShowModal] = useState(false);
  const [imgIndex, setImgIndex] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editPersonal, setEditPersonal] = useState(false);
  const [editDating, setEditDating] = useState(false);

  // Available interests
  const availableInterests = [
    "Gym", "Movies", "Reading", "Music", "Photography",
    "Sports", "Travel", "Cooking", "Yoga", "Blogging",
    "Dancing", "Gaming",
  ];

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.user.name || "");
      setEmail(userProfile.user.email || "");
      setMobileNumber(userProfile.user.mobileNumber || "");
      setDateOfBirth(userProfile.user.dateOfBirth || "");
      setGender(userProfile.userInfo.gender || '');
      setLookingFor(userProfile.userInfo.lookingFor || '');
      setRelationship(userProfile.userInfo.relationship || '');
      setInterests(userProfile.userInfo.interests || '');
      setPlace(userProfile.userInfo.place || '');
      setCaste(userProfile.userInfo.caste || '');
      setOccupation(userProfile.userInfo.occupation || '');
      setEducation(userProfile.userInfo.education || '');
      setBio(userProfile.userInfo.bio || '');
      setSmoking(userProfile.userInfo.smoking || '');
      setDrinking(userProfile.userInfo.drinking || '');
      
      if (userProfile?.userInfo?.profilePhotos) {
        setProfilePhotos(userProfile.userInfo.profilePhotos);
      }
    }
  }, [userProfile]);

  const handlePersonalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }
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
        refetch();
        setEditPersonal(false);
      } catch (err) {
        console.log(err)
        toast.error("Failed to update profile");
      }
    }
  };

  const handleInterestClick = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else if (interests.length < 5) {
      setInterests([...interests, interest]);
    }
  };

  const handleImageChange = (index: number, newImage: File) => {
    const updatedPhotos = [...profilePhotos];
    updatedPhotos[index] = newImage;
    setProfilePhotos(updatedPhotos);
    setImgIndex(prevIndex => [...prevIndex, index]);
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!gender.trim()) newErrors.gender = "Gender is required.";
    if (!lookingFor.trim()) newErrors.lookingFor = "Looking for is required.";
    if (!relationship.trim()) newErrors.relationship = "Relationship type is required.";
    if (interests.length === 0) newErrors.interests = "At least one interest must be selected.";
    if (!occupation.trim() || !/^[a-zA-Z\s]+$/.test(occupation)) {
      newErrors.occupation = "Valid occupation is required.";
    }
    if (!education.trim() || !/^[a-zA-Z\s]+$/.test(education)) {
      newErrors.education = "Valid education is required.";
    }
    if (!bio.trim() || !/^[a-zA-Z\s.,!?']+$/.test(bio)) {
      newErrors.bio = "Valid bio is required.";
    }
    if (!caste.trim() || !/^[a-zA-Z\s.,!?']+$/.test(caste)) {
      newErrors.caste = "Valid religion is required.";
    }
    if (!smoking.trim()) newErrors.smoking = "Smoking habit is required.";
    if (!drinking.trim()) newErrors.drinking = "Drinking habit is required.";
    if (profilePhotos.length !== 4) {
      newErrors.profilePhotos = "Four profile photos are required.";
    }

    setErrors(newErrors);
    setTimeout(() => {
      Object.keys(newErrors).forEach((field) => {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      });
    }, 4000);
    return Object.keys(newErrors).length === 0;
  };

  const handleDatingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) return;
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

      // Get file types for presigned URLs (only for new/changed images)
      const newImageFileTypes = imgIndex.map(index => profilePhotos[index].type);
    
      // Get signed URLs from backend if there are new images
      let signedUrls: { signedUrls: Array<{signedUrl: string, publicUrl: string}> } | null = null;
      if (newImageFileTypes.length > 0) {
        const { data } = await getPresignedUrls({ fileTypes: newImageFileTypes });
        
        if (!data || !data.signedUrls) {
          toast.error('Failed to generate upload URLs');
          return;
        }
        signedUrls = data;
      }
  
      // Upload new photos to S3
      let profilePhotoUrls: string[] = [];
      if (signedUrls) {
        const uploadPromises = signedUrls.signedUrls.map(async (urlInfo, index) => {
          const fileIndex = imgIndex[index];
          const success = await uploadToS3(profilePhotos[fileIndex], urlInfo.signedUrl);
          return success ? urlInfo.publicUrl : null;
        });
  
        profilePhotoUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
  
        if (profilePhotoUrls.length !== imgIndex.length) {
          toast.error('Failed to upload all photos');
          return;
        }
      }

      console.log('profilePhotoUrlsprofilePhotoUrls',profilePhotoUrls)

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
    // formData.append('imgIndex', imgIndex.join(','));
if (profilePhotoUrls.length > 0) {
  formData.append('imgIndex', imgIndex.join(','));
  profilePhotoUrls.forEach(url => {
    formData.append('profilePhotos', url);
  });
}
    try {
      await updateUserDatingInfo({ userId, data: formData }).unwrap();
      toast.success("Dating Info Updated Successfully");
      setEditDating(false);
      setImgIndex([]);
      refetch();
    } catch (error) {
      console.log(error)
      toast.error("Failed to update dating info");
    }
  };

  const uploadToS3 = async (file: File, signedUrl: string) => {
    try {
      await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });
      return true;
    } catch (error) {
      console.error('S3 upload error:', error);
      toast.error('Failed to upload photo');
      return false;
    }
  };

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Personal Information */}
          <form onSubmit={handlePersonalSubmit} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditPersonal(!editPersonal)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {editPersonal ? "Cancel" : "Update"}
                </button>
                {editPersonal && (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="col-span-2 flex justify-center">
                <img
                  src={
                    userProfile?.userInfo.profilePhotos[0] instanceof File
                      ? URL.createObjectURL(userProfile?.userInfo.profilePhotos[0])
                      : userProfile?.userInfo.profilePhotos[0]
                  }
                  alt="Profile"
                  
                  className="w-32 h-32 rounded-full object-cover border-4 border-rose-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Name</label>
                  {editPersonal ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.user?.name}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
                  {editPersonal ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.user?.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Phone</label>
                  {editPersonal ? (
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.user?.mobileNumber}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  {editPersonal ? (
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.user?.dateOfBirth}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
  <button
    type="button"
    onClick={() =>
      navigate("/forgotPasswordRequesting", {
        state: { email, isChangePassword: true },
      })
    }
    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
  >
    Change Password
  </button>
</div>

          </form>

          {/* Dating Information */}
          <form onSubmit={handleDatingSubmit} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Dating Information</h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditDating(!editDating)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {editDating ? "Cancel" : "Update"}
                </button>
                {editDating && (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Left column fields */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Gender</label>
                  {editDating ? (
                    <>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && (
                        <span className="text-red-500 text-sm mt-1">{errors.gender}</span>
                      )}
                    </>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.gender}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Looking For</label>
                  {editDating ? (
                    <>
                      <select
                        value={lookingFor}
                        onChange={(e) => setLookingFor(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Preference</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.lookingFor && (
                        <span className="text-red-500 text-sm mt-1">{errors.lookingFor}</span>
                      )}
                    </>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.lookingFor}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Interests</label>
                  {editDating ? (
                    <>
                      <div
                        onClick={() => setShowModal(true)}
                        className="p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        {interests.length > 0 ? interests.join(", ") : "Select interests"}
                      </div>
                      {errors.interests && (
                        <span className="text-red-500 text-sm mt-1">{errors.interests}</span>
                      )}
                    </>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">
                      {userProfile?.userInfo.interests.join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Education</label>
                  {editDating ? (
                    <>
                      <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.education && (
                        <span className="text-red-500 text-sm mt-1">{errors.education}</span>
                      )}
                    </>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.education}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Right column fields */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Occupation</label>
                  {editDating ? (
                    <>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.occupation && (
                        <span className="text-red-500 text-sm mt-1">{errors.occupation}</span>
                      )}
                    </>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.occupation}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Bio</label>
                  {editDating ? (
                    <>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                      />
                      {errors.bio && (
                        <span className="text-red-500 text-sm mt-1">{errors.bio}</span>
                      )}
                    </>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.bio}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Location</label>
                  {editDating ? (
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.place}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Religion</label>
                  {editDating ? (
                    <>
                      <input
                        type="text"
                        value={caste}
                        onChange={(e) => setCaste(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.caste && (
                        <span className="text-red-500 text-sm mt-1">{errors.caste}</span>
                      )}
                    </>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.caste}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Smoking Habit</label>
                    {editDating ? (
                      <select
                        value={smoking}
                        onChange={(e) => setSmoking(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.smoking}</p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 mb-1">Drinking Habit</label>
                    {editDating ? (
                      <select
                        value={drinking}
                        onChange={(e) => setDrinking(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      <p className="p-2 bg-gray-50 rounded-lg">{userProfile?.userInfo.drinking}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-600 mb-3 block">Profile Photos</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {userProfile?.userInfo.profilePhotos.map((image:  File | string, index: number) => (
                      <div key={index} className="relative group">
                       <img
  src={image instanceof File ? URL.createObjectURL(image) : image}
  alt={`Profile ${index + 1}`}
  className="w-full h-48 object-cover rounded-lg"
/>
                        {editDating && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <input
                              type="file"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageChange(index, e.target.files[0]);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                            />
                            <span className="text-white text-sm">Change Photo</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Interests Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Select Interests (Up to 5)</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestClick(interest)}
                  disabled={interests.length >= 5 && !interests.includes(interest)}
                  className={`p-2 rounded-lg transition-colors ${
                    interests.includes(interest)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } ${
                    interests.length >= 5 && !interests.includes(interest)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;