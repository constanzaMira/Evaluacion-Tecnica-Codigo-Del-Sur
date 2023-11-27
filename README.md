# Evaluacion-Tecnica-Codigo-Del-Sur

## Introducción
**Breve descripción del proyecto y su finalidad.** Este proyecto es una API desarrollada como parte de una evaluación técnica propuesta por CodigoDelSur. La API está diseñada para gestionar usuarios y películas, permitiendo a los usuarios registrarse, autenticarse, buscar películas, añadir películas a sus favoritos y consultar su lista de películas favoritas.

## Tecnologías Utilizadas
- **Node.js y Express:** Utilizados para construir la API.
- **SQLite:** Empleado para el almacenamiento local de datos, simulando una base de datos real.
- **Postman:** Utilizado para probar y verificar las funcionalidades de la API.
- **JWT (JSON Web Tokens):** Para la autenticación y manejo de sesiones.
- **Dotenv:** Para la gestión de variables de entorno.

## Instalación y Configuración
Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

1. **Clonar el repositorio:** `git clone https://github.com/constanzaMira/Evaluacion-Tecnica-Codigo-Del-Sur`
2. **Instalar dependencias:** `npm install`
3. **Ejecutar la aplicación:** `node index.js`

## Estructura del Proyecto
Este proyecto sigue una estructura modular y organizada para facilitar la escalabilidad y el mantenimiento. A continuación se describe la disposición de los archivos y directorios clave:

- **`/models`**: 
  - **`db.js`**: Este archivo gestiona la conexión con la base de datos SQLite. Aquí se inicializa la base de datos (`movie_database.db`) y se definen las tablas utilizadas en la aplicación:
    - **Tabla `users`**: Almacena información de los usuarios registrados, incluyendo email, nombre, apellido y contraseña.
    - **Tabla `favorites`**: Contiene los detalles de las películas favoritas de los usuarios, relacionándolas con el usuario que las añadió a favoritos. La tabla incluye campos como título, fecha de lanzamiento, identificadores de género, calificación promedio y la fecha en que se añadió a favoritos.
      
- **`/routes`**: Incluye los archivos que definen los endpoints de la API y las rutas. Cada ruta está asociada con sus respectivas operaciones de solicitud y respuesta.
   - **`users.js`**: Maneja las rutas para el registro y la autenticación de usuarios.
   - **`movies.js`**: Contiene las rutas para obtener películas, agregar y obtener películas favoritas.
   - **`logout.js`**: Maneja el cierre de sesion teniendo en cuenta que permita que un “token” de autenticación pueda ser inválido.
    
 - **`authMiddleware.js`**: Verifica los tokens JWT para proteger las rutas que requieren autenticación.

- **`index.js`**: El punto de entrada principal de la aplicación. Configura el servidor, los middlewares y las rutas.

- **`.env`**: Un archivo que contiene variable de entorno, en este caso clave secreta.

- **`package.json`**: Define las dependencias del proyecto, scripts y metadatos del proyecto.

## Endpoints de la API
Descripción detallada de cada endpoint implementado:

- **POST `/users/register`:** Registro de un nuevo usuario.
- **POST `/users/login`:** Autenticación de un usuario.
- **POST `/logout`:** Cerrar sesion.
- **GET `/movies`:** Obtener una lista de películas de la Api themoviedb.org.
- **POST `/movies/add-to-favorites`:** Agregar una película a favoritos.
- **GET `/movies/favorites`:** Obtener películas favoritas del usuario.

## Autenticación
Para manejar la autenticación y autorización, se utiliza el estándar JSON Web Token (JWT). 

- **Registro y Autenticación de Usuarios:** 
  - Cuando un usuario se registra (`POST /users/register`), la API almacena sus datos en la base de datos, incluyendo una contraseña que se almacena de forma segura.
  - Durante el proceso de login (`POST /users/login`), la API verifica las credenciales proporcionadas. Si son válidas, genera un token JWT.
  
- **Manejo de JWT:**
  - El token JWT se crea utilizando una clave secreta almacenada de forma segura y se configura para caducar después de un período determinado (1 hora).
  - Este token se envía al cliente como parte de la respuesta de login exitoso y debe ser utilizado por el cliente en solicitudes subsiguientes para acceder a rutas protegidas.

- **Rutas Protegidas:**
  - Algunas rutas de la API, especialmente aquellas relacionadas con la gestión de películas favoritas, requieren autenticación.
  - El middleware `authenticateToken` verifica la presencia y validez del token JWT en cada solicitud a estas rutas protegidas.
  - Si el token es válido, la solicitud procede; si no, la API devuelve un error, impidiendo el acceso a la funcionalidad protegida.

- **Logout y Lista de Tokens usados:**
  - La API también ofrece un endpoint de logout (`POST /logout`), donde el token JWT del usuario se agrega a una lista de tokens usados, invalidándolo efectivamente para su uso en futuras solicitudes.

Esta estrategia de autenticación asegura que solo los usuarios registrados y autenticados puedan acceder a ciertas funcionalidades de la API, manteniendo así la seguridad y la integridad de los datos del usuario.


## Tests


