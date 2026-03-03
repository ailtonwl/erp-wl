import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Users,
  Ruler,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  CreditCard,
  Banknote,
  Calendar,
  Eye,
  CheckCircle,
  Truck,
  ShoppingBag,
  Receipt,
  Printer,
  LogOut,
  Shield,
  Lock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Unit {
  id: number;
  name: string;
  abbreviation: string;
}

interface Product {
  id: number;
  name: string;
  unit_id: number;
  price: number;
  cost_price: number;
  average_cost: number;
  stock: number;
  unit_name?: string;
  unit_abbr?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface SalesMethod {
  id: number;
  description: string;
  installments: number;
  due_days: string;
}

interface ReceivingMethod {
  id: number;
  description: string;
  is_active: boolean;
}

interface UserProfile {
  id: number;
  username: string;
  name: string;
  role: string;
}

interface SaleItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  unit_abbr?: string;
  stock?: number;
}

interface SaleInstallment {
  installment_number: number;
  due_date: string;
  amount: number;
}

interface Sale {
  id: number;
  customer_id: number;
  customer_name?: string;
  sales_method_id: number;
  sales_method_name?: string;
  total_amount: number;
  sale_date: string;
  items?: SaleItem[];
  installments?: SaleInstallment[];
}

interface InstallmentPayment {
  id: number;
  installment_id: number;
  payment_date: string;
  amount: number;
  receiving_method_id: number;
  receiving_method_name?: string;
}

interface Receivable {
  id: number;
  sale_id: number;
  installment_number: number;
  due_date: string;
  amount: number;
  customer_name: string;
  paid_amount: number;
}

interface ReceiptReportItem {
  payment_date: string;
  amount: number;
  method_name: string;
  customer_name: string;
  sale_id: number;
  installment_number: number;
}

interface Supplier {
  id: number;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  tax_id: string;
}

interface PurchaseItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  unit_abbr?: string;
  sale_price?: number;
}

interface PurchaseInstallment {
  installment_number: number;
  due_date: string;
  amount: number;
}

interface Purchase {
  id: number;
  supplier_id: number;
  supplier_name?: string;
  total_amount: number;
  purchase_date: string;
  items?: PurchaseItem[];
  installments?: PurchaseInstallment[];
}

interface PayablePayment {
  id: number;
  installment_id: number;
  payment_date: string;
  amount: number;
  payment_method_id: number;
  payment_method_name?: string;
}

interface Payable {
  id: number;
  purchase_id: number;
  installment_number: number;
  due_date: string;
  amount: number;
  supplier_name: string;
  paid_amount: number;
}

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ConfirmModal = ({ isOpen, onClose, title, message, onConfirm }: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  message: string, 
  onConfirm: () => void 
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="space-y-6">
      <p className="text-slate-600 font-medium">{message}</p>
      <div className="flex gap-3">
        <button 
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={() => { onConfirm(); onClose(); }}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
        >
          Confirmar
        </button>
      </div>
    </div>
  </Modal>
);

const DashboardView = () => {
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

  return (
    <div className="space-y-8">
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
        </motion.div>

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
      </motion.div>
    </div>
  );
};

const UnitsView = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({ name: '', abbreviation: '' });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  const fetchUnits = async () => {
    const res = await fetch('/api/units');
    const data = await res.json();
    setUnits(data);
  };

  useEffect(() => { fetchUnits(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingUnit ? 'PUT' : 'POST';
    const url = editingUnit ? `/api/units/${editingUnit.id}` : '/api/units';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    setEditingUnit(null);
    setFormData({ name: '', abbreviation: '' });
    fetchUnits();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/units/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir unidade');
    } else {
      fetchUnits();
    }
  };

  const openEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({ name: unit.name, abbreviation: unit.abbreviation });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Units of Measure</h2>
        <button 
          onClick={() => { setEditingUnit(null); setFormData({ name: '', abbreviation: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Unit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Abbreviation</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {units.map((unit) => (
              <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-700">{unit.name}</td>
                <td className="px-6 py-4 text-slate-500 font-medium uppercase">{unit.abbreviation}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(unit)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: unit.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUnit ? 'Edit Unit' : 'Add Unit'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="e.g. Kilogram"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Abbreviation</label>
            <input 
              required
              type="text" 
              value={formData.abbreviation}
              onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="e.g. kg"
            />
          </div>
          <button type="submit" className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {editingUnit ? 'Update Unit' : 'Save Unit'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta unidade (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
      />
    </div>
  );
};

const ProductsView = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', unit_id: 0, price: 0, cost_price: 0, average_cost: 0, stock: 0 });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  const fetchData = async () => {
    const [pRes, uRes] = await Promise.all([fetch('/api/products'), fetch('/api/units')]);
    const [pData, uData] = await Promise.all([pRes.json(), uRes.json()]);
    setProducts(pData);
    setUnits(uData);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', unit_id: units[0]?.id || 0, price: 0, cost_price: 0, average_cost: 0, stock: 0 });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir produto');
    } else {
      fetchData();
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      unit_id: product.unit_id, 
      price: product.price, 
      cost_price: product.cost_price || 0,
      average_cost: product.average_cost || 0,
      stock: product.stock 
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Products</h2>
        <button 
          onClick={() => { 
            setEditingProduct(null); 
            setFormData({ name: '', unit_id: units[0]?.id || 0, price: 0, cost_price: 0, average_cost: 0, stock: 0 }); 
            setIsModalOpen(true); 
          }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Unit</th>
              <th className="px-6 py-4">Cost Price</th>
              <th className="px-6 py-4">Avg Cost</th>
              <th className="px-6 py-4">Sale Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-700">{product.name}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{product.unit_name} ({product.unit_abbr})</td>
                <td className="px-6 py-4 text-slate-600 font-medium">${(product.cost_price || 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">${(product.average_cost || 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-slate-900 font-bold">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold",
                    product.stock < 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  )}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(product)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: product.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="e.g. Smart Connector"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Unit</label>
            <select 
              required
              value={formData.unit_id}
              onChange={(e) => setFormData({ ...formData, unit_id: parseInt(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
            >
              <option value={0} disabled>Select a unit</option>
              {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Cost Price ($)</label>
              <input 
                required
                type="number" 
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Avg Cost ($)</label>
              <input 
                required
                type="number" 
                step="0.01"
                value={formData.average_cost}
                onChange={(e) => setFormData({ ...formData, average_cost: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sale Price ($)</label>
              <input 
                required
                type="number" 
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Stock</label>
              <input 
                required
                type="number" 
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {editingProduct ? 'Update Product' : 'Save Product'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir este produto (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
      />
    </div>
  );
};

const CustomersView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCustomer ? 'PUT' : 'POST';
    const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
    fetchCustomers();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir cliente');
    } else {
      fetchCustomers();
    }
  };

  const openEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({ 
      name: customer.name, 
      email: customer.email, 
      phone: customer.phone, 
      address: customer.address 
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Customers</h2>
        <button 
          onClick={() => { setEditingCustomer(null); setFormData({ name: '', email: '', phone: '', address: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-700">{customer.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 font-medium">{customer.email}</div>
                  <div className="text-xs text-slate-400">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium text-sm max-w-xs truncate">{customer.address}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(customer)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: customer.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCustomer ? 'Edit Customer' : 'Add Customer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... form fields ... */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="e.g. ACME Corp"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
                placeholder="contact@acme.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
            <textarea 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none h-20 resize-none"
              placeholder="123 Main St, City, Country"
            />
          </div>
          <button type="submit" className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {editingCustomer ? 'Update Customer' : 'Save Customer'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir este cliente (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
      />
    </div>
  );
};

const SuppliersView = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: ''
  });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  const fetchSuppliers = async () => {
    const res = await fetch('/api/suppliers');
    const data = await res.json();
    setSuppliers(data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : '/api/suppliers';
    const method = editingSupplier ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingSupplier(null);
      setFormData({ name: '', contact_name: '', email: '', phone: '', address: '', tax_id: '' });
      fetchSuppliers();
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_name: supplier.contact_name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      tax_id: supplier.tax_id
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir fornecedor');
    } else {
      fetchSuppliers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Suppliers</h2>
        <button 
          onClick={() => {
            setEditingSupplier(null);
            setFormData({ name: '', contact_name: '', email: '', phone: '', address: '', tax_id: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-700">{supplier.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{supplier.tax_id}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{supplier.contact_name}</td>
                <td className="px-6 py-4 text-slate-500">{supplier.email}</td>
                <td className="px-6 py-4 text-slate-500">{supplier.phone}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(supplier)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: supplier.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
                placeholder="Supplier Co."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tax ID / CNPJ</label>
              <input 
                type="text" 
                value={formData.tax_id}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
                placeholder="00.000.000/0001-00"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Contact Person</label>
              <input 
                type="text" 
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
                placeholder="contact@supplier.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="+1 234 567 890"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
            <textarea 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none h-20 resize-none"
              placeholder="123 Industrial Way"
            />
          </div>
          <button type="submit" className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir este fornecedor (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
      />
    </div>
  );
};

const SalesMethodsView = () => {
  const [methods, setMethods] = useState<SalesMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<SalesMethod | null>(null);
  const [formData, setFormData] = useState({ description: '', installments: 1, due_days: '' });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  const fetchMethods = async () => {
    const res = await fetch('/api/sales-methods');
    const data = await res.json();
    setMethods(data);
  };

  useEffect(() => { fetchMethods(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingMethod ? 'PUT' : 'POST';
    const url = editingMethod ? `/api/sales-methods/${editingMethod.id}` : '/api/sales-methods';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    setEditingMethod(null);
    setFormData({ description: '', installments: 1, due_days: '' });
    fetchMethods();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/sales-methods/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir forma de venda');
    } else {
      fetchMethods();
    }
  };

  const openEdit = (m: SalesMethod) => {
    setEditingMethod(m);
    setFormData({ 
      description: m.description, 
      installments: m.installments, 
      due_days: m.due_days 
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Sales Methods</h2>
        <button 
          onClick={() => { setEditingMethod(null); setFormData({ description: '', installments: 1, due_days: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Method
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Installments</th>
              <th className="px-6 py-4">Due Days (e.g. 30/60/90)</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {methods.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-700">{m.description}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{m.installments}x</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{m.due_days}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(m)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: m.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMethod ? 'Edit Sales Method' : 'Add Sales Method'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <input 
              required
              type="text" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="e.g. Credit Card 3x"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Installments</label>
              <input 
                required
                type="number" 
                min="1"
                value={formData.installments}
                onChange={(e) => setFormData({ ...formData, installments: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Due Days (sep by /)</label>
              <input 
                required
                type="text" 
                value={formData.due_days}
                onChange={(e) => setFormData({ ...formData, due_days: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
                placeholder="e.g. 30/60/90"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 italic">
            Note: For 3 installments, enter 30/60/90. The system interprets this as days from the sale date.
          </p>
          <button type="submit" className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {editingMethod ? 'Update Method' : 'Save Method'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta forma de venda (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
      />
    </div>
  );
};

const ReceivingMethodsView = () => {
  const [methods, setMethods] = useState<ReceivingMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ReceivingMethod | null>(null);
  const [formData, setFormData] = useState({ description: '', is_active: true });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  const fetchMethods = async () => {
    const res = await fetch('/api/receiving-methods');
    const data = await res.json();
    setMethods(data.map((m: any) => ({ ...m, is_active: !!m.is_active })));
  };

  useEffect(() => { fetchMethods(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingMethod ? 'PUT' : 'POST';
    const url = editingMethod ? `/api/receiving-methods/${editingMethod.id}` : '/api/receiving-methods';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    setEditingMethod(null);
    setFormData({ description: '', is_active: true });
    fetchMethods();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/receiving-methods/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir forma de recebimento');
    } else {
      fetchMethods();
    }
  };

  const openEdit = (m: ReceivingMethod) => {
    setEditingMethod(m);
    setFormData({ description: m.description, is_active: m.is_active });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Receiving Methods</h2>
        <button 
          onClick={() => { setEditingMethod(null); setFormData({ description: '', is_active: true }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Method
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {methods.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-700">{m.description}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    m.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {m.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(m)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: m.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMethod ? 'Edit Receiving Method' : 'Add Receiving Method'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <input 
              required
              type="text" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="e.g. Cash, Bank Transfer"
            />
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-[#11c4d4] focus:ring-[#11c4d4]/20"
            />
            <label htmlFor="is_active" className="text-sm font-bold text-slate-700">Active</label>
          </div>
          <button type="submit" className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {editingMethod ? 'Update Method' : 'Save Method'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta forma de recebimento (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
      />
    </div>
  );
};

const SalesView = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesMethods, setSalesMethods] = useState<SalesMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });
  
  // New Sale State
  const [step, setStep] = useState(1);
  const [newSale, setNewSale] = useState({
    customer_id: 0,
    sales_method_id: 0,
    sale_date: new Date().toISOString().split('T')[0],
    items: [] as SaleItem[],
    installments: [] as SaleInstallment[]
  });

  // Item Selection State
  const [currentItem, setCurrentItem] = useState<Partial<SaleItem>>({
    product_id: 0,
    quantity: 1,
    unit_price: 0
  });

  const fetchData = async () => {
    const [sRes, cRes, pRes, smRes] = await Promise.all([
      fetch('/api/sales'),
      fetch('/api/customers'),
      fetch('/api/products'),
      fetch('/api/sales-methods')
    ]);
    const [sData, cData, pData, smData] = await Promise.all([
      sRes.json(), cRes.json(), pRes.json(), smRes.json()
    ]);
    setSales(sData);
    setCustomers(cData);
    setProducts(pData);
    setSalesMethods(smData);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddProduct = () => {
    if (!currentItem.product_id || !currentItem.quantity || currentItem.quantity <= 0) return;
    
    const product = products.find(p => p.id === currentItem.product_id);
    if (!product) return;

    const newItem: SaleItem = {
      product_id: product.id,
      product_name: product.name,
      quantity: currentItem.quantity,
      unit_price: currentItem.unit_price || product.price,
      unit_abbr: product.unit_abbr,
      stock: product.stock
    };

    setNewSale({ ...newSale, items: [...newSale.items, newItem] });
    setCurrentItem({ product_id: 0, quantity: 1, unit_price: 0 });
  };

  const handleRemoveProduct = (index: number) => {
    const items = [...newSale.items];
    items.splice(index, 1);
    setNewSale({ ...newSale, items });
  };

  const totalAmount = newSale.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  const generateInstallments = () => {
    const method = salesMethods.find(m => m.id === newSale.sales_method_id);
    if (!method || method.installments <= 0) {
      setStep(3); // Skip to review if no installments
      return;
    }

    const installmentCount = method.installments;
    const dueDays = method.due_days.split('/').map(d => parseInt(d.trim()));
    const baseAmount = parseFloat((totalAmount / installmentCount).toFixed(2));
    
    const generated: SaleInstallment[] = [];
    let remaining = totalAmount;

    for (let i = 0; i < installmentCount; i++) {
      const days = dueDays[i] || (30 * (i + 1));
      const date = new Date(newSale.sale_date);
      date.setDate(date.getDate() + days);
      
      const amount = i === installmentCount - 1 ? parseFloat(remaining.toFixed(2)) : baseAmount;
      remaining -= amount;

      generated.push({
        installment_number: i + 1,
        due_date: date.toISOString().split('T')[0],
        amount
      });
    }

    setNewSale({ ...newSale, installments: generated });
    setStep(2);
  };

  const handleSaveSale = async () => {
    const installmentsTotal = newSale.installments.reduce((sum, inst) => sum + inst.amount, 0);
    const method = salesMethods.find(m => m.id === newSale.sales_method_id);
    
    if (method && method.installments > 0) {
      if (Math.abs(installmentsTotal - totalAmount) > 0.01) {
        alert(`Total of installments ($${installmentsTotal.toFixed(2)}) must equal total items ($${totalAmount.toFixed(2)})`);
        return;
      }
    }

    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newSale,
        total_amount: totalAmount
      })
    });

    if (res.ok) {
      setIsModalOpen(false);
      setNewSale({
        customer_id: 0,
        sales_method_id: 0,
        sale_date: new Date().toISOString().split('T')[0],
        items: [],
        installments: []
      });
      setStep(1);
      fetchData();
    } else {
      const err = await res.json();
      alert(`Error: ${err.error}`);
    }
  };

  const viewSaleDetails = async (id: number) => {
    const res = await fetch(`/api/sales/${id}`);
    const data = await res.json();
    setSelectedSale(data);
    setIsViewModalOpen(true);
  };

  const handleDeleteSale = async (id: number) => {
    const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir venda');
    } else {
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Sales</h2>
        <button 
          onClick={() => { 
            setStep(1);
            setNewSale({
              customer_id: customers[0]?.id || 0,
              sales_method_id: salesMethods[0]?.id || 0,
              sale_date: new Date().toISOString().split('T')[0],
              items: [],
              installments: []
            });
            setIsModalOpen(true); 
          }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Sale
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#{sale.id}</td>
                <td className="px-6 py-4 text-slate-600">{sale.sale_date}</td>
                <td className="px-6 py-4 font-semibold text-slate-700">{sale.customer_name}</td>
                <td className="px-6 py-4 text-slate-500">{sale.sales_method_name}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${sale.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => viewSaleDetails(sale.id)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: sale.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Sale Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Sale">
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
          {/* Progress Steps */}
          <div className="flex items-center justify-between px-4 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step >= s ? "bg-[#11c4d4] text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {s}
                </div>
                {s < 3 && <div className={cn("w-12 h-1 mx-2 rounded", step > s ? "bg-[#11c4d4]" : "bg-slate-100")} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Customer</label>
                  <select 
                    value={newSale.customer_id}
                    onChange={(e) => setNewSale({ ...newSale, customer_id: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
                  >
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newSale.sale_date}
                    onChange={(e) => setNewSale({ ...newSale, sale_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Sales Method</label>
                <select 
                  value={newSale.sales_method_id}
                  onChange={(e) => setNewSale({ ...newSale, sales_method_id: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
                >
                  {salesMethods.map(m => <option key={m.id} value={m.id}>{m.description} ({m.installments}x)</option>)}
                </select>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 mb-3">Add Products</h4>
                <div className="grid grid-cols-12 gap-2 mb-4">
                  <div className="col-span-6">
                    <select 
                      value={currentItem.product_id}
                      onChange={(e) => {
                        const pid = parseInt(e.target.value);
                        const p = products.find(prod => prod.id === pid);
                        setCurrentItem({ ...currentItem, product_id: pid, unit_price: p?.price || 0 });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                    >
                      <option value={0}>Select Product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      placeholder="Qty"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseFloat(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <button 
                      onClick={handleAddProduct}
                      className="w-full h-full bg-[#11c4d4] text-white rounded-xl flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {currentItem.product_id ? (
                  <div className="bg-slate-50 p-3 rounded-xl mb-4 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 uppercase font-bold mr-2">Stock:</span>
                      <span className="font-bold text-slate-700">{products.find(p => p.id === currentItem.product_id)?.stock} {products.find(p => p.id === currentItem.product_id)?.unit_abbr}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-bold mr-2">Price:</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={currentItem.unit_price}
                        onChange={(e) => setCurrentItem({ ...currentItem, unit_price: parseFloat(e.target.value) })}
                        className="w-20 bg-white border border-slate-200 rounded px-1 py-0.5 font-bold text-slate-900"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2">
                  {newSale.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{item.product_name}</span>
                        <span className="text-xs text-slate-400">{item.quantity} {item.unit_abbr} x ${item.unit_price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#11c4d4]">${(item.quantity * item.unit_price).toFixed(2)}</span>
                        <button onClick={() => handleRemoveProduct(idx)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="text-slate-400 text-sm font-bold uppercase">Total Amount</div>
                <div className="text-2xl font-black text-slate-900">${totalAmount.toFixed(2)}</div>
              </div>

              <button 
                disabled={newSale.items.length === 0}
                onClick={generateInstallments}
                className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 disabled:opacity-50 transition-colors"
              >
                Next: Payment Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">Installments</h4>
              <div className="space-y-3">
                {newSale.installments.map((inst, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl">
                    <div className="col-span-1 font-bold text-slate-400">#{inst.installment_number}</div>
                    <div className="col-span-6">
                      <input 
                        type="date" 
                        value={inst.due_date}
                        onChange={(e) => {
                          const updated = [...newSale.installments];
                          updated[idx].due_date = e.target.value;
                          setNewSale({ ...newSale, installments: updated });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none"
                      />
                    </div>
                    <div className="col-span-5">
                      <input 
                        type="number" 
                        step="0.01"
                        value={inst.amount}
                        onChange={(e) => {
                          const updated = [...newSale.installments];
                          updated[idx].amount = parseFloat(e.target.value);
                          setNewSale({ ...newSale, installments: updated });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-100 p-4 rounded-xl flex justify-between items-center">
                <div className="text-xs font-bold text-slate-500 uppercase">Installments Total</div>
                <div className={cn(
                  "font-bold",
                  Math.abs(newSale.installments.reduce((s, i) => s + i.amount, 0) - totalAmount) < 0.01 ? "text-green-600" : "text-red-600"
                )}>
                  ${newSale.installments.reduce((s, i) => s + i.amount, 0).toFixed(2)} / ${totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Back</button>
                <button onClick={handleSaveSale} className="flex-[2] bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors">Complete Sale</button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* View Sale Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Sale Details #${selectedSale?.id}`}>
        {selectedSale && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400 uppercase font-bold text-[10px]">Customer</div>
                <div className="font-bold text-slate-800">{selectedSale.customer_name}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase font-bold text-[10px]">Date</div>
                <div className="font-bold text-slate-800">{selectedSale.sale_date}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase font-bold text-[10px]">Method</div>
                <div className="font-bold text-slate-800">{selectedSale.sales_method_name}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase font-bold text-[10px]">Total</div>
                <div className="font-bold text-[#11c4d4]">${selectedSale.total_amount.toFixed(2)}</div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-800 mb-3 text-sm">Items</h4>
              <div className="space-y-2">
                {selectedSale.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-bold">{item.product_name}</div>
                      <div className="text-xs text-slate-400">{item.quantity} {item.unit_abbr} x ${item.unit_price.toFixed(2)}</div>
                    </div>
                    <div className="font-bold text-slate-700">${(item.quantity * item.unit_price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedSale.installments && selectedSale.installments.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">Installments</h4>
                <div className="space-y-2">
                  {selectedSale.installments.map((inst, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-xs">#{inst.installment_number}</span>
                        <span className="font-medium">{inst.due_date}</span>
                      </div>
                      <div className="font-bold text-slate-700">${inst.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta venda (ID: ${confirmDelete.id})? O estoque será revertido.`}
        onConfirm={() => confirmDelete.id && handleDeleteSale(confirmDelete.id)}
      />
    </div>
  );
};

const PurchasesView = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    supplier_id: 0,
    purchase_date: new Date().toISOString().split('T')[0],
    items: [] as PurchaseItem[],
    installments: [] as PurchaseInstallment[]
  });

  const fetchPurchases = async () => {
    const res = await fetch('/api/purchases');
    const data = await res.json();
    setPurchases(data);
  };

  const fetchInitialData = async () => {
    const [sRes, pRes] = await Promise.all([
      fetch('/api/suppliers'),
      fetch('/api/products')
    ]);
    const [sData, pData] = await Promise.all([sRes.json(), pRes.json()]);
    setSuppliers(sData);
    setProducts(pData);
  };

  useEffect(() => {
    fetchPurchases();
    fetchInitialData();
  }, []);

  const handleAddProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    setFormData({
      ...formData,
      items: [...formData.items, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.cost_price || 0,
        unit_abbr: product.unit_abbr,
        sale_price: product.price
      }]
    });
  };

  const handleRemoveProduct = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  const generateInstallments = (count: number) => {
    const insts: PurchaseInstallment[] = [];
    const baseAmount = parseFloat((totalAmount / count).toFixed(2));
    let remaining = totalAmount;

    for (let i = 1; i <= count; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i * 30));
      const amount = i === count ? remaining : baseAmount;
      insts.push({
        installment_number: i,
        due_date: date.toISOString().split('T')[0],
        amount: amount
      });
      remaining = parseFloat((remaining - amount).toFixed(2));
    }
    setFormData({ ...formData, installments: insts });
  };

  const handleSubmit = async () => {
    const instTotal = formData.installments.reduce((sum, i) => sum + i.amount, 0);
    if (Math.abs(instTotal - totalAmount) > 0.01) {
      alert(`Installment total (${instTotal.toFixed(2)}) must match purchase total (${totalAmount.toFixed(2)})`);
      return;
    }

    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, total_amount: totalAmount })
    });

    if (res.ok) {
      setIsModalOpen(false);
      setStep(1);
      setFormData({ supplier_id: 0, purchase_date: new Date().toISOString().split('T')[0], items: [], installments: [] });
      fetchPurchases();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/purchases/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir compra');
    } else {
      fetchPurchases();
    }
  };

  const viewPurchase = async (id: number) => {
    const res = await fetch(`/api/purchases/${id}`);
    const data = await res.json();
    setSelectedPurchase(data);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Purchases</h2>
        <button 
          onClick={() => {
            setStep(1);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Purchase
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {purchases.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-600">{p.purchase_date}</td>
                <td className="px-6 py-4 font-semibold text-slate-700">{p.supplier_name}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${p.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => viewPurchase(p.id)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: p.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Purchase Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Purchase">
        <div className="space-y-6">
          {/* Stepper */}
          <div className="flex items-center justify-between px-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                  step >= s ? "bg-[#11c4d4] text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {s}
                </div>
                {s < 3 && <div className={cn("w-20 h-1 mx-2 rounded", step > s ? "bg-[#11c4d4]" : "bg-slate-100")} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Supplier</label>
                <select 
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Purchase Date</label>
                <input 
                  type="date" 
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
                />
              </div>
              <button 
                disabled={!formData.supplier_id}
                onClick={() => setStep(2)}
                className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 disabled:opacity-50 transition-all"
              >
                Next: Add Products
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddProduct(parseInt(e.target.value));
                      e.target.value = "";
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
                >
                  <option value="">Search Product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock} {p.unit_abbr})</option>)}
                </select>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                <div className="flex gap-3 px-3 text-[10px] uppercase font-bold text-slate-400">
                  <div className="flex-1">Product</div>
                  <div className="w-20 text-center">Qty</div>
                  <div className="w-24 text-center">Cost</div>
                  <div className="w-24 text-center">New Sale</div>
                  <div className="w-4"></div>
                </div>
                {formData.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-bold text-slate-700 text-sm truncate">{item.product_name}</div>
                      <div className="text-[10px] text-slate-400">Current Cost: ${item.unit_price}</div>
                    </div>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[idx].quantity = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm text-center"
                    />
                    <input 
                      type="number" 
                      value={item.unit_price}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[idx].unit_price = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm text-center"
                    />
                    <input 
                      type="number" 
                      value={item.sale_price}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[idx].sale_price = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm text-center font-bold text-[#11c4d4]"
                      placeholder="Sale Price"
                    />
                    <button onClick={() => handleRemoveProduct(idx)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="text-lg font-black text-slate-800">Total: ${totalAmount.toFixed(2)}</div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="px-4 py-2 text-slate-400 font-bold">Back</button>
                  <button 
                    disabled={formData.items.length === 0}
                    onClick={() => {
                      generateInstallments(1);
                      setStep(3);
                    }}
                    className="bg-[#11c4d4] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 disabled:opacity-50"
                  >
                    Next: Installments
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                <label className="text-sm font-bold text-slate-700">Installments:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button 
                      key={n}
                      onClick={() => generateInstallments(n)}
                      className={cn(
                        "w-8 h-8 rounded-lg font-bold text-xs transition-colors",
                        formData.installments.length === n ? "bg-[#11c4d4] text-white" : "bg-white border border-slate-200 text-slate-400"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.installments.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                    <span className="text-xs font-bold text-slate-400 w-8">#{inst.installment_number}</span>
                    <input 
                      type="date" 
                      value={inst.due_date}
                      onChange={(e) => {
                        const newInst = [...formData.installments];
                        newInst[idx].due_date = e.target.value;
                        setFormData({ ...formData, installments: newInst });
                      }}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm"
                    />
                    <input 
                      type="number" 
                      value={inst.amount}
                      onChange={(e) => {
                        const newInst = [...formData.installments];
                        newInst[idx].amount = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, installments: newInst });
                      }}
                      className="w-32 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm text-right font-bold"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="text-lg font-black text-slate-800">Total: ${totalAmount.toFixed(2)}</div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="px-4 py-2 text-slate-400 font-bold">Back</button>
                  <button 
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-8 py-2 rounded-xl font-bold hover:bg-green-600"
                  >
                    Finish Purchase
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* View Purchase Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Purchase Details">
        {selectedPurchase && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Supplier</div>
                <div className="font-bold text-slate-800">{selectedPurchase.supplier_name}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Date</div>
                <div className="font-bold text-slate-800">{selectedPurchase.purchase_date}</div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total Amount</div>
              <div className="text-3xl font-black">${selectedPurchase.total_amount.toFixed(2)}</div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-3 text-sm">Items</h4>
              <div className="space-y-2">
                {selectedPurchase.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                    <div>
                      <div className="font-bold text-slate-700">{item.product_name}</div>
                      <div className="text-xs text-slate-400">{item.quantity} {item.unit_abbr} x ${item.unit_price}</div>
                    </div>
                    <div className="font-bold text-slate-700">${(item.quantity * item.unit_price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPurchase.installments && selectedPurchase.installments.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">Installments</h4>
                <div className="space-y-2">
                  {selectedPurchase.installments.map((inst, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-xs">#{inst.installment_number}</span>
                        <span className="font-medium">{inst.due_date}</span>
                      </div>
                      <div className="font-bold text-slate-700">${inst.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta compra (ID: ${confirmDelete.id})? O estoque será revertido.`}
        onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
      />
    </div>
  );
};

const PayablesView = () => {
  const [payables, setPayables] = useState<Payable[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<ReceivingMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<Payable | null>(null);
  const [payments, setPayments] = useState<PayablePayment[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });
  const [formData, setFormData] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_method_id: 0
  });

  const fetchData = async () => {
    const [pRes, pmRes] = await Promise.all([
      fetch('/api/payables'),
      fetch('/api/receiving-methods')
    ]);
    const [pData, pmData] = await Promise.all([pRes.json(), pmRes.json()]);
    setPayables(pData);
    setPaymentMethods(pmData.filter((m: any) => m.is_active));
  };

  const fetchPayments = async (id: number) => {
    const res = await fetch(`/api/payables/${id}/payments`);
    const data = await res.json();
    setPayments(data);
  };

  useEffect(() => { fetchData(); }, []);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayable) return;

    const res = await fetch('/api/payables/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        installment_id: selectedPayable.id
      })
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
    }
  };

  const handleDeletePayment = async (id: number) => {
    const res = await fetch(`/api/payable-payments/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir pagamento');
    } else {
      if (selectedPayable) fetchPayments(selectedPayable.id);
      fetchData();
    }
  };

  const openPaymentModal = (p: Payable) => {
    setSelectedPayable(p);
    setFormData({
      payment_date: new Date().toISOString().split('T')[0],
      amount: p.amount - p.paid_amount,
      payment_method_id: paymentMethods[0]?.id || 0
    });
    setIsModalOpen(true);
  };

  const openPaymentsList = (p: Payable) => {
    setSelectedPayable(p);
    fetchPayments(p.id);
    setIsPaymentsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Accounts Payable</h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Installment</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Paid</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payables.map((p) => {
              const balance = p.amount - p.paid_amount;
              const isPaid = balance <= 0.01;
              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 font-medium">{p.due_date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{p.supplier_name}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">#{p.purchase_id} - {p.installment_number}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${p.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-green-600">${p.paid_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-red-600">${balance.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openPaymentsList(p)}
                        className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors"
                        title="View Payments"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!isPaid && (
                        <button 
                          onClick={() => openPaymentModal(p)}
                          className="p-2 text-slate-400 hover:text-green-500 transition-colors"
                          title="Record Payment"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Payment">
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Installment Balance</div>
            <div className="text-xl font-black text-slate-800">
              ${(selectedPayable ? selectedPayable.amount - selectedPayable.paid_amount : 0).toFixed(2)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Payment Date</label>
            <input 
              required
              type="date" 
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Amount</label>
            <input 
              required
              type="number" 
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Payment Method</label>
            <select 
              required
              value={formData.payment_method_id}
              onChange={(e) => setFormData({ ...formData, payment_method_id: parseInt(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            >
              <option value="">Select Method</option>
              {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.description}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Record Payment
          </button>
        </form>
      </Modal>

      {/* Payments List Modal */}
      <Modal isOpen={isPaymentsModalOpen} onClose={() => setIsPaymentsModalOpen(false)} title="Payment History">
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic">No payments recorded yet.</div>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-800">${p.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">{p.payment_date} • {p.payment_method_name}</div>
                  </div>
                  <button onClick={() => setConfirmDelete({ isOpen: true, id: p.id })} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir este pagamento (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDeletePayment(confirmDelete.id)}
      />
    </div>
  );
};

const ReceivablesView = () => {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [receivingMethods, setReceivingMethods] = useState<ReceivingMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<ReceiptReportItem[]>([]);
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null);
  const [payments, setPayments] = useState<InstallmentPayment[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });
  const [formData, setFormData] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    amount: 0,
    receiving_method_id: 0
  });

  const fetchData = async () => {
    const res = await fetch('/api/receivables');
    if (res.status === 401) return; // Handled by App
    const rData = await res.json();
    
    const rmRes = await fetch('/api/receiving-methods');
    if (rmRes.status === 401) return;
    const rmData = await rmRes.json();
    
    setReceivables(rData);
    setReceivingMethods(rmData.filter((m: any) => m.is_active));
  };

  const fetchReportData = async () => {
    const res = await fetch('/api/reports/receipts');
    const data = await res.json();
    setReportData(data);
    setIsReportModalOpen(true);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the report.');
      return;
    }

    const summaryHtml = Object.entries(
      reportData.reduce((acc, curr) => {
        acc[curr.method_name] = (acc[curr.method_name] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([method, total]) => `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0;">
        <span>${method}</span>
        <span style="font-weight: bold;">$${(total as number).toFixed(2)}</span>
      </div>
    `).join('');

    const rowsHtml = reportData.map(item => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 12px 8px;">${item.payment_date}</td>
        <td style="padding: 12px 8px; font-weight: 600;">${item.customer_name}</td>
        <td style="padding: 12px 8px; color: #666;">#${item.sale_id}-${item.installment_number}</td>
        <td style="padding: 12px 8px;">${item.method_name}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: bold;">$${item.amount.toFixed(2)}</td>
      </tr>
    `).join('');

    const grandTotal = reportData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipts Report</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            h1 { margin-bottom: 10px; font-size: 24px; }
            .subtitle { color: #666; margin-bottom: 30px; font-style: italic; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; background: #f8f9fa; padding: 12px 8px; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
            .summary-box { background: #f8f9fa; padding: 20px; border-radius: 8px; }
            .summary-title { font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; color: #666; }
            .grand-total { margin-top: 20px; padding-top: 15px; border-top: 2px solid #333; display: flex; justify-content: space-between; align-items: center; }
            .total-label { font-size: 18px; font-weight: bold; }
            .total-value { font-size: 24px; font-weight: 900; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Receipts Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleDateString()}</div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Sale #</th>
                <th>Method</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="summary-box">
            <div class="summary-title">Summary by Method</div>
            ${summaryHtml}
            <div class="grand-total">
              <span class="total-label">Grand Total</span>
              <span class="total-value">$${grandTotal}</span>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const fetchPayments = async (id: number) => {
    const res = await fetch(`/api/receivables/${id}/payments`);
    const data = await res.json();
    setPayments(data);
  };

  useEffect(() => { fetchData(); }, []);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceivable) return;

    const res = await fetch('/api/receivables/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        installment_id: selectedReceivable.id
      })
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
    }
  };

  const handleDeletePayment = async (id: number) => {
    const res = await fetch(`/api/payments/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir recebimento');
    } else {
      if (selectedReceivable) fetchPayments(selectedReceivable.id);
      fetchData();
    }
  };

  const openPaymentModal = (r: Receivable) => {
    setSelectedReceivable(r);
    setFormData({
      payment_date: new Date().toISOString().split('T')[0],
      amount: r.amount - r.paid_amount,
      receiving_method_id: receivingMethods[0]?.id || 0
    });
    setIsModalOpen(true);
  };

  const openPaymentsList = (r: Receivable) => {
    setSelectedReceivable(r);
    fetchPayments(r.id);
    setIsPaymentsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold text-slate-800">Accounts Receivable</h2>
        <button 
          type="button"
          onClick={fetchReportData}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-700 transition-colors"
        >
          <Printer className="w-5 h-5" />
          Receipts Report
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Installment</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Paid</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {receivables.map((r) => {
              const balance = r.amount - r.paid_amount;
              const isPaid = balance <= 0.01;
              return (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 font-medium">{r.due_date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{r.customer_name}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">#{r.sale_id} - {r.installment_number}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${r.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-green-600">${r.paid_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-red-600">${balance.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openPaymentsList(r)}
                        className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors"
                        title="View Payments"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!isPaid && (
                        <button 
                          onClick={() => openPaymentModal(r)}
                          className="p-2 text-slate-400 hover:text-green-500 transition-colors"
                          title="Record Payment"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Payment">
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Installment Balance</div>
            <div className="text-xl font-black text-slate-800">
              ${(selectedReceivable ? selectedReceivable.amount - selectedReceivable.paid_amount : 0).toFixed(2)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Payment Date</label>
            <input 
              required
              type="date" 
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Amount</label>
            <input 
              required
              type="number" 
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Receiving Method</label>
            <select 
              required
              value={formData.receiving_method_id}
              onChange={(e) => setFormData({ ...formData, receiving_method_id: parseInt(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            >
              <option value="">Select Method</option>
              {receivingMethods.map(m => <option key={m.id} value={m.id}>{m.description}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Record Payment
          </button>
        </form>
      </Modal>

      {/* Payments List Modal */}
      <Modal isOpen={isPaymentsModalOpen} onClose={() => setIsPaymentsModalOpen(false)} title="Payment History">
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic">No payments recorded yet.</div>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-800">${p.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">{p.payment_date} • {p.receiving_method_name}</div>
                  </div>
                  <button onClick={() => setConfirmDelete({ isOpen: true, id: p.id })} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir este recebimento (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDeletePayment(confirmDelete.id)}
      />

      {/* Receipts Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Receipts Report">
        <div className="space-y-6">
          <div className="flex justify-between items-center print:hidden">
            <div className="text-slate-400 text-sm italic">This report shows all payments received.</div>
            <button 
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden print:border-0 print:rounded-none">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider print:bg-transparent print:text-black print:border-b print:border-slate-300">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Sale #</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 print:divide-slate-200">
                {reportData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-600">{item.payment_date}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{item.customer_name}</td>
                    <td className="px-4 py-3 text-slate-400">#{item.sale_id}-{item.installment_number}</td>
                    <td className="px-4 py-3 text-slate-500">{item.method_name}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl print:bg-white print:text-black print:border-t-2 print:border-slate-800 print:rounded-none">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 print:text-black">Summary by Method</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(
                reportData.reduce((acc, curr) => {
                  acc[curr.method_name] = (acc[curr.method_name] || 0) + curr.amount;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([method, total]) => (
                <div key={method} className="flex justify-between items-center border-b border-white/10 pb-2 print:border-slate-200">
                  <span className="text-sm opacity-80">{method}</span>
                  <span className="font-bold">${(total as number).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center print:border-slate-800">
              <span className="text-lg font-bold">Grand Total</span>
              <span className="text-2xl font-black">
                ${reportData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const UsersView = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({ username: '', password: '', name: '', role: 'user' });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ username: '', password: '', name: '', role: 'user' });
      fetchUsers();
    } else {
      const data = await res.json();
      alert(data.error || 'Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao excluir usuário');
    } else {
      fetchUsers();
    }
  };

  const openEdit = (u: UserProfile) => {
    setEditingUser(u);
    setFormData({ 
      username: u.username, 
      password: '', 
      name: u.name, 
      role: u.role 
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Users</h2>
        <button 
          onClick={() => { setEditingUser(null); setFormData({ username: '', password: '', name: '', role: 'user' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#11c4d4] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-700">{u.name}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{u.username}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    u.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-[#11c4d4] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: u.id })} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
            <input 
              required
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="e.g. jdoe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password {editingUser && '(leave blank to keep current)'}</label>
            <input 
              required={!editingUser}
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
            <select 
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#11c4d4]/20 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-[#11c4d4] text-white py-3 rounded-xl font-bold hover:bg-[#11c4d4]/90 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {editingUser ? 'Update User' : 'Save User'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir este usuário (ID: ${confirmDelete.id})?`}
        onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
      />
    </div>
  );
};

const LoginView = ({ onLogin }: { onLogin: (user: UserProfile) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const user = await res.json();
        onLogin(user);
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f8] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8 bg-[#11c4d4] text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <TrendingUp className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">ERP Manager</h1>
          <p className="text-white/70 text-sm font-medium mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-red-100">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#11c4d4]/20 transition-all font-medium"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#11c4d4]/20 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#11c4d4] text-white py-4 rounded-2xl font-black hover:bg-[#11c4d4]/90 transition-all shadow-lg shadow-[#11c4d4]/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="text-center">
            <p className="text-xs text-slate-400 font-medium italic">
              Default credentials: admin / admin123
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Auth check failed');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    setActiveTab('Dashboard');
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#f6f8f8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#11c4d4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginView onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardView />;
      case 'Products': return <ProductsView />;
      case 'Units': return <UnitsView />;
      case 'Customers': return <CustomersView />;
      case 'Suppliers': return <SuppliersView />;
      case 'Sales Methods': return <SalesMethodsView />;
      case 'Receiving Methods': return <ReceivingMethodsView />;
      case 'Sales': return <SalesView />;
      case 'Receivables': return <ReceivablesView />;
      case 'Purchases': return <PurchasesView />;
      case 'Payables': return <PayablesView />;
      case 'Users': return <UsersView />;
      default: return <DashboardView />;
    }
  };

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

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Products', icon: Package },
            { name: 'Units', icon: Ruler },
            { name: 'Customers', icon: Users },
            { name: 'Suppliers', icon: Truck },
            { name: 'Sales Methods', icon: CreditCard },
            { name: 'Receiving Methods', icon: Banknote },
            { name: 'Sales', icon: ShoppingCart },
            { name: 'Receivables', icon: CheckCircle },
            { name: 'Purchases', icon: ShoppingBag },
            { name: 'Payables', icon: Receipt },
            { name: 'Users', icon: Shield, adminOnly: true },
          ].filter(item => !item.adminOnly || user.role === 'admin').map((item) => (
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
          <div className="group flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#11c4d4]/20 flex items-center justify-center text-[#11c4d4]">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold truncate">{user.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
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
                src={`https://picsum.photos/seed/${user.username}/100/100`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
