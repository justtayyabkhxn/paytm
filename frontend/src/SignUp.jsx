import { BottomWarning } from "./Components/BottomWarning";
import { Button } from "./Components/Button";
import { Heading } from "./Components/Heading";
import { InputBox } from "./Components/InputBox";
import { SubHeading } from "./Components/SubHeading";
import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Inside the component

function Signup() {
  const navigate = useNavigate();

  const [info, setInfo] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const submit = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.password
    ) {
      setInfo("All fields are required");
      return;
    }
  
    setInfo("");
    axios
      .post("http://localhost:3000/api/v1/user/signup", formData)
      .then((response) => {
        if (response.data.token) {
          navigate("/sign-in");
        } else if (response.data.message) {
          setInfo(response.data.message);
        }
      })
      .catch((error) => {
        console.log(
          "Error Occurred: ",
          error.response?.data?.message || error.message
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
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            placeholder="John"
            label={"First Name"}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <InputBox
            placeholder="Doe"
            label={"Last Name"}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <InputBox
            placeholder="john@gmail.com"
            label={"Email"}
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <InputBox
            placeholder="123456"
            label={"Password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="pt-4">
            <Button label={"Sign up"} onClick={submit} />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/sign-in"}
          />
          {info && <div className="text-red-500 text-sm mt-2">{info}</div>}

        </div>
      </div>
    </div>
  );
}

export default Signup;
