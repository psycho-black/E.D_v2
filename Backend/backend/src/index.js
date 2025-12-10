require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Configuración de CORS - ¡ADVERTENCIA: Permite TODOS los orígenes!
// Esto es para depuración en Cloud Shell. NO USAR EN PRODUCCIÓN.
app.use(cors());

app.use(express.json()); // Middleware para parsear JSON

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'un-secreto-muy-secreto-para-desarrollo';

// Configuración del pool de conexiones a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Endpoint para configurar la base de datos (USO ÚNICO)
app.get('/setup-database', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('DROP TABLE IF EXISTS users;');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.status(200).send('Tabla de usuarios reseteada y creada exitosamente.');
  } catch (err) {
    console.error('Error al resetear la tabla de usuarios', err.stack);
    res.status(500).send('Error al configurar la base de datos.');
  } finally {
    client.release();
  }
});

// Endpoint para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'El nombre de usuario, la contraseña y el rol son requeridos.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error('Error al registrar el usuario', err.stack);
    if (err.code === '23505') { // Unique violation
      return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Intento de login para el usuario: ${username}`);

  if (!username || !password) {
    console.log('Error: Faltan usuario o contraseña en la petición.');
    return res.status(400).json({ message: 'El nombre de usuario y la contraseña son requeridos.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      console.log(`Error: Usuario '${username}' no encontrado en la base de datos.`);
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    console.log(`Usuario '${username}' encontrado. Verificando contraseña...`);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Error: Contraseña incorrecta para el usuario '${username}'.`);
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    console.log(`Login exitoso para el usuario '${username}'. Generando token...`);
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso.', token });
  } catch (err) {
    console.error('Error de base de datos al iniciar sesión', err.stack);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


app.get('/', (req, res) => {
  res.send('El backend del Ecosistema Digital Inteligente está funcionando!');
});

// Endpoint para probar la conexión a la base de datos
app.get('/db-test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    const isLocal = pool.options.host === 'localhost';
    res.json({
      success: true,
      message: 'Conexión a la base de datos exitosa',
      environment: isLocal ? 'local' : 'cloud',
      host: pool.options.host,
      time: result.rows[0]
    });
    client.release();
  } catch (err) {
    console.error('Error al conectar a la base de datos', err.stack);
    res.status(500).json({ success: false, message: 'Error al conectar a la base de datos' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('¡Ha ocurrido un error no controlado!');
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
