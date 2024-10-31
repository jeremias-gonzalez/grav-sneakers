require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT =  3001;

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
    range: 'pedidos!A2:O', // Ajusta este rango según tus columnas
  };

  try {
    const response = await gsapi.spreadsheets.values.get(options);
    const rows = response.data.values || [];

    // Mapeo de los datos a un formato adecuado
    const orders = rows.map((row) => {
      return {
        customerName: row[0],       // Suponiendo que la columna A es el nombre
        customerSurname: row[1],    // Suponiendo que la columna B es el apellido
        customerDNI: row[2],        // Columna C
        customerTelefono: row[3],   // Columna D
        shippingMethod: row[4],     // Columna E
        customerEmail: row[5],      // Columna F
        address: {
          street: row[6],           // Columna G
          number: row[7],           // Columna H
          piso: row[8],             // Columna I
          depto: row[9],            // Columna J
          city: row[10],            // Columna K
          province: row[11],        // Columna L
        },
        products: JSON.parse(row[12]), // Suponiendo que la columna M contiene los productos en formato JSON
        totalPrice: row[13],        // Columna N
        paymentMethod: row[14],     // Columna O
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

mercadopago.configure({
  // Configura tus credenciales de Mercado Pago
  access_token: 'TU_ACCESS_TOKEN',
});

router.post('/api/create-preference', async (req, res) => {
  const { items, totalPrice } = req.body;

  const preference = {
    items: items.map(item => ({
      title: item.brand + ' ' + item.model,
      unit_price: item.price,
      quantity: item.quantity,
    })),
    back_urls: {
      success: 'http://localhost:3000/success', // Redirige aquí después de una compra exitosa
      failure: 'http://localhost:3000/failure',
      pending: 'http://localhost:3000/pending',
    },
    auto_return: 'approved',
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    res.status(500).send('Error creating Mercado Pago preference');
  }
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
