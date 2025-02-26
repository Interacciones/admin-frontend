"use client";

import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

function Profile() {
  const [tutor, setTutor] = useState({
    description: "",
    photo: "",
    priceDescription: "",
    contactNumber: "",
  });
  const [userProfile, setUserProfile] = useState({
    name: "",
    lastName: "",
    email: "",
  });
  const { user } = UserAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...tutor, photo : null});

  const fetchTutorProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tutors-self`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.stsTokenManager.accessToken}`,
        },
      });
      const result = await response.json();
      setTutor(result.data);
      setFormData({ ...result.data});
    } catch (error) {
      console.error("Error fetching tutor profile:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users-self`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.stsTokenManager.accessToken}`,
        },
      });
      const result = await response.json();
      setUserProfile(result.data);
      setFormData((prev) => ({ ...prev}));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTutorProfile();
      fetchUserProfile();
    }
  }, [user]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...tutor});
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      console.log(formData.photo);
      formDataToSend.append("photo", formData.photo);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("priceDescription", formData.priceDescription);
  
      const response = await fetch(`http://localhost:3000/own-tutor`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user?.stsTokenManager.accessToken}`,
        },
        body: formDataToSend,
      });
  
      const result = await response.json();
      console.log(result.data);
      setTutor(result.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {tutor && userProfile ? (
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <img
          src={tutor.photo}
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500"
        />
        <h2 className="text-2xl font-semibold mt-4">
          {userProfile.name} {userProfile.lastName}
        </h2>

        {!isEditing ? (
          <>
            <p className="text-gray-500">{tutor.description}</p>
            <div className="mt-4 text-left space-y-2">
              <p><span className="font-semibold">Email:</span> {userProfile.email}</p>
              <p><span className="font-semibold">Phone:</span> {tutor.contactNumber}</p>
              <p><span className="font-semibold">Price:</span> {tutor.priceDescription}</p>
            </div>
            <button
              onClick={handleEdit}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form className="mt-4 space-y-2">
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="priceDescription"
              value={formData.priceDescription}
              onChange={handleChange}
              placeholder="Price Description"
              className="w-full p-2 border rounded"
            />

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
      ) : (
        <p> Loading... </p>
      )}
    </div>
  );
}

export default Profile;
