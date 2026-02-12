import React from "react";
import { CameraFill } from "react-bootstrap-icons";

const ProfileAvatar = ({ preview, username, onFileChange, readOnly }) => {
  return (
    <div className="position-relative d-inline-block mb-4">
      <div
        className="rounded-circle bg-dark overflow-hidden shadow"
        style={{ width: "120px", height: "120px" }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-100 h-100 object-fit-cover"
          />
        ) : (
          <span className="text-white display-4 d-flex align-items-center justify-content-center h-100">
            {username?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {!readOnly && (
        <>
          <label
            htmlFor="fileInput"
            className="position-absolute bottom-0 end-0 btn btn-primary rounded-circle d-flex align-items-center justify-content-center border border-white"
            style={{ width: "40px", height: "40px", padding: "0" }}
          >
            <CameraFill size={18} />
          </label>
          <input
            type="file"
            id="fileInput"
            hidden
            onChange={onFileChange}
            accept="image/*"
          />
        </>
      )}
    </div>
  );
};

export default ProfileAvatar;
