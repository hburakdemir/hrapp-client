import React, { useState } from "react";
import { authAPI } from "../../api/modules/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LockOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await authAPI.login(form);
    const { accessToken, user } = res.data.data;

    // login fonksiyonunu çalıştır
    login({ accessToken, user }); // refreshToken cookie'de

    // Candidate kullanıcıysa profil kontrolü yap
    if (user.role === "CANDIDATE") {
      // Backend’de candidate profili eksik mi kontrol eden endpoint
      const profileRes = await authAPI.getProfileStauts(); // GET /api/users/profile-status
      const { profileComplete } = profileRes.data.data;

      if (!profileComplete) {
        navigate("/profile"); // profil eksikse yönlendir
      } else {
        navigate("/"); // profil tamamsa anasayfa
      }
    } else {
      navigate("/"); // HR veya Admin ise direkt anasayfa
    }

  } catch (err) {
    toast.error(err.response?.data?.message || "Giriş başarısız");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundColor: colors.bg,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="shadow-lg p-6 rounded-xl w-96 flex flex-col gap-5"
        style={{
          backgroundColor: colors.bgsoft,
        }}
      >
        <h2
          className="text-2xl font-semibold text-center mb-2"
          style={{
            color: colors.text,
          }}
        >
          Giriş Yap
        </h2>

        <div className="flex flex-col gap-2">
          <span
            className="flex items-center gap-2  text-sm font-medium"
            style={{
              color: colors.text,
            }}
          >
            <Mail size={16} />
            <span>Email</span>
          </span>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email adresiniz"
            required
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <span
            className="flex items-center gap-2  text-sm font-medium"
            style={{
              color: colors.text,
            }}
          >
            <Lock size={16} />
            <span>Şifre</span>
          </span>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Şifreniz"
            className="pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <LockOpen size={20} /> : <Lock size={20} />}
          </button>
        </div>

        <Button
          text={loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          type="submit"
          disabled={loading}
        />

        <p className="text-sm text-center" style={{ color: colors.text }}>
          Hesabın yok mu?{" "}
          <span
            onClick={() => navigate("/register")}
            className=" cursor-pointer underline"
            style={{
              color: colors.primary,
            }}
          >
            Kayıt ol
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
