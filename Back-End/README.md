## Hướng dẫn cài đặt

# Tạo môi trường ảo

python -m venv myenv

# Kích hoạt môi trường ảo

# Windows

myenv\Scripts\activate

# macOS và Linux

source myenv/bin/activate

# Tải các tệp cài đặt

pip install -r requirements.txt

# Chạy ứng dụng

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
