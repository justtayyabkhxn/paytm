import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SendMoney() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [info, setInfo] = useState("");
  const [reciever, setReciever] = useState({});

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from");
  const to = params.get("to");

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/sign-in");
    } else {
      axios
        .post("http://localhost:3000/api/v1/user/getUser", { userId: to })
        .then((response) => {
          setReciever(response.data.user);
        })
        .catch(() => {
          navigate("/dashboard");
        });
    }
  }, [navigate, to]);

  const initiateTransfer = () => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/sign-in");
    } else {
      axios
        .post(
          "http://localhost:3000/api/v1/account/transfer",
          { to, amount },
          {
            headers: {
              Authorization: "Bearer " + userToken,
            },
          }
        )
        .then((response) => {
          setInfo(response.data.message); // Assuming response contains a message
          alert("Transfer Successful: " + response.data.message);
          navigate("/dashboard")
        })
        .catch((error) => {
          alert("Transfer Failed: " + error.response.data.message);
        });
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setAmount(value);
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                {reciever.firstName ? (
                  <span className="text-2xl text-white">
                    {reciever.firstName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-2xl text-white">N/A</span>
                )}
              </div>
              <h3 className="text-2xl font-semibold">
                {reciever.firstName ? `${reciever.firstName} ${reciever.lastName}` : "Loading..."}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleChange}
                />
              </div>
              <button
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                onClick={initiateTransfer}
              >
                Initiate Transfer
              </button>
            </div>
            {info && <p className="text-green-500 mt-4">{info}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
