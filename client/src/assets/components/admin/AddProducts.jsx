import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';

const AddProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '',
    brand: '',
    model: '',
    price: '',
    image: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [productAdded, setProductAdded] = useState(false);

  // Función para obtener productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/sheet-data`);
      const data = await response.json();

      // Transformar los sub-arrays en objetos con propiedades específicas
      const formattedData = data.map((productArray) => ({
        id: productArray[0],
        brand: productArray[1],
        model: productArray[2],
        price: productArray[3],
        image: productArray[4],
      }));
  
      setProducts(formattedData);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/delete-product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
      });

      if (response.ok) {
        console.log('Producto eliminado con éxito');
        fetchProducts(); // Actualiza la lista de productos después de eliminar
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error("Error en la eliminación:", error);
    }
  };
  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Función para manejar el envío del formulario y agregar un nuevo producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Establece el estado de procesamiento

    console.log("Producto a agregar:", newProduct); // Verifica la estructura de los datos

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/add-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price) // Asegura que el precio sea un número
        }),
      });

      if (response.ok) {
        console.log('Producto agregado con éxito');
        fetchProducts(); // Refrescar productos para mostrar el nuevo producto agregado
        setProductAdded(true); // Cambia el estado a verdadero cuando el producto se agrega
        setShowForm(false); // Cierra el formulario después de agregar
        setNewProduct({ id: '', brand: '', model: '', price: '', image: '' }); // Resetea el formulario
      } else {
        const errorData = await response.json();
        console.error("Error al agregar el producto:", errorData.message || 'Error desconocido');
      }
    } catch (error) {
      console.error("Error en el envío:", error.message);
    } finally {
      setIsProcessing(false); // Restablecer el estado de procesamiento
    }
  };

  // Llamar a fetchProducts cuando se carga el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <SideBar />
      <div className='flex flex-col md:mx-96 md:px-80'>
        <h2 className="text-2xl text-custom-blue montserrat2 mb-4 text-center my-5 mb-10 ">Lista de Productos</h2>
        <ul>
          {products.length > 0 ? (
            products.map((product, index) => (
              <li key={index} className="border border-gray-200 mb-3 mx-10 ">
                           <button
                  onClick={() => handleDelete(product.id)}
                  className="mt-2 p-2 text-white rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z"></path>
</svg>
                </button>
                <img src={product.image} alt={product.model} className="w-40 h-40 mb-2 mx-auto rounded-lg " />
                <div className='flex flex-col'>
                  <p className='text-center'><strong>ID:</strong> {product.id}</p>
                  <p className='text-center'><strong>Marca:</strong> {product.brand}</p>
                  <p className='text-center'><strong>Modelo:</strong> {product.model}</p>
                  <p className='text-center'><strong>Precio:</strong> ${product.price}</p>
                </div>
     
              </li>
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </ul>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 p-2 bg-custom-blue montserrat2 mx-10 my-10 text-white rounded"
        >
          Agregar un producto
        </button>
      </div>
      {/* Formulario emergente */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl montserrat2 mx-auto mb-4">Nuevo Producto</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block">ID:</label>
                <input
                  type="number"
                  name="id"
                  value={newProduct.id}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block">Marca:</label>
                <input
                  type="text"
                  name="brand"
                  value={newProduct.brand}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block">Modelo:</label>
                <input
                  type="text"
                  name="model"
                  value={newProduct.model}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block">Precio:</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block">Imagen (URL):</label>
                <input
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-2 bg-red-900 montserrat2 text-white rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="p-2 bg-custom-blue montserrat2 text-white rounded"
                  disabled={isProcessing} // Deshabilita el botón mientras se procesa
                >
                  {isProcessing ? 'Agregando...' : 'Agregar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProducts;
