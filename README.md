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
├── 🌐 Frontend/                         # Capa de Presentación (Client-Side)
│   ├── index.html - index7.html        # Evolución y despliegue iterativo de la UI
│   ├── css/                            # Hojas de estilo modulares (variables, responsive)
│   └── js/                             # Lógica de componentes (carrito, storage, helpers)
├── ⚙️ Backend/                            # Capa de Lógica de Negocio (Server-Side)
│   └── src/
│       ├── LeandroBaterias.Presentation.WebAPI/   # Endpoints de la API y Middlewares
│       ├── LeandroBaterias.Application/            # Casos de uso y reglas de aplicación
│       ├── LeandroBaterias.Domain/                 # Entidades core del negocio
│       └── LeandroBaterias.Infrastructure/         # Capa de datos y persistencia
└── 🗃️ docs/                             # Documentación del sistema y scripts SQL
    └── ScriptsSQL/
        ├── CreateTables.sql            # Definición del esquema relacional
        └── SeedData.sql                # Población inicial de datos de catálogo

🛠️ Stack TecnológicoFrontend & MaquetaciónHTML5 / CSS3 (Flexbox, CSS Grid)   JavaScript Avanzado (ES6+, Vanilla JS)   jsPDF 2.5.1 (Librería nativa para construcción de reportes PDF)   Font Awesome 6.4.0 & Google Fonts (Inter)   Backend & Base de DatosASP.NET Core Web API   Entity Framework Core (ORM)   Dapper (Micro-ORM optimizado para consultas de alta velocidad)   SQL Server (Relacional con Stored Procedures)   ⚙️ Reglas de Negocio ConfiguradasLa base de datos relacional inicializa el sistema con los siguientes parámetros comerciales estándares de Perú:  [!IMPORTANT]
* Tasa de Impuesto (IGV): 18.00% * Moneda Base: PEN (Soles peruanos) * Envío Gratuito: Aplicable automáticamente a montos superiores a S/ 200.00 * Series Correlativas: F001 para Facturas y B001 para Boletas   👥 Equipo del Proyecto (Scrum Team)El desarrollo del proyecto se ejecutó bajo el marco de trabajo Scrum, facilitando la mejora continua en cada sprint:  Sponsor: Medina Carpio Alexsander   Product Owner: Baca Medina   Scrum Master: Cahuana Mendoza   DevTeam: Bonifacio Ruiz, Llanos Luna   
