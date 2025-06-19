from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from werkzeug.utils import secure_filename
import traceback
import datetime
import jwt
import base64
from diagnose.model.malaria.predict import predict_image

app = Flask(__name__)
SECRET_KEY = "skylanxcode"
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def index():
  return jsonify({"succes": "beckend is running"}), 200

@app.route("/predict", methods=["POST"])
def predict():
  print("Request method:", request.method)
  print("Request content type:", request.content_type)
  print("Request json:", request.json)

  if not request.is_json:
    return jsonify({"error": "Content-Type harus application/json"}), 400

  data = request.get_json()
  if not data or "image" not in data:
    return jsonify({"error": "Field 'image' tidak ditemukan dalam JSON"}), 400

  base64_image = data["image"]

  # cek base64_image apakah ada header "data:image/png;base64,"? Kalau ada, hapus dulu
  if base64_image.startswith("data:image"):
    base64_image = base64_image.split(",")[1]

  try:
    # decode base64 ke bytes
    image_data = base64.b64decode(base64_image)
  except Exception as e:
    return jsonify({"error": "Gagal decode base64", "details": str(e)}), 400

  # buat filename unik + extension
  filename = f"{uuid.uuid4().hex}.png"
  filepath = os.path.join(UPLOAD_FOLDER, secure_filename(filename))

  try:
    # simpan bytes ke file
    with open(filepath, "wb") as f:
      f.write(image_data)

    print(f"Gambar berhasil disimpan di {filepath}")

    # panggil fungsi prediksi dengan path file
    result = predict_image(filepath)
    print(f"ini daya print {result}")
    

    return jsonify(result)

  except Exception as e:
    print(f"Terjadi kesalahan saat prediksi: {traceback.format_exc()}")
    return jsonify({"error": "Terjadi kesalahan saat memproses gambar", "details": str(e)}), 500

  finally:
    if os.path.exists(filepath):
      os.remove(filepath)
      print(f"File sementara {filepath} telah dihapus")

@app.route("/users", methods=["GET"])
def get_users():
  from services.firebase.utils.firestore import get_all_users
  try:
    users = get_all_users()
    return jsonify(users), 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500

@app.route("/register", methods=["POST"])
def register():
    from services.firebase.utils.firestore import register_user
    
    try:
        data = request.json
        required_fields = ["nama", "email", "no_telp", "password", "alamat", "tanggal_lahir"]
        if not all(field in data for field in required_fields):
            return jsonify({"status": "error", "message": "Data yang dikirim tidak lengkap"}), 400

        return register_user(data)

    except Exception as e:
        
        print(f"Error during registration endpoint: {e}")
        return jsonify({
            "status": "error",
            "message": "Terjadi kesalahan internal pada server.",
            "details": str(e)
        }), 500
        
@app.route("/login", methods=["POST"])
def login():
  from services.firebase.utils.firestore import login_user
  data = request.get_json()
  email = data.get("email", "").strip().lower()
  password = data.get("password", "")

  if not email or not password:
    return jsonify({
      "users": None,
      "status": "error",
      "message": "Email dan password wajib diisi."
    }), 400

  user = login_user(email, password) 

  if user:
    payload = {
      "user_id": user.get("id"),
      "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return jsonify({
      "users": user,
      "status": "success",
      "message": f"Login berhasil! Selamat datang {user.get('nama', '')}",
      "token": token
    }), 200

  else:
    return jsonify({
      "users": None,
      "status": "error",
      "message": "Email atau password salah!"
    }), 401
    

@app.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
  from services.firebase.utils.firestore import get_user_by_id
  result = get_user_by_id(user_id)

  if not result["success"]:
    return jsonify(result), 404

  return jsonify(result), 200

@app.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
  from services.firebase.utils.firestore import update_user_by_id

  data = request.get_json()

  try:
    result = update_user_by_id(user_id, data)

    if not result["success"]:
      return jsonify(result), 404

    return jsonify(result), 200

  except Exception as e:
    print("Update error:", e)
    return jsonify({
      "success": False,
      "message": "Gagal update profil",
      "data": None,
      "details": str(e)
    }), 500


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000, debug=True)