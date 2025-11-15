import React, { useEffect, useState } from 'react';
import { Coffee, LogOut, Utensils, CheckCircle, Table } from 'lucide-react';
import axios from 'axios';

export default function WaiterDashboard() {
  const [readyOrders, setReadyOrders] = useState([]);

  useEffect(() => {
    fetchReadyOrders();
  }, []);

  const fetchReadyOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders");
      const readyOrdersData = response.data.filter(order => order.status === "Ready to Serve");
      setReadyOrders(readyOrdersData);
    } catch (error) {
      console.error("Error fetching ready orders:", error);
    }
  };

  const markAsServed = async (orderId) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: "Served" });
      setReadyOrders(prev => prev.filter(order => order.id !== orderId));
      console.log(`Order ${orderId} marked as served.`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleLogout = () => {
    console.log("Waiter logged out");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50/70 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-2xl font-bold text-amber-900">
            <Coffee className="w-8 h-8" />
            <span className="font-serif">The Coffee Bean</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center px-6 py-2.5 text-lg font-medium text-white bg-amber-700 rounded-full shadow-md hover:bg-amber-800 transition duration-300"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 md:py-16">
        <div className="mb-14 flex items-center space-x-4">
          <Utensils className="w-16 h-16 text-amber-800" />
          <div>
            <h1 className="text-4xl font-extrabold font-serif text-amber-950 leading-tight">
              Waiter Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage ready orders and mark them as served.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 min-h-[550px]">
          <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
            <Utensils className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold font-serif text-gray-800 ml-3">
              Ready to Serve Orders
            </h2>
            <span className="ml-auto text-sm font-extrabold bg-amber-100 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center shadow-inner">
              {readyOrders.length}
            </span>
          </div>

          {/* Orders List */}
          <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
            {readyOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-6 italic text-sm">
                No ready orders available.
              </p>
            ) : (
              readyOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3 border-b pb-3 border-dashed border-gray-200">
                    <h3 className="text-base font-semibold text-amber-900">Order #{order.id}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-green-100 text-green-800 border-green-300">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Customer: {order.customerName}
                    </span>
                    <span className="flex items-center text-lg font-bold text-amber-800">
                      <Table className="w-5 h-5 mr-1" />
                      {order.tableNumber}
                    </span>
                  </div>

                  <div className="space-y-1 mb-4 border-t border-gray-100 pt-3">
                    {order.items &&
                      order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-gray-600 text-sm">
                          <span>{item.menuItemName}</span>
                          <span className="font-medium">x{item.quantity}</span>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => markAsServed(order.id)}
                    className="w-full flex items-center justify-center py-2 px-4 rounded-lg shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition duration-300"
                  >
                    Mark as Served
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-8 mt-auto shadow-inner-top">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-2 text-base">&copy; 2025 The Coffee Bean. All rights reserved.</p>
          <p className="text-sm text-amber-100">Crafted with passion, served with care.</p>
        </div>
      </footer>
    </div>
  );
}
