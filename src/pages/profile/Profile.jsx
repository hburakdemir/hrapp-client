import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { candidateAPI } from "../../api/modules/candidate";
import Layout from '../../components/layout/Layout';
import { useTheme } from "../../context/ThemeContext";

const CandidateProfile = () => {
  const [formData, setFormData] = useState({
    phone: "",
    city: "",
    platform: "",
    cvUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { colors } = useTheme();
  const navigate = useNavigate();

  // Profil bilgilerini fetch et ve formu doldur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await candidateAPI.profile();
        const data = response.data.data;
        setFormData({
          phone: data.phone || "",
          city: data.city || "",
          platform: data.platform || "",
          cvUrl: data.cvUrl || "",
        });
      } catch (err) {
        console.error("Profil fetch hatası:", err);
        setMessage("Profil bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await candidateAPI.updateProfile(formData);
      setMessage(response.data.message);

      const hasMissing = Object.values(formData).some(val => !val);
      navigate(hasMissing ? "/profile" : "/");
    } catch (err) {
      console.error("Profil güncelleme hatası:", err);
      setMessage(err.response?.data?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div
        className="flex flex-col justify-center items-center min-h-screen p-4"
        style={{ backgroundColor: colors.bgsoft }}
      >
          <h2
            className=" text-3xl font-bold mb-6 text-center"
            style={{ color: colors.primary }}
            >
           İş Başvurunuzu Tamamlamak İçin Lütfen Profilinizi Tamamlayın
          </h2>

        <div
          className="w-full max-w-lg rounded-2xl shadow-lg p-8"
          style={{ backgroundColor: colors.bg }}
        >

          <form onSubmit={handleSubmit} className="space-y-5">
            {["phone", "city", "platform", "cvUrl"].map((field) => (
              <div key={field}>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: colors.text }}
                >
                  {field === "cvUrl" ? "CV URL" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.bgsoft,
                    color: colors.text,
                    border: `1px solid ${colors.primary}`,
                  }}
                  placeholder={field === "cvUrl" ? "CV linki" : field}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold transition-transform transform hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: colors.bg,
              }}
              disabled={loading}
            >
              {loading ? "Gönderiliyor..." : "Güncelle"}
            </button>
          </form>

          {message && (
            <p
              className="mt-4 text-center font-medium"
              style={{ color: colors.primary }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CandidateProfile;
