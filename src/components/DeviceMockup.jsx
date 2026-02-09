// components/DeviceMockup.jsx
import { Button } from "react-bootstrap";

export const DeviceMockup = () => (
  <div className="position-relative">
    <div
      className="position-absolute top-50 start-50 translate-middle rounded-circle"
      style={{
        width: "450px",
        height: "450px",
        backgroundColor: "rgba(0,0,0,0.03)",
        filter: "blur(60px)",
        zIndex: -1,
      }}
    />
    <div
      className="device-frame position-relative bg-dark shadow-lg"
      style={{
        width: "300px",
        height: "600px",
        borderRadius: "50px",
        border: "12px solid #1a1a1a",
        overflow: "hidden",
      }}
    >
      <div
        className="position-absolute start-50 translate-middle-x bg-black"
        style={{
          width: "100px",
          height: "25px",
          top: "15px",
          borderRadius: "20px",
          zIndex: 10,
        }}
      />
      <div className="bg-white h-100 w-100 p-3 pt-5 overflow-hidden">
        {/* Phone Content */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-1">
          <div
            className="bg-success-subtle text-success rounded-pill px-3 py-1 small fw-bold"
            style={{ fontSize: "10px" }}
          >
            Active Now
          </div>
          <div
            className="rounded-circle bg-dark shadow-sm"
            style={{ width: 35, height: 35 }}
          ></div>
        </div>
        <h5 className="fw-bold text-start mb-3 px-1">ReacTalk Chats</h5>
        <div className="d-flex flex-column gap-3 text-start">
          <ChatBubble name="Nitesh Sharma" msg="Happy Birthday Lungsom! 🎂" />
          <ChatBubble
            name="GDG Technical Lead"
            msg="The workshop starts at 5."
          />
          <ChatBubble name="Vernovate R&D" msg="API documentation is ready." />
        </div>
        <Button
          variant="dark"
          className="w-100 mt-5 py-2 rounded-pill fw-bold shadow-sm"
          style={{ fontSize: "12px" }}
        >
          Open Conversation
        </Button>
      </div>
    </div>
  </div>
);

const ChatBubble = ({ name, msg }) => (
  <div className="p-3 rounded-4 bg-light border-0">
    <div className="fw-bold small text-primary">{name}</div>
    <div className="text-muted extra-small">{msg}</div>
  </div>
);
