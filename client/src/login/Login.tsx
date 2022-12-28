import { Button, Input } from "antd";
import { useContext, useState } from "react";
import { UserContext } from "../provider/UserContextProvider";

export default function Login() {
  const { userId, setUserId } = useContext(UserContext);
  const [newUserId, setNewUserId] = useState<string>(userId || "");
  const [submitted, setSubmitted] = useState<boolean>(false);

  function submitUserId() {
    if (newUserId) {
      setUserId(newUserId);
      setSubmitted(true);
    }
  }

  function showSuccess() {
    if (!submitted) return null;
    return <div>Logged in!</div>;
  }
  return (
    <div>
      <Input
        value={newUserId}
        placeholder={"User ID"}
        onChange={(e) => setNewUserId(e.target.value)}
      />
      <Button type="primary" onClick={submitUserId}>
        Submit
      </Button>
      {showSuccess()}
    </div>
  );
}
