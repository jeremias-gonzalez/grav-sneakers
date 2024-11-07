require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT =  3001;


const allowedOrigins = [
  process.env.FRONTEND_URL, 
];

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));



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
app.post('/api/add-product', async (req, res) => {
  console.log("Datos recibidos:", req.body); 
  const { id, brand, model, price, image } = req.body;

  if (!id || !brand || !model || !price || !image) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const gsapi = google.sheets({ version: 'v4', auth: client });
  const options = {
    spreadsheetId: '14JIBAQ90WU7_3g8RBe11B7PC-G-7kzUx-v_87P3x2Yw',
    range: 'Products!A:E', 
    valueInputOption: 'RAW',
    resource: {
      values: [[id, brand, model, price, image]],
    },
  };

  try {
    const result = await gsapi.spreadsheets.values.append(options);
    console.log("Resultado de Google Sheets:", result.data);
    res.status(200).json({ message: 'Producto agregado con éxito' });
  } catch (error) {
    console.error('Error al agregar el producto:', error.message);
    res.status(500).json({ error: 'Error al agregar el producto', details: error.message });
  }
});
app.delete('/api/delete-product', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'El ID del producto es obligatorio' });
  }

  try {
    // Obtenemos la hoja de Google Sheets
    const gsapi = google.sheets({ version: 'v4', auth: client });

    // Obtenemos todos los productos
    const getOptions = {
      spreadsheetId: '14JIBAQ90WU7_3g8RBe11B7PC-G-7kzUx-v_87P3x2Yw',
      range: 'Products!A:E',
    };
    const sheetData = await gsapi.spreadsheets.values.get(getOptions);
    const rows = sheetData.data.values;

    // Buscamos el índice del producto a eliminar
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminamos el producto
    const deleteOptions = {
      spreadsheetId: '14JIBAQ90WU7_3g8RBe11B7PC-G-7kzUx-v_87P3x2Yw',
      range: `Products!A${rowIndex + 1}:E${rowIndex + 1}`,
    };

    await gsapi.spreadsheets.values.clear(deleteOptions);
    res.status(200).json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error.message);
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
});
app.post('/api/add-order', async (req, res) => {
  const { 
    NumOrder,
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

  // Función de validación de datos
  const validarDatos = () => {
    if (
      !customerName ||
      !customerSurname ||
      !customerDNI ||
      !customerTelefono ||
      !shippingMethod ||
      !customerEmail ||
      !cartItems ||
      cartItems.length === 0 ||
      !paymentMethod 
    ) {
      return 'Faltan datos necesarios';
    }

    if (
      shippingMethod === 'domicilio' &&
      (!street || !number || !city || !province)
    ) {
      return 'Faltan datos de domicilio';
    }

    return null;
  };

  const errorValidacion = validarDatos();
  if (errorValidacion) {
    return res.status(400).json({ message: errorValidacion });
  }

  // Generar un número de orden único usando la fecha y un número aleatorio
  const generateOrderNumber = () => {
    const timestamp = Date.now(); // Tiempo actual en milisegundos
    const randomNum = Math.floor(Math.random() * 1000); // Número aleatorio de 3 dígitos
    return `#${timestamp}-${randomNum}`;
  };
  const orderNumber = generateOrderNumber();

  const gsapi = google.sheets({ version: 'v4', auth: client });
  const options = {
    spreadsheetId: '1C81BRGg-U8eJLFXXGYIPEwdkOMwWbsWXIKcYVWz68gY',
    range: 'pedidos!A2:P', // Agregamos una columna extra para el número de orden
    valueInputOption: 'RAW',
    resource: {
      values: [
        [
          orderNumber,        // Columna para el número de orden
          customerName,
          customerSurname,
          customerDNI,
          customerTelefono,
          shippingMethod,
          customerEmail,
          street || '',
          number || '',
          piso || '',
          depto || '',
          city || '',
          province || '',
          JSON.stringify(cartItems),
          totalPrice,
          paymentMethod,
          NumOrder
        ],
      ],
    },
  };

  try {
    await gsapi.spreadsheets.values.append(options);
    res.status(201).json({ message: 'Orden creada exitosamente', orderNumber });
  } catch (error) {
    console.error('Error al agregar la orden a Google Sheets:', error.message);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message || 'Error desconocido',
    });
  }
});
app.delete('/api/delete-order', async (req, res) => {
  const { orderNumber, customerName, customerSurname } = req.body;

  if (!orderNumber || !customerName || !customerSurname) {
    return res.status(400).json({ error: 'El número de orden, nombre y apellido son obligatorios' });
  }

  const gsapi = google.sheets({ version: 'v4', auth: client });

  try {
    // Obtener todos los pedidos
    const getOptions = {
      spreadsheetId: '1C81BRGg-U8eJLFXXGYIPEwdkOMwWbsWXIKcYVWz68gY',
      range: 'pedidos!A2:P',
    };
    const sheetData = await gsapi.spreadsheets.values.get(getOptions);
    const rows = sheetData.data.values;

    // Buscar el índice del pedido a eliminar
    const rowIndex = rows.findIndex((row) => {
      return row[0] === orderNumber && row[1] === customerName && row[2] === customerSurname;
    });

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Eliminar el pedido
    const deleteOptions = {
      spreadsheetId: '1C81BRGg-U8eJLFXXGYIPEwdkOMwWbsWXIKcYVWz68gY',
      range: `pedidos!A${rowIndex + 2}:P${rowIndex + 2}`, // +2 para coincidir con la fila real en la hoja
    };

    await gsapi.spreadsheets.values.clear(deleteOptions);
    res.status(200).json({ message: 'Pedido eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error.message);
    res.status(500).json({ error: 'Error al eliminar el pedido', details: error.message });
  }
});


app.get('/api/orders', async (req, res) => {
  const gsapi = google.sheets({ version: 'v4', auth: client });
  const options = {
    spreadsheetId: '1C81BRGg-U8eJLFXXGYIPEwdkOMwWbsWXIKcYVWz68gY',
    range: 'pedidos!A2:P',
  };

  try {
    const response = await gsapi.spreadsheets.values.get(options);
    const rows = response.data.values || [];
    // Imprime los datos obtenidos para revisión
    console.log('Datos de Google Sheets:', rows);

    const orders = rows.map((row) => {
      let cartItems = [];
      try {
        cartItems = row[13] ? JSON.parse(row[13]) : [];
      } catch (error) {
        console.error('Error al convertir cartItems:', error);
        cartItems = [];
      }

      return {
        NumOrder: row[0] || 'Sin Número de pedido',
        customerName: row[1] || 'Sin nombre',
        customerSurname: row[2] || 'Sin apellido',
        customerDNI: row[3] || 'Sin DNI',
        customerTelefono: row[4] || 'Sin teléfono',
        shippingMethod: row[5] || 'Sin método de envío',
        customerEmail: row[6] || 'Sin email',
        address: {
          street: row[7] || 'Sin dirección',
          number: row[8] || 'Sin número',
          city: row[11] || 'Sin ciudad',
          province: row[12] || 'Sin provincia',
        },
        cartItems: Array.isArray(cartItems) ? cartItems : [], // Asegura que sea un array
        totalPrice: row[14] || 'N/A',
        paymentMethod: row[15] || 'Sin método de pago',
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

app.put('/api/update-product', async (req, res) => {
  const {id, brand, model, price, image } = req.body;

  // Validar que se haya proporcionado un ID
  if (!id) {
    return res.status(400).json({ error: 'El ID del producto es obligatorio' });
  }

  // Validar que se proporcionen los campos necesarios para la actualización
  if (!brand || !model || !price || !image) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios para la actualización' });
  }

  try {
    // Obtenemos la hoja de Google Sheets
    const gsapi = google.sheets({ version: 'v4', auth: client });

    // Obtenemos todos los productos
    const getOptions = {
      spreadsheetId: '14JIBAQ90WU7_3g8RBe11B7PC-G-7kzUx-v_87P3x2Yw',
      range: 'Products!A:E',
    };

    const sheetData = await gsapi.spreadsheets.values.get(getOptions);
    const rows = sheetData.data.values;

    // Buscamos el índice del producto a actualizar
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizamos el producto en la hoja de cálculo
    const updateOptions = {
      spreadsheetId: '14JIBAQ90WU7_3g8RBe11B7PC-G-7kzUx-v_87P3x2Yw',
      range: `Products!A${rowIndex + 1}:E${rowIndex + 1}`,
      valueInputOption: 'RAW',
      resource: {
        values: [[id, brand, model, price, image]], // Asegúrate de que esto coincide con el orden de las columnas en tu hoja
      },
    };

    await gsapi.spreadsheets.values.update(updateOptions);

    res.status(200).json({ message: 'Producto actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar el producto:', error.message);
    res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
