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

export default function ExternalUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);

        // Logic to check if you are already following them
        // This assumes your backend returns the list of follower IDs
        const myId = localStorage.getItem("userId"); // Ensure you save userId on login
        setIsFollowing(res.data.followers.includes(myId));
      } catch (err) {
        navigate("/chat");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleFollowToggle = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      // This endpoint should handle both follow and unfollow (toggle)
      const res = await axios.post(
        `${BASE_URL}/api/user/follow/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setIsFollowing(!isFollowing);
      // Update the local user state to reflect the new count
      setUser((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter(
              (fid) => fid !== localStorage.getItem("userId"),
            )
          : [...prev.followers, localStorage.getItem("userId")],
      }));
    } catch (err) {
      alert("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#fafaf9" }}>
      <Container className="d-flex justify-content-center">
        <Card
          className="border-0 shadow-sm rounded-5 overflow-hidden"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <Card.Header className="bg-white border-0 pt-4 px-4">
            <Button
              variant="light"
              className="rounded-circle p-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
          </Card.Header>

          <Card.Body className="p-4 text-center">
            {/* Camera icon is hidden because readOnly is true */}
            <ProfileAvatar
              preview={user.profilePic ? `${BASE_URL}${user.profilePic}` : ""}
              username={user.username}
              readOnly={true}
            />

            <ProfileStats
              followers={user.followers?.length}
              following={user.following?.length}
            />

            <h3 className="fw-bold text-dark mb-1">{user.username}</h3>
            <p className="text-muted mb-4 px-3">
              {user.bio || "No bio available"}
            </p>

            <Stack gap={2}>
              {/* Toggle Follow Button */}
              <Button
                variant={isFollowing ? "outline-dark" : "dark"}
                className="w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                onClick={handleFollowToggle}
                disabled={actionLoading}
              >
                {isFollowing ? (
                  <>
                    <PersonCheckFill size={18} /> Following
                  </>
                ) : (
                  <>
                    <PersonPlusFill size={18} /> Follow
                  </>
                )}
              </Button>

              <Button
                variant="light"
                className="w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 border"
              >
                <ChatDotsFill size={18} />
                Message
              </Button>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
