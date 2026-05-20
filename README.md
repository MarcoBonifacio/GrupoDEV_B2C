Leandro Baterías - Sistema de Control de Inventario y E-Commerce
📝 Descripción del Proyecto
Leandro Baterías es una plataforma web e-commerce integral diseñada para la gestión de inventario, control de stock y procesamiento de ventas de baterías automotrices en el mercado peruano. El sistema permite realizar un seguimiento en tiempo real del catálogo de productos, gestionar carritos de compras, procesar pagos interactivos y emitir comprobantes dinámicos en formato PDF según las normativas fiscales vigentes.

Desarrollado bajo un enfoque ágil e iterativo, el proyecto evolucionó a través de múltiples versiones estructuradas para garantizar una interfaz de usuario fluida y un backend robusto de nivel empresarial.

🚀 Características Principales
🛒 Frontend & E-Commerce (UI/UX)
Catálogo Unificado: Visualización y filtrado avanzado de 63 modelos de baterías pertenecientes a 6 marcas líderes del mercado (Capsa, Solite, Varta, Ultrabat, Etna y Enerjet).

Búsqueda Inteligente: Buscador predictivo y filtros dinámicos por nombre, modelo, marca y voltaje.

Carrito de Compras de Alta Persistencia: Sistema de gestión de productos (añadir, remover, modificar cantidades) con sincronización automática en localStorage.

Tema Oscuro (Dark Mode): Interfaz adaptable con persistencia de preferencia de usuario mediante variables CSS globales.

Diseño Totalmente Flexible: Maquetación Mobile-First optimizada para Smartphones (576px), Tablets (992px) y Desktops.

💳 Pasarela de Pagos & Facturación
Métodos de Pago Locales: Integración interactiva de las pasarelas más usadas en Perú:

Yape (Flujo guiado por número celular)

Plin (Flujo guiado por número celular)

Tarjeta de Crédito/Débito (Campos dinámicos validados para MM/AA y CVV)

Emisión de Documentos Dinámicos: Generación de archivos descargables en formato PDF mediante la librería jsPDF con diseños y códigos fiscales personalizados:

Comprobante de Pago (Uso interno/sin valor fiscal - Color Azul #1A73E8)

Boleta de Venta (Persona natural, requiere DNI de 8 dígitos - Código 03 - Color Rojo #B40000)

Factura Electrónica (Empresas, requiere RUC de 11 dígitos y Dirección - Código 01 - Color Verde #006400)

📊 Backend & Gestión de Datos
Panel de Control (Dashboard): Métricas clave en tiempo real para administración (total de productos, alertas de stock bajo, pedidos activos y ventas mensuales).

Persistencia Relacional: Arquitectura de base de datos robusta encargada de registrar marcas, categorías técnicas (Convencional, AGM, Gel, Premium), pedidos, transacciones de pago y logística de transportistas.

📐 Arquitectura del Sistema
El proyecto implementa principios de Clean Architecture y una estricta separación de responsabilidades estructurada en 3 capas principales:

LeandroBaterias/
├── Frontend/                           # Capa de Presentación (Client-Side)
│   ├── index.html - index7.html        # Versiones evolutivas del sistema
│   ├── css/                            # Estilos modulares (variables, componentes, responsive)
│   ├── js/                             # Componentes y utilidades en Vanilla JS
│   └── assets/                         # Recursos gráficos e imágenes de productos
├── Backend/                            # Capa de Lógica de Negocio y Datos
│   ├── src/
│   │   ├── LeandroBaterias.Presentation.WebAPI/   # Controladores, Middleware y Endpoints
│   │   ├── LeandroBaterias.Application/            # Casos de uso y servicios de aplicación
│   │   ├── LeandroBaterias.Domain/                 # Entidades de negocio y reglas core
│   │   └── LeandroBaterias.Infrastructure/         # Acceso a datos (EF Core, Dapper)
│   └── docs/
│       └── ScriptsSQL/                 # Esquemas de base de datos y Seed Data
└── docs/                               # Documentación general y guías de agentes
🛠️ Tecnologías y Herramientas
Frontend
HTML5 / CSS3 (Flexbox, CSS Grid, Variables Globales)

JavaScript Avanzado (ES6+, Vanilla JS)

Font Awesome 6.4.0 (Iconografía)

Google Fonts (Tipografía Inter)

jsPDF 2.5.1 (Librería cliente para generación de comprobantes)

Backend
.NET Core (ASP.NET Core Web API)

Entity Framework Core (ORM Principal)

Dapper (Micro-ORM para consultas optimizadas de alta velocidad)

SQL Server (Motor de base de datos relacional)

Herramientas de Desarrollo
Visual Studio Code / Visual Studio

Git & GitHub (Control de versiones)

SQL Server Management Studio (SSMS)

Swagger (Documentación y testeo de la API REST)

👥 Equipo del Proyecto (Scrum Team)
El desarrollo de este sistema se rigió estrictamente bajo el marco de trabajo Scrum, permitiendo entregas iterativas y un control de calidad constante de los entregables:

Sponsor: Medina Carpio Alexsander

Product Owner: Baca Medina

Scrum Master: Cahuana Mendoza

DevTeam: Bonifacio Ruiz, Llanos Luna

🔧 Configuración del Sistema (Seed Data)
El sistema viene preconfigurado con las políticas comerciales estándares de la empresa:

Impuesto General a las Ventas (IGV): 18.00%

Moneda Base: PEN (Soles peruanos)

Monto Mínimo para Envío Gratis: S/200.00

Numeración Correlativa: Series F001 (Facturas) y B001 (Boletas)

Proyecto desarrollado con fines académicos y comerciales. Versión Final estable asociada al despliegue de index7.html.
