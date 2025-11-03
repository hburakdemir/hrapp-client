// CandidateProfile.jsx
import { useState } from "react";
import { userAPI } from "../../api/modules/user";


const CandidateProfile = () => {
  const [formData, setFormData] = useState({
    phone: "",
    city: "",
    platform: "",
    cvUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  
  console.log("Form Data:", formData); // Debug
  
  try {
    console.log("API çağrısı yapılıyor..."); // Debug
    const response = await userAPI.updateCandidateProfile(formData);
    console.log("API Response:", response); // Debug
    
    setMessage(response.data.message);
    setFormData({
      phone: response.data.data.phone,
      city: response.data.data.city,
      platform: response.data.data.platform,
      cvUrl: response.data.data.cvUrl,
    });
  } catch (err) {
    console.error("Hata detayı:", err); // Daha detaylı log
    console.error("Response:", err.response); // API response'u
    setMessage(err.response?.data?.message || "Bir hata oluştu.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Profil Güncelle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Telefon</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Telefon numarası"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Şehir</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Şehir"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Platform</label>
          <input
            type="text"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Platform"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">CV URL</label>
          <input
            type="text"
            name="cvUrl"
            value={formData.cvUrl}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="CV linki"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Gönderiliyor..." : "Güncelle"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default CandidateProfile;
