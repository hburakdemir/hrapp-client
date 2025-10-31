import React, { useState } from "react";
import { authAPI } from "../../api/modules/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/layout/Navbar";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Kayıt başarısız");
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
          Kayıt Ol
        </h2>

        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2text-sm font-medium"
           style={{
             color: colors.text,
            }}>
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
          <span className="flex items-center gap-2 text-sm font-medium"
           style={{
             color: colors.text,
            }}>
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
          <span className="flex items-center gap-2  text-sm font-medium"
           style={{
             color: colors.text,
            }}>
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
          <span className="flex items-center gap-2 text-sm font-medium"
           style={{
             color: colors.text,
            }}>
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

        <p className="text-sm text-center"
         style={{
           color: colors.text,
          }}>
          Zaten hesabın var mı?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer underline"
            style={{
              color: colors.primary
            }}
            >
            Giriş yap
          </span>
        </p>
      </form>
    </div>
           
  );
};

export default Register;
