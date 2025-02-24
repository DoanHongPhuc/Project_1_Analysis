import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import axios from "axios";
import { LinearProgress } from "@mui/material";
function CommentStudent() {
  const { role, user_email, std_email } = useAuth();
  const [comments, setComments] = useState<any>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getCommentData();
  }, []);
  const getCommentData = async () => {
    let url = "";
    if (std_email === null || std_email === undefined) {
      url = process.env.REACT_APP_API_KEY + `/comment/${user_email}`;
    } else {
      url = process.env.REACT_APP_API_KEY + `/comment/${std_email}`;
    }
    try {
      setLoading(true);
      const result = await axios.get(url);
      console.log(result);
      if (result.status !== 200) {
        toast.error(result.data.message);
      }
      if (result.status === 200) {
        setComments(
          result.data.comment_list.map((comment: any) => {
            return {
              avatar: comment.send_email.charAt(0),
              text: comment.comment_text,
              time: getFormatTime(comment.create_at),
            };
          })
        );
      }
      setLoading(false);
    } catch (e: any) {
      console.log(e);
      toast.error("Không lấy đữ liệu");
      setLoading(false);
    }
  };
  const getFormatTime = (time: string) => {
    const dateTime = new Date(time);

    const formattedDate = dateTime.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = dateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
  };
  const handleSendComment = async () => {
    const data = {
      comment_text: newComment,
      owner_email: std_email,
      send_email: user_email,
    };
    const url = process.env.REACT_APP_API_KEY + `/comment/create_new_comment`;
    try {
      const result = await axios.post(url, data);
      if (result.status === 200) {
        setNewComment("");
        await getCommentData();
        toast.success("Nhận xét thành công");
      }
    } catch (e) {
      console.log(e);
      toast.error("Tạo comment mới không thành công!!!");
    }
  };
  return (
    <div className="mt-[10px] px-[10px] mb-[10px]">
      <div className="bg-[#f0ebe8] border border-[#d4d4d4]">
        <p className="pdf_padding text-[22px] text-[#6b6b6b] text-center">
          Nhận xét của giáo viên
        </p>
      </div>
      <div className="border border-[#d4d4d4]">
        <div className="border border-[#d4d4d4] m-[10px] h-[300px] px-[10px] py-[8px] space-y-[6px] overflow-scroll">
          {isLoading && <LinearProgress />}
          {comments.map((comment: any, index: number) => {
            return (
              <div
                key={index}
                className="border border-[#d4d4d4] rounded p-[10px] w-full flex items-center"
              >
                <div className="bg-[#0099a6] w-[30px] h-[30px] rounded-[30px] flex justify-center items-center mr-[10px]">
                  <p className="text-white uppercase">{comment.avatar}</p>
                </div>
                <div className="border-l border-[#cac8c8b8] pl-[8px]">
                  <p>{comment.text}</p>
                  <p className="text-[10px] text-[#cac8c8b8]">{comment.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        {role === "2" && (
          <div className="flex items-center overflow-hidden mx-[10px] mb-[10px]">
            <input
              className="w-full px-[4px] py-[8px] border border-[#d9d9d9] border-r-[0px] rounded-l-md outline-none"
              type="text"
              placeholder="Nhập nhận xét của bạn"
              value={newComment}
              onChange={(e: any) => {
                setNewComment(e.target.value);
              }}
            />
            <button
              onClick={handleSendComment}
              className="px-[20px] py-[9.5px] bg-[#1677ff] text-white border border-[#1677ff] rounded-r-md hover:bg-[#4096ff] text-[14px]"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default CommentStudent;
