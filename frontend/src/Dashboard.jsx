import { useEffect, useState } from "react";
import { Balance } from "./Components/Balance";
import { Users } from "./Components/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppBar } from "./Components/AppBar";

export default function Dashboard() {
  const [bal, setBal] = useState(0);
  const [userId, setuserId] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    // Check if token exists in local storage
    if (!userToken) {
      navigate("/sign-in"); // Redirect to sign-in page if token doesn't exist
    } else {
      // Fetch balance if token exists
      axios
        .get("http://localhost:3000" + "/api/v1/account/balance", {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        })
        .then((response) => {
          setBal(response.data.balance);
          setuserId(response.data.userId);
        })
        .catch((error) => {
          navigate("/sign-in");
        });
    }
  }, [bal]);

  useEffect(() => {
    axios
      .post("http://localhost:3000" + "/api/v1/user/getUser", {
        userId,
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log(error);
        navigate("/dashboard");
      });
  }, [userId]);
  const firstLetter = user.firstName.charAt(0).toUpperCase();
  return (
    <div>
      <AppBar firstletter={firstLetter} />

      <div className="m-8">
        <h1>
          Welcome {user.firstName} {user.lastName}
        </h1>
        <Balance value={bal} />
        <Users />
      </div>
    </div>
  );
}
