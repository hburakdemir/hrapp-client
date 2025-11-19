// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import Layout from "../../../components/layout/Layout";
import { adminAPI } from "../../../api/modules/admin";
import { userAPI } from "../../../api/modules/user";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [candidatesCount, setCandidatesCount] = useState(0);

  const [stats, setStats] = useState([
    { label: "Total Forms", value: 0 },
    { label: "Total Users", value: 0 },
    { label: "Orders", value: "—" },
    { label: "Growth", value: "—" },
  ]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Users fetch
        const usersRes = await adminAPI.getUsers();
        const fetchedUsers = Array.isArray(usersRes.data?.data?.users)
          ? usersRes.data.data.users
          : Array.isArray(usersRes.data?.users)
          ? usersRes.data.users
          : [];
        setUsers(fetchedUsers);

        // Candidates fetch
        const candRes = await userAPI.getAllCandidates();
        const candList = Array.isArray(candRes.data?.data)
          ? candRes.data.data
          : Array.isArray(candRes.data)
          ? candRes.data
          : [];
        
        setCandidatesCount(candList.length);

        // Stats güncelleme
        setStats((prev) =>
          prev.map((i) => {
            if (i.label === "Total Users")
              return { ...i, value: fetchedUsers.length };
            if (i.label === "Total Forms")
              return { ...i, value: candList.length };
            return i;
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Dashboard verileri yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const createdAtBuckets = useMemo(() => {
    const buckets = {
      last7Days: 0,
      last14Days: 0,
      last1Month: 0,
      last1Year: 0,
    };

    users?.forEach((u) => {
      if (!u.createdAt) return;
      const created = new Date(u.createdAt);
      const diffDays = (new Date() - created) / (1000 * 60 * 60 * 24);

      if (diffDays <= 7) buckets.last7Days++;
      if (diffDays <= 14) buckets.last14Days++;
      if (diffDays <= 30) buckets.last1Month++;
      if (diffDays <= 365) buckets.last1Year++;
    });

    return [
      { period: "7 gün", value: buckets.last7Days },
      { period: "14 gün", value: buckets.last14Days },
      { period: "1 ay", value: buckets.last1Month },
      { period: "1 yıl", value: buckets.last1Year },
    ];
  }, [users]);

  const roleData = useMemo(() => {
    // adminAPI'den gelen users'ları role'e göre say
    const roleCounts = users.reduce((acc, u) => {
      const r = (u.role || "").toUpperCase();
      if (r === "ADMIN" || r === "HR" || r === "CANDIDATE") {
        acc[r] = (acc[r] || 0) + 1;
      }
      return acc;
    }, {});

    // userAPI'den gelen candidates count'u UNKNOWN olarak ekle
    const roles = [
      { name: "Admin", value: roleCounts["ADMIN"] || 0 },
      { name: "İnsan Kaynakları", value: roleCounts["HR"] || 0 },
      { name: "Yarım Profil", value: roleCounts["CANDIDATE"] || 0 },
      { name: "Aday", value: candidatesCount } // userAPI'den gelen sayı
    ];
    
    return roles;
  }, [users, candidatesCount]);

  if (loading) {
    return (
      <Layout>
        <div className="p-5 text-center" style={{ color: colors.text }}>
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 min-h-screen " style={{ background: colors.bgsoft }}>
        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl p-5 shadow-sm"
              style={{ backgroundColor: colors.bg }}
            >
              <p className="text-xs mb-2" style={{ color: colors.text }}>
                {stat.label}
              </p>
              <h3
                className="text-2xl md:text-3xl font-bold"
                style={{ color: colors.text }}
              >
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* signup period chart */}
          <div
            className="rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: colors.bg }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              Yeni Üye Zaman Dağılımı
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={createdAtBuckets} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fill: colors.text }} />
                  <YAxis tick={{ fill: colors.text }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* role distribution */}
          <div
            className="rounded-xl p-5 shadow-sm "
            style={{ backgroundColor: colors.bg }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              Üye Dağılımı
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: colors.text }} />
                  <YAxis tick={{ fill: colors.text }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;