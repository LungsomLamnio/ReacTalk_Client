import React, { useState, useEffect } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { ArrowLeft, PencilSquare } from "react-bootstrap-icons"; // Added Pencil icon
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileStats from "../components/ProfileStats";
import ProfileForm from "../components/ProfileForm";

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for toggle

  const [userData, setUserData] = useState({
    username: "",
    bio: "",
    profilePic: "",
  });
  const [originalData, setOriginalData] = useState({ username: "", bio: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const response = await axios.get(`${BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setUserData(data);
        setOriginalData({ username: data.username, bio: data.bio });
        setPreview(data.profilePic ? `${BASE_URL}${data.profilePic}` : "");
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const isChanged =
    userData.username !== originalData.username ||
    userData.bio !== originalData.bio ||
    selectedFile !== null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setIsEditing(true); // Auto-enable edit mode if a photo is picked
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("bio", userData.bio);
    if (selectedFile) formData.append("profilePic", selectedFile);

    try {
      const res = await axios.put(`${BASE_URL}/api/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setOriginalData({ username: res.data.username, bio: res.data.bio });
      setSelectedFile(null);
      setIsEditing(false); // Exit edit mode after saving
      alert("Profile Updated!");
    } catch (err) {
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="dark" />
      </div>
    );

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#fafaf9" }}>
      <Container className="d-flex justify-content-center">
        <Card
          className="border-0 shadow-sm rounded-5 overflow-hidden"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <Card.Header className="bg-white border-0 pt-4 px-4 d-flex align-items-center justify-content-between">
            <Button
              variant="light"
              className="rounded-circle p-2 shadow-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <h4 className="fw-bold mb-0">My Account</h4>
            <div style={{ width: "40px" }}></div> {/* Spacer for symmetry */}
          </Card.Header>

          <Card.Body className="p-4 text-center">
            <ProfileAvatar
              preview={preview}
              username={userData.username}
              onFileChange={handleFileChange}
            />

            <ProfileStats
              followers={userData.followers?.length}
              following={userData.following?.length}
            />

            {/* Conditional Rendering: Form vs View Mode */}
            {isEditing ? (
              <ProfileForm
                userData={userData}
                setUserData={setUserData}
                onSave={handleSave}
                saving={saving}
                canSave={isChanged}
                onCancel={() => {
                  setUserData({ ...userData, ...originalData }); // Revert changes
                  setIsEditing(false);
                }}
              />
            ) : (
              <div className="mt-2">
                <h3 className="fw-bold text-dark mb-1">{userData.username}</h3>
                <p
                  className="text-muted mb-4 px-3"
                  style={{ fontSize: "0.95rem" }}
                >
                  {userData.bio || "No bio added yet."}
                </p>
                <Button
                  variant="dark"
                  className="w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilSquare size={18} />
                  Edit Profile
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
