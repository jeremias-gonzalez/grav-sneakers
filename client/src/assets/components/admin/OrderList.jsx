import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import SideBar from './SideBar';
import Logo from '../Logo/Logo';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`);
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      const data = await response.json();
      console.log('Datos de la respuesta:', data); // Para verificar la respuesta

      // Transformar los datos recibidos
      const transformedOrders = data.map(order => {
        return {
          customerName: order.customerName || 'Sin nombre',
          customerSurname: order.customerSurname || 'Sin apellido',
          customerDNI: order.customerDNI || 'Sin DNI',
          customerTelefono: order.customerTelefono || 'Sin teléfono',
          shippingMethod: order.shippingMethod || 'Sin método de envío',
          customerEmail: order.customerEmail || 'Sin email',
          address: {
            street: order.address.street || 'Sin calle',
            number: order.address.number || 'Sin número',
            city: order.address.city || 'Sin ciudad',
            province: order.address.province || 'Sin provincia',
          },
          cartItems: order.cartItems || [], // Asumiendo que es un array
          totalPrice: order.totalPrice || '$N/A',
          paymentMethod: order.paymentMethod || 'Sin método de pago',
        };
      });

      console.log('Pedidos transformados:', transformedOrders); // Verificar la transformación
      setOrders(transformedOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Cambiar a estado de no carga
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <SideBar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl montserrat2 text-custom-blue text-center mb-6">Pedidos</h2>
        {loading && <p className="text-center">Cargando pedidos...</p>} {/* Mensaje de carga */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <ul className="space-y-4">
          {orders.map((order, index) => (
            <li key={index} className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold">Nombre Completo: {order.customerName} {order.customerSurname}</span>
                  <span className="text-gray-500">Email: {order.customerEmail} | DNI: {order.customerDNI} | Numero de Teléfono: {order.customerTelefono}</span>
                  <span className="mt-1">
                    Método de Envío: <span className="font-medium">{order.shippingMethod}</span>
                    {order.shippingMethod === 'domicilio' && (
                      <span className="block">
                        Dirección: {order.address.street}, {order.address.number}, {order.address.city}, {order.address.province}
                      </span>
                    )}
                  </span>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <span className="block">Método de Pago: <span className="font-medium">{order.paymentMethod}</span></span>
                  <span className="block mt-2">Total: <span className="font-semibold text-lg">${order.totalPrice}</span></span>
                </div>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Productos:</span>
                <div className="flex flex-wrap">
                {order.cartItems && order.cartItems.length > 0 ? (
  order.cartItems.map((item, itemIndex) => (
    <div key={itemIndex} className="flex items-center mr-2 mt-1">
      <img src={item.image} alt={`${item.brand} ${item.model}`} className="w-20 h-20 rounded" />
      <span className="mr-1">{item.brand} {item.model}</span>
    </div>
  ))
) : (
  <p>No hay productos en esta orden.</p>
)}

                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default OrdersList;
