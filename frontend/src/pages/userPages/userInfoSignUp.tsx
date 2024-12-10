import React, { useEffect, useState } from 'react';
import "../style/userStyle/userInfoSignUP.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateUserInfoMutation } from '../../slices/apiUserSlice';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const UserInformation: React.FC = () => {
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
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo && !userInfo.isGoogleLogin) {
      console.log('rrrrrrrrrrrrrrrenderr user Effect')
      navigate('/');
    }
  }, [navigate, userInfo]);

  const [createUserInfo, { isLoading }] = useCreateUserInfoMutation();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate('/register');
    }
  }, []);

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        fetchLocationName(position.coords.latitude, position.coords.longitude)
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
      const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
  
      if (city) {
        setPlace(city); // Set only the city name
      } else {
        toast.error("Unable to determine city name from location.");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      toast.error("Failed to retrieve location name.");
    }
  };
  

  const availableInterests = [
    'Gym', 'Movies', 'Reading', 'Music', 'Photography', 'Sports',
    'Travel', 'Cooking', 'Yoga', 'Blogging', 'Dancing', 'Gaming'
  ];

  const handleInterestClick = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else if (interests.length < 5) {
      setInterests([...interests, interest]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + profilePhotos.length <= 4) {
      setProfilePhotos([...profilePhotos, ...files]);
    } else {
      alert("You can only upload up to 4 photos.");
    }
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
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    const MyFormData = new FormData();
    if (userId) {
      MyFormData.append('userId', userId);
    }
    MyFormData.append('gender', gender);
    MyFormData.append('lookingFor', lookingFor);
    profilePhotos.forEach((photo) => {
      MyFormData.append('profilePhotos', photo);
    });
    interests.forEach((interest) => {
      MyFormData.append('interests', interest);
    });
    MyFormData.append('relationship', relationship);
    MyFormData.append('occupation', occupation);
    MyFormData.append('education', education);
    MyFormData.append('bio', bio);
    MyFormData.append('smoking', smoking);
    MyFormData.append('drinking', drinking);
    MyFormData.append('place',place)
    if (location) {
      MyFormData.append('location', JSON.stringify({ type: 'Point', coordinates: [location.longitude, location.latitude] }));
    } else {
      toast.error("Location is required.");
      return;
    }
    MyFormData.append('caste', caste);

    try {
      await createUserInfo(MyFormData).unwrap();
      toast.success("User information successfully submitted");
      localStorage.removeItem('emailId');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err) {
      console.log(err)
      toast.error(err?.data?.message || "Failed to submit user information");
    }
  };

  return (
    <div className="user-info-container">
      <form className="user-info-form" onSubmit={handleSubmit}>
        <div className="form-box left-box">
          <div className="input-group">
            <label htmlFor="gender">Gender:</label>
            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="lookingFor">Looking for:</label>
            <select id="lookingFor" value={lookingFor} onChange={(e) => setLookingFor(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.lookingFor && <span className="error-message">{errors.lookingFor}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="relationship">Relationship Type:</label>
            <select id="relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)}>
              <option value="">Select Type</option>
              <option value="long-time">Long-Time</option>
              <option value="short-time">Short-Time</option>
            </select>
            {errors.relationship && <span className="error-message">{errors.relationship}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="interests">Interests:</label>
            <input
              type="text"
              id="interests"
              value={interests.join(', ')}
              readOnly
              onClick={() => setShowModal(true)} 
            />
            {errors.interests && <span className="error-message">{errors.interests}</span>}
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
                      className={`interest-button ${interests.includes(interest) ? 'selected' : ''}`}
                      onClick={() => handleInterestClick(interest)}
                      disabled={interests.length >= 5 && !interests.includes(interest)}
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

          <div className="input-group">
            <label htmlFor="location">location:</label>
            <input type="text" id="location" value={place} onClick={handleLocation}readOnly />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="caste">Caste:</label>
            <input type="text" id="caste" value={caste} onChange={(e) => setCaste(e.target.value)} />
            {errors.caste && <span className="error-message">{errors.caste}</span>}

          </div>
        </div>

        <div className="form-box right-box">
          <div className="input-group">
            <label htmlFor="occupation">Occupation:</label>
            <input type="text" id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
            {errors.occupation && <span className="error-message">{errors.occupation}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="education">Education:</label>
            <input type="text" id="education" value={education} onChange={(e) => setEducation(e.target.value)} />
            {errors.education && <span className="error-message">{errors.education}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="bio">Bio:</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            {errors.bio && <span className="error-message">{errors.bio}</span>}
          </div>

          <div className="input-group">
            <label>Smoking Habit:</label>
            <select value={smoking} onChange={(e) => setSmoking(e.target.value)}>
              <option value="">Select Habit</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.smoking && <span className="error-message">{errors.smoking}</span>}
          </div>

          <div className="input-group">
            <label>Drinking Habit:</label>
            <select value={drinking} onChange={(e) => setDrinking(e.target.value)}>
              <option value="">Select Habit</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.drinking && <span className="error-message">{errors.drinking}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="profilePhotos">Profile Photos:</label>
            <input type="file" id="profilePhotos" multiple accept="image/*" onChange={handlePhotoUpload} />
            {errors.profilePhotos && <span className="error-message">{errors.profilePhotos}</span>}

            <div className="photos-preview-user-info">
              {profilePhotos.map((file, index) => (
                <img key={index} src={URL.createObjectURL(file)} alt={`Profile ${index + 1}`} className="profile-photo-user-info" />
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UserInformation;
