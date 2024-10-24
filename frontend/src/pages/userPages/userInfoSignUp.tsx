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
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo) {
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
  
    if (!gender) newErrors.gender = "Gender is required.";
    if (!lookingFor) newErrors.lookingFor = "Looking for is required.";
    if (!relationship) newErrors.relationship = "Relationship type is required.";
    if (interests.length === 0) newErrors.interests = "At least one interest must be selected.";
    if (!place) newErrors.place = "Place is required.";
  
    // Validate occupation to allow only text
    if (!occupation) {
      newErrors.occupation = "Occupation is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(occupation)) {
      newErrors.occupation = "Occupation must only contain letters.";
    }
  
    // Validate education to allow only text
    if (!education) {
      newErrors.education = "Education is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(education)) {
      newErrors.education = "Education must only contain letters.";
    }
  
    // Validate bio to allow only text
    if (!bio) {
      newErrors.bio = "Bio is required.";
    } else if (!/^[a-zA-Z\s.,!?']+$/.test(bio)) {
      newErrors.bio = "Bio must only contain letters and basic punctuation.";
    }
  
    if (!smoking) newErrors.smoking = "Smoking habit is required.";
    if (!drinking) newErrors.drinking = "Drinking habit is required.";
  
    // Validate profile photos
    if (profilePhotos.length === 0) {
      newErrors.profilePhotos = "profile photo must be uploaded.";
    } else if (profilePhotos.length !== 4) {
      newErrors.profilePhotos = "Exactly four profile photos must be uploaded.";
    }
  
    setErrors(newErrors);
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
    MyFormData.append('place', place);
    MyFormData.append('caste', caste);

    try {
      await createUserInfo(MyFormData).unwrap();
      toast.success("User information successfully submitted");
      localStorage.removeItem('emailId');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err) {
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
            <label htmlFor="place">Place:</label>
            <input type="text" id="place" value={place} onChange={(e) => setPlace(e.target.value.trim())} />
            {errors.place && <span className="error-message">{errors.place}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="caste">Caste:</label>
            <input type="text" id="caste" value={caste} onChange={(e) => setCaste(e.target.value.trim())} />
          </div>
        </div>

        <div className="form-box right-box">
          <div className="input-group">
            <label htmlFor="occupation">Occupation:</label>
            <input type="text" id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value.trim())} />
            {errors.occupation && <span className="error-message">{errors.occupation}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="education">Education:</label>
            <input type="text" id="education" value={education} onChange={(e) => setEducation(e.target.value.trim())} />
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
