import React, { useState, useEffect } from 'react';
import {
    Coffee, Home, Menu, ShoppingCart, ScrollText, CalendarDays, User, LogOut,
    Search, ChevronDown, CheckCircle, Package, Heart, Award, MapPin, Edit,
    FileText, Loader, Plus, Minus, Trash2, X, Clock, Layers, Shield,
    MenuIcon, ArrowDown,CreditCard,ChevronRight,Mail, 
    Phone 
} from 'lucide-react';


const welcomeBackBg = 'https://plus.unsplash.com/premium_photo-1682092528374-87a10d6c92ac?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170';
const reserveTableBg = "https://images.unsplash.com/photo-1612192527395-06b72da6b35a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170";
const discoverMenuBg = 'https://plus.unsplash.com/premium_photo-1670445287612-d6fed960c910?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687';


const menuCoffeeImage = 'https://images.unsplash.com/photo-1514438341640-c30953a96860?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const teaImage = 'https://images.unsplash.com/photo-1583099230588-4c8e77a28e83?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const croissantImage = 'https://images.unsplash.com/photo-1565292850-d4638a16538b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const muffinImage = 'https://images.unsplash.com/photo-1563811802951-40ac7c8c3608?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';



const API_BASE_URL = 'http://localhost:8080/api/menu';


function SectionTitle({ title, subtitle }) {
    return (
        <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#5C4033]">{title}</h2>
            <p className="text-gray-500">{subtitle}</p>
        </div>
    );
}

// --- MAIN APPLICATION COMPONENT ---
const CustomerDashboard = () => {
    
    const [activeSection, setActiveSection] = useState('Home');
    const [cart, setCart] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const Mail = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7L12 13 2 7" /><rect x="2" y="4" width="20" height="16" rx="2" ry="2" /></svg>;
    const Phone = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
   
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; 
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 3000);
    };

    const navItems = [
        { name: 'Food Menu', icon: Menu, page: 'Menu' },
        { name: 'Cart', icon: ShoppingCart, page: 'Cart' }, 
        { name: 'My Orders', icon: ScrollText, page: 'My Orders' },
        { name: 'Book Table', icon: CalendarDays, page: 'Book Table' },
        { name: 'Profile', icon: User, page: 'Profile' },
        { name: 'Report/Feedback', icon: FileText, page: 'Report' }, 
    ];

    
    
    const renderMainContent = () => {
        switch (activeSection) {
            case 'Home':
                return (
                    <HomeView setActiveSection={setActiveSection} />
                );
            case 'Menu':
                return (
                    <MenuScreen cart={cart} setCart={setCart} showToast={showToast} setActiveSection={setActiveSection} />
                );
            case 'Cart':
                
                return (
                    <PaymentScreen navigate={setActiveSection} cart={cart} setCart={setCart} subtotal={subtotal} taxes={0} total={total} showToast={showToast} />
                );
            case 'My Orders':
                return (
                    <OrdersScreen />
                );
            case 'Book Table':
                return (
                    <BookingScreen showToast={showToast} />
                );
            case 'Profile':
                return (
                    <ProfileScreen showToast={showToast} />
                );
            case 'Report':
                return (
                    <ReportFeedbackScreen showToast={showToast} setActiveSection={setActiveSection} />
                );
            default:
                return <HomeView setActiveSection={setActiveSection} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8F5F0]">
            {/* Sidebar */}
            <aside className={`bg-[#5C4033] text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-lg transition-all duration-300 ease-in-out
                            ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <div className="flex items-center space-x-3">
                            <Coffee className="w-8 h-8 text-[#D4AF37]" />
                            <h1 className="text-xl font-bold">The Coffee Bean</h1>
                        </div>
                    ) : (
                        <Coffee className="w-8 h-8 text-[#D4AF37] mx-auto" />
                    )}
                    <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-[#7A604D] hidden md:block">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-grow p-4">
                    <ul>
                        {/* Home button */}
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveSection('Home')}
                                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200
                                        ${activeSection === 'Home' ? 'bg-[#8B5A2B] text-white shadow-md' : 'hover:bg-[#7A604D] text-gray-200'}`}
                            >
                                <Home className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span>Dashboard</span>}
                            </button>
                        </li>

                        {navItems.map((item) => (
                            <li key={item.name} className="mb-2">
                                <button
                                    onClick={() => setActiveSection(item.page)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200
                                        ${activeSection === item.page ? 'bg-[#8B5A2B] text-white shadow-md' : 'hover:bg-[#7A604D] text-gray-200'}`}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-300 hover:bg-[#7A604D] transition-colors duration-200">
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-grow bg-[#F8F5F0] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {renderMainContent()}
            </main>

           
            <ToastNotification toast={toast} />
        </div>
    );
};



function HomeView({ setActiveSection }) {
    return (
        <div className="p-8 pb-16 min-h-screen space-y-12">

            
            <div className="relative bg-[#5C4033] rounded-xl shadow-lg overflow-hidden h-96 flex items-center p-10 md:p-16">
                
                <img
                    src={welcomeBackBg}
                    alt="Welcome staff background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-10 text-white text-left max-w-xl">
                    <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-lg opacity-90">
                        Your favorite coffee experience is just a click away. Explore our menu, book a table, or track your orders.
                    </p>
                    <div className="flex space-x-4 mt-8">
                        <button
                            onClick={() => setActiveSection('Menu')}
                            className="bg-[#D4AF37] text-[#5C4033] px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#EBDD79] transition-colors duration-200 shadow-md"
                        >
                            <span>Explore Menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </button>
                        <button
                            onClick={() => setActiveSection('Book Table')}
                            className="bg-white text-[#5C4033] px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                            Book a Table
                        </button>
                    </div>
                </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-xl shadow-md text-center transition-transform duration-300 hover:scale-[1.03]">
                    <CalendarDays className="w-10 h-10 text-[#8B5A2B] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#5C4033] mb-2">Easy Reservation</h3>
                    <p className="text-gray-600">Book your favorite time and spot effortlessly.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center transition-transform duration-300 hover:scale-[1.03]">
                    <Coffee className="w-10 h-10 text-[#8B5A2B] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#5C4033] mb-2">Premium Selection</h3>
                    <p className="text-gray-600">Handcrafted beverages and delicious pastries.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center transition-transform duration-300 hover:scale-[1.03]">
                    <Award className="w-10 h-10 text-[#8B5A2B] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#5C4033] mb-2">Loyalty Rewards</h3>
                    <p className="text-gray-600">Earn points with every purchase and get exclusive offers.</p>
                </div>
            </div>

            {/* --- 2.  Reserve Your Spot--- */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-12">
                
                <div className="md:w-1/2 flex justify-center order-1 md:pr-8 mb-8 md:mb-0">
                    <img
                        src={reserveTableBg}
                        alt="Reserved table setting"
                        className="rounded-lg shadow-xl w-full max-w-md transition-transform duration-500 hover:scale-[1.05]"
                    />
                </div>

               
                <div className="md:w-1/2 text-center md:text-left order-2 md:pl-8">
                    <div className="inline-flex items-center space-x-2 text-[#8B5A2B] bg-amber-50 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <CalendarDays className="w-4 h-4" />
                        <span>Table Reservation</span>
                    </div>
                    <h2 className="text-4xl font-bold text-[#5C4033] mb-4">Reserve Your Perfect Spot</h2>
                    <p className="text-gray-600 mb-6">
                        Whether you're planning a cozy coffee date, a business meeting, or gathering with friends, we've got the perfect table waiting for you. Book in advance and skip the wait.
                    </p>
                    <ul className="text-gray-700 space-y-2 mb-8 list-none md:list-disc md:list-inside ml-4">
                        <li>Choose your preferred time slot</li>
                        <li>Select number of guests</li>
                        <li>Add special requests or preferences</li>
                    </ul>
                    <button
                        onClick={() => setActiveSection('Book Table')}
                        className="bg-[#8B5A2B] text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#A06D3E] transition-colors duration-200 mx-auto md:mx-0 shadow-md"
                    >
                        <span>Book a Table Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-12 mt-16">

                
                <div className="md:w-1/2 text-center md:text-left order-2 md:order-1 md:pr-8 mb-8 md:mb-0">
                    <div className="inline-flex items-center space-x-2 text-[#8B5A2B] bg-amber-50 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Menu className="w-4 h-4" />
                        <span>Our Menu</span>
                    </div>
                    <h2 className="text-4xl font-bold text-[#5C4033] mb-4">Discover Our Coffee Collection</h2>
                    <p className="text-gray-600 mb-6">
                        From bold espressos to refreshing iced coffees, explore our carefully curated menu of handcrafted beverages and delicious pastries. Every item is made with premium ingredients and lots of love.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#F8F5F0] p-4 rounded-lg">
                            <h4 className="font-semibold text-[#5C4033]">Hot Coffee</h4>
                            <p className="text-sm text-gray-500">Classic favorites</p>
                        </div>
                        <div className="bg-[#F8F5F0] p-4 rounded-lg">
                            <h4 className="font-semibold text-[#5C4033]">Iced Drinks</h4>
                            <p className="text-sm text-gray-500">Cool refreshments</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveSection('Menu')}
                        className="bg-[#8B5A2B] text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#A06D3E] transition-colors duration-200 mx-auto md:mx-0 shadow-md"
                    >
                        <span>Explore Full Menu</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>

                
                <div className="md:w-1/2 flex justify-center order-1 md:order-2 md:pl-8">
                    <img
                        src={discoverMenuBg}
                        alt="Coffee Menu Board"
                        className="rounded-lg shadow-xl w-full max-w-md transition-transform duration-500 hover:scale-[1.05]"
                    />
                </div>
            </div>
        </div>
    );
}

// --- 1. MENU SCREEN 
function MenuScreen({ cart, setCart, showToast, setActiveSection }) {
    const [selectedCategory, setSelectedCategory] = useState('Hot Coffee');
    const [searchQuery, setSearchQuery] = useState('');
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            setError(null);
            
            
            const response = await fetch(`http://localhost:8080/api/menu/all`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            
            const data = await response.json();
            
            
            const groupedItems = data.reduce((acc, item) => {
                const category = item.category || 'Other';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    image: item.imageUrl, 
                    category: item.category
                });
                return acc;
            }, {});
            
            setMenuItems(groupedItems);
            
            
            const categories = Object.keys(groupedItems);
            if (categories.length > 0 && !groupedItems[selectedCategory]) {
                setSelectedCategory(categories[0]);
            }
            
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setError(err.message);
            showToast('Failed to load menu items', 'error');
        } finally {
            setLoading(false);
        }
    };

    const categories = Object.keys(menuItems);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        showToast(`✅ ${item.name} added to cart!`, 'success');
    };

    
    const filteredItems = menuItems[selectedCategory]?.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#5C4033] mb-2">Explore Our Menu</h2>
                <p className="text-gray-600 mb-8">Discover our handcrafted coffee and delicious treats</p>

                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for coffee, tea, or pastries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-gray-800"
                        />
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((cat, index) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                    ${selectedCategory === cat ? 'bg-[#8B5A2B] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                    transition-colors duration-200`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <Loader className="w-12 h-12 animate-spin text-[#8B5A2B] mx-auto mb-4" />
                            <p className="text-gray-600">Loading menu items...</p>
                        </div>
                    </div>
                )}
                
                
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-800 font-semibold mb-2">Unable to load menu items</p>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchMenuItems}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}


                
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No items found matching "{searchQuery}" in {selectedCategory}.
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div key={item.id} className="bg-[#F8F5F0] rounded-xl shadow-sm overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
                                    <div className="relative">
                                        <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                                       
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-xl font-semibold text-[#5C4033] mb-1">{item.name}</h3>
                                        <p className="text-gray-500 text-sm mb-3 flex-grow line-clamp-2">{item.description}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-lg font-bold text-[#5C4033]">₹{item.price.toFixed(2)}</span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="bg-[#8B5A2B] text-white px-4 py-2 rounded-full text-sm flex items-center space-x-1 hover:bg-[#A06D3E] transition-colors duration-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 2. ORDERS SCREEN 
function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const userId = localStorage.getItem("userId");
            let response;
            if (userId) {
                response = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
            } else {
                response = await fetch('http://localhost:8080/api/orders'); 
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            
            const data = await response.json();
            setOrders(data);
            
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
            
        } finally {
            setLoading(false);
        }
    };

    
    const currentOrders = orders.filter(order => order.status !== 'Served' && order.status !== 'Cancelled');
    const pastOrders = orders.filter(order => order.status === 'Served' || order.status === 'Cancelled');
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-600 bg-yellow-50';
            case 'InPreparation': return 'text-orange-600 bg-orange-50';
            case 'ReadyToServe': return 'text-green-600 bg-green-50';
            case 'Served': return 'text-gray-600 bg-gray-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };
    const getProgressPercentage = (status) => {
        switch (status) {
            case 'Pending': return 25;
            case 'InPreparation': return 60;
            case 'ReadyToServe': return 90;
            case 'Served': return 100;
            default: return 0;
        }
    };
    const formatStatus = (status) => {
        switch (status) {
            case 'InPreparation': return 'IN PREPARATION';
            case 'ReadyToServe': return 'READY TO SERVE';
            default: return status?.toUpperCase();
        }
    };


    
    const CurrentOrderCard = ({ order }) => (
        <div key={order.id} className="bg-white rounded-xl shadow-lg border border-[#F8F5F0] p-6 flex space-x-6 items-center transition-transform duration-200 hover:scale-[1.01]">
            <div className="w-24 h-24 bg-gradient-to-br from-[#F8F5F0] to-white rounded-lg flex-shrink-0 flex items-center justify-center">
                <Package className="w-12 h-12 text-[#8B5A2B]" />
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-semibold text-gray-800">Order #{order.id}</span>
                        <span className={`ml-3 text-xs font-bold px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600">
                    Items: {order.items?.map(item => `${item.quantity}x ${item.menuItemName}`).join(', ')}
                </p>
                <p className="text-sm font-semibold text-[#8B5A2B]">Total: ₹{order.totalAmount?.toFixed(2)}</p>
                
                <div className="pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(order.status)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );

    
    const PastOrderCard = ({ order }) => (
        <div key={order.id} className="flex justify-between items-center bg-[#F8F5F0] rounded-xl p-4 border border-gray-200 transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-amber-200 rounded-full flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-[#5C4033]" />
                </div>
                <div>
                    <p className="font-bold text-gray-800">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)} • {order.items?.length || 0} Items • ₹{order.totalAmount?.toFixed(2)}
                    </p>
                </div>
            </div>
            <button
                
                className="px-4 py-2 bg-[#8B5A2B] text-white rounded-lg text-sm font-semibold hover:bg-[#A06D3E] transition-colors"
            >
                Order Again
            </button>
        </div>
    );


    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <SectionTitle title="Order History" subtitle="Track your past and current coffee orders" />

                
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <Loader className="w-12 h-12 animate-spin text-[#8B5A2B] mx-auto mb-4" />
                            <p className="text-gray-600">Loading your orders...</p>
                        </div>
                    </div>
                )}

               
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-800 font-semibold mb-2">Unable to load orders</p>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

               
                {!loading && !error && (
                    <>
                        {/* Current Orders Section */}
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Current Orders ({currentOrders.length})</h3>
                        {currentOrders.length === 0 ? (
                            <div className="bg-[#F8F5F0] rounded-xl p-8 text-center mb-10">
                                <Package className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No current orders in preparation.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-10">
                                {currentOrders.map(order => <CurrentOrderCard key={order.id} order={order} />)}
                            </div>
                        )}

                        {/* Past Orders Section */}
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Past Orders ({pastOrders.length})</h3>
                        {pastOrders.length === 0 ? (
                            <div className="bg-[#F8F5F0] rounded-xl p-8 text-center">
                                <Layers className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No past completed or cancelled orders.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pastOrders.map(order => <PastOrderCard key={order.id} order={order} />)}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// --- 3. BOOKING SCREEN 
function BookingScreen({ showToast }) {
    
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [guests, setGuests] = useState(2);
    const [tableNumber, setTableNumber] = useState('');

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date || !time || !guests || !tableNumber) {
            showToast('Please fill all required fields.', 'error');
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            showToast('⚠️ Please log in again. User ID not found.', 'error');
            return;
        }

        const bookingTime = `${date}T${time}:00`;

        try {
            const response = await fetch(
                `http://localhost:8080/api/bookings/book?userId=${userId}&tableNumber=${tableNumber}&bookingTime=${bookingTime}&numberOfPeople=${guests}`,
                { method: 'POST' }
            );

            if (response.ok) {
                showToast(`✅ Table booked successfully!`, 'success');
            } else {
                const errorText = await response.text();
                showToast(`❌ Booking failed: ${errorText}`, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('⚠️ Error connecting to server.', 'error');
        }
    };

    return (
        <div className="p-8 pb-16 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <SectionTitle title="Book a Table" subtitle="Reserve your perfect spot in advance" />
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
                    
                    
                    <div>
                        <label htmlFor="tableNumber" className="block text-sm font-bold text-gray-700 mb-2">Table Number</label>
                        <input 
                            type="number"
                            id="tableNumber"
                            min="1"
                            max="20"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="Enter table number (1-20)"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-[#8B5A2B] focus:border-[#8B5A2B]" 
                            required 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="relative">
                            <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                                <CalendarDays className="w-5 h-5 text-[#8B5A2B]" /><span>Date</span>
                            </label>
                            <input 
                                type="date" 
                                id="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-[#8B5A2B] focus:border-[#8B5A2B] appearance-none cursor-pointer" 
                                required 
                            />
                        </div>
                        
                        
                        <div className="relative">
                            <label htmlFor="time" className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-[#8B5A2B]" /><span>Time</span>
                            </label>
                            <input 
                                type="time" 
                                id="time" 
                                value={time} 
                                onChange={(e) => setTime(e.target.value)} 
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-[#8B5A2B] focus:border-[#8B5A2B] appearance-none cursor-pointer" 
                                required 
                            />
                        </div>
                    </div>
                    
                    
                    <div>
                        <label htmlFor="guests" className="block text-sm font-bold text-gray-700 mb-2">Number of Guests</label>
                        <div className="relative">
                            <select 
                                id="guests" 
                                value={guests} 
                                onChange={(e) => setGuests(e.target.value)} 
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-[#8B5A2B] focus:border-[#8B5A2B] appearance-none"
                                required
                            >
                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                    
                    
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-lg font-medium text-white bg-[#8B5A2B] rounded-lg hover:bg-[#A06D3E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5A2B] transition duration-300 shadow-md"
                        >
                            Confirm Reservation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

-


// --- 4. PAYMENT SCREEN 

function PaymentScreen({ navigate, cart, setCart, subtotal, taxes, total, showToast }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProceed = async () => {
   
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }

    
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showToast('⚠️ Please log in first', 'error');
      return;
    }

    
    const tableNumber = prompt("Enter your table number (1-20):");
    if (!tableNumber || parseInt(tableNumber) < 1 || parseInt(tableNumber) > 20) {
      showToast('Please enter a valid table number (1-20)', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      
      const orderData = {
        userId: parseInt(userId),
        tableNumber: parseInt(tableNumber),
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      };

      console.log("Creating order:", orderData);

      
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create order');
      }

      const createdOrder = await response.json();
      console.log("Order created:", createdOrder);

      
      showToast(`✅ Order #${createdOrder.id} placed successfully!`, 'success');

      
      setCart([]);

      
      setTimeout(() => {
        navigate('orders');
      }, 1500);

    } catch (error) {
      console.error('Error creating order:', error);
      showToast(`❌ Failed to place order: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeItemFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    showToast('Item removed from cart.', 'error');
  };

  

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-[calc(100vh-80px)]">
      <div className="mb-8 flex items-center space-x-2 text-gray-500 text-sm">
        <span>Cart</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-bold text-amber-700">Payment</span>
        <ChevronRight className="w-4 h-4" />
        <span>Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/*  Review & Pay */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Review & Pay</h1>
          <p className="text-gray-500 mb-8">Confirm your order details and proceed to payment.</p>

          {/* Payment Method Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
              <CreditCard className="w-6 h-6 text-green-700" />
            </div>
            <p className="text-gray-600 mb-4">
              You will be redirected to Razorpay's secure payment gateway to complete your purchase. All major payment methods are supported.
            </p>
            <div className="flex items-center text-sm text-gray-700">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              <span>100% Secure & Encrypted</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
  onClick={handleProceed}
  disabled={isProcessing || cart.length === 0}
  className={`w-full flex items-center justify-center px-8 py-4 text-white rounded-lg font-bold text-xl transition-colors shadow-lg ${
    isProcessing || cart.length === 0 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-amber-800 hover:bg-amber-900'
  }`}
>
  {isProcessing ? (
    <>
      <Loader className="w-5 h-5 mr-3 animate-spin" />
      Processing Order...
    </>
  ) : (
    <>
      Place Order - ₹{total.toFixed(2)} <ArrowDown className="w-5 h-5 ml-3 transform -rotate-90" />
    </>
  )}
</button>
          
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>
              <Shield className="w-4 h-4 inline-block mr-1 text-gray-400" /> Secure SSL Encryption
            </p>
            <p className="mt-2">
              By placing your order, you agree to our <a href="#" className="text-amber-700 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-700 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Your Order Summary (Cart) */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Your Order</h2>
          
          
          {cart.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div key={item.id} className="flex space-x-4 border-b pb-4 items-center">
               <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
  {item.image ? (
    <img 
      src={item.image} 
      alt={item.name} 
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200"><svg class="w-8 h-8 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg></div>';
      }}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
      <Coffee className="w-8 h-8 text-amber-800" />
    </div>
  )}
</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-semibold text-gray-800 mb-1">₹{(item.price * item.quantity).toFixed(2)}</span>
                    
                    <button 
                        onClick={() => removeItemFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                        title="Remove item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            ))
          )}

          {/* Totals */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-3">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- NEW: 5. PROFILE SCREEN 
function ProfileScreen({ showToast }) {
   
    const [formData, setFormData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567"
    });
    const [memberSince] = useState("November 2024");
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        const fields = Object.values(formData);
        const isEmpty = fields.some(field => field === '');

        if (isEmpty) {
            showToast('Please fill out all fields before saving.', 'error');
            return;
        }
        showToast('Profile updated successfully!', 'success');
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <SectionTitle title="Account Settings" subtitle="Manage your account and preferences" />

                <h3 className="text-2xl font-bold text-[#5C4033] mb-6 flex items-center space-x-3 border-b pb-3">
                    <User className="w-6 h-6 text-[#8B5A2B]" />
                    <span>My Profile</span>
                </h3>
                
                <form onSubmit={handleSave} className="space-y-8">
                    {/* Profile Card */}
                    <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm">
                        <div className="flex justify-end mb-4">
                            <button type="button" onClick={() => setIsEditing(!isEditing)} className="text-[#8B5A2B] hover:text-[#5C4033] font-semibold text-sm">
                                {isEditing ? "Cancel Edit" : "Edit Details"}
                            </button>
                        </div>
                        <div className="flex items-center space-x-6 mb-6">
                            <div className="w-16 h-16 bg-[#8B5A2B] text-white flex items-center justify-center text-xl font-bold rounded-full">
                                {formData.name.split(' ').map(n => n[0]).join('') || 'JD'}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h4 className="text-2xl font-semibold text-[#5C4033]">{formData.name}</h4>
                                    <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                                        Gold Member
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm">Member since {memberSince}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 border rounded-lg focus:ring-[#D4AF37] ${isEditing ? 'bg-white border-gray-400' : 'bg-gray-100 border-gray-200 cursor-default'}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 border rounded-lg focus:ring-[#D4AF37] ${isEditing ? 'bg-white border-gray-400' : 'bg-gray-100 border-gray-200 cursor-default'}`}
                                />
                            </div>
                            <div className="space-y-2 col-span-full">
                                <label className="block text-sm font-bold text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 border rounded-lg focus:ring-[#D4AF37] ${isEditing ? 'bg-white border-gray-400' : 'bg-gray-100 border-gray-200 cursor-default'}`}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="pt-6 text-center">
                                <button type="submit" className="px-8 py-3 bg-[#8B5A2B] text-white rounded-full font-bold hover:bg-[#5C4033] transition-colors shadow-md">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 pt-8 border-t border-gray-200">
                        <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm text-center">
                            <Package className="w-8 h-8 text-[#8B5A2B] mx-auto mb-3" />
                            <p className="text-3xl font-bold text-[#5C4033]">42</p>
                            <p className="text-sm text-gray-500">Total Orders</p>
                        </div>
                        <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm text-center">
                            <Heart className="w-8 h-8 text-[#8B5A2B] mx-auto mb-3" />
                            <p className="text-3xl font-bold text-[#5C4033]">8</p>
                            <p className="text-sm text-gray-500">Favorite Items</p>
                        </div>
                        <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-sm text-center">
                            <Award className="w-8 h-8 text-[#8B5A2B] mx-auto mb-3" />
                            <p className="text-3xl font-bold text-[#5C4033]">1,250</p>
                            <p className="text-sm text-gray-500">Rewards Points</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- NEW: 6. REPORT/FEEDBACK SCREEN --
function ReportFeedbackScreen({ showToast, setActiveSection }) {
    const [feedback, setFeedback] = useState('');
    const [type, setType] = useState('Feedback');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!feedback) {
            showToast('Please enter your feedback or report.', 'error');
            return;
        }
        console.log(`Submitted ${type}: ${feedback}`);
        showToast('Thank you for your feedback! We will look into it.', 'success');
        setFeedback('');
        setType('Feedback');
        setTimeout(() => setActiveSection('Home'), 1500);
    };

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <SectionTitle title="Report & Feedback" subtitle="Help us improve your experience or report an issue." />

                <div>
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                            <div className="relative">
                                <select 
                                    value={type} 
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-[#8B5A2B] focus:border-[#8B5A2B] appearance-none"
                                >
                                    <option>Feedback</option>
                                    <option>Bug Report</option>
                                    <option>Suggestion</option>
                                </select>
                                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Details</label>
                            <textarea 
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows="6" 
                                placeholder="Describe your experience or the issue you found..." 
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-[#8B5A2B] focus:border-[#8B5A2B]"
                                required
                            ></textarea>
                        </div>

                        <div className="pt-4 text-center">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-[#8B5A2B] text-white rounded-full font-bold text-lg hover:bg-[#5C4033] transition-colors shadow-md"
                            >
                                Submit {type}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// --- TOAST NOTIFICATION COMPONENT ---
function ToastNotification({ toast }) {
    if (!toast.message) return null;

    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl text-white font-semibold flex items-center gap-3 z-[9999] transition-all duration-300";
    let colorClasses = "";
    let Icon = X;

    switch (toast.type) {
        case 'success':
            colorClasses = "bg-green-600";
            Icon = CheckCircle; 
            break;
        case 'error':
            colorClasses = "bg-red-600";
            Icon = X;
            break;
        case 'info':
            colorClasses = "bg-blue-600";
            Icon = ArrowDown;
            break;
        default:
            colorClasses = "bg-gray-700";
            Icon = ArrowDown;
    }

    return (
        <div className={`${baseClasses} ${colorClasses} transform transition-all duration-300 scale-100 ease-out`}>
            <Icon className="w-5 h-5" />
            <span>{toast.message}</span>
        </div>
    );
}


export default CustomerDashboard;