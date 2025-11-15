import React, { useState, useEffect } from "react";
import { ChefHat, ClipboardList, UtensilsCrossed, Clock, BellRing } from "lucide-react";

function ChefDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

 
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert(`✅ Order ${orderId} updated to "${newStatus}"`);
        fetchOrders(); // refresh data
      } else {
        alert("❌ Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  
  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const inProgressOrders = orders.filter((order) => order.status === "In Preparation");

 
  const startPreparation = (id) => updateOrderStatus(id, "In Preparation");
  const markAsReady = (id) => updateOrderStatus(id, "Ready to Serve");

  return (
    <div className="max-w-7xl mx-auto">
      
      <div className="mb-14 flex items-center space-x-5">
        <ChefHat className="w-20 h-20 text-amber-800 animate-bounce-slow" />
        <div>
          <h1 className="text-6xl font-extrabold font-serif text-amber-950 leading-tight mb-2">
            Chef's Station
          </h1>
          <p className="text-xl text-gray-700">
            Real-time order insights. Keep the coffee flowing!
          </p>
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         
          <OrderColumn
            icon={<ClipboardList className="w-9 h-9 text-red-600" />}
            title="New Orders"
            count={pendingOrders.length}
            orders={pendingOrders}
            onAction={startPreparation}
            actionLabel="Start Prep"
            actionIcon={<UtensilsCrossed className="w-5 h-5 ml-2" />}
            actionColor="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
          />

          {/* In Progress */}
          <OrderColumn
            icon={<Clock className="w-9 h-9 text-blue-600" />}
            title="In Progress"
            count={inProgressOrders.length}
            orders={inProgressOrders}
            onAction={markAsReady}
            actionLabel="Ready for Serve"
            actionIcon={<BellRing className="w-5 h-5 ml-2" />}
            actionColor="bg-green-600 hover:bg-green-700 focus:ring-green-500"
          />
        </div>
      )}
    </div>
  );
}

export default ChefDashboard;


function OrderColumn({
  icon,
  title,
  count,
  orders,
  onAction,
  actionLabel,
  actionIcon,
  actionColor,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-t-8 border-amber-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl font-bold text-amber-950 font-serif">{title}</h2>
        </div>
        <span className="text-lg bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-medium">
          {count}
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAction={onAction}
              actionLabel={actionLabel}
              actionIcon={actionIcon}
              actionColor={actionColor}
            />
          ))
        ) : (
          <p className="text-gray-500 italic text-center py-6">No orders found</p>
        )}
      </div>
    </div>
  );
}

// Individual Order Card
function OrderCard({ order, onAction, actionLabel, actionIcon, actionColor }) {
  return (
    <div className="bg-amber-50 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-amber-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-amber-900 font-serif">
          Order #{order.id}
        </h3>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            order.status === "Pending"
              ? "bg-red-100 text-red-800"
              : order.status === "In Preparation"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {order.status}
        </span>
      </div>
      <p className="text-gray-700 mb-2">Table: {order.tableNumber}</p>
      <p className="text-gray-700 mb-2">Customer: {order.customerName || "N/A"}</p>

      <ul className="text-sm text-gray-600 list-disc list-inside mb-4">
        {order.items && order.items.length > 0 ? (
          order.items.map((item, i) => (
            <li key={i}>
              {item.menuItemName} × {item.quantity}
            </li>
          ))
        ) : (
          <li className="italic text-gray-400">No items listed</li>
        )}
      </ul>

      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-amber-900">
          ₹{order.totalAmount || 0}
        </p>
        <button
          onClick={() => onAction(order.id)}
          className={`flex items-center text-white px-4 py-2 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${actionColor}`}
        >
          {actionLabel}
          {actionIcon}
        </button>
      </div>
    </div>
  );
}
