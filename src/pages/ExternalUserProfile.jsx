import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Stack } from "react-bootstrap";
import {
  ArrowLeft,
  ChatDotsFill,
  PersonCheckFill,
  PersonPlusFill,
} from "react-bootstrap-icons";
import axios from "axios";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileStats from "../components/ProfileStats";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ExternalUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const myId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setUser(res.data);
        setIsFollowing(res.data.isFollowing); 
      } catch (err) {
        navigate("/chat");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleMessage = () => {
    navigate("/chat", {
      state: {
        selectedUser: {
          id: user._id,
          name: user.username,
          profilePic: user.profilePic,
          status: "Online",
        },
      },
    });
  };

  const handleFollowToggle = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/user/follow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (res.data) {
        setUser(res.data);
        
        const isNowFollowing = res.data.followers.some(
          (followerId) => String(followerId).trim() === String(myId).trim()
        );
        setIsFollowing(isNowFollowing);
      }
    } catch (err) {
      alert("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  const avatarPreview = user.profilePic 
    ? (user.profilePic.startsWith("http") ? user.profilePic : `${BASE_URL}${user.profilePic}`) 
    : "";

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#fafaf9" }}>
      <Container className="d-flex justify-content-center">
        <Card className="border-0 shadow-sm rounded-5 overflow-hidden" style={{ maxWidth: "500px", width: "100%" }}>
          <Card.Header className="bg-white border-0 pt-4 px-4">
            <Button variant="light" className="rounded-circle p-2" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </Button>
          </Card.Header>

          <Card.Body className="p-4 text-center">
            <ProfileAvatar preview={avatarPreview} username={user.username} readOnly={true} />
            <ProfileStats followers={user.followers?.length || 0} following={user.following?.length || 0} />

            <h3 className="fw-bold text-dark mb-1">{user.username}</h3>
            <p className="text-muted mb-4 px-3">{user.bio || "Hey there! I am using ReacTalk"}</p>

            <Stack gap={2}>
              <Button
                variant={isFollowing ? "outline-dark" : "dark"}
                className="w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                onClick={handleFollowToggle}
                disabled={actionLoading}
              >
                {isFollowing ? <><PersonCheckFill size={18} /> Following</> : <><PersonPlusFill size={18} /> Follow</>}
              </Button>

              <Button
                variant="light"
                onClick={handleMessage}
                className="w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 border"
              >
                <ChatDotsFill size={18} /> Message
              </Button>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}