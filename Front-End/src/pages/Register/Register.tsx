import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { LinearProgress } from "@mui/material";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    const registet_url = process.env.REACT_APP_API_KEY + "/user/register";
    const data = {
      email: email,
      password: "123456",
      role: role,
    };
    try {
      setLoading(true);
      const result: any = await axios.post(registet_url, data);
      if (result.status === 200) {
        sendEmail();
      }
    } catch (e: any) {
      toast.error(e.response.data.detail);
      console.log(e);
      setLoading(false);
    }
  };
  const options = [
    { label: "Sinh viên", value: 1 },
    { label: "Giáo viên", value: 2 },
  ];
  const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
    console.log("radio3 checked", value);
    setRole(value);
  };
  const sendEmail = () => {
    const serviceId = "service_ru4d9sp";
    const public_key = "DwrLWBYgEtpbvP4UN";
    const templateId = "template_y6i8xwb";
    const templateParams = {
      Subject: "Mật khẩu của bạn",
      to: "doanhongphuc0222@gmail.com",
      password: "123456",
      sendername: "Hệ thống tạo báo cáo tự động Project1",
      replyto: "",
    };
    emailjs
      .send(serviceId, templateId, templateParams, public_key)
      .then((response: any) => {
        toast.success("Tạo tài khoản thành công.");
        toast.success("Mật khẩu đã được gửi qua Mail.");
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  return (
    <div>
      {isLoading && <LinearProgress />}

      <div className="flex flex-col justify-center px-6 py-12 lg:px-8 min-h-full">
        <div>
          <div className="login_logo mx-auto flex items-center justify-center">
            <div
              className="login_logo_icon w-12 h-12 flex items-center justify-center rounded-xl mr-2"
              style={{ backgroundColor: "#dc4c3e" }}
            >
              <FontAwesomeIcon icon={faBook} className="text-3xl text-white" />
            </div>
            <p
              className="login_logo_text text-2xl font-bold"
              style={{ color: "#dc4c3e" }}
            >
              Báo cáo học tập
            </p>
          </div>
          <h2 className="font-bold text-center text-2xl mt-8 leading-9 text-gray-900 tracking-tight">
            Tạo tài khoản mới
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="post">
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium leading-6 text-gray-900"
              >
                Địa chỉ Email:
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="font-semibold outline-none block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Radio.Group
                options={options}
                onChange={onChange3}
                value={role}
                optionType="button"
              />
            </div>

            <div>
              <button
                onClick={(e: any) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                type="submit"
                className=" w-full rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                style={{ backgroundColor: "#dc4c3e" }}
              >
                Tạo tài khoản mới
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="w-full rounded-md bg-slate-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 mt-4"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
