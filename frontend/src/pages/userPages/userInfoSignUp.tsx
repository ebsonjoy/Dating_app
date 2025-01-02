import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateUserInfoMutation } from '../../slices/apiUserSlice';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { Camera, MapPin, Briefcase, Book, MessageSquare, Heart } from 'lucide-react';
import { IApiError } from '../../types/error.types';

interface FormErrors {
  gender?: string;
  lookingFor?: string;
  relationship?: string;
  interests?: string
  location?: string;
  occupation?: string;
  education?: string;
  bio?: string;
  caste?: string;
  smoking?: string;
  drinking?: string;
  profilePhotos?: string
}
interface ILocation {
  latitude: number;
  longitude: number;
}


const UserInformation = () => {
  // State management
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [relationship, setRelationship] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [place, setPlace] = useState('');
  const [caste, setCaste] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');
  const [smoking, setSmoking] = useState('');
  const [drinking, setDrinking] = useState('');
  const [profilePhotos, setProfilePhotos] =useState<File[]>([]);
  const [location, setLocation] = useState<ILocation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [createUserInfo, { isLoading }] = useCreateUserInfoMutation();
  const [userId, setUserId] = useState<string | null>(null);
  // Available interests
  const availableInterests = [
    'Gym', 'Movies', 'Reading', 'Music', 'Photography', 'Sports',
    'Travel', 'Cooking', 'Yoga', 'Blogging', 'Dancing', 'Gaming'
  ];

  // Effects
  useEffect(() => {
    if (userInfo && !userInfo.isGoogleLogin) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate('/register');
    }
  }, []);

  // Validation function
  const validateFields = () => {
    const newErrors:FormErrors  = {};

    if (!gender.trim()) newErrors.gender = "Gender is required.";
    if (!lookingFor.trim()) newErrors.lookingFor = "Looking for is required.";
    if (!relationship.trim()) newErrors.relationship = "Relationship type is required.";
    if (interests.length === 0) newErrors.interests = "At least one interest must be selected.";
    if (!location) newErrors.location = "Please enable location.";

    if (!occupation.trim()) {
      newErrors.occupation = "Occupation is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(occupation)) {
      newErrors.occupation = "Occupation must only contain letters.";
    }

    if (!education.trim()) {
      newErrors.education = "Education is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(education)) {
      newErrors.education = "Education must only contain letters.";
    }

    if (!bio.trim()) {
      newErrors.bio = "Bio is required.";
    } else if (!/^[a-zA-Z\s.,!?']+$/.test(bio)) {
      newErrors.bio = "Bio must only contain letters and basic punctuation.";
    }

    if (!caste.trim()) {
      newErrors.caste = "Caste is required.";
    } else if (!/^[a-zA-Z\s.,!?']+$/.test(caste)) {
      newErrors.caste = "Caste must only contain letters and basic punctuation.";
    }

    if (!smoking.trim()) newErrors.smoking = "Smoking habit is required.";
    if (!drinking.trim()) newErrors.drinking = "Drinking habit is required.";

    if (profilePhotos.length === 0) {
      newErrors.profilePhotos = "Profile photos must be uploaded.";
    } else if (profilePhotos.length !== 4) {
      newErrors.profilePhotos = "Exactly four profile photos must be uploaded.";
    }

    setErrors(newErrors);
    
    // Clear errors after 4 seconds
    (Object.keys(newErrors) as (keyof FormErrors)[]).forEach((field) => {
      setTimeout(() => {
        setErrors(prev => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }, 4000);
    });

    return Object.keys(newErrors).length === 0;
  };

  // Handler functions
  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchLocationName(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error fetching location:', error);
        toast.error("Unable to fetch location. Please enable location services.");
      }
    );
  };

  const fetchLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d271ae71e593422e9b3539cd29e1f8eb`
      );
      const data = await response.json();
      const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village || data.results[0].components.state_district;
      
      if (city) {
        setPlace(city);
      } else {
        toast.error("Unable to determine city name from location.");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      toast.error("Failed to retrieve location name.");
    }
  };

  const handleInterestClick = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else if (interests.length < 5) {
      setInterests([...interests, interest]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[]
    if (files.length + profilePhotos.length <= 4) {
      setProfilePhotos([...profilePhotos, ...files]);
    } else {
      toast.error("You can only upload up to 4 photos.");
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateFields()) return;

    const formData = new FormData();
    if (userId) {
      formData.append('userId', userId);
    }
    
    // Append all form data
    formData.append('gender', gender);
    formData.append('lookingFor', lookingFor);
    profilePhotos.forEach((photo) => {
      formData.append('profilePhotos', photo);
    });
    interests.forEach((interest) => {
      formData.append('interests', interest);
    });
    formData.append('relationship', relationship);
    formData.append('occupation', occupation);
    formData.append('education', education);
    formData.append('bio', bio);
    formData.append('smoking', smoking);
    formData.append('drinking', drinking);
    formData.append('place', place);
    
    if (location) {
      formData.append('location', JSON.stringify({
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      }));
    } else {
      toast.error("Location is required.");
      return;
    }
    
    formData.append('caste', caste);
    try {
      await createUserInfo(formData).unwrap();
      toast.success("User information successfully submitted");
      localStorage.removeItem('emailId');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err:unknown) {
      const error = err as IApiError
      toast.error(error?.data?.message || "Failed to submit user information");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-rose-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 bg-pink-300/20 rounded-full -top-12 -left-12 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-300/20 rounded-full -bottom-24 -right-24 animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-rose-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
          </div>
          <p className="text-gray-600">Tell us more about yourself to find your perfect match</p>
        </div>

        <form className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Basic Information</label>
                
                <div className="space-y-4">
                  <div>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.gender ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                  </div>

                  <div>
                    <select
                      value={lookingFor}
                      onChange={(e) => setLookingFor(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.lookingFor ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                    >
                      <option value="">Looking For</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.lookingFor && <p className="mt-1 text-sm text-red-500">{errors.lookingFor}</p>}
                  </div>

                  <div>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.relationship ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                    >
                      <option value="">Relationship Type</option>
                      <option value="long-time">Long-Term</option>
                      <option value="short-time">Short-Term</option>
                    </select>
                    {errors.relationship && <p className="mt-1 text-sm text-red-500">{errors.relationship}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Location & Background</label>
                
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={place}
                      onClick={handleLocation}
                      readOnly
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                      placeholder="Click to set location"
                    />
                  </div>
                  {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.caste ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                    placeholder="Caste"
                  />
                  {errors.caste && <p className="mt-1 text-sm text-red-500">{errors.caste}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Habits</label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      value={smoking}
                      onChange={(e) => setSmoking(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.smoking ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                    >
                      <option value="">Smoking</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.smoking && <p className="mt-1 text-sm text-red-500">{errors.smoking}</p>}
                  </div>

                  <div>
                    <select
                      value={drinking}
                      onChange={(e) => setDrinking(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.drinking ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                    >
                      <option value="">Drinking</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.drinking && <p className="mt-1 text-sm text-red-500">{errors.drinking}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Professional Details</label>
                
                <div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.occupation ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                      placeholder="Occupation"
                    />
                  </div>
                  {errors.occupation && <p className="mt-1 text-sm text-red-500">{errors.occupation}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Book className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.education ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90`}
                      placeholder="Education"
                    />
                  </div>
                  {errors.education && <p className="mt-1 text-sm text-red-500">{errors.education}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">About You</label>
                
                <div>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.bio ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/90 h-32`}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Interests</span>
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="text-sm text-rose-600 hover:text-rose-500"
                    >
                      Select Interests
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  {errors.interests && <p className="mt-1 text-sm text-red-500">{errors.interests}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Profile Photos</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.profilePhotos ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-xl`}>
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="profilePhotos"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-rose-600 hover:text-rose-500"
                      >
                        <span>Upload photos</span>
                        <input
                          id="profilePhotos"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB (4 photos required)</p>
                  </div>
                </div>
                {errors.profilePhotos && <p className="mt-1 text-sm text-red-500">{errors.profilePhotos}</p>}
                <div className="grid grid-cols-2 gap-4">
                  {profilePhotos.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Profile ${index + 1}`}
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Complete Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Interests Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Interests (Up to 5)</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestClick(interest)}
                  disabled={interests.length >= 5 && !interests.includes(interest)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    interests.includes(interest)
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className="mt-6 w-full py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInformation;