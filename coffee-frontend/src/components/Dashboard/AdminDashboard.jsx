import React, { useState, useEffect } from "react";
import { LogOut, Users, UserPlus, ChevronLeft } from "lucide-react";

export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CHEF",
  });

  
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageFile: null,
  });

  const [editingItem, setEditingItem] = useState(null);

 
  const fetchMenuItems = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/menu/all");
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/staff");
      const data = await res.json();
      setStaff(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  
  useEffect(() => {
    fetchStaff();
    fetchMenuItems();
  }, []);

  
  useEffect(() => {
    if (view === "menuManagement") fetchMenuItems();
  }, [view]);

  
  const handleChangeMenu = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

 
  const handleNewImageFile = (e) => {
    const file = e.target.files && e.target.files[0];
    setNewItem(prev => ({ ...prev, imageFile: file }));
  };

  
  const handleAddMenu = async (e) => {
    e.preventDefault();

    try {
      
      const formDataToSend = new FormData();
      const menuItemPayload = {
        name: newItem.name,
        category: newItem.category,
        price: parseFloat(newItem.price) || 0,
        description: newItem.description
        
      };
          formDataToSend.append(
      "menuItem",
      new Blob([JSON.stringify(menuItemPayload)], { type: "application/json" })
    );
      if (newItem.imageFile) {
        formDataToSend.append('imageFile', newItem.imageFile);
      }

      const res = await fetch("http://localhost:8080/api/menu/add", {
        method: "POST",
        body: formDataToSend 
      });

      if (res.ok) {
        const saved = await res.json();
        alert("✅ Menu Item Added");
        setNewItem({ name: "", category: "", price: "", description: "", imageFile: null });
        fetchMenuItems();
      } else {
        const errorText = await res.text();
        alert(`❌ Failed to add item: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error connecting to server.");
    }
  };

  
  const handleEdit = (item) => {
    
    setEditingItem({ ...item, imageFile: null });
  };

  
  const handleEditFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setEditingItem(prev => ({ ...prev, imageFile: file }));
  };

  
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const id = editingItem.id;
      const formDataToSend = new FormData();
      const menuItemPayload = {
        name: editingItem.name,
        category: editingItem.category,
        price: parseFloat(editingItem.price) || 0,
        description: editingItem.description
      };
       formDataToSend.append(
      "menuItem",
      new Blob([JSON.stringify(menuItemPayload)], { type: "application/json" })
    );
      if (editingItem.imageFile) {
        formDataToSend.append('imageFile', editingItem.imageFile);
      }

      const res = await fetch(`http://localhost:8080/api/menu/update/${id}`, {
        method: "PUT",
        body: formDataToSend
      });

      if (res.ok) {
        const updated = await res.json();
        alert("✅ Item updated successfully");
        setEditingItem(null);
        fetchMenuItems();
      } else {
        const text = await res.text();
        alert("❌ Failed to update item: " + text);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error connecting to server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("✅ Item deleted successfully.");
        fetchMenuItems();
      } else {
        alert("❌ Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Error connecting to server.");
    }
  };

  // ------------------ Staff handlers 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`❌ Failed: ${data}`);
      } else {
        alert(`✅ Staff added: ${data.name}`);
        setFormData({ name: "", email: "", password: "", role: "CHEF" });
        fetchStaff();
        setView("dashboard");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Error adding staff");
    }
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  // ------------------ Orders management 
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (view === "ordersManagement") {
      fetchOrdersWithUsers();
    }
  }, [view]);

  const fetchOrdersWithUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      const ordersWithUsers = await Promise.all(
        data.map(async (order) => {
          try {
            const userRes = await fetch(`http://localhost:8080/api/users/${order.userId}`);
            if (!userRes.ok) throw new Error("User not found");
            const userData = await userRes.json();
            return { ...order, customerName: userData.name };
          } catch {
            return { ...order, customerName: "N/A" };
          }
        })
      );

      setOrders(ordersWithUsers);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  
  if (view === "dashboard") {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-gray-50/70">
        <Navbar onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold font-serif text-amber-900 mb-12">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <DashboardCard
                icon={<UserPlus className="w-12 h-12 text-amber-800" />}
                title="Add Staff"
                description="Add a new Chef or Waiter to the system"
                onClick={() => setView("addStaff")}
              />
              <DashboardCard
                icon={<Users className="w-12 h-12 text-amber-800" />}
                title="View Staff"
                description="See all chefs and waiters"
                onClick={() => setView("viewStaff")}
              />
              <DashboardCard
                icon={<Users className="w-12 h-12 text-amber-800" />}
                title="Menu Management"
                description="Add, edit, or remove menu items"
                onClick={() => setView("menuManagement")}
              />
              <DashboardCard
                icon={<Users className="w-12 h-12 text-amber-800" />}
                title="Orders Management"
                description="View and monitor all customer orders"
                onClick={() => setView("ordersManagement")}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Add Staff view
  if (view === "addStaff") {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border mt-12">
        <BackButton onClick={() => setView("dashboard")} />
        <h2 className="text-3xl font-bold font-serif text-amber-900 mb-8 text-center">Add Staff (Chef/Waiter)</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter staff name"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter email address"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select name="role" value={formData.role} onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-800 cursor-pointer">
              <option value="CHEF">Chef</option>
              <option value="WAITER">Waiter</option>
            </select>
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-lg font-medium text-white bg-amber-800 hover:bg-amber-900">
            Add Staff
          </button>
        </form>
      </div>
    );
  }

  // View Staff
  if (view === "viewStaff") {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border mt-12">
        <BackButton onClick={() => setView("dashboard")} />
        <h2 className="text-3xl font-bold font-serif text-amber-900 mb-8 text-center">Staff List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Menu Management view
  if (view === "menuManagement") {
    return (
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg border mt-12">
        <BackButton onClick={() => setView("dashboard")} />
        <h2 className="text-3xl font-bold font-serif text-amber-900 mb-8 text-center">Menu Management</h2>

        {/* Add Menu Item */}
        <form onSubmit={handleAddMenu} className="grid grid-cols-2 gap-4 mb-8">
          <input name="name" value={newItem.name} onChange={handleChangeMenu} placeholder="Item Name"
            className="border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:ring-amber-800 focus:border-amber-800" required />
          <input name="category" value={newItem.category} onChange={handleChangeMenu} placeholder="Category"
            className="border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:ring-amber-800 focus:border-amber-800" required />
          <input name="price" type="number" value={newItem.price} onChange={handleChangeMenu} placeholder="Price"
            className="border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:ring-amber-800 focus:border-amber-800" required />
          {/* FILE INPUT (replaces imageUrl text input) */}
          <input name="imageFile" type="file" accept="image/*" onChange={handleNewImageFile}
            className="border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:ring-amber-800 focus:border-amber-800" />
          <textarea name="description" value={newItem.description} onChange={handleChangeMenu} placeholder="Description"
            className="col-span-2 border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:ring-amber-800 focus:border-amber-800"></textarea>
          <button type="submit" className="col-span-2 bg-amber-800 text-white p-2 rounded hover:bg-amber-900">Add Menu Item</button>
        </form>

        {/* Menu Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-14 object-cover rounded" />
                    ) : (
                      <span className="text-gray-500 italic">No image</span>
                    )}
                  </td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">₹{item.price}</td>
                  <td className="border p-2 space-x-2">
                    <button onClick={() => handleEdit(item)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit Modal */}
          {editingItem && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-3">Edit Menu Item</h3>
                <form onSubmit={handleUpdateItem} className="space-y-3">
                  <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:ring-amber-500 focus:border-amber-500" />
                  <input type="text" value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:ring-amber-500 focus:border-amber-500" />
                  <textarea rows="3" value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:ring-amber-500 focus:border-amber-500" />
                  <input type="number" value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:ring-amber-500 focus:border-amber-500" />

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Current Image</label>
                    {editingItem.imageUrl ? (
                      <img src={editingItem.imageUrl} alt="current" className="w-28 h-20 object-cover rounded mb-2" />
                    ) : (
                      <div className="text-gray-500 italic mb-2">No image</div>
                    )}
                    <label className="block text-sm text-gray-600 mb-2">Replace Image (optional)</label>
                    <input type="file" accept="image/*" onChange={handleEditFileChange}
                      className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:ring-amber-500 focus:border-amber-500" />
                  </div>

                  <div className="flex justify-end space-x-2 mt-3">
                    <button type="button" onClick={() => setEditingItem(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Orders Management view
  if (view === "ordersManagement") {
    return (
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg border mt-12">
        <BackButton onClick={() => setView("dashboard")} />
        <h2 className="text-3xl font-bold font-serif text-amber-900 mb-8 text-center">Orders Management</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Table No</th>
                <th className="border p-2">Total Amount</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.customerName || "N/A"}</td>
                    <td className="border p-2">{order.tableNumber}</td>
                    <td className="border p-2">₹{order.totalAmount}</td>
                    <td className="border p-2">{order.status}</td>
                    <td className="border p-2 text-left">
                      {order.items && order.items.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {order.items.map((item, i) => (
                            <li key={i}>{item.menuItemName} x {item.quantity}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500 italic">No items</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

 
  return (
    <div className="max-w-xl mx-auto p-12 text-center text-red-600">
      <h1 className="text-3xl font-bold">404 View Not Found</h1>
      <p>The current view '{view}' does not have a defined rendering path.</p>
      <button onClick={() => setView("dashboard")} className="mt-4 text-amber-800 underline">Go to Dashboard</button>
    </div>
  );
}



function DashboardCard({ icon, title, description, onClick }) {
  return (
    <button onClick={onClick} className="bg-white p-8 rounded-xl shadow-lg border text-left hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-800 focus:ring-offset-2">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold font-serif text-amber-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </button>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center text-gray-600 hover:text-amber-900 mb-6 group transition-all duration-300">
      <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
      Back to Dashboard
    </button>
  );
}

function Navbar({ onLogout }) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-2xl font-bold text-amber-900">
          <UserPlus className="w-8 h-8" />
          <span className="font-serif">Admin Panel</span>
        </div>
        <button onClick={onLogout} className="flex items-center justify-center px-5 py-2.5 text-lg font-medium text-white bg-amber-800 rounded-lg shadow-md hover:bg-amber-900">
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>
    </nav>
  );
}
