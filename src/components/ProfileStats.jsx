import React from "react";

const ProfileStats = ({ followers, following }) => {
  return (
    <div className="d-flex justify-content-center gap-4 mb-4">
      <div className="text-center px-3">
        <h6 className="fw-bold mb-0 text-dark">{followers || 0}</h6>
        <small className="text-muted">Followers</small>
      </div>
      <div className="border-start"></div>
      <div className="text-center px-3">
        <h6 className="fw-bold mb-0 text-dark">{following || 0}</h6>
        <small className="text-muted">Following</small>
      </div>
    </div>
  );
};

export default ProfileStats;
