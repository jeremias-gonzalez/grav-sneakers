import React, { useContext, useState, useEffect, lazy, Suspense } from 'react';
import { DataContext } from '../Context/DataContext';
import carticon from '../../../../public/imgs/shopping-cart.png'// Asegúrate de tener la ruta correcta para el ícono
import Loader from '../ui/loader'; // Importa tu componente Loader
import { Link } from 'react-router-dom';
// Lazy load del componente CartContent
const CartContent = lazy(() => import('../CartContent/CartContent')); // Cambia la ruta según tu estructura de carpetas

const Cart = () => {
  const { cart } = useContext(DataContext);
  const [active, setActive] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true); // Estado para controlar el loading

  useEffect(() => {
    const calculateTotalItems = () => {
      const total = cart.reduce((acc, product) => acc + product.quantity, 0);
      setTotalItems(total);
    };

    calculateTotalItems();
  }, [cart]);

  useEffect(() => {
    // Simula un delay de 2 segundos para mostrar el loader
    if (active) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);

      return () => clearTimeout(timer); // Limpia el timeout si el componente se desmonta
    }
  }, [active, cart]);

  return (
    <header>
       <Link to='/cart'>
      <div className="container-icon relative">
       
        <div
          className="container-cart-icon mx-5"
          onClick={() => setActive(!active)} // Alterna el estado de apertura del carrito
        >
        <img className='w-5' src={carticon} alt="" />

          {totalItems > 0 && (
            <div className="absolute top-[-.5rem] right-5 w-4 h-4 rounded-full bg-custom-blue text-white flex items-center justify-center text-xs">
              {totalItems}
            </div>
          )}
        </div>

        {/* Slide-over con CartContent o Loader */}
     
      </div>
      </Link>
    </header>
  );
};

export default Cart;

{/* <div
className={`fixed inset-0 overflow-hidden z-10 transition-transform duration-500 ${
  active ? 'translate-x-0' : 'translate-x-full'
}`}
>
<div className="absolute inset-0 overflow-hidden">
  <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setActive(false)} />
  <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
    <div className="pointer-events-auto w-screen max-w-md">
      <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between mb-7">
            <h2 className="text-lg md:text-2xl font-kelsi text-gray-900 mx-auto">Mis Productos</h2>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                onClick={() => setActive(false)}
              >
                <span className="sr-only">Cerrar panel</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cargando el contenido del carrito o mostrando el Loader */}
          // {loading ? (
          //   <div className='flex justify-center my-[25rem] md:my-[12rem]'>
          //   {/* <Loader /> */}
          //   </div> // Muestra el Loader mientras se carga
          // ) : (
          //   //<Suspense fallback={<div className='flex justify-center'> <Loader /> </div>}>
          //     <CartContent />
          //  // </Suspense>
          // )}
//         </div>
//       </div>
//     </div>
//   </div> 
// </div>
// </div> */}

   {/* {Array.isArray(allProducts) && allProducts.length ? ( // Verifica si es un array y tiene elementos
                        <>
                            <div className='row-product'>
                                {allProducts.map(product => (
                                    <div className='cart-product' key={product.id}>
                                        <div className='info-cart-product'>
                                            <span className='cantidad-producto-carrito'>
                                                {product.quantity}
                                            </span>
                                            <p className='titulo-producto-carrito'>
                                                {product.nameProduct}
                                            </p>
                                            <span className='precio-producto-carrito'>
                                                ${product.price}
                                            </span>
                                        </div>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth='1.5'
                                            stroke='currentColor'
                                            className='icon-close'
                                            onClick={() => onDeleteProduct(product)}
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M6 18L18 6M6 6l12 12'
                                            />
                                        </svg>
                                    </div>
                                ))}
                            </div>

                            <div className='cart-total'>
                                <h3>Total:</h3>
                                <span className='total-pagar'>${total}</span>
                            </div>

                            <button className='btn-clear-all' onClick={onCleanCart}>
                                Vaciar Carrito
                            </button>
                        </>
                    ) : (
                        <p className='cart-empty'>El carrito está vacío</p>
                    )} */}