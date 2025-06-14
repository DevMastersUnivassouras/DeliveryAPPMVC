import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
type OrderStatus = 'processing' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  address: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: PaymentStatus;
  userId?: string;
}

type OrderContextType = {
  orders: Order[];
  placeOrder: (items: CartItem[], address: string) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  cancelOrder: (id: string) => Promise<void>;
  clearUserOrders: () => void;
  fetchUserOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  // Recupera o token do localStorage
  const token = localStorage.getItem('token');

  const fetchUserOrders = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/orders/user/${user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro HTTP:', response.status, errorText);
        throw new Error('Failed to fetch user orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const pollInterval = setInterval(() => {
      fetchUserOrders();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [user?.id]);

  const placeOrder = async (items: CartItem[], address: string): Promise<Order> => {
    try {
      const response = await fetch('http://localhost:5000/api/checkout-simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          address,
          customer: {
            id: user?.id || 'guest',
            name: user?.name || 'Cliente Convidado',
            email: user?.email || 'guest@example.com'
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar pedido');
      }

      const data = await response.json();
      
      const newOrder: Order = {
        id: data.orderId,
        items,
        total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 3.99,
        status: 'processing',
        address,
        orderId: data.orderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentStatus: 'paid',
        userId: user?.id
      };

      setOrders(prevOrders => [...prevOrders, newOrder]);
      
      return newOrder;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === id) {
          return {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === id) {
          return {
            ...order,
            paymentStatus: status,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  const cancelOrder = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro HTTP:', response.status, errorText);
        throw new Error('Erro ao cancelar pedido');
      }

      await fetchUserOrders();
      toast.success('Pedido cancelado com sucesso');
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      toast.error('Erro ao cancelar pedido');
    }
  };

  const clearUserOrders = () => {
    setOrders([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
        updateOrderStatus,
        updatePaymentStatus,
        cancelOrder,
        clearUserOrders,
        fetchUserOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};