import { useNavigate } from "react-router-dom";
import { BottomWarning } from "./Components/BottomWarning";
import { Button } from "./Components/Button";
import { Heading } from "./Components/Heading";
import { InputBox } from "./Components/InputBox";
import { SubHeading } from "./Components/SubHeading";
import { useState } from "react";
import axios from "axios";

function Signin() {
  const navigate = useNavigate();

  const [info, setInfo] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const submit = () => {
    if (!formData.username || !formData.password) {
      setInfo("All fields are required");
      return;
    }

    setInfo("");
    axios
      .post("http://localhost:3000/api/v1/user/signin", formData)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          // Navigate to dashboard or home page
          navigate("/dashboard");
        } else if (response.data.message) {
          setInfo(response.data.message);
        }
      })
      .catch((error) => {
        setInfo(
          error.response?.data?.message || "Something went wrong. Please try again."
        );
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            placeholder="john@gmail.com"
            label={"Email"}
            value={formData.username}
            name="username"
            onChange={handleChange}
          />
          <InputBox
            placeholder="123456"
            label={"Password"}
            value={formData.password}
            name="password"
            onChange={handleChange}
          />
          {info && (
            <div className="text-red-500 text-sm mt-2">
              {info}
            </div>
          )}
          <div className="pt-4">
            <Button label={"Sign in"} onClick={submit} />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/sign-up"}
          />
        </div>
      </div>
    </div>
  );
}

export default Signin;
