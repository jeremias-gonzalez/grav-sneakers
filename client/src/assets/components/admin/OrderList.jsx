import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import SideBar from './SideBar';
import Logo from '../Logo/Logo';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`);
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      const data = await response.json();
     // Ver la estructura de los datos
      // Transformar el array de arrays a un array de objetos
      const transformedOrders = data.map(orderArray => {
        return {
          customerName: orderArray[0],
          customerSurname: orderArray[1],
          customerDNI: orderArray[2],
          customerTelefono: orderArray[3],
          shippingMethod: orderArray[4],
          customerEmail: orderArray[5],
          address: {
            street: orderArray[6],
            number: orderArray[7],
            city: orderArray[10],
            province: orderArray[11],
          },
          cartItems: JSON.parse(orderArray[12]), // Convertir el string a un objeto
          totalPrice: orderArray[13],
          paymentMethod: orderArray[14],
        };
      });
      setOrders(transformedOrders);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
    <SideBar/>
   
    <div className="container mx-auto p-4">
    <h2 className="text-2xl montserrat2 text-custom-blue text-center mb-6">Pedidos</h2>
    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    <ul className="space-y-4">
      {orders.map((order, index) => (
        <li key={index} className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex flex-col">
              <span className="font-semibold">Nombre Completo: {order.customerName} {order.customerSurname}</span>
              <span className="text-gray-500">Email: {order.customerEmail} | DNI:
                 {order.customerDNI} | Numero de Teléfono: {order.customerTelefono}</span>
              <span className="mt-1">
                Método de Envío: <span className="font-medium">{order.shippingMethod}</span>
                {order.shippingMethod === 'domicilio' && (
                  <>
                    <span className="block">Dirección: {order.address.street && order.address.number && order.address.city && order.address.province 
                      ? `${order.address.street}, ${order.address.number}, ${order.address.city}, ${order.address.province}` 
                      : 'Sin dirección, Sin número, Sin ciudad, Sin provincia'}</span>
                  </>
                )}
              </span>
            </div>
            <div className="mt-2 md:mt-0 md:text-right">
              <span className="block">Método de Pago: <span className="font-medium">{order.paymentMethod}</span></span>
              <span className="block mt-2">Total: <span className="font-semibold text-lg">${order.totalPrice.toLocaleString()}</span></span>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-semibold">Productos:</span>
            <div className="flex flex-wrap">
              {order.cartItems.map(item => (
                <div key={item.id} className="flex items-center  mr-2 mt-1">
                 
                  <img src={item.image} alt={`${item.brand} ${item.model}`} className="w-20 h-20 rounded" />
                  <span className="mr-1">{item.brand} {item.model}</span>
                </div>
              ))}
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
