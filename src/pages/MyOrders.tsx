import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle, XCircle, Truck, Clock } from "lucide-react";
import { toast } from "sonner";

const MyOrders = () => {
  const { user } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "preparing":
        return <Package className="h-5 w-5 text-orange-500" />;
      case "out_for_delivery":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "Processando";
      case "preparing":
        return "Em Preparo";
      case "out_for_delivery":
        return "Em Entrega";
      case "delivered":
        return "Entregue";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar este pedido?")) {
      await cancelOrder(orderId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
          <Button
            onClick={() => navigate("/")}
            className="mt-4"
          >
            Fazer um pedido
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleDateString();
            const formattedTime = orderDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <h2 className="text-lg font-semibold">
                        Pedido #{order.id} {/* Mostra o ID real do pedido */}
                        {order.orderId ? (
                          <span className="text-xs text-gray-400 ml-2">(Ref: {order.orderId})</span>
                        ) : null}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formattedDate} às {formattedTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "preparing"
                          ? "bg-orange-100 text-orange-800"
                          : order.status === "out_for_delivery"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getStatusText(order.status)}
                    </span>
                    {order.status === "processing" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    {(order.items || []).map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.product?.name}
                        </span>
                        <span className="font-medium">
                          R$ {(item.product?.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Endereço de entrega:</p>
                        <p className="text-sm font-medium">{order.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total do pedido:</p>
                        <p className="text-lg font-bold">
                          R$ {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;