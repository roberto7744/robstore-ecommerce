🛒 RobStore — Plataforma de Comercio Electrónico

RobStore es una plataforma de comercio electrónico desarrollada como proyecto académico, que integra backend en Django REST Framework y frontend en React, aplicando principios de ingeniería web, seguridad, arquitectura cliente-servidor y metodologías ágiles.

El sistema permite la gestión de productos, carrito de compras, proceso de pago simulado y administración de productos por usuarios con rol administrador.

🚀 Tecnologías Utilizadas
Backend

Python 3.10

Django

Django REST Framework

JWT (SimpleJWT)

MySQL (administrado con phpMyAdmin)

Django ORM

Frontend

React (Vite)

React Router

Axios

Context API

Herramientas

Git & GitHub

Postman (pruebas API)

phpMyAdmin (gestión base de datos)

🧩 Arquitectura del Sistema

El proyecto sigue una arquitectura Cliente-Servidor desacoplada:

React (Frontend)
   ↓ REST API
Django REST Framework (Backend)
   ↓ ORM
MySQL (phpMyAdmin)


El frontend consume la API mediante Axios.

El backend expone endpoints REST protegidos con JWT.

La base de datos se gestiona mediante phpMyAdmin.

🔐 Seguridad

Autenticación mediante JWT

Autorización basada en roles (is_staff)

Endpoints protegidos con:

IsAuthenticated

IsAdminUser

Tokens almacenados en localStorage

🛍️ Funcionalidades Principales
Usuarios

Inicio de sesión con JWT

Identificación de usuario administrador

Productos

Listado público de productos

Panel administrador para:

Crear productos

Editar productos

Eliminar productos

Carrito de Compras

Agregar productos

Modificar cantidades

Eliminar productos

Vaciar carrito

Cálculo automático del total

Checkout (Pago Simulado)

Proceso de pago simulado

Creación de órdenes

Limpieza del carrito tras el pago

Confirmación visual de pago exitoso

⚠️ Nota:
La pasarela de pago es simulada, diseñada con fines académicos para demostrar el flujo completo de compra sin integrar un proveedor real.

📁 Estructura del Proyecto
ecommerce-django1/
│
├── robstore_backend/
│   ├── core/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── views_admin.py
│   │   └── urls.py
│   ├── robstore_backend/
│   │   └── urls.py
│   └── manage.py
│
├── robstore_frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── admin/
│   │   └── components/
│   └── main.jsx
│
├── venv/
└── README.md

⚙️ Instalación y Ejecución
Backend
cd robstore_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend
cd robstore_frontend
npm install
npm run dev

🧪 Pruebas

Pruebas manuales mediante Postman

Verificación de endpoints protegidos

Validación de flujo completo:

Login

Carrito

Checkout

Administración

📊 Metodología de Desarrollo

Metodología Ágil

Desarrollo incremental

Pruebas continuas

Documentación técnica estructurada

📌 Estado del Proyecto

✔️ Funcional
✔️ Prototipo navegable
✔️ Cumple requisitos académicos
✔️ Backend y frontend integrados

👨‍💻 Autor

Roberto Garrett
Proyecto académico — Plataforma de Comercio Electrónico
UNIACC
