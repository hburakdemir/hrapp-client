import React, { useEffect, useState } from 'react';
import { authAPI } from '../../../api/modules/auth';
import { useTheme } from '../../../context/ThemeContext';
import Layout from '../../../components/layout/Layout';

const MyApplications = () => {
  const [profileComplete, setProfileComplete] = useState(true); 
  const { colors } = useTheme();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const res = await authAPI.getProfileStatus(); 
        setProfileComplete(res.data.data.isProfileComplete); 
      } catch (err) {
        console.error(err);
      }
    };

    checkProfileStatus();
  }, []);

  if (!profileComplete) {
    return (
      <Layout>
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: colors.bg, color: colors.text }}
        >
        <p style={{ color: colors.primary, fontWeight: 'bold' }}>
          Profilinizi tamamlamanız gerekmektedir.
        </p>
      </div>
        </Layout>
    );
  }

  return (
    <div className="p-6" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <p>asd</p>
    </div>
  );
};

export default MyApplications;
