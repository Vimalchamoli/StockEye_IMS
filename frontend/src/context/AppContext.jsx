import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // ================= THEME =================
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ================= USER =================
  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@stockeye.com",
    avatar: null,
  });

  // ================= INVENTORY (PERSISTED) =================
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("inventory");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Quantum Processor",
            quantity: 42,
            price: 1250,
            category: "Hardware",
            lowStockThreshold: 10,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Neural Link Interface",
            quantity: 15,
            price: 890,
            category: "Neural",
            lowStockThreshold: 5,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Plasma Coils",
            quantity: 3,
            price: 450,
            category: "Energy",
            lowStockThreshold: 5,
            lastUpdated: new Date().toISOString(),
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  // ================= TRANSACTIONS (PERSISTED) =================
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 101,
            type: "IN",
            item: "Quantum Processor",
            qty: 20,
            date: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 102,
            type: "OUT",
            item: "Plasma Coils",
            qty: 2,
            date: new Date(Date.now() - 172800000).toISOString(),
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ================= ALERTS =================
  const [alerts, setAlerts] = useState([
    { id: 202, message: "System update scheduled", type: "info", read: true },
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setAlerts((prevAlerts) => {
        const otherAlerts = prevAlerts.filter(
          (a) => !String(a.id).startsWith("low-stock-"),
        );

        const lowStockAlerts = inventory
          .filter((item) => item.quantity <= (item.lowStockThreshold || 5))
          .map((item) => ({
            id: `low-stock-${item.id}`,
            message: `Low stock on ${item.name} (${item.quantity} remaining, threshold: ${item.lowStockThreshold || 5})`,
            type: "warning",
            read:
              prevAlerts.find((a) => a.id === `low-stock-${item.id}`)?.read ||
              false,
          }));

        return [...otherAlerts, ...lowStockAlerts];
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [inventory]);

  // ================= ACTIONS =================
  const login = (email, password) => {
    setUser({ email, name: "Admin User", avatar: null });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser({ ...user, ...updates });
  };

  const addItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      lowStockThreshold: 5,
      lastUpdated: new Date().toISOString(),
    };

    setInventory((prev) => [...prev, newItem]);

    setTransactions((prev) => [
      {
        id: Date.now() + 1,
        type: "IN",
        item: item.name,
        qty: item.quantity,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateItem = (id, updatedItem) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...updatedItem, id, lastUpdated: new Date().toISOString() }
          : item,
      ),
    );
  };

  const dismissAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)),
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        login,
        logout,
        updateProfile,
        inventory,
        addItem,
        updateItem,
        transactions,
        alerts,
        dismissAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
