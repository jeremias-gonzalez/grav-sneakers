require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const PORT =  3001;
// const mercadopago = require('mercadopago');

// // Configurar Mercado Pago
// mercadopago.configure({
//   access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
//   // También puedes incluir el modo (test o producción) si es necesario
//   // mode: 'test',
// });

// Lista de orígenes permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL, // Para desarrollo local
, // Para Vercel
];

// Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json());

// Autenticación con Google Sheets
const client = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err, tokens) => {
  if (err) {
    console.error('Error connecting to Google Sheets:', err);
    return;
  }
  console.log('Connected to Google Sheets');
});


// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.send("Servidor activo y funcionando en producción");
});

// Ruta para obtener datos de Google Sheets
app.get('/api/sheet-data', async (req, res) => {
  const gsapi = google.sheets({ version: 'v4', auth: client });
  const options = {
    spreadsheetId: '14JIBAQ90WU7_3g8RBe11B7PC-G-7kzUx-v_87P3x2Yw', // ID de Google Sheets
    range: 'Products!A2:E',
  };

  try {
    const data = await gsapi.spreadsheets.values.get(options);
    const rows = data.data.values;

    // Imprimir data para depuración
    console.log('Data from Google Sheets:', data);

    if (!rows || rows.length === 0) {
      return res.status(404).send('No data found');
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching data from Google Sheets:', err);
    res.status(500).json({
      message: 'Error fetching data from Google Sheets',
      error: err.message,
      stack: err.stack,
    });
  }
});

app.post('/api/add-order', async (req, res) => {
  const {
    customerName,
    customerSurname,
    customerDNI,
    customerTelefono,
    shippingMethod,
    customerEmail,
    address,
    cartItems,
    totalPrice,
    paymentMethod,
  } = req.body;

  // Separar los datos de la dirección si existen
  const { street, number, piso, depto, city, province } = address || {};

  // Validación condicional de datos según el método de envío
  if (!customerName || !customerSurname || !customerDNI || !customerTelefono || !shippingMethod || !customerEmail || !cartItems || cartItems.length === 0 || !paymentMethod) {
    return res.status(400).send({ message: 'Faltan datos necesarios' });
  }

  // Validar datos adicionales solo si es envío a domicilio
  if (shippingMethod === 'domicilio' && (!street || !number || !city || !province)) {
    return res.status(400).send({ message: 'Faltan datos de domicilio' });
  }

  const gsapi = google.sheets({ version: 'v4', auth: client });
  const options = {
    spreadsheetId: '1C81BRGg-U8eJLFXXGYIPEwdkOMwWbsWXIKcYVWz68gY',
    range: 'pedidos!A2:O',
    valueInputOption: 'RAW',
    resource: {
      values: [
        [
          customerName,
          customerSurname,
          customerDNI,
          customerTelefono,
          shippingMethod,
          customerEmail,
          street || '',     // Datos de domicilio, opcionales si es envío a sucursal
          number || '',
          piso || '',
          depto || '',
          city || '',
          province || '',
          JSON.stringify(cartItems),
          totalPrice,
          paymentMethod,
        ],
      ],
    },
  };

  try {
    await gsapi.spreadsheets.values.append(options);
    res.status(201).send('Orden creada exitosamente');
  } catch (error) {
    console.error('Error al agregar la orden a Google Sheets:', error);
    res.status(500).send({
      message: 'Error interno del servidor',
      error: error.message || 'Error desconocido',
    });
  }
});


app.get('/api/orders', async (req, res) => {
  const gsapi = google.sheets({ version: 'v4', auth: client });
  const options = {
    spreadsheetId: '1C81BRGg-U8eJLFXXGYIPEwdkOMwWbsWXIKcYVWz68gY',
    range: 'pedidos!A2:O', // Ajusta el rango según tus columnas
  };

  try {
    const response = await gsapi.spreadsheets.values.get(options);
    const rows = response.data.values || [];

    // Mapeo de los datos a un formato adecuado
    const orders = rows.map((row) => {
      return {
        customerName: row[0] || 'Sin nombre',       
        customerSurname: row[1] || 'Sin apellido',   
        customerDNI: row[2] || 'Sin DNI',            
        customerTelefono: row[3] || 'Sin teléfono',   
        shippingMethod: row[4] || 'Sin método de envío',
        customerEmail: row[5] || 'Sin email',        
        address: {
          street: row[6] || 'Sin dirección',
          number: row[7] || 'Sin número',
          city: row[10] || 'Sin ciudad',
          province: row[11] || 'Sin provincia',
        },
        cartItems: row[12] ? JSON.parse(row[12]) : [], // Cambia a cartItems
        totalPrice: row[13] || 'N/A',                 
        paymentMethod: row[14] || 'Sin método de pago',
      };
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener los pedidos de Google Sheets:', error);
    res.status(500).send({
      message: 'Error interno del servidor',
      error: error.message || 'Error desconocido',
    });
  }
});

app.post('/api/add-product', async (req, res) => {
  console.log("Datos recibidos:", req.body); // Imprime los datos recibidos
  const {id, brand, model, price, image } = req.body;

  // Verifica si hay campos vacíos
  if (!id || !brand || !model || !price || !image) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const gsapi = google.sheets({ version: 'v4', auth: client });
  const options = {
    spreadsheetId: '1C81BRGg-U8eJLFXXGYIPEwdkOMwWbsWXIKcYVWz68gY',
    range: 'productos!A:G', // Asegúrate de que esto refleje la cantidad de columnas que tienes
    valueInputOption: 'RAW',
    resource: {
      values: [[id, brand, model, price, image]], // Asegúrate de que esto sea lo que esperas
    },
  };

  try {
    const result = await gsapi.spreadsheets.values.append(options);
    console.log("Resultado de Google Sheets:", result.data); // Imprime el resultado
    res.status(200).json({ message: 'Producto agregado con éxito' });
  } catch (error) {
    console.error('Error al agregar el producto:', error.message); // Imprime el mensaje de error
    console.error('Detalles del error:', error); // Imprime el objeto completo del error
    res.status(500).json({ error: 'Error al agregar el producto', details: error.message });
  }
});



// app.post('/api/create-preference', async (req, res) => {
//   const { cartItems, customerEmail } = req.body;

//   // Crear items para Mercado Pago
//   const items = cartItems.map((item) => ({
//     title: item.brand && item.model,  // Reemplaza "name" con el nombre del producto
//     unit_price: item.price, // Reemplaza "price" con el precio del producto
//     quantity: item.quantity, // Reemplaza "quantity" con la cantidad del producto
//   }));

//   // Configurar preferencia
//   const preference = {
//     items: items,
//     payer: {
//       email: customerEmail,
//     },
//     back_urls: {
//       success: `${process.env.FRONTEND_URL}/success`,
//       failure: `${process.env.FRONTEND_URL}/failure`,
//       pending: `${process.env.FRONTEND_URL}/pending`,
//     },
//     auto_return: 'approved',
//   };

//   try {
//     const response = await mercadopago.preferences.create(preference);
//     res.json({ id: response.body.id }); // ID de la preferencia para redirigir al pago
//   } catch (error) {
//     console.error('Error al crear la preferencia de pago:', error);
//     res.status(500).send('Error al crear la preferencia de pago');
//   }
// });

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
