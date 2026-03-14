canchas-backend

Backend para un sistema de reserva de canchas deportivas y venta de productos, desarrollado con Node.js, Express y MongoDB.

La aplicación permite que personas usuarias puedan:

visualizar canchas disponibles

reservar horarios

pagar reservas

comprar productos

gestionar su carrito

administrar usuarios

👥 Equipo

Los Piratas Dev

🧠 Objetivo del proyecto

Desarrollar una API backend que permita gestionar:

reservas de canchas deportivas

disponibilidad de horarios

compras de productos

pagos online

gestión de usuarios

Este proyecto busca servir como base para una plataforma donde distintos complejos deportivos puedan administrar sus canchas y ofrecer productos a las personas usuarias.

⚙️ Tecnologías utilizadas

Principales tecnologías del proyecto:

Node.js

Express

MongoDB

Mongoose

JWT (JSON Web Token)

Mercado Pago

Cloudinary

Express Validator

Nodemailer

📦 Instalación

Clonar el repositorio:

git clone https://github.com/Cristhianbsts/canchas_backend.git

Entrar a la carpeta del proyecto:

cd canchas_backend

Instalar dependencias:

npm install bcrypt bcryptjs cloudinary cookie-parser cors express express-fileupload express-validator jsonwebtoken mercadopago mongoose morgan node-mailer
▶️ Ejecutar el proyecto

Modo desarrollo:

npm run dev

El servidor se ejecutará con Node watch mode.

🔑 Variables de entorno

Crear un archivo .env en la raíz del proyecto.

Ejemplo:

PORT=3000

MONGO_URI=tu_conexion_mongodb

JWT_SECRET=tu_secreto

MP_ACCESS_TOKEN=tu_token_mercadopago

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

EMAIL_USER=tu_email
EMAIL_PASS=tu_password
📂 Estructura del proyecto
canchas_backend
│
├── api
│   ├── index.js
│   ├── pago-error.html
│   ├── pago-exitoso.html
│   └── pago-pendiente.html
│
├── src
│
│   ├── config
│   │   └── db.js
│
│   ├── controllers
│   │   ├── book.controller.js
│   │   ├── cart.controller.js
│   │   ├── categories.controller.js
│   │   ├── field.controller.js
│   │   ├── login.controller.js
│   │   ├── nodemailer.controller.js
│   │   ├── payment.controller.js
│   │   ├── products.controller.js
│   │   ├── register.controller.js
│   │   ├── search.controller.js
│   │   ├── upload.controller.js
│   │   └── user.controller.js
│
│   ├── middlewares
│   │   ├── cart.middleware.js
│   │   ├── categories.middleware.js
│   │   ├── error.middleware.js
│   │   ├── field.middleware.js
│   │   ├── login.middleware.js
│   │   ├── nodemailer.middleware.js
│   │   ├── products.middleware.js
│   │   ├── register.middleware.js
│   │   ├── rol.middleware.js
│   │   ├── search.middleware.js
│   │   ├── token.middleware.js
│   │   └── upload.middleware.js
│
│   ├── models
│   │   ├── Book.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Field.js
│   │   ├── Product.js
│   │   └── User.js
│
│   ├── routes
│   │   ├── book.route.js
│   │   ├── cart.routes.js
│   │   ├── categories.routes.js
│   │   ├── field.routes.js
│   │   ├── login.routes.js
│   │   ├── nodemailer.routes.js
│   │   ├── payment.routes.js
│   │   ├── products.routes.js
│   │   ├── register.routes.js
│   │   ├── search.routes.js
│   │   ├── upload.routes.js
│   │   └── user.routes.js
│
│   ├── validators
│   │   ├── cart.rules.js
│   │   ├── categories.rules.js
│   │   ├── products.rules.js
│   │   └── search.rules.js
│
│   └── utils
│       ├── apiResponse.js
│       ├── asyncHandler.js
│       ├── createError.js
│       ├── jwt.js
│       └── time.js
│
├── .env
├── .env.example
├── package.json
└── README.md