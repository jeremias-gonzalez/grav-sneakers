import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Crear el contexto
export const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderForm, setOrderForm] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    priceRange: [0, 1000],
    size: '',
    color: '',
  });

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:3001"
  : "https://grav-sneakers-server.vercel.app"; // Opción 1

    // Concatenar el endpoint específico en la solicitud
    const res = await axios.get(`${apiUrl}/api/sheet-data`);
        const formattedData = res.data.map(product => ({
          id: product[0],
          brand: product[1],
          model: product[2],
          price: parseFloat(product[3].replace('.', '').replace(',', '.')) || null,
          image: product[4],
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };
    fetchData();
 
  }, []);
  
  return (
    <DataContext.Provider value={{ 
      data, 
      cart, 
      setCart, 
      selectedProduct, 
      setSelectedProduct, 
      isCartOpen, 
      toggleCart, 
      filters, 
      setFilters,
      orderForm,    // Exponemos el estado del formulario de pedido
      setOrderForm  // Exponemos la función para modificar el estado del formulario de pedido
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
