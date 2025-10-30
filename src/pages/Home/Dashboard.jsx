import { useTheme } from '../../context/ThemeContext';
import Layout from '../../components/layout/Layout';

const Dashboard = () => {
  const { colors } = useTheme();

  const stats = [
    { label: 'Total Sales', value: '$32,096', change: '+12.5%', trend: 'up' },
    { label: 'Revenue', value: '$6,680', change: '+8.2%', trend: 'up' },
    { label: 'Orders', value: '1574', change: '+3.1%', trend: 'up' },
    { label: 'Growth', value: '75%', change: '+2.4%', trend: 'up' },
  ];

  return (
    <Layout>
    <div className="p-4"
    style={{
      background:colors.bgsoft
    }} >
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl p-5 shadow-sm"
              style={{ backgroundColor: colors.bg }}
            >
              <p className="text-xs mb-2" style={{ color: colors.text }}>
                {stat.label}
              </p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text }}>
                  {stat.value}
                </h3>
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    backgroundColor: `${colors.bgsoft}`,
                    color: colors.text2,
                  }}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Chart 1 */}
          <div
            className="rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: colors.bg }}
          >
            <h3 className="text-base md:text-lg font-semibold mb-4" style={{ color: colors.text }}>
              Revenue Over Time
            </h3>
            <div className="h-48 md:h-64 flex items-end justify-between space-x-1 md:space-x-2">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 70, 95].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg transition-all hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    backgroundColor: index % 2 === 0 ? colors.primary : colors.bgsoft,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Chart 2 */}
          <div
            className="rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: colors.bg }}
          >
            <h3 className="text-base md:text-lg font-semibold mb-4" style={{ color: colors.text }}>
              Top Products
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Product A', value: 85 },
                { name: 'Product B', value: 70 },
                { name: 'Product C', value: 60 },
                { name: 'Product D', value: 45 },
              ].map((product, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs md:text-sm" style={{ color: colors.text }}>
                      {product.name}
                    </span>
                    <span className="text-xs md:text-sm font-medium" style={{ color: colors.text }}>
                      {product.value}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${product.value}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;