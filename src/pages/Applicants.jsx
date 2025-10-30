import { useTheme } from '../context/ThemeContext';
import Layout from '../components/layout/Layout';

const Applicants = () => {
  const { colors } = useTheme();

  return (
    <Layout>
      <div className="rounded-xl p-8 shadow-sm" style={{ backgroundColor: colors.bg }}>
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
          Customers Page
        </h2>
        <p className="mt-4" style={{ color: colors.textMuted }}>
          Müşteri listesi burada görüntülenecek.
        </p>
      </div>
    </Layout>
  );
};

export default Applicants;