import React, { useState } from "react";
import { authAPI } from "../../api/modules/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LockOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const { accessToken, user } = res.data.data; // refreshToken yok artık
      
      // AuthContext'in login fonksiyonunu kullan
      login({ accessToken, user }); // refreshToken cookie'de
      
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-xl w-96 flex flex-col gap-5"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Giriş Yap</h2>
        
        {/* EMAIL FIELD */}
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-gray-600 text-sm font-medium">
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

        {/* PASSWORD FIELD */}
        <div className="flex flex-col gap-2 relative">
          <span className="flex items-center gap-2 text-gray-600 text-sm font-medium">
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

        <p className="text-sm text-center text-gray-500">
          Hesabın yok mu?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Kayıt ol
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;