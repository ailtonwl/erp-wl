import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Wallet, 
  TrendingUp, 
  Search, 
  Bell, 
  Settings, 
  User,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  FileText,
  Box,
  ShoppingCart,
  PlusCircle,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const salesData = [
  { name: 'Mon', sales: 45, expenses: 32 },
  { name: 'Tue', sales: 52, expenses: 38 },
  { name: 'Wed', sales: 48, expenses: 35 },
  { name: 'Thu | 01', sales: 61, expenses: 42 },
  { name: 'Fri', sales: 55, expenses: 39 },
  { name: 'Sat', sales: 68, expenses: 45 },
  { name: 'Sun', sales: 72, expenses: 48 },
];

const topProducts = [
  { name: 'Widget Type A', sold: 1240, color: '#11c4d4' },
  { name: 'Smart Connector Pro', sold: 982, color: '#11c4d4' },
  { name: 'Industrial Hub X', sold: 654, color: '#11c4d4' },
  { name: 'Eco Sensor Kit', sold: 432, color: '#11c4d4' },
];

const recentActivities = [
  { 
    id: '1', 
    title: 'Inv #00241 - ACME Corp', 
    type: 'Sale', 
    status: 'Completed', 
    date: '2 mins ago', 
    amount: '$1,240.00',
    icon: <FileText className="w-4 h-4" />,
    iconBg: 'bg-blue-100 text-blue-600'
  },
  { 
    id: '2', 
    title: 'Stock Restock - Widget A', 
    type: 'Inventory', 
    status: 'In Transit', 
    date: '1 hour ago', 
    amount: '+500 units',
    icon: <Box className="w-4 h-4" />,
    iconBg: 'bg-orange-100 text-orange-600'
  },
  { 
    id: '3', 
    title: 'Vendor PO - Global Log', 
    type: 'Payable', 
    status: 'Pending', 
    date: '4 hours ago', 
    amount: '-$3,450.00',
    icon: <ShoppingCart className="w-4 h-4" />,
    iconBg: 'bg-red-100 text-red-600'
  },
  { 
    id: '4', 
    title: 'Inv #00240 - TechNova', 
    type: 'Sale', 
    status: 'Completed', 
    date: 'Yesterday', 
    amount: '$8,900.00',
    icon: <PlusCircle className="w-4 h-4" />,
    iconBg: 'bg-green-100 text-green-600'
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen bg-[#f6f8f8] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#11c4d4] rounded-lg flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">ERP Manager</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Inventory', icon: Package },
            { name: 'Finance', icon: Wallet },
            { name: 'Sales', icon: TrendingUp },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                activeTab === item.name 
                  ? "bg-[#11c4d4]/10 text-[#11c4d4] font-semibold border-r-4 border-[#11c4d4] rounded-r-none" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#11c4d4]/20 flex items-center justify-center text-[#11c4d4]">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate">Alex Rivera</span>
              <span className="text-xs text-slate-500">Admin Console</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#11c4d4] transition-colors" />
              <input 
                type="text" 
                placeholder="Search transactions, products, or reports..."
                className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#11c4d4]/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
              <img 
                src="https://picsum.photos/seed/alex/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Sales', value: '$124,500', change: '12% from last month', up: true, icon: Wallet, color: 'text-green-500' },
              { label: 'Accounts Payable', value: '$12,400', change: '5% from last month', up: false, icon: ArrowDown, color: 'text-red-500' },
              { label: 'Accounts Receivable', value: '$45,200', change: '8% from last month', up: true, icon: ArrowUp, color: 'text-blue-500' },
              { label: 'Low Stock Alerts', value: '18 Items', change: 'Action required soon', up: null, icon: AlertTriangle, color: 'text-orange-500' },
            ].map((kpi, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={kpi.label} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm text-slate-500 font-medium">{kpi.label}</p>
                  <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                </div>
                <h3 className="text-2xl font-bold mt-2 text-slate-800">{kpi.value}</h3>
                <div className={cn("flex items-center gap-1 mt-2 text-sm font-medium", kpi.color)}>
                  {kpi.up === true && <ArrowUp className="w-3 h-3" />}
                  {kpi.up === false && <ArrowDown className="w-3 h-3" />}
                  <span>{kpi.change}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales vs Expenses */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Sales vs. Expenses</h2>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-xs font-semibold text-slate-600">Last 7 Days</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#11c4d4" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#11c4d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#11c4d4" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#64748b" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="transparent" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#11c4d4]"></div>
                  <span className="text-xs font-medium text-slate-500">Sales ($85k)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <span className="text-xs font-medium text-slate-500">Expenses ($62k)</span>
                </div>
              </div>
            </motion.div>

            {/* Top Selling Products */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Top Selling Products</h2>
                <button className="text-[#11c4d4] text-xs font-bold hover:underline">View Report</button>
              </div>
              <div className="space-y-6">
                {topProducts.map((product) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{product.name}</span>
                      <span className="text-slate-500 font-medium">{product.sold.toLocaleString()} sold</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(product.sold / 1300) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-[#11c4d4]"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activities Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Recent Activities</h2>
              <button className="text-sm font-bold text-[#11c4d4] bg-[#11c4d4]/10 px-4 py-2 rounded-xl hover:bg-[#11c4d4]/20 transition-colors">
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Transaction / Item</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Amount / Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", activity.iconBg)}>
                            {activity.icon}
                          </div>
                          <span className="font-semibold text-slate-700">{activity.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{activity.type}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                          activity.status === 'Completed' ? "bg-green-100 text-green-700" :
                          activity.status === 'In Transit' ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-600"
                        )}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{activity.date}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">{activity.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-50 text-center">
              <button className="text-sm font-bold text-[#11c4d4] hover:text-[#11c4d4]/80 transition-colors">
                View All Transactions
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
