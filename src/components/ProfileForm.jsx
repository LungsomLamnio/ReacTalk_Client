import React from "react";
import { Form, Button, Stack } from "react-bootstrap";

const ProfileForm = ({
  userData,
  setUserData,
  onSave,
  saving,
  canSave,
  onCancel,
}) => {
  return (
    <Form className="text-start mt-2" onSubmit={onSave}>
      <Form.Group className="mb-3">
        <Form.Label className="small fw-bold text-secondary">
          Username
        </Form.Label>
        <Form.Control
          type="text"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
          className="py-2 bg-light border-0 shadow-none"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="small fw-bold text-secondary">Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={userData.bio}
          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          className="py-2 bg-light border-0 shadow-none"
          style={{ resize: "none" }}
        />
      </Form.Group>

      <Stack direction="horizontal" gap={2}>
        <Button
          type="button"
          variant="light"
          className="w-50 py-2 rounded-pill fw-bold"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="dark"
          className="w-50 py-2 rounded-pill fw-bold shadow-sm"
          disabled={saving || !canSave}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Form>
  );
};

export default ProfileForm;
