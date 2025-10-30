import React, { useState } from "react";
import { authAPI } from "../../api/modules/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: "", 
    surname: "", 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Kayıt başarısız");
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
        <h2 className="text-2xl font-semibold text-center mb-2">Kayıt Ol</h2>

        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <User size={16} />
            <span>Ad</span>
          </span>
          <Input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Adınız"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <User size={16} />
            <span>Soyad</span>
          </span>
          <Input
            name="surname"
            type="text"
            value={form.surname}
            onChange={handleChange}
            placeholder="Soyadınız"
          />
        </div>

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
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <Lock size={16} />
            <span>Şifre</span>
          </span>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Şifreniz"
          />
        </div>

        <Button
          text={loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          type="submit"
          disabled={loading}
        />

        <p className="text-sm text-center text-gray-500">
          Zaten hesabın var mı?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Giriş yap
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;