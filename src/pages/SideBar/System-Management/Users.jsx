import { useState, useEffect } from "react";
import { adminAPI } from "../../../api/modules/admin";
import Layout from "../../../components/layout/Layout";
import { useTheme } from "../../../context/ThemeContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "",
  });

  const [creating, setCreating] = useState(false);
  const { colors } = useTheme();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ search, sortBy, order });
      setUsers(data.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminAPI.createUser(newUser);
      setIsModalOpen(false);
      setNewUser({ name: "", surname: "", email: "", password: "", role: "" });
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminAPI.updateUser(editingUser.id, editingUser);
      setIsModalOpen(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;
    try {
      await adminAPI.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, sortBy, order]);

  return (
    <Layout>
      <div
        className="p-6 lg:p-12 min-h-screen relative"
        style={{ backgroundColor: colors.bg }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-xl lg:text-2xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Kullanıcı Yönetimi
          </h1>
          <p
            className="text-sm lg:text-base"
            style={{ color: colors.text }}
          >
            Sistem kullanıcılarını yönetin
          </p>
        </div>

        <div className="mb-6 space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                className="flex-1 border p-3 rounded-lg text-sm lg:text-base "
                style={{
                  backgroundColor: colors.bgsoft,
                  color: "black",
                  placeItems: colors.text,
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border p-3 rounded-lg text-sm lg:text-base min-w-0 flex-1 sm:flex-none sm:min-w-[120px]"
                  style={{
                    backgroundColor: colors.bgsoft,
                    color: colors.text,
                  }}
                >
                  <option value="name">İsim</option>
                  <option value="createdAt">Tarih</option>
                </select>

                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="border p-3 rounded-lg text-sm lg:text-base min-w-0 flex-1 sm:flex-none sm:min-w-[100px]"
                  style={{
                    backgroundColor: colors.bgsoft,
                    color: colors.text,
                  }}
                >
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </div>
            </div>

            <Button
              onClick={() => {
                setNewUser({
                  name: "",
                  surname: "",
                  email: "",
                  password: "",
                  role: "",
                });
                setEditingUser(null);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm lg:text-base"
              style={{ backgroundColor: colors.bgsoft, color: "black" }}
            >
              <Plus size={20} />
              <span className="">Yeni Kullanıcı</span>
            </Button>
          </div>
        </div>

        {/* Users Table/Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-lg" style={{ color: colors.text }}>
              Yükleniyor...
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="rounded-xl shadow-sm overflow-hidden"
              style={{
                backgroundColor:colors.bgsoft
              }}>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium"
                        style={{
                          color: colors.text,
                          backgroundColor: colors.bgsoft,
                        }}
                      >
                        İsim
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium"
                        style={{
                          color: colors.text,
                          backgroundColor: colors.bgsoft,
                        }}
                      >
                        Email
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium"
                        style={{
                          color: colors.text,
                          backgroundColor: colors.bgsoft,
                        }}
                      >
                        Rol
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium"
                        style={{
                          color: colors.text,
                          backgroundColor: colors.bgsoft,
                        }}
                      >
                        Kayıt Tarihi
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium"
                        style={{
                          color: colors.text,
                          backgroundColor: colors.bgsoft,
                        }}
                      >
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t transition-colors hover:bg-opacity-50"
                        style={{
                          borderColor: colors.bg,
                          color: colors.text,
                        }}
                      >
                        <td className="px-6 py-4 text-sm"
                        style={{
                          color:colors.text
                        }}>
                          {user.name} {user.surname}
                        </td>
                        <td className="px-6 py-4 text-sm"
                        style={{
                          color:colors.text
                        }}>{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className="px-2 py-1 rounded-full text-sm font-medium bg-red-900"
                            style={{
                              backgroundColor:colors.bg,
                              color: colors.primary,
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setIsModalOpen(true);
                              }}
                              className="p-2 rounded-l transition-colors"
                              title="Düzenle"
                            >
                              <Edit size={16} style={{color:colors.text}} />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 rounded-lg  transition-colors"
                              title="Sil"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* responsive */}
            <div className="lg:hidden space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-lg p-4 shadow-sm border"
                  style={{
                    backgroundColor: colors.bgsoft,
                    borderColor: colors.bgLight,
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3
                        className="font-semibold text-base"
                        style={{ color: colors.text }}
                      >
                        {user.name} {user.surname}
                      </h3>
                      <p
                        className="text-sm mt-1"
                        style={{ color: colors.textMuted }}
                      >
                        {user.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition-colors"
                      >
                        <Edit size={16} className="text-yellow-600" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary,
                      }}
                    >
                      {user.role}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: colors.textMuted }}
                    >
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* empty*/}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg mb-2" style={{ color: colors.textMuted }}>
              Henüz kullanıcı bulunmamaktadır
            </p>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              Yeni kullanıcı eklemek için yukarıdaki butonu kullanın
            </p>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: colors.bg }}
            >
              <div className="p-6">
                <h2
                  className="text-xl font-semibold mb-6 text-center"
                  style={{ color: colors.text }}
                >
                  {editingUser
                    ? "Kullanıcıyı Düzenle"
                    : "Yeni Kullanıcı Oluştur"}
                </h2>

                <form
                  onSubmit={editingUser ? updateUser : createUser}
                  className="space-y-4"
                >
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      İsim
                    </label>
                    <input
                      type="text"
                      className="w-full border p-3 rounded-lg text-sm"
                      style={{
                        borderColor: colors.primary,
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                      value={editingUser ? editingUser.name : newUser.name}
                      onChange={(e) =>
                        editingUser
                          ? setEditingUser({
                              ...editingUser,
                              name: e.target.value,
                            })
                          : setNewUser({ ...newUser, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Soyisim
                    </label>
                    <input
                      type="text"
                      className="w-full border p-3 rounded-lg text-sm"
                      style={{
                        borderColor: colors.primary,
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                      value={
                        editingUser ? editingUser.surname : newUser.surname
                      }
                      onChange={(e) =>
                        editingUser
                          ? setEditingUser({
                              ...editingUser,
                              surname: e.target.value,
                            })
                          : setNewUser({ ...newUser, surname: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border p-3 rounded-lg text-sm"
                      style={{
                        borderColor: colors.primary,
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                      value={editingUser ? editingUser.email : newUser.email}
                      onChange={(e) =>
                        editingUser
                          ? setEditingUser({
                              ...editingUser,
                              email: e.target.value,
                            })
                          : setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Şifre{" "}
                      
                    </label>
                    <input
                      type="password"
                      className="w-full border p-3 rounded-lg text-sm"
                     style={{
                        borderColor: colors.primary,
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                      value={
                        editingUser
                          ? editingUser.password || ""
                          : newUser.password
                      }
                      onChange={(e) =>
                        editingUser
                          ? setEditingUser({
                              ...editingUser,
                              password: e.target.value,
                            })
                          : setNewUser({ ...newUser, password: e.target.value })
                      }
                      required={!editingUser}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text}}
                    >
                      Rol
                    </label>
                    <select
                      value={
                        editingUser ? editingUser.role : newUser.role || ""
                      }
                      onChange={(e) =>
                        editingUser
                          ? setEditingUser({
                              ...editingUser,
                              role: e.target.value,
                            })
                          : setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg text-sm"
                     style={{
                        borderColor: colors.primary,
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                      required
                    >
                      <option value="">Rol Seçin</option>
                      <option value="CANDIDATE">Aday</option>
                      <option value="HR">İK</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingUser(null);
                      }}
                      className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: colors.bgsoft,
                        color: colors.text,
                      }}
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {creating
                        ? editingUser
                          ? "Güncelleniyor..."
                          : "Oluşturuluyor..."
                        : editingUser
                        ? "Güncelle"
                        : "Oluştur"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
