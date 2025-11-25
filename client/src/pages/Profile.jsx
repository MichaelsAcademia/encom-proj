import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user?.username || user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>User ID:</strong> {user?._id}</p>
    </div>
  );
}
