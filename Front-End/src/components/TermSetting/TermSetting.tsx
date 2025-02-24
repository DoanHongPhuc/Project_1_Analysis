import { Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import axios from "axios";

function TermSetting() {
  const [filename, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [typefile, setTypeFile] = useState(undefined);
  const [dataUpload, setData] = useState<any>(undefined);
  const [columns, setColumn] = useState<any>(undefined);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  useEffect(() => {
    if (typefile && dataUpload) {
      if (!checkDataFormat(dataUpload)) {
        toast.error("Định dạng không chính xác !!!");
        setIsUpdate(false);
      } else {
        setIsUpdate(true);
      }
    }
  }, [typefile, dataUpload]);
  const studentColumns: TableProps<any>["columns"] = [
    {
      title: "MSSV",
      dataIndex: "StudentID",
      key: "StudentID",
    },
    {
      title: "Họ và Tên",
      dataIndex: "studentname",
      key: "studentname",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "GVHD",
      dataIndex: "GVHD",
      key: "GVHD",
    },
    {
      title: "Kỳ học",
      dataIndex: "termid",
      key: "termid",
    },
  ];
  const teacherColumns: TableProps<any>["columns"] = [
    {
      title: "Mã giáo viên",
      dataIndex: "Teacher_id",
      key: "Problem_ID",
    },
    {
      title: "Tên bài tập",
      dataIndex: "Teacher_name",
      key: "Teacher_name",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
  ];
  const problemColumns: TableProps<any>["columns"] = [
    {
      title: "Mã bài tập",
      dataIndex: "Problem_ID",
      key: "Problem_ID",
    },
    {
      title: "Tên bài tập",
      dataIndex: "Problem_Name",
      key: "Problem_Name",
    },
    {
      title: "Điểm của bài tập",
      dataIndex: "Max_point",
      key: "Max_point",
    },
    {
      title: "Tuần học",
      dataIndex: "Week",
      key: "Week",
    },
  ];
  const clickUploadFile = () => {
    const fileInput = document.getElementById("file_input");
    fileInput?.click();
  };
  const onChangeFileUpload = (event: any) => {
    if (typefile) {
      const selectedFile: any = event.target.files[0];
      if (selectedFile) {
        const fileExtension = selectedFile.name.split(".").pop();
        if (fileExtension === "xlsx") {
          setFile(selectedFile);
          setFileName(selectedFile.name);
          const reader = new FileReader();
          reader.onload = (event: any) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setData(jsonData);
          };
          reader.readAsArrayBuffer(selectedFile);
        } else {
          setFile(null);
          setFileName("");
          toast.info("Hãy tải lên file excel.");
        }
      }
    } else {
      toast.info("Hãy chọn loại dữ liệu cập nhật");
    }
  };
  const onChangeTypeFile = (value: any) => {
    setTypeFile(value);
    if (value === "student") {
      setColumn(studentColumns);
    } else if (value === "teacher") {
      setColumn(teacherColumns);
    } else {
      setColumn(problemColumns);
    }
  };

  const exportDefaultFile = () => {
    let data: any = [];
    if (typefile === "student") {
      data = [
        {
          StudentID: "1",
          studentname: "Nguyen Van A",
          Email: "A.nv@gmail.com",
          GVHD: "Nguyen Van B",
          termid: "20311",
        },
      ];
    } else if (typefile === "teacher") {
      data = [
        {
          Teacher_id: "1",
          Teacher_name: "Nguyen Van A",
          Email: "A.nv@gmail.com",
        },
      ];
    } else {
      data = [
        {
          Problem_ID: "ABC",
          Problem_Name: "Bai tap",
          Max_point: "100",
          Week: "1",
          Index: "1",
        },
      ];
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "People");

    // Generate buffer
    XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    // Generate binary string
    XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Create a Blob object
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Function to handle Blob object
    function s2ab(s: any) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }

    // Create URL and download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expamle_data.xlsx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  };

  const checkDataFormat = (data: any) => {
    let requiredKeys: any = [];
    if (typefile === "student") {
      requiredKeys = ["StudentID", "studentname", "Email", "GVHD", "termid"];
    } else if (typefile === "teacher") {
      requiredKeys = ["Teacher_id", "Teacher_name", "Email"];
    } else {
      requiredKeys = [
        "Problem_ID",
        "Problem_Name",
        "Max_point",
        "Week",
        "Index",
      ];
    }

    return data.every((item: any) =>
      requiredKeys.every((key: any) => Object.hasOwnProperty.call(item, key))
    );
  };

  const handleUpdateTermData = async () => {
    if (file) {
      const url = process.env.REACT_APP_API_KEY + `/term_setting/` + typefile;
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success("Cập nhật dữ liệu thành công!");
        })
        .catch((error) => {
          toast.error("Cập nhật dữ liệu không thành công!");
        });
    }
  };
  return (
    <div className="w-full pt-[10px] px-[20px] pb-[0px] space-y-[10px]">
      <input
        type="file"
        className="hidden"
        id="file_input"
        onChange={onChangeFileUpload}
      />
      <div className=" flex items-center justify-center gap-[10px]">
        <Select
          onChange={onChangeTypeFile}
          value={typefile}
          className="h-[40px] flex-1 border-[#d9d9d9] "
        >
          <Select.Option value="student">Danh sách sinh viên</Select.Option>
          <Select.Option value="teacher">Danh sách giảng viên</Select.Option>
          <Select.Option value="problem">Danh sách bài tập</Select.Option>
        </Select>
        {isUpdate ? (
          <button
            onClick={handleUpdateTermData}
            className="rounded border-[1px] h-[40px] px-[20px] border-[#d9d9d9] bg-[#0086ff] hover:bg-[#007bff] text-white"
          >
            Cập nhật dữ liệu
          </button>
        ) : (
          <button className="rounded border-[1px] h-[40px] px-[20px] border-[#d9d9d9] bg-[#0086ff]  text-white opacity-40 cursor-default">
            Cập nhật dữ liệu
          </button>
        )}
      </div>
      <div className="flex items-center justify-center">
        <div className="flex-1 leading-[40px] pl-[10px] rounded-l-[4px] border-[#d9d9d9] border-[1px]">
          {filename ? (
            <p>{filename}</p>
          ) : (
            <p className="text-[#333] opacity-40">Chọn file dữ liệu cập nhật</p>
          )}
        </div>
        <button
          onClick={clickUploadFile}
          className="w-[160px] h-[42px] bg-gray-600 hover:bg-gray-700 rounded-r-[4px] border border-gray-600  text-white"
        >
          Tải file
        </button>
      </div>
      {typefile && file && (
        <div className=" border border-[#d9d9d9] space-y-[10px]">
          <div className="bg-[#f0ebe8] border border-[#d4d4d4]">
            <p className="pdf_padding text-[28px] text-[#6b6b6b] text-center">
              Xem trước dữ liệu cập nhật
            </p>
            <div className="pdf-display-block mb-[20px] hidden"></div>
          </div>
          <div className="flex items-center justify-end">
            <button
              className="py-[4px] px-[10px] rounded-md border border-[#d4d4d4]  bg-[#0086ff] hover:bg-[#007bff] text-white mr-[10px]"
              onClick={() => {
                exportDefaultFile();
              }}
            >
              File dữ liệu mẫu
            </button>
          </div>
          <Table columns={columns} dataSource={dataUpload} />
        </div>
      )}
    </div>
  );
}
export default TermSetting;
