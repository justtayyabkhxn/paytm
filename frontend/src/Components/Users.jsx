import { useState, useEffect } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("") // Optional search functionality

  useEffect(() => {
    // Fetch all users on component mount
    axios
      .post("http://localhost:3000/api/v1/user/getallUsers")
      .then((response) => {
        setUsers(response.data.users); // Assuming the response contains a `users` array
      })
      .catch((error) => {
        console.error("Error fetching users:", error.message);
      });
  }, []);

  // Filter users based on the search query (optional)
  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </div>
      <div>
        {filteredUsers.map((user) => (
          <User user={user} key={user._id} />
        ))}
      </div>
    </>
  );
}

function User({ user }) {
  const [userId, setuserId] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/sign-in");
    } else {
      axios
        .get("http://localhost:3000/api/v1/account/balance", {
          headers: { Authorization: "Bearer " + userToken },
        })
        .then((response) => {
          setuserId(response.data.userId);
        })
        .catch(() => {
          navigate("/sign-in");
        });
    }
  }, [navigate]);
  

  const sendMoney = ({ to }) => {
    if (userId) {
      navigate(`/send?to=${to}`);
    } else {
      alert("Unable to fetch your user ID. Please try again.");
    }
  };
  

  return (
    <div className="flex justify-between mb-4">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-2">
          <span className="text-xl font-bold">
            {user.firstName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-lg font-medium">
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>
      <div className="flex items-center">
      <Button label={"Send Money"} onClick={() => sendMoney({ to: user._id })} />

      </div>
    </div>
  );
}
