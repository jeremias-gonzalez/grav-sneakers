import React, { useContext, useState, useMemo , useEffect } from 'react';
import { DataContext } from '../Context/DataContext';
import './bigcart.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import BankDetails from './BankDetails/BankDetails'; // Importar el componente BankDetails
import Confetti from 'react-confetti';

const PaymentMethod = ({ onSelectPayment }) => (
  <div className="payment-method-section">
       <div>
              <div className="overflow-hidden rounded-full bg-gray-200">
                <div className="h-2 w-2/2 rounded-full bg-custom-blue"></div>
              </div>

              <ol className="my-2 grid grid-cols-3 text-sm font-medium text-gray-500">
                <li className="flex items-center justify-start text-gray-900 sm:gap-1.5">
                  <span className="hidden sm:inline">
                     DATOS 
                  </span>
                  <svg
                    className="size-6 sm:size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg> 
                  <span className="hidden sm:inline">
                  Y ENVIO
                  </span>
                  <svg
                    className="size-6 sm:size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </li>

                {/* <li className="flex items-center justify-center text-blue-600 sm:gap-1.5">
                  <span className="hidden sm:inline"> Address </span>

                 
      </li> */}

      <li className="flex items-center justify-end text-custom-blue sm:gap-1.5">
        <span className="hidden sm:inline"> PAGO </span>

        <svg
          className="size-6 sm:size-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </li>
    </ol>
  </div>

                  <hr className='mb-10 'style={{ boxShadow: '0 4px 10px rgba(0, 123, 255, 0.5)' }} />
    <h3 className='flex justify-center text-2xl montserrat2 mb-10 '>Método de Pago</h3>
    <div className='flex flex-col my-5'>
    <label >
      {/* <input
     
        type="radio"
        name="paymentMethod"
        value="efectivo"
        onChange={(e) => onSelectPayment(e.target.value)}
      /> */}
      {/* Efectivo */}
    </label>
    <label className='rounded-lg  flex border border-custom-blue md:w-full w-full  p-2 '>
      <input
       className='mx-2 hidden-radio '
        type="radio"
        name="paymentMethod"
        value="transferencia"
        onChange={(e) => onSelectPayment(e.target.value)}
      />
       <label htmlFor="sucursal" className="custom-radio"></label>
      <div className='flex gap-3'>
       <img className='w-10 h-10 my-4 md:my-4 md:h-16 md:w-16' src="https://dk0k1i3js6c49.cloudfront.net/iconos-pago/iconos-checkout/bank-payment-icon.png" alt="" />
     
     <div className='flex flex-col my-3 md:my-3'>
      <h1 className='montserrat2 text-sm md:text-lg md:mx-4'>Transferencia Bancaria</h1>
     <p className='montserrat text-xs md:text-sm md:mx-4'>Al finalizar, te mostraremos los datos bancarios para pagar</p>
     </div>
     </div>
    </label>
    {/* <label className='rounded-lg flex border border-custom-blue md:w-full w-full p-2'>
        <input
          className='mx-2 hidden-radio'
          type="radio"
          name="paymentMethod"
          value="mercadoPago"
          onChange={(e) => onSelectPayment(e.target.value)}
        />
        <label htmlFor="mercadoPago" className="custom-radio"></label>
        <div className='flex gap-3'>
          <img className='w-10 h-10 my-4 md:my-4 md:h-16 md:w-16' src="https://www.mercadopago.com.br/org-img/MP3/home/mercado-pago-icon.svg" alt="" />
          <div className='flex flex-col my-3 md:my-3'>
            <h1 className='montserrat2 text-sm md:text-lg md:mx-4'>Mercado Pago</h1>
            <p className='montserrat text-xs md:text-sm md:mx-4'>Realiza tu pago de forma segura</p>
          </div>
        </div>
      </label> */}
    </div>
  </div>
);

const BigCart = () => {
  const [order, setOrder] = useState([]);
  const { cart, setCart } = useContext(DataContext);
  const [customerName, setCustomerName] = useState('');
  const [customerSurname, setCustomerSurname] = useState('');
  const [customerDNI, setCustomerDNI] = useState(''); 
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerTelefono, setCustomerTelefono] = useState('');
  const [shippingMethod, setShippingMethod] = useState('sucursal');
  const [address, setAddress] = useState({ street: '', number: '', piso: '', depto: '', city: '', province: '', postalCode: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [ NumOrder, setNumOrder] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(true);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const shippingCost = shippingMethod === 'sucursal' ? 6167 : shippingMethod === 'domicilio' ? 8000 : 0;
  const totalPrice = cartSubtotal + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderData = {
      NumOrder,
      customerName,
      customerSurname,
      customerEmail,
      customerDNI,
      customerTelefono,
      shippingMethod,
      address,
      paymentMethod,
      NumOrder,
      cartItems: cart,
      totalPrice
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/add-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json(); // Suponiendo que el backend devuelve datos JSON

        // Verificar el método de pago y redirigir si es Mercado Pago
        if (paymentMethod === 'mercadoPago') {
          window.location.href = data.checkoutUrl; // Reemplaza con la URL del checkout que devuelvas desde el backend
        } else {
          console.log('Pedido enviado con éxito');
          setOrderSubmitted(true);
          setShowPaymentMethods(false);
        }
      } else {
        console.error('Error al enviar el pedido:', response.statusText);
        alert('Hubo un error al realizar el pedido');
      }
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      alert('Hubo un error en la conexión al servidor');
    } finally {
      setIsProcessing(false);
    }
  };
  const fetchNumOrder = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`);
      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }
      const data = await response.json();
      console.log('Datos de la respuesta:', data);
  
      // Obtener el primer número de pedido
      const firstOrder = data[0]?.NumOrder || 'Sin Orden';
      setNumOrder(firstOrder); // Cambié esto a setNumOrder
    } catch (err) {
      console.error(err);
    }
  };
  const generateWhatsAppLink = (cart, total) => {
    const baseUrl = 'https://api.whatsapp.com/send?phone=543585181780';
    let message = 'Hola!👟, realicé la compra de los siguientes productos y aqui va mi comprobante!:\n';

    cart.forEach((product) => {
      message += `- ${product.brand} ${product.model}, Precio por unidad: $${product.price.toLocaleString()}, Cantidad: ${product.quantity}\n`;
    });

    message += `\nTotal de la compra: $${total.toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}&text=${encodedMessage}`;
  };

  const handleWhatsAppShare = () => {
    const link = generateWhatsAppLink(cart, totalPrice);
    window.open(link, '_blank');
  };

  return (
    <>
      <Navbar />
      <div className="bigcart-container">
        <form onSubmit={handleSubmitOrder} className={`order-form ${isProcessing ? 'disabled' : ''}`}>
          <div className="form-left">
            {!showPayment ? (
              <>
                {/* Formulario de Datos de Contacto */}
                <div className="section contact-info">
                <div className="section shipping-method">
                <div>
            <h2 className="sr-only">Steps</h2>

            <div>
              <div className="overflow-hidden rounded-full bg-gray-200">
                <div className="h-2 w-1/2 rounded-full bg-custom-blue"></div>
              </div>

              <ol className="my-2 grid grid-cols-3 text-sm font-medium text-gray-500">
                <li className="flex items-center justify-start text-custom-blue sm:gap-1.5">
                  <span className="hidden sm:inline">
                     DATOS 
                  </span>
                  <svg
                    className="size-6 mx-2 sm:size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg> 
                  <span className="hidden sm:inline">
                  Y ENVIO
                  </span>
                  <svg
                    className="size-6 mx-1 sm:size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </li>

                {/* <li className="flex items-center justify-center text-blue-600 sm:gap-1.5">
                  <span className="hidden sm:inline"> Address </span>

                 
      </li> */}

      <li className="flex items-center justify-end sm:gap-1.5">
        <span className="hidden sm:inline"> PAGO </span>

        <svg
          className="size-6 sm:size-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </li>
    </ol>
  </div>
</div>
                  <hr className='mb-10'style={{ boxShadow: '0 4px 10px rgba(90, 154, 119, 0.5)' }} />
                  <h3 className='montserrat uppercase my-5'>Medios de Envío</h3>
                  
                  <div className="input-group">
                    <label className='rounded-lg gap-3 p-2 flex border border-custom-blue w-25'>
                    <div className="shipping-option">
                    <input
                      className="hidden-radio"
                      type="radio"
                      id="sucursal"
                      name="shippingMethod"
                      value="sucursal"
                      checked={shippingMethod === 'sucursal'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    />
                    <label htmlFor="sucursal" className="custom-radio">
                    
                    </label>
                  </div>

                      <div className='flex flex-col'>
                     <p className='montserrat2 uppercase'>Envío a Sucursal </p> 
                     <p className='montserrat'> Entre 3 a 6 dias habiles - $6,167</p> 
                     </div>
                    </label>
                    <label className='rounded-lg gap-3 p-2 flex border border-custom-blue w-25'>
                      <input
                      className='hidden-radio'
                        type="radio"
                         id="domicilio"
                        name="shippingMethod"
                        value="domicilio"
                        checked={shippingMethod === 'domicilio'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      />
                      <label htmlFor="domicilio" className="custom-radio">
                    
                    </label>
                        <div className='flex flex-col'>
                     <p className='montserrat2 uppercase'>Envío a Domicilio </p> 
                     <p className='montserrat '> Entre 6 a 9 dias habiles - $8.000</p> 
                     </div>
                    </label>
                    <h3 className='montserrat uppercase my-5'>Punto de Entrega</h3>
                    <label className='rounded-lg gap-3 p-2 flex border border-custom-blue w-25'>
                        <input
                          className='hidden-radio'
                          type="radio"
                          id="showroom"
                          name="shippingMethod"
                          value="showroom"
                          checked={shippingMethod === 'showroom'}
                          onChange={(e) => setShippingMethod(e.target.value)}
                        />
                        <label htmlFor="showroom" className="custom-radio"></label>
                        <div className='flex flex-col'>
                          <p className='montserrat2 uppercase'>Nuestro Showroom - Gratis</p>
                          <p className='montserrat'>Entrega inmediata en nuestro showroom , 72hs despues de tu compra</p>
                        </div>
                      </label>
                  </div>
                </div>
               
                  <h3 className='montserrat uppercase my-5'>Datos del Destinatario</h3>
                  <div className='grid grid-cols-2 grid-rows-1 gap-3'>
                  <div className="input-group">
                    <label 
                    className='montserrat2'
                     htmlFor="customerName">Nombre</label>
                    <input
                      type="text"
                      id="customerName"
                  
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="input-group">
                    <label className='montserrat2' htmlFor="customerSurname">Apellido</label>
                    <input
                      type="text"
                      id="customerSurname"
                      value={customerSurname}
                      onChange={(e) => setCustomerSurname(e.target.value)}
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className='montserrat2' htmlFor="customerEmail">Email</label>
                    <input
                      type="email"
                      id="customerEmail"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="input-group">
                  <label className='montserrat2' htmlFor="customerDNI">DNI</label>
                      <input
                        type="text"
                        id="customerDNI"
                        value={customerDNI}
                        onChange={(e) => {
                          // Verificar que el valor solo tenga números y no exceda los 8 caracteres
                          const newValue = e.target.value.replace(/\D/g, '').slice(0, 8);
                          setCustomerDNI(newValue);
                        }}
                        maxLength={8} // Limita a 8 caracteres
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="input-group">
                      <label className='montserrat2' htmlFor="customerTelefono">Telefono</label>
                      <input
                        type="text"
                        id="customerTelefono"
                        value={customerTelefono}
                        onChange={(e) => setCustomerTelefono(e.target.value)}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
       
                {/* Sección del Método de Envío */}
               

                {shippingMethod === 'domicilio' && (
                  <div className="section address-info">
                    <h3 className='montserrat uppercase my-5'>Dirección del Destinatario</h3>
                    <div className='grid grid-cols-2 grid-rows-2 gap-3'>
                    <div className="input-group">
                      <label
                      className='montserrat2'
                       htmlFor="street">Calle</label>
                      <input
                        type="text"
                        id="street"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="input-group">
                      <label
                      className='montserrat2'
                      htmlFor="number">Número</label>
                      <input
                        type="text"
                        id="number"
                        value={address.number}
                        onChange={(e) => setAddress({ ...address, number: e.target.value })}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="input-group">
                      <label
                      className='montserrat2'
                      htmlFor="piso">Piso(OPCIONAL)</label>
                      <input
                        type="text"
                        id="piso"
                        value={address.piso}
                        onChange={(e) => setAddress({ ...address, piso: e.target.value })}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="input-group">
                      <label
                      className='montserrat2'
                      htmlFor="piso">Depto(OPCIONAL)</label>
                      <input
                        type="text"
                        id="depto"
                        value={address.depto}
                        onChange={(e) => setAddress({ ...address, depto: e.target.value })}
                        
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="input-group">
                      <label
                      className='montserrat2'
                      htmlFor="city">Ciudad</label>
                      <input
                        type="text"
                        id="city"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="input-group">
                      <label
                      className='montserrat2'
                      htmlFor="province">Provincia</label>
                      <input
                        type="text"
                        id="province"
                        value={address.province}
                        onChange={(e) => setAddress({ ...address, province: e.target.value })}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    </div>
                  </div>
                )}

            <button
              type="button"
              className="next-button montserrat2 bg-custom-blue text-white p-2 rounded-xl"
              onClick={() => {
                if (
                  customerName &&
                  customerSurname &&
                  customerEmail &&
                  customerDNI &&
                  (
                    shippingMethod === 'sucursal' || 
                    shippingMethod === 'showroom' || // Añadido para que avance con "showroom"
                    (
                      address.street && 
                      address.number && 
                      address.city && 
                      address.province && 
                      (
                        (!address.piso && !address.depto) || 
                        (address.piso && address.depto)
                      )
                    )
                  )
                ) {
                  setShowPayment(true);
                } else {
                  alert('Por favor, completa todos los campos requeridos antes de continuar.');
                }
              }}
            >
              Siguiente
            </button>

              </>
            ) : (
              <>
                  {showPaymentMethods && (
                  <>
                    <PaymentMethod onSelectPayment={setPaymentMethod} />
                    {paymentMethod && (
                      <button
                      className='montserrat2 bg-custom-blue text-white p-2 rounded-xl'
                        type="submit"
                        disabled={isProcessing}
                        style={{ display: orderSubmitted ? 'none' : 'block' }}
                         // Ocultar el botón si el pedido fue enviado
                      >
                        Finalizar Pedido
                      </button>
                    )}
                  </>
                )}
                 {orderSubmitted && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}

                {orderSubmitted && (
                  <div className="order-confirmation my-5 mx-5 md:mx-10 md:my-10">
                    <h3 className='font-kelsi2 text-custom-blue text-4xl'>¡Gracias por tu pedido!</h3>
                    {NumOrder && <p>Número de Orden: {NumOrder}</p>}
                    <BankDetails />
                    <button
                type="button"
                onClick={handleWhatsAppShare}
                className="montserrat2 bg-green-500 text-white p-2 rounded-xl mt-2"
              >
               Enviar Comprobante por WhatsApp
              </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="form-right">
            <div className="section order-summary flex flex-col">
              <h3 className='font-kelsi2 text-4xl mt-2 mb-4 flex justify-center'>Mi pedido</h3>
              <div className="order-items">
                {cart.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.model} className="item-image" />
                    <div className="item-details">
                      <div className='flex gap-1'>
                      <h3 className='montserrat'>{item.brand}</h3>
                      <h4 className='montserrat'>{item.model}</h4>
                      </div>
                      <p className='montserrat'>Precio: ${item.price.toLocaleString()}</p>
                      <p className='montserrat'> Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex flex-col items-center mt-5'>
              <h4 className='montserrat text-sm my-1'>Subtotal: ${cartSubtotal.toLocaleString()}</h4>
              <h4 className='montserrat text-sm my-1'>Costo de Envío: ${shippingCost.toLocaleString()}</h4>
              <h4 className='montserrat text-sm my-1'>Total: ${totalPrice.toLocaleString()}</h4>
            </div>

            </div>
          </div>
        </form>
      </div>
    
     
    </>
  );
};

export default BigCart;