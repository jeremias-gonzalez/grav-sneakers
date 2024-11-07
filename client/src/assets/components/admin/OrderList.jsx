import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import SideBar from './SideBar';
import Logo from '../Logo/Logo';
import './admin.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [orderToDelete, setOrderToDelete] = useState(null); // Estado para almacenar el pedido a eliminar
  const [notification, setNotification] = useState({ visible: false, message: '' });

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`);
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Cambiar a estado de no carga
    }
  };

  const handleDelete = async (orderNumber, customerName, customerSurname) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/delete-order`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderNumber, customerName, customerSurname }),
      });

      if (response.ok) {
        console.log('Pedido eliminado con éxito');
        setNotification({ visible: true, message: 'Pedido eliminado con éxito!' });
        fetchOrders(); // Actualiza la lista de pedidos después de eliminar
        setIsModalOpen(false); // Cierra el modal después de eliminar
        setTimeout(() => setNotification({ visible: false, message: '' }), 10);
      } else {
        console.error('Error al eliminar el pedido');
      }
    } catch (error) {
      console.error("Error en la eliminación:", error);
    }
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      handleDelete(orderToDelete.NumOrder, orderToDelete.customerName, orderToDelete.customerSurname);
    }
  };

  const openModal = (order) => {
    setOrderToDelete(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderToDelete(null);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <SideBar />
      <div className="container mx-auto p-4 md:mx-96 md:px-96">
        <h2 className="text-2xl montserrat2 text-custom-blue text-center mb-6">Pedidos</h2>
        {loading && <p className="text-center">Cargando pedidos...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <ul className="space-y-4">
          {orders.map((order, index) => (
            <li key={index} className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row md:justify-between md:flex-row">
                <div className="flex flex-col">
                  <button
                    onClick={() => openModal(order)}
                    className="mt-2 p-2 text-white "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z"></path>
                    </svg>
                  </button>
                  <span>Numero De Pedido : {order.NumOrder}</span>
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
                       <div className='flex flex-col mx-5'> <span className="mr-1">{item.brand} {item.model}</span>
                        <span className="mr-1">Cantidad:{item.quantity}</span>
                        </div>
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

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-70" onClick={closeModal}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full z-10">
              <h3 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas eliminar este pedido?</h3>
              <div className="flex justify-end">
                <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
                <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
              </div>
            </div>
          </div>
        )}

        {notification.visible && (
          <div className="fixed bottom-0 right-0 m-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {notification.message}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersList;
