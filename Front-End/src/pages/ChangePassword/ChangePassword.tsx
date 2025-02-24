import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

function ChangePassword() {
  const [isErrorr, setError] = useState(false);
  const [currentPW, setCurrentPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  const { user_email } = useAuth();
  const checkNewPassword = () => {
    if (newPW === confirmPW) {
      setError(false);
    } else {
      setError(true);
    }
  };
  useEffect(() => {
    checkNewPassword();
  }, [newPW, confirmPW]);
  const handleChangePW = async () => {
    const url = process.env.REACT_APP_API_KEY + `/user/changepw`;
    const data = {
      email: user_email,
      current_password: currentPW,
      new_password: newPW,
    };
    try {
      const result = await axios.post(url, data);
      if (result.status !== 200) {
        toast.error(result.data.message);
      }
      if (result.status === 200) {
        toast.success("Thay đổi mật khẩu thành công !!!");
      }
    } catch (e) {
      toast.error("Thay đổi mật khẩu không thành công !!!");
      console.log(e);
    }
  };
  return (
    <div className="bg-[#d6d4d4] h-full w-full flex items-center justify-center">
      <div className="m-[8px] rounded-[8px] bg-white w-[800px] h-[500px]">
        <div className="p-[10px] px-[20px]">
          <div className="mt-[20px]">
            <p className="text-[26px] font-semibold mb-[8px]">Đổi mật khẩu</p>
            <div className="border-b-[2px]"></div>
          </div>
          <div className="leading-[40px] text-[#f34949]">
            {!isErrorr ? "" : "Mật khẩu không trùng khớp"}
          </div>
          <div className="mt-[20px] space-y-[20px]">
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  Mật khẩu hiện tại của bạn
                </label>
              </div>
              <div className="mt-2">
                <input
                  value={currentPW}
                  onChange={(e: any) => {
                    setCurrentPW(e.target.value);
                  }}
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="font-semibold outline-none w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  Mật khẩu mới của bạn
                </label>
              </div>
              <div className="mt-2">
                <input
                  value={newPW}
                  onChange={(e: any) => {
                    setNewPW(e.target.value);
                  }}
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="font-semibold outline-none w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  Xác nhận lại mật khẩu mới
                </label>
              </div>
              <div className="mt-2">
                <input
                  value={confirmPW}
                  onChange={(e: any) => {
                    setConfirmPW(e.target.value);
                  }}
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="font-semibold outline-none w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center w-full h-full  mt-[40px]">
            <button
              onClick={handleChangePW}
              className="w-[500px] h-[40px] rounded-[8px] border bg-[#dc4c3e] text-[#fff] hover:bg-[#ed6256]"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChangePassword;
