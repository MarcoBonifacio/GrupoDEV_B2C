# ARQUITECTURA DEL SISTEMA - Leandro Baterías

## 1. ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PRESENTACIÓN (Frontend)                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    HTML5 + CSS3 + JavaScript (Vanilla)               │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │  │
│  │  │ Catálogo │ │ Carrito  │ │ Checkout │ │ Mi Cuenta│ │ Dashboard │  │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │  │
│  └───────┼───────────┼───────────┼───────────┼───────────────┼────────┘  │
└──────────┼───────────┼───────────┼───────────┼───────────────┼───────────┘
           │           │           │           │               │
           └───────────┴───────────┴───────────┴───────────────┘
                                   │
                          ┌────────▼────────┐
                          │   API Gateway   │
                          │  (ASP.NET Core) │
                          │   /api/v1/*     │
                          └────────┬────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
┌───────▼───────┐        ┌────────▼────────┐        ┌────────▼────────┐
│  Capa API     │        │  Capa Servicios │        │  Capa Datos     │
│  (Web API)    │───────▶│  (Business)     │───────▶│  (Repository)   │
│               │        │                 │        │                 │
│ - Controllers │        │ - Servicios     │        │ - DbContext     │
│ - DTOs        │        │ - Validaciones  │        │ - Repositories  │
│ - Filters     │        │ - Mapeos        │        │ - UnitOfWork    │
└───────────────┘        └─────────────────┘        └────────┬────────┘
                                                             │
                                              ┌────────────▼────────┐
                                              │   SQL Server        │
                                              │   (Base de Datos)   │
                                              └─────────────────────┘
```

### Flujo de Comunicación Frontend ↔ API ↔ Base de Datos

```
┌─────────────────┐     HTTP/JSON      ┌─────────────────┐     Dapper/EF    ┌─────────────────┐
│  JavaScript     │ ─────────────────▶ │  ASP.NET Core   │ ───────────────▶│  SQL Server     │
│  Vanilla        │ ◀───────────────── │  Web API        │ ◀───────────────│                │
│  (Fetch API)    │    (JSON Response) │                 │   (Data Reader) │                │
└─────────────────┘                    └─────────────────┘                  └─────────────────┘
```

**Patrón de Diseño:** Clean Architecture con Repository Pattern

---

## 2. ESTRUCTURA DE LA SOLUCIÓN VISUAL STUDIO

```
LeandroBaterias.sln
│
├───src/
│   ├── LeandroBaterias.Presentation.WebAPI          (API REST - C#)
│   │   ├── Controllers/
│   │   ├── Filters/
│   │   ├── Middleware/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   │
│   ├── LeandroBaterias.Application                  (Capa de Aplicación)
│   │   ├── DTOs/
│   │   ├── Interfaces/
│   │   ├── Services/
│   │   └── Mappings/
│   │
│   ├── LeandroBaterias.Domain                       (Capa de Dominio)
│   │   ├── Entities/
│   │   ├── Enums/
│   │   ├── Interfaces/
│   │   └── ValueObjects/
│   │
│   ├── LeandroBaterias.Infrastructure               (Capa de Infraestructura)
│   │   ├── Data/
│   │   │   ├── Context/
│   │   │   ├── Repositories/
│   │   │   └── Configurations/
│   │   ├── Services/
│   │   └── Validations/
│   │
│   └── LeandroBaterias.Frontend                      (HTML/CSS/JS - No es proyecto VS)
│       ├── html/
│       ├── css/
│       ├── js/
│       └── assets/
│
└───docs/
    └── ScriptsSQL/
```

**Paquetes NuGet Requeridos:**
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Design
- Dapper
- Swashbuckle.AspNetCore (Swagger)
- Newtonsoft.Json
- iTextSharp (PDF)
- System.Security.Cryptography.Algorithms

---

## 3. MODELO ENTIDAD-RELACIÓN (ER)

### 3.1 Diagrama de Entidades

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  MARCAS     │     │  MODELOS    │     │  AÑOS       │     │  BATERIAS   │
├─────────────┤     ├─────────────┤     ├─────────────┤     ├─────────────┤
│ IdMarca(PK) │─▶───│ IdModelo(PK)│─▶───│ IdAnio(PK)  │     │ IdBateria(PK│
│ Nombre      │     │ IdMarca(FK) │     │ IdModelo(FK)│─▶───│ IdMarca(FK) │
│ Descripcion │     │ Nombre      │     │ Anio        │     │ IdModelo(FK)│
│ Activo      │     │ Activo      │     │ Activo      │     │ IdAnio(FK)  │
└─────────────┘     └─────────────┘     └─────────────┘     │ IdCategoria │
                                                            │ Nombre      │
                                                            │ Descripcion │
                                                            │ Precio      │
                                                            │ PrecioCosto │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     │ StockActual │
│  CLIENTES   │     │  USUARIOS   │     │  PEDIDOS    │     │ StockMinimo │
├─────────────┤     ├─────────────┤     ├─────────────┤     │ Activo      │
│ IdCliente(PK│─▶───│ IdUsuario(PK│─▶───│ IdPedido(PK)│     └──────┬──────┘
│ IdUsuario(FK│     │ Username    │     │ IdCliente(FK│           │
│ TipoDoc    │     │ PasswordHash│     │ IdUsuario(FK│           │
│ NumeroDoc  │     │ Rol         │     │ FechaPedido │           │
│ Nombre     │     │ Email       │     │ Estado      │◀──────────┘
│ Apellido   │     │ Activo      │     │ Total       │    ┌─────────────┐
│ Telefono   │     └─────────────┘     │ IdPago(FK)   │    │ CATEGORIAS │
│ Email      │                         │ IdFactura(FK)│    ├─────────────┤
│ Direccion │                         └──────┬────────┘    │ IdCategoria │
│ Ciudad    │                              │            │ Nombre      │
│ Region    │                              │            │ Descripcion │
└───────────┘                              │            │ Activo      │
                                             │            └─────────────┘
    ┌───────────────────┐                    │
    │  DETALLE_PEDIDO   │                    ▼
    ├───────────────────┤              ┌─────────────┐
    │ IdDetalle(PK)     │              │  PAGOS      │
    │ IdPedido(FK)      │◀─────────────│ IdPago(PK)  │
    │ IdBateria(FK)     │              │ IdPedido(FK)│
    │ Cantidad          │              │ TipoPago    │
    │ PrecioUnitario   │              │ Estado      │
    │ Subtotal          │              │ FechaPago   │
    └───────────────────┘              │ NumeroOperac│
                                       │ Monto       │
    ┌───────────────────┐              │ TokenPago   │
    │  FACTURAS_SUNAT  │              └─────────────┘
    ├───────────────────┤
    │ IdFactura(PK)    │
    │ IdPedido(FK)     │
    │ NumeroFactura    │
    │ Serie            │
    │ TipoDoc          │
    │ FechaEmision     │
    │ EstadoSunat      │
    │ XMLGenerado      │
    │ PDFGenerado      │
    │ HashCabecera     │
    │ HashDetalle      │
    └───────────────────┘
                                             ┌─────────────┐
    ┌───────────────────┐                    │  LOGISTICA  │
    │  PAGOS_DETALLE    │                    ├─────────────┤
    ├───────────────────┤                    │ IdLogistica│
    │ IdPagoDetalle(PK) │                    │ IdPedido(FK)│
    │ IdPago(FK)       │                    │ IdTransport │
    │ NumeroTarjeta    │                    │ NumeroGuia  │
    │ TipoTarjeta      │                    │ EstadoEnvio │
    │ MesExpiracion    │                    │ FechaEnvio  │
    │ AnioExpiracion   │                    │ FechaEntrega│
    │ CodigoSeguridad  │                    │ Direccion   │
    └───────────────────┘                    │ Observacion│
                                               └─────────────┘
          ┌───────────────────┐
          │  TRANSPORTISTAS   │
          ├───────────────────┤
          │ IdTransport(PK)  │
          │ Nombre           │
          │ RUC              │
          │ Telefono         │
          │ Email            │
          │ Activo           │
          └───────────────────┘
```

---

## 4. SCRIPT SQL - CREATE TABLE

```sql
-- ============================================================================
-- BASE DE DATOS: LeandroBaterias
-- SERVIDOR: .\SQLEXPRESS o localhost
-- ============================================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'LeandroBaterias')
BEGIN
    CREATE DATABASE LeandroBaterias;
END
GO

USE LeandroBaterias;
GO

-- ============================================================================
-- TABLAS DE CATÁLOGO (Baterías y Vehículos)
-- ============================================================================

CREATE TABLE Marcas (
    IdMarca INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    LogoUrl NVARCHAR(255) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL
);

CREATE TABLE Modelos (
    IdModelo INT PRIMARY KEY IDENTITY(1,1),
    IdMarca INT NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Modelos_Marcas FOREIGN KEY (IdMarca) REFERENCES Marcas(IdMarca)
);

CREATE TABLE Anios (
    IdAnio INT PRIMARY KEY IDENTITY(1,1),
    IdModelo INT NOT NULL,
    Anio SMALLINT NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Anios_Modelos FOREIGN KEY (IdModelo) REFERENCES Modelos(IdModelo)
);

CREATE TABLE Categorias (
    IdCategoria INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL
);

CREATE TABLE Baterias (
    IdBateria INT PRIMARY KEY IDENTITY(1,1),
    IdMarca INT NOT NULL,
    IdModelo INT NULL,
    IdAnio INT NULL,
    IdCategoria INT NOT NULL,
    Codigo NVARCHAR(50) NOT NULL UNIQUE,
    Nombre NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(1000) NULL,
    Voltaje NVARCHAR(20) NOT NULL,
    Amperaje INT NOT NULL,
    PotenciaArranque NVARCHAR(50) NULL,
    Largo DECIMAL(10,2) NULL,
    Ancho DECIMAL(10,2) NULL,
    Alto DECIMAL(10,2) NULL,
    Peso DECIMAL(10,2) NULL,
    Precio DECIMAL(12,2) NOT NULL,
    PrecioCosto DECIMAL(12,2) NOT NULL,
    StockActual INT NOT NULL DEFAULT 0,
    StockMinimo INT NOT NULL DEFAULT 5,
    StockMaximo INT NULL,
    ImagenUrl NVARCHAR(255) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    Destacado BIT NOT NULL DEFAULT 0,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Baterias_Marcas FOREIGN KEY (IdMarca) REFERENCES Marcas(IdMarca),
    CONSTRAINT FK_Baterias_Modelos FOREIGN KEY (IdModelo) REFERENCES Modelos(IdModelo),
    CONSTRAINT FK_Baterias_Anios FOREIGN KEY (IdAnio) REFERENCES Anios(IdAnio),
    CONSTRAINT FK_Baterias_Categorias FOREIGN KEY (IdCategoria) REFERENCES Categorias(IdCategoria)
);

-- ============================================================================
-- TABLAS DE CLIENTES Y USUARIOS
-- ============================================================================

CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL UNIQUE,
    Descripcion NVARCHAR(255) NULL,
    Activo BIT NOT NULL DEFAULT 1
);

CREATE TABLE Usuarios (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    IdRol INT NOT NULL,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Nombres NVARCHAR(100) NOT NULL,
    Apellidos NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    UltimoLogin DATETIME NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Usuarios_Roles FOREIGN KEY (IdRol) REFERENCES Roles(IdRol)
);

CREATE TABLE Clientes (
    IdCliente INT PRIMARY KEY IDENTITY(1,1),
    IdUsuario INT NULL,
    TipoDocumento CHAR(1) NOT NULL, -- D=DNI, R=RUC, P=Pasaporte
    NumeroDocumento NVARCHAR(20) NOT NULL,
    Nombres NVARCHAR(100) NOT NULL,
    Apellidos NVARCHAR(100) NULL,
    RazonSocial NVARCHAR(200) NULL,
    Email NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20) NULL,
    Direccion NVARCHAR(500) NULL,
    Ciudad NVARCHAR(100) NULL,
    Departamento NVARCHAR(100) NULL,
    ReferenciaDireccion NVARCHAR(500) NULL,
    FechaNacimiento DATE NULL,
    AceptaTerminos BIT NOT NULL DEFAULT 1,
    AceptaPoliticas BIT NOT NULL DEFAULT 1,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Clientes_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    CONSTRAINT CK_TipoDocumento CHECK (TipoDocumento IN ('D', 'R', 'P'))
);

-- ============================================================================
-- TABLAS DE PEDIDOS Y VENTAS
-- ============================================================================

CREATE TABLE Pedidos (
    IdPedido INT PRIMARY KEY IDENTITY(1,1),
    IdCliente INT NOT NULL,
    IdUsuario INT NOT NULL,
    NumeroPedido NVARCHAR(20) NOT NULL UNIQUE,
    FechaPedido DATETIME NOT NULL DEFAULT GETDATE(),
    FechaConfirmacion DATETIME NULL,
    FechaCompletado DATETIME NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE, CONFIRMADO, PAGADO, ENVIADO, ENTREGADO, CANCELADO
    Subtotal DECIMAL(12,2) NOT NULL,
    IGV DECIMAL(12,2) NOT NULL,
    Descuento DECIMAL(12,2) NOT NULL DEFAULT 0,
    Total DECIMAL(12,2) NOT NULL,
    TipoPago NVARCHAR(20) NOT NULL, -- TARJETA, YAPE, PLIN
    Moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    DireccionEnvio NVARCHAR(500) NOT NULL,
    CiudadEnvio NVARCHAR(100) NOT NULL,
    DepartamentoEnvio NVARCHAR(100) NOT NULL,
    ReferenciaEnvio NVARCHAR(500) NULL,
    Observaciones NVARCHAR(1000) NULL,
    IPCliente NVARCHAR(50) NULL,
    UserAgent NVARCHAR(500) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Pedidos_Clientes FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    CONSTRAINT FK_Pedidos_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    CONSTRAINT CK_EstadoPedido CHECK (Estado IN ('PENDIENTE', 'CONFIRMADO', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO')),
    CONSTRAINT CK_TipoPago CHECK (TipoPago IN ('TARJETA', 'YAPE', 'PLIN'))
);

CREATE TABLE TiposDocumentoVenta (
    IdTipoDoc INT PRIMARY KEY IDENTITY(1,1),
    Codigo CHAR(2) NOT NULL UNIQUE, -- 01=Factura, 03=Boleta, NULL=Comprobante
    Nombre NVARCHAR(50) NOT NULL,
    RequiereDNI BIT NOT NULL DEFAULT 0,
    RequiereRUC BIT NOT NULL DEFAULT 0,
    RequiereDireccion BIT NOT NULL DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1
);

CREATE TABLE Ventas (
    IdVenta INT PRIMARY KEY IDENTITY(1,1),
    IdPedido INT NOT NULL UNIQUE,
    IdCliente INT NOT NULL,
    IdTipoDoc INT NOT NULL,
    NumeroComprobante NVARCHAR(20) NOT NULL,
    DNI NVARCHAR(8) NULL,
    RUC NVARCHAR(11) NULL,
    NombreCliente NVARCHAR(200) NOT NULL,
    DireccionFiscal NVARCHAR(500) NULL,
    FechaEmision DATETIME NOT NULL DEFAULT GETDATE(),
    Subtotal DECIMAL(12,2) NOT NULL,
    IGV DECIMAL(12,2) NOT NULL,
    IGVPorcentaje DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    Total DECIMAL(12,2) NOT NULL,
    FormaPago NVARCHAR(20) NOT NULL,
    NumeroOperacion NVARCHAR(100) NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'COMPLETADO',
    PDFGenerado VARBINARY(MAX) NULL,
    RutaPDF NVARCHAR(500) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Ventas_Pedidos FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido),
    CONSTRAINT FK_Ventas_Clientes FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    CONSTRAINT FK_Ventas_TiposDoc FOREIGN KEY (IdTipoDoc) REFERENCES TiposDocumentoVenta(IdTipoDoc)
);

CREATE TABLE DetallePedido (
    IdDetalle INT PRIMARY KEY IDENTITY(1,1),
    IdPedido INT NOT NULL,
    IdBateria INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(12,2) NOT NULL,
    Descuento DECIMAL(12,2) NOT NULL DEFAULT 0,
    Subtotal DECIMAL(12,2) NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_DetallePedido_Pedidos FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido),
    CONSTRAINT FK_DetallePedido_Baterias FOREIGN KEY (IdBateria) REFERENCES Baterias(IdBateria)
);

-- ============================================================================
-- TABLAS DE PAGOS
-- ============================================================================

CREATE TABLE Pagos (
    IdPago INT PRIMARY KEY IDENTITY(1,1),
    IdPedido INT NOT NULL UNIQUE,
    TipoPago NVARCHAR(20) NOT NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE, APROBADO, RECHAZADO, ANULADO
    FechaPago DATETIME NULL,
    Monto DECIMAL(12,2) NOT NULL,
    NumeroOperacion NVARCHAR(100) NULL,
    TokenPago NVARCHAR(255) NULL,
    IdTransaccionProveedor NVARCHAR(255) NULL,
    MensajeProveedor NVARCHAR(500) NULL,
    IPCliente NVARCHAR(50) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Pagos_Pedidos FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido),
    CONSTRAINT CK_EstadoPago CHECK (Estado IN ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'ANULADO'))
);

CREATE TABLE PagosDetalle (
    IdPagoDetalle INT PRIMARY KEY IDENTITY(1,1),
    IdPago INT NOT NULL,
    NumeroTarjetaEnmascarado NVARCHAR(20) NULL,
    TipoTarjeta NVARCHAR(20) NULL, -- VISA, MASTERCARD, AMEX
    BancoEmisor NVARCHAR(100) NULL,
    NumeroComprobante NVARCHAR(50) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_PagosDetalle_Pagos FOREIGN KEY (IdPago) REFERENCES Pagos(IdPago)
);

-- ============================================================================
-- TABLAS DE FACTURACIÓN ELECTRÓNICA (SUNAT)
-- ============================================================================

CREATE TABLE Facturas (
    IdFactura INT PRIMARY KEY IDENTITY(1,1),
    IdPedido INT NOT NULL UNIQUE,
    IdCliente INT NOT NULL,
    NumeroFactura NVARCHAR(20) NOT NULL UNIQUE,
    Serie NVARCHAR(4) NOT NULL,
    NumeroCorrelativo INT NOT NULL,
    TipoDocumento CHAR(2) NOT NULL, -- 01=Factura, 03=Boleta, 07=NotaCrédito, 08=NotaDébito
    FechaEmision DATETIME NOT NULL,
    FechaVencimiento DATE NOT NULL,
    HoraEmision TIME NOT NULL DEFAULT CAST(GETDATE() AS TIME),
    Moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    Subtotal DECIMAL(12,2) NOT NULL,
    IGV DECIMAL(12,2) NOT NULL,
    IGVPorcentaje DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    Total DECIMAL(12,2) NOT NULL,
    Gravadas DECIMAL(12,2) NOT NULL,
    Exoneradas DECIMAL(12,2) NOT NULL DEFAULT 0,
    Gratuitas DECIMAL(12,2) NOT NULL DEFAULT 0,
    DescuentoTotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    TipoOperacion NVARCHAR(10) NOT NULL DEFAULT 'ONEROSA', -- ONEROSA, GRATUIDA, EXPORTACION
    -- Datos SUNAT
    CodigoHashCabecera NVARCHAR(255) NULL,
    CodigoHashDetalle NVARCHAR(255) NULL,
    EstadoSunat NVARCHAR(20) NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE, ENVIADO, ACEPTADO, RECHAZADO, ANULADO
    FechaEnvioSunat DATETIME NULL,
    FechaRespuestaSunat DATETIME NULL,
    CodigoRespuestaSunat NVARCHAR(10) NULL,
    DescripcionRespuestaSunat NVARCHAR(500) NULL,
    CodigoHash CDR NVARCHAR(255) NULL,
    XMLEnviado NVARCHAR(MAX) NULL,
    XMLRecibido NVARCHAR(MAX) NULL,
    PDFGenerado VARBINARY(MAX) NULL,
    RutaPDF NVARCHAR(500) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Facturas_Pedidos FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido),
    CONSTRAINT FK_Facturas_Clientes FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    CONSTRAINT CK_TipoDocumentoSunat CHECK (TipoDocumento IN ('01', '03', '07', '08'))
);

CREATE TABLE FacturaDetalle (
    IdFacturaDetalle INT PRIMARY KEY IDENTITY(1,1),
    IdFactura INT NOT NULL,
    NumeroItem INT NOT NULL,
    IdBateria INT NOT NULL,
    CodigoProducto NVARCHAR(20) NULL,
    Descripcion NVARCHAR(500) NOT NULL,
    UnidadMedida CHAR(3) NOT NULL DEFAULT 'NIU',
    Cantidad DECIMAL(12,4) NOT NULL,
    PrecioUnitario DECIMAL(12,6) NOT NULL,
    TipoPrecioUnitario CHAR(2) NOT NULL DEFAULT '01', -- 01=Precio unitario (incluye IGV)
    IGVUnitario DECIMAL(12,2) NOT NULL,
    PorcentajeIGV DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    Subtotal DECIMAL(12,2) NOT NULL,
    IGV DECIMAL(12,2) NOT NULL,
    Total DECIMAL(12,2) NOT NULL,
    CodigoAfectacionIGV CHAR(2) NOT NULL DEFAULT '10', -- 10=Gravado, 20=Exonerado, 30=Inafecto
    CONSTRAINT FK_FacturaDetalle_Facturas FOREIGN KEY (IdFactura) REFERENCES Facturas(IdFactura)
);

CREATE TABLE ComprobantesSunat (
    IdComprobante INT PRIMARY KEY IDENTITY(1,1),
    IdFactura INT NOT NULL,
    TipoDocumento CHAR(2) NOT NULL,
    Serie NVARCHAR(4) NOT NULL,
    Numero INT NOT NULL,
    FechaEmision DATETIME NOT NULL,
    HashCabecera NVARCHAR(255) NOT NULL,
    XMLContenido NVARCHAR(MAX) NOT NULL,
    FechaEnvio DATETIME NOT NULL,
    Estado NVARCHAR(20) NOT NULL,
    CodigoRespuesta NVARCHAR(10) NULL,
    DescripcionRespuesta NVARCHAR(500) NULL,
    CDR XML NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_ComprobantesSunat_Facturas FOREIGN KEY (IdFactura) REFERENCES Facturas(IdFactura)
);

-- ============================================================================
-- TABLAS DE LOGÍSTICA
-- ============================================================================

CREATE TABLE Transportistas (
    IdTransportista INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(200) NOT NULL,
    RUC NVARCHAR(20) NOT NULL UNIQUE,
    Telefono NVARCHAR(20) NULL,
    Email NVARCHAR(100) NULL,
    Direccion NVARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL
);

CREATE TABLE Logistica (
    IdLogistica INT PRIMARY KEY IDENTITY(1,1),
    IdPedido INT NOT NULL UNIQUE,
    IdTransportista INT NULL,
    NumeroGuia NVARCHAR(50) NULL,
    NumeroOrdenReparto NVARCHAR(50) NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE, EN_REPARTO, ENTREGADO, DEVUELTO
    FechaRecojo DATETIME NULL,
    FechaEnvio DATETIME NULL,
    FechaEntregaEstimada DATE NULL,
    FechaEntrega DATE NULL,
    DireccionEntrega NVARCHAR(500) NULL,
    NombreReceptor NVARCHAR(200) NULL,
    DNIReceptor NVARCHAR(20) NULL,
    Observaciones NVARCHAR(1000) NULL,
    LatitudEntrega NVARCHAR(50) NULL,
    LongitudEntrega NVARCHAR(50) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_Logistica_Pedidos FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido),
    CONSTRAINT FK_Logistica_Transportistas FOREIGN KEY (IdTransportista) REFERENCES Transportistas(IdTransportista),
    CONSTRAINT CK_EstadoLogistica CHECK (Estado IN ('PENDIENTE', 'EN_REPARTO', 'ENTREGADO', 'DEVUELTO'))
);

CREATE TABLE LogisticaHistorial (
    IdHistorial INT PRIMARY KEY IDENTITY(1,1),
    IdLogistica INT NOT NULL,
    Estado NVARCHAR(20) NOT NULL,
    Observacion NVARCHAR(500) NULL,
    Ubicacion NVARCHAR(200) NULL,
    Latitud NVARCHAR(50) NULL,
    Longitud NVARCHAR(50) NULL,
    Fecha DATE NOT NULL DEFAULT GETDATE(),
    Hora TIME NOT NULL DEFAULT CAST(GETDATE() AS TIME),
    CONSTRAINT FK_LogisticaHistorial_Logistica FOREIGN KEY (IdLogistica) REFERENCES Logistica(IdLogistica)
);

-- ============================================================================
-- TABLAS DE ALERTAS E INVENTARIO
-- ============================================================================

CREATE TABLE AlertasStock (
    IdAlerta INT PRIMARY KEY IDENTITY(1,1),
    IdBateria INT NOT NULL,
    TipoAlerta NVARCHAR(20) NOT NULL, -- BAJO_STOCK, STOCK_CRITICO, EXPIRADO
    Mensaje NVARCHAR(500) NOT NULL,
    StockActual INT NOT NULL,
    StockMinimo INT NOT NULL,
    Leida BIT NOT NULL DEFAULT 0,
    FechaAlerta DATETIME NOT NULL DEFAULT GETDATE(),
    FechaLeida DATETIME NULL,
    CONSTRAINT FK_AlertasStock_Baterias FOREIGN KEY (IdBateria) REFERENCES Baterias(IdBateria)
);

CREATE TABLE MovimientosInventario (
    IdMovimiento INT PRIMARY KEY IDENTITY(1,1),
    IdBateria INT NOT NULL,
    TipoMovimiento NVARCHAR(20) NOT NULL, -- ENTRADA, SALIDA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO
    Cantidad INT NOT NULL,
    StockAnterior INT NOT NULL,
    StockNuevo INT NOT NULL,
    IdPedido INT NULL,
    IdUsuario INT NOT NULL,
    Motivo NVARCHAR(500) NULL,
    Referencia NVARCHAR(100) NULL,
    FechaMovimiento DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_MovimientosInventario_Baterias FOREIGN KEY (IdBateria) REFERENCES Baterias(IdBateria),
    CONSTRAINT FK_MovimientosInventario_Pedidos FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido),
    CONSTRAINT FK_MovimientosInventario_Usuarios FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

-- ============================================================================
-- TABLAS DE CONFIGURACIÓN
-- ============================================================================

CREATE TABLE Configuraciones (
    IdConfiguracion INT PRIMARY KEY IDENTITY(1,1),
    Clave NVARCHAR(100) NOT NULL UNIQUE,
    Valor NVARCHAR(500) NOT NULL,
    Descripcion NVARCHAR(255) NULL,
    TipoDato NVARCHAR(20) NOT NULL, -- STRING, NUMERO, BOOLEANO, FECHA
    Activo BIT NOT NULL DEFAULT 1,
    FechaModificacion DATETIME NULL
);

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

CREATE INDEX IX_Baterias_Marca ON Baterias(IdMarca);
CREATE INDEX IX_Baterias_Modelo ON Baterias(IdModelo);
CREATE INDEX IX_Baterias_Categoria ON Baterias(IdCategoria);
CREATE INDEX IX_Baterias_Activo ON Baterias(Activo);
CREATE INDEX IX_Baterias_Precio ON Baterias(Precio);

CREATE INDEX IX_Pedidos_Cliente ON Pedidos(IdCliente);
CREATE INDEX IX_Pedidos_Fecha ON Pedidos(FechaPedido);
CREATE INDEX IX_Pedidos_Estado ON Pedidos(Estado);
CREATE INDEX IX_Pedidos_Numero ON Pedidos(NumeroPedido);

CREATE INDEX IX_DetallePedido_Pedido ON DetallePedido(IdPedido);
CREATE INDEX IX_DetallePedido_Bateria ON DetallePedido(IdBateria);

CREATE INDEX IX_Facturas_Pedido ON Facturas(IdPedido);
CREATE INDEX IX_Facturas_Numero ON Facturas(NumeroFactura);
CREATE INDEX IX_Facturas_FechaEmision ON Facturas(FechaEmision);
CREATE INDEX IX_Facturas_EstadoSunat ON Facturas(EstadoSunat);

CREATE INDEX IX_Logistica_Pedido ON Logistica(IdPedido);
CREATE INDEX IX_Logistica_Transportista ON Logistica(IdTransportista);
CREATE INDEX IX_Logistica_Estado ON Logistica(Estado);

CREATE INDEX IX_AlertasStock_Bateria ON AlertasStock(IdBateria);
CREATE INDEX IX_AlertasStock_Leida ON AlertasStock(Leida);

CREATE INDEX IX_Movimientos_Bateria ON MovimientosInventario(IdBateria);
CREATE INDEX IX_Movimientos_Fecha ON MovimientosInventario(FechaMovimiento);

-- ============================================================================
-- DATOS INICIALES (SEED DATA)
-- ============================================================================

-- Roles
INSERT INTO Roles (Nombre, Descripcion) VALUES
('ADMIN', 'Administrador del sistema'),
('VENDEDOR', 'Personal de ventas'),
('ALMACEN', 'Personal de almacén'),
('CONTABILIDAD', 'Personal de contabilidad'),
('LOGISTICA', 'Personal de logística'),
('CLIENTE', 'Cliente del sistema e-commerce');

-- Categorías de baterías
INSERT INTO Categorias (Nombre, Descripcion) VALUES
('Convencional', 'Baterías convencionales de ácido-plomo'),
('Ácido-Plomo', 'Baterías de plomo-ácido selladas'),
('EFB', 'Baterías de inicio mejorado'),
('AGM', 'Baterías de fibra de vidrio absorbida'),
('Gel', 'Baterías de electrolito gelificado');

-- Marcas de baterías
INSERT INTO Marcas (Nombre, Descripcion) VALUES
('Bosch', 'Baterías alemanas de alta calidad'),
('Exide', 'Baterías estadounidenses líderes'),
('Varta', 'Baterías alemanas premium'),
('Yuasa', 'Baterías japonesas de excelencia'),
('ACDelco', 'Baterías estadounidenses GM'),
(' Willard', 'Baterías americano-peruanas'),
('Dynastar', 'Baterías nacionales');

-- Transportistas
INSERT INTO Transportistas (Nombre, RUC, Telefono, Email) VALUES
('Olva Courier', '20511027033', '0800-11112', 'ventas@olva.com.pe'),
('Shalom', '20442509218', '014270101', 'envios@shalom.com.pe'),
('Bus Cargo', '20100123456', '012345678', 'logistica@buscargo.com.pe');

-- Configuraciones iniciales
INSERT INTO Configuraciones (Clave, Valor, Descripcion, TipoDato) VALUES
('IGV_PORCENTAJE', '18.00', 'Porcentaje del IGV', 'NUMERO'),
('MONEDA_DEFAULT', 'PEN', 'Moneda predeterminada', 'STRING'),
('SERIE_FACTURA', 'F001', 'Serie para facturas', 'STRING'),
('SERIE_BOLETA', 'B001', 'Serie para boletas', 'STRING'),
('STOCK_MINIMO_DEFAULT', '5', 'Stock mínimo por defecto', 'NUMERO'),
('DIAS_VENCIMIENTO_FACTURA', '30', 'Días de vencimiento de factura', 'NUMERO'),
('PAGO_YAPE_NUMERO', '927456789', 'Número de Yape', 'STRING'),
('PAGO_PLIN_NUMERO', '927456789', 'Número de Plin', 'STRING'),
('PAGO_TARJETA_HABILITADO', 'true', 'Habilitar pago con tarjeta', 'BOOLEANO'),
('MONTO_ENVIO_GRATIS', '200', 'Monto mínimo para envío gratis', 'NUMERO');

-- Tipos de documento de venta
INSERT INTO TiposDocumentoVenta (Codigo, Nombre, RequiereDNI, RequiereRUC, RequiereDireccion) VALUES
(NULL, 'Comprobante', 0, 0, 0),
('03', 'Boleta', 1, 0, 0),
('01', 'Factura', 0, 1, 1);

-- Usuario administrador inicial
INSERT INTO Roles (IdRol, Username, PasswordHash, Email, Nombres, Apellidos, Telefono)
SELECT 1, 'admin', '$2a$11$8K1p/a0dL4E5R6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N', 'admin@leandrobaterias.com', 'Administrador', 'Sistema', '999999999';

PRINT 'Base de datos creada exitosamente con todas las tablas e índices.';
GO
```

---

## 5. ENDPOINTS DE LA API REST

### Catálogo
- `GET /api/v1/catalogo/marcas` - Listar marcas
- `GET /api/v1/catalogo/modelos/{idMarca}` - Modelos por marca
- `GET /api/v1/catalogo/anios/{idModelo}` - Años por modelo
- `GET /api/v1/catalogo/baterias` - Listar baterías (con filtros)
- `GET /api/v1/catalogo/baterias/{id}` - Detalle de batería
- `GET /api/v1/catalogo/baterias/buscar` - Búsqueda avanzada

### Inventario
- `GET /api/v1/inventario/baterias` - Stock de baterías
- `GET /api/v1/inventario/alertas` - Alertas de stock bajo
- `POST /api/v1/inventario/ajustar` - Ajustar stock
- `GET /api/v1/inventario/movimientos` - Historial de movimientos

### Pedidos
- `POST /api/v1/pedidos` - Crear pedido
- `GET /api/v1/pedidos/{id}` - Ver detalle
- `GET /api/v1/pedidos/cliente/{idCliente}` - Pedidos del cliente
- `PUT /api/v1/pedidos/{id}/estado` - Actualizar estado

### Pagos
- `POST /api/v1/pagos/crear-token` - Crear token de pago
- `POST /api/v1/pagos/procesar` - Procesar pago
- `GET /api/v1/pagos/{id}` - Estado del pago

### Facturación
- `POST /api/v1/facturas/generar` - Generar factura/boleta
- `GET /api/v1/facturas/{id}` - Ver factura
- `POST /api/v1/facturas/{id}/enviar-sunat` - Enviar a SUNAT
- `GET /api/v1/facturas/{id}/xml` - Descargar XML
- `GET /api/v1/facturas/{id}/pdf` - Descargar PDF

### Logística
- `POST /api/v1/logistica/asignar` - Asignar transportista
- `GET /api/v1/logistica/{idPedido}` - Tracking del envío
- `PUT /api/v1/logistica/{id}/estado` - Actualizar estado

---

## 6. ESTRUCTURA DE CARPETAS FRONTEND

```
LeandroBaterias.Frontend/
├── index.html
├── manifest.json
├── css/
│   ├── styles.css
│   ├── components.css
│   ├── responsive.css
│   └── variables.css
├── js/
│   ├── app.js (punto de entrada)
│   ├── api/
│   │   ├── apiClient.js (configuración Fetch)
│   │   ├── catalogo.js
│   │   ├── inventario.js
│   │   ├── pedidos.js
│   │   ├── pagos.js
│   │   ├── facturas.js
│   │   └── logistica.js
│   ├── components/
│   │   ├── navbar.js
│   │   ├── footer.js
│   │   ├── producto-card.js
│   │   ├── filtros.js
│   │   ├── carrito.js
│   │   └── modal.js
│   ├── pages/
│   │   ├── home.js
│   │   ├── catalogo.js
│   │   ├── producto-detalle.js
│   │   ├── carrito.js
│   │   ├── checkout.js
│   │   ├── mi-cuenta.js
│   │   └── admin/
│   │       ├── dashboard.js
│   │       ├── inventario.js
│   │       ├── pedidos.js
│   │       └── reportes.js
│   ├── utils/
│   │   ├── storage.js (localStorage)
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   └── format.js
│   └── services/
│       ├── auth.js
│       └── payment.js
├── assets/
│   ├── img/
│   ├── icons/
│   └── fonts/
└── pages/
    ├── admin.html
    └── error.html
```

---

**Siguiente paso sugerido:** Iniciar el proyecto en Visual Studio creando la solución y los proyectos según la estructura definida.