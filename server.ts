import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("erp.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unit_id INTEGER,
    price REAL NOT NULL,
    cost_price REAL DEFAULT 0,
    average_cost REAL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    FOREIGN KEY (unit_id) REFERENCES units (id)
  );

  -- Ensure columns exist for existing databases
  -- Using try-catch style in JS or just separate execs

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT
  );

  CREATE TABLE IF NOT EXISTS sales_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    installments INTEGER NOT NULL,
    due_days TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS receiving_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    sales_method_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    sale_date TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers (id),
    FOREIGN KEY (sales_method_id) REFERENCES sales_methods (id)
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity REAL NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  );

  CREATE TABLE IF NOT EXISTS sale_installments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    installment_number INTEGER NOT NULL,
    due_date TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales (id)
  );

  CREATE TABLE IF NOT EXISTS installment_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    installment_id INTEGER NOT NULL,
    payment_date TEXT NOT NULL,
    amount REAL NOT NULL,
    receiving_method_id INTEGER NOT NULL,
    FOREIGN KEY (installment_id) REFERENCES sale_installments (id),
    FOREIGN KEY (receiving_method_id) REFERENCES receiving_methods (id)
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    tax_id TEXT
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    purchase_date TEXT NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
  );

  CREATE TABLE IF NOT EXISTS purchase_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity REAL NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  );

  CREATE TABLE IF NOT EXISTS purchase_installments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER NOT NULL,
    installment_number INTEGER NOT NULL,
    due_date TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases (id)
  );

  CREATE TABLE IF NOT EXISTS payable_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    installment_id INTEGER NOT NULL,
    payment_date TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_method_id INTEGER NOT NULL,
    FOREIGN KEY (installment_id) REFERENCES purchase_installments (id),
    FOREIGN KEY (payment_method_id) REFERENCES receiving_methods (id)
  );
`);

// Migration: Ensure columns exist for products
try { db.exec("ALTER TABLE products ADD COLUMN cost_price REAL DEFAULT 0"); } catch (e) {}
try { db.exec("ALTER TABLE products ADD COLUMN average_cost REAL DEFAULT 0"); } catch (e) {}

// Seed initial data if empty
const unitCount = db.prepare("SELECT count(*) as count FROM units").get() as { count: number };
if (unitCount.count === 0) {
  db.prepare("INSERT INTO units (name, abbreviation) VALUES (?, ?)").run("Unit", "un");
  db.prepare("INSERT INTO units (name, abbreviation) VALUES (?, ?)").run("Kilogram", "kg");
  db.prepare("INSERT INTO units (name, abbreviation) VALUES (?, ?)").run("Liter", "lt");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes - Units
  app.get("/api/units", (req, res) => {
    const units = db.prepare("SELECT * FROM units").all();
    res.json(units);
  });

  app.post("/api/units", (req, res) => {
    const { name, abbreviation } = req.body;
    const result = db.prepare("INSERT INTO units (name, abbreviation) VALUES (?, ?)").run(name, abbreviation);
    res.json({ id: result.lastInsertRowid, name, abbreviation });
  });

  app.put("/api/units/:id", (req, res) => {
    const { name, abbreviation } = req.body;
    db.prepare("UPDATE units SET name = ?, abbreviation = ? WHERE id = ?").run(name, abbreviation, req.params.id);
    res.json({ id: req.params.id, name, abbreviation });
  });

  app.delete("/api/units/:id", (req, res) => {
    db.prepare("DELETE FROM units WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Routes - Products
  app.get("/api/products", (req, res) => {
    const products = db.prepare(`
      SELECT p.*, u.name as unit_name, u.abbreviation as unit_abbr 
      FROM products p 
      LEFT JOIN units u ON p.unit_id = u.id
    `).all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { name, unit_id, price, cost_price, average_cost, stock } = req.body;
    const result = db.prepare("INSERT INTO products (name, unit_id, price, cost_price, average_cost, stock) VALUES (?, ?, ?, ?, ?, ?)").run(name, unit_id, price, cost_price || 0, average_cost || 0, stock);
    res.json({ id: result.lastInsertRowid, name, unit_id, price, cost_price, average_cost, stock });
  });

  app.put("/api/products/:id", (req, res) => {
    const { name, unit_id, price, cost_price, average_cost, stock } = req.body;
    db.prepare("UPDATE products SET name = ?, unit_id = ?, price = ?, cost_price = ?, average_cost = ?, stock = ? WHERE id = ?").run(name, unit_id, price, cost_price, average_cost, stock, req.params.id);
    res.json({ id: req.params.id, name, unit_id, price, cost_price, average_cost, stock });
  });

  app.delete("/api/products/:id", (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Routes - Customers
  app.get("/api/customers", (req, res) => {
    const customers = db.prepare("SELECT * FROM customers").all();
    res.json(customers);
  });

  app.post("/api/customers", (req, res) => {
    const { name, email, phone, address } = req.body;
    const result = db.prepare("INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)").run(name, email, phone, address);
    res.json({ id: result.lastInsertRowid, name, email, phone, address });
  });

  app.put("/api/customers/:id", (req, res) => {
    const { name, email, phone, address } = req.body;
    db.prepare("UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?").run(name, email, phone, address, req.params.id);
    res.json({ id: req.params.id, name, email, phone, address });
  });

  app.delete("/api/customers/:id", (req, res) => {
    db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Routes - Suppliers
  app.get("/api/suppliers", (req, res) => {
    const suppliers = db.prepare("SELECT * FROM suppliers").all();
    res.json(suppliers);
  });

  app.post("/api/suppliers", (req, res) => {
    const { name, contact_name, email, phone, address, tax_id } = req.body;
    const result = db.prepare("INSERT INTO suppliers (name, contact_name, email, phone, address, tax_id) VALUES (?, ?, ?, ?, ?, ?)").run(name, contact_name, email, phone, address, tax_id);
    res.json({ id: result.lastInsertRowid, name, contact_name, email, phone, address, tax_id });
  });

  app.put("/api/suppliers/:id", (req, res) => {
    const { name, contact_name, email, phone, address, tax_id } = req.body;
    db.prepare("UPDATE suppliers SET name = ?, contact_name = ?, email = ?, phone = ?, address = ?, tax_id = ? WHERE id = ?").run(name, contact_name, email, phone, address, tax_id, req.params.id);
    res.json({ id: req.params.id, name, contact_name, email, phone, address, tax_id });
  });

  app.delete("/api/suppliers/:id", (req, res) => {
    db.prepare("DELETE FROM suppliers WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Routes - Sales Methods
  app.get("/api/sales-methods", (req, res) => {
    const methods = db.prepare("SELECT * FROM sales_methods").all();
    res.json(methods);
  });

  app.post("/api/sales-methods", (req, res) => {
    const { description, installments, due_days } = req.body;
    const result = db.prepare("INSERT INTO sales_methods (description, installments, due_days) VALUES (?, ?, ?)").run(description, installments, due_days);
    res.json({ id: result.lastInsertRowid, description, installments, due_days });
  });

  app.put("/api/sales-methods/:id", (req, res) => {
    const { description, installments, due_days } = req.body;
    db.prepare("UPDATE sales_methods SET description = ?, installments = ?, due_days = ? WHERE id = ?").run(description, installments, due_days, req.params.id);
    res.json({ id: req.params.id, description, installments, due_days });
  });

  app.delete("/api/sales-methods/:id", (req, res) => {
    db.prepare("DELETE FROM sales_methods WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Routes - Receiving Methods
  app.get("/api/receiving-methods", (req, res) => {
    const methods = db.prepare("SELECT * FROM receiving_methods").all();
    res.json(methods);
  });

  app.post("/api/receiving-methods", (req, res) => {
    const { description, is_active } = req.body;
    const result = db.prepare("INSERT INTO receiving_methods (description, is_active) VALUES (?, ?)").run(description, is_active ? 1 : 0);
    res.json({ id: result.lastInsertRowid, description, is_active });
  });

  app.put("/api/receiving-methods/:id", (req, res) => {
    const { description, is_active } = req.body;
    db.prepare("UPDATE receiving_methods SET description = ?, is_active = ? WHERE id = ?").run(description, is_active ? 1 : 0, req.params.id);
    res.json({ id: req.params.id, description, is_active });
  });

  app.delete("/api/receiving-methods/:id", (req, res) => {
    db.prepare("DELETE FROM receiving_methods WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // API Routes - Sales
  app.get("/api/sales", (req, res) => {
    const sales = db.prepare(`
      SELECT s.*, c.name as customer_name, sm.description as sales_method_name 
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      JOIN sales_methods sm ON s.sales_method_id = sm.id
      ORDER BY s.id DESC
    `).all();
    res.json(sales);
  });

  app.get("/api/sales/:id", (req, res) => {
    const sale = db.prepare(`
      SELECT s.*, c.name as customer_name, sm.description as sales_method_name 
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      JOIN sales_methods sm ON s.sales_method_id = sm.id
      WHERE s.id = ?
    `).get(req.params.id);

    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const items = db.prepare(`
      SELECT si.*, p.name as product_name, u.abbreviation as unit_abbr
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      JOIN units u ON p.unit_id = u.id
      WHERE si.sale_id = ?
    `).all(req.params.id);

    const installments = db.prepare(`
      SELECT * FROM sale_installments WHERE sale_id = ? ORDER BY installment_number
    `).all(req.params.id);

    res.json({ ...sale, items, installments });
  });

  app.post("/api/sales", (req, res) => {
    const { customer_id, sales_method_id, total_amount, sale_date, items, installments } = req.body;
    
    const transaction = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO sales (customer_id, sales_method_id, total_amount, sale_date)
        VALUES (?, ?, ?, ?)
      `).run(customer_id, sales_method_id, total_amount, sale_date);
      
      const saleId = result.lastInsertRowid;

      const insertItem = db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `);

      const updateStock = db.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `);

      for (const item of items) {
        insertItem.run(saleId, item.product_id, item.quantity, item.unit_price);
        updateStock.run(item.quantity, item.product_id);
      }

      if (installments && installments.length > 0) {
        const insertInstallment = db.prepare(`
          INSERT INTO sale_installments (sale_id, installment_number, due_date, amount)
          VALUES (?, ?, ?, ?)
        `);
        for (const inst of installments) {
          insertInstallment.run(saleId, inst.installment_number, inst.due_date, inst.amount);
        }
      }

      return saleId;
    });

    try {
      const id = transaction();
      res.json({ id, success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/sales/:id", (req, res) => {
    const transaction = db.transaction(() => {
      // Revert stock
      const items = db.prepare("SELECT product_id, quantity FROM sale_items WHERE sale_id = ?").all(req.params.id) as any[];
      const updateStock = db.prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
      for (const item of items) {
        updateStock.run(item.quantity, item.product_id);
      }

      db.prepare("DELETE FROM sale_installments WHERE sale_id = ?").run(req.params.id);
      db.prepare("DELETE FROM sale_items WHERE sale_id = ?").run(req.params.id);
      db.prepare("DELETE FROM sales WHERE id = ?").run(req.params.id);
    });

    try {
      transaction();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Accounts Receivable (Receivables)
  app.get("/api/receivables", (req, res) => {
    const installments = db.prepare(`
      SELECT 
        si.id, 
        si.sale_id, 
        si.installment_number, 
        si.due_date, 
        si.amount,
        c.name as customer_name,
        COALESCE(SUM(ip.amount), 0) as paid_amount
      FROM sale_installments si
      JOIN sales s ON si.sale_id = s.id
      JOIN customers c ON s.customer_id = c.id
      LEFT JOIN installment_payments ip ON si.id = ip.installment_id
      GROUP BY si.id
      ORDER BY si.due_date ASC
    `).all();
    res.json(installments);
  });

  app.get("/api/receivables/:id/payments", (req, res) => {
    const payments = db.prepare(`
      SELECT ip.*, rm.description as receiving_method_name
      FROM installment_payments ip
      JOIN receiving_methods rm ON ip.receiving_method_id = rm.id
      WHERE ip.installment_id = ?
      ORDER BY ip.payment_date DESC
    `).all(req.params.id);
    res.json(payments);
  });

  app.post("/api/receivables/payments", (req, res) => {
    const { installment_id, payment_date, amount, receiving_method_id } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO installment_payments (installment_id, payment_date, amount, receiving_method_id)
        VALUES (?, ?, ?, ?)
      `).run(installment_id, payment_date, amount, receiving_method_id);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/payments/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM installment_payments WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/payments/:id", (req, res) => {
    const { payment_date, amount, receiving_method_id } = req.body;
    try {
      db.prepare(`
        UPDATE installment_payments 
        SET payment_date = ?, amount = ?, receiving_method_id = ?
        WHERE id = ?
      `).run(payment_date, amount, receiving_method_id, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Purchases
  app.get("/api/purchases", (req, res) => {
    const purchases = db.prepare(`
      SELECT p.*, s.name as supplier_name 
      FROM purchases p 
      JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.purchase_date DESC
    `).all();
    res.json(purchases);
  });

  app.get("/api/purchases/:id", (req, res) => {
    const purchase = db.prepare(`
      SELECT p.*, s.name as supplier_name 
      FROM purchases p 
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = ?
    `).get(req.params.id);

    if (purchase) {
      const items = db.prepare(`
        SELECT pi.*, pr.name as product_name, u.abbreviation as unit_abbr
        FROM purchase_items pi
        JOIN products pr ON pi.product_id = pr.id
        LEFT JOIN units u ON pr.unit_id = u.id
        WHERE pi.purchase_id = ?
      `).all(req.params.id);

      const installments = db.prepare(`
        SELECT * FROM purchase_installments WHERE purchase_id = ?
      `).all(req.params.id);

      res.json({ ...purchase, items, installments });
    } else {
      res.status(404).json({ error: "Purchase not found" });
    }
  });

  app.post("/api/purchases", (req, res) => {
    const { supplier_id, total_amount, purchase_date, items, installments } = req.body;
    
    const transaction = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO purchases (supplier_id, total_amount, purchase_date)
        VALUES (?, ?, ?)
      `).run(supplier_id, total_amount, purchase_date);
      
      const purchaseId = result.lastInsertRowid;

      const insertItem = db.prepare(`
        INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
      `);

      const getProduct = db.prepare(`SELECT stock, average_cost FROM products WHERE id = ?`);
      const updateProduct = db.prepare(`
        UPDATE products 
        SET stock = stock + ?, 
            cost_price = ?, 
            average_cost = ?, 
            price = ? 
        WHERE id = ?
      `);

      for (const item of items) {
        insertItem.run(purchaseId, item.product_id, item.quantity, item.unit_price);
        
        const currentProduct = getProduct.get(item.product_id) as { stock: number, average_cost: number };
        const currentStock = currentProduct.stock || 0;
        const currentAvgCost = currentProduct.average_cost || 0;
        
        const newStock = currentStock + item.quantity;
        const newAvgCost = newStock > 0 
          ? ((currentStock * currentAvgCost) + (item.quantity * item.unit_price)) / newStock
          : item.unit_price;
        
        updateProduct.run(item.quantity, item.unit_price, newAvgCost, item.sale_price, item.product_id);
      }

      if (installments && installments.length > 0) {
        const insertInstallment = db.prepare(`
          INSERT INTO purchase_installments (purchase_id, installment_number, due_date, amount)
          VALUES (?, ?, ?, ?)
        `);
        for (const inst of installments) {
          insertInstallment.run(purchaseId, inst.installment_number, inst.due_date, inst.amount);
        }
      }

      return purchaseId;
    });

    try {
      const id = transaction();
      res.json({ id, success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/purchases/:id", (req, res) => {
    const transaction = db.transaction(() => {
      // Revert stock
      const items = db.prepare("SELECT product_id, quantity FROM purchase_items WHERE purchase_id = ?").all(req.params.id) as any[];
      const updateStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
      for (const item of items) {
        updateStock.run(item.quantity, item.product_id);
      }

      db.prepare("DELETE FROM purchase_installments WHERE purchase_id = ?").run(req.params.id);
      db.prepare("DELETE FROM purchase_items WHERE purchase_id = ?").run(req.params.id);
      db.prepare("DELETE FROM purchases WHERE id = ?").run(req.params.id);
    });

    try {
      transaction();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Accounts Payable (Payables)
  app.get("/api/payables", (req, res) => {
    const installments = db.prepare(`
      SELECT 
        pi.id, 
        pi.purchase_id, 
        pi.installment_number, 
        pi.due_date, 
        pi.amount,
        s.name as supplier_name,
        COALESCE(SUM(pp.amount), 0) as paid_amount
      FROM purchase_installments pi
      JOIN purchases p ON pi.purchase_id = p.id
      JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN payable_payments pp ON pi.id = pp.installment_id
      GROUP BY pi.id
      ORDER BY pi.due_date ASC
    `).all();
    res.json(installments);
  });

  app.get("/api/payables/:id/payments", (req, res) => {
    const payments = db.prepare(`
      SELECT pp.*, rm.description as payment_method_name
      FROM payable_payments pp
      JOIN receiving_methods rm ON pp.payment_method_id = rm.id
      WHERE pp.installment_id = ?
      ORDER BY pp.payment_date DESC
    `).all(req.params.id);
    res.json(payments);
  });

  app.post("/api/payables/payments", (req, res) => {
    const { installment_id, payment_date, amount, payment_method_id } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO payable_payments (installment_id, payment_date, amount, payment_method_id)
        VALUES (?, ?, ?, ?)
      `).run(installment_id, payment_date, amount, payment_method_id);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/payable-payments/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM payable_payments WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Reports
  app.get("/api/reports/receipts", (req, res) => {
    try {
      const receipts = db.prepare(`
        SELECT 
          ip.payment_date,
          ip.amount,
          rm.description as method_name,
          c.name as customer_name,
          si.sale_id,
          si.installment_number
        FROM installment_payments ip
        JOIN sale_installments si ON ip.installment_id = si.id
        JOIN sales s ON si.sale_id = s.id
        JOIN customers c ON s.customer_id = c.id
        JOIN receiving_methods rm ON ip.receiving_method_id = rm.id
        ORDER BY ip.payment_date DESC
      `).all();
      res.json(receipts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
