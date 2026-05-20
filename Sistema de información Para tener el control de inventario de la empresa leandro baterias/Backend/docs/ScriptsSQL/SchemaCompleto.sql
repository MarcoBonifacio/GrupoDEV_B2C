-- =============================================
-- ESQUEMA COMPLETO - Leandro Baterías
-- Sistema de Control de Inventario y Ventas
-- Convención: T + Nombre (TProducto, TMarca)
-- =============================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'LeandroBaterias')
    CREATE DATABASE LeandroBaterias;
GO

USE LeandroBaterias;
GO

-- =============================================
-- ELIMINAR OBJETOS EXISTENTES (orden inverso de FK)
-- =============================================

DROP VIEW IF EXISTS V_VentasHoy;
DROP VIEW IF EXISTS V_DashboardResumen;
DROP VIEW IF EXISTS V_ProductosCompleto;
GO

DROP TABLE IF EXISTS TAlertaStock;
DROP TABLE IF EXISTS TMovimientoInventario;
DROP TABLE IF EXISTS THistorialLogistica;
DROP TABLE IF EXISTS TLogistica;
DROP TABLE IF EXISTS TDetalleFactura;
DROP TABLE IF EXISTS TFactura;
DROP TABLE IF EXISTS TDetallePago;
DROP TABLE IF EXISTS TPago;
DROP TABLE IF EXISTS TDetallePedido;
DROP TABLE IF EXISTS TPedido;
DROP TABLE IF EXISTS TCliente;
DROP TABLE IF EXISTS TProductoVehiculo;
DROP TABLE IF EXISTS TVehiculoAnio;
DROP TABLE IF EXISTS TVehiculoModelo;
DROP TABLE IF EXISTS TVehiculoMarca;
DROP TABLE IF EXISTS TTipoComprobante;
DROP TABLE IF EXISTS TMetodoPago;
DROP TABLE IF EXISTS TConfiguracion;
DROP TABLE IF EXISTS TTransportista;
DROP TABLE IF EXISTS TUsuario;
DROP TABLE IF EXISTS TRol;
DROP TABLE IF EXISTS TProducto;
DROP TABLE IF EXISTS TCategoria;
DROP TABLE IF EXISTS TMarca;
GO

-- =============================================
-- TABLAS DE CATÁLOGO / PARÁMETROS
-- =============================================

-- 1. Marcas de baterías (Solite, Enerjet, Etna, etc.)
CREATE TABLE TMarca (
    IdMarca INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(500) NULL,
    LogoUrl VARCHAR(500) NULL,
    OrdenPrioridad INT NOT NULL DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL
);
GO

-- 2. Categorías de baterías (Convencional, AGM, Gel, Premium)
CREATE TABLE TCategoria (
    IdCategoria INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(500) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- 3. Productos (baterías) - tabla principal del inventario
CREATE TABLE TProducto (
    IdProducto INT IDENTITY(1,1) PRIMARY KEY,
    IdMarca INT NOT NULL,
    IdCategoria INT NOT NULL,
    Codigo VARCHAR(50) NOT NULL,
    Nombre VARCHAR(200) NOT NULL,
    Descripcion VARCHAR(500) NULL,
    Voltaje VARCHAR(10) NOT NULL DEFAULT '12',
    Amperaje INT NOT NULL,
    PotenciaArranque VARCHAR(50) NULL,
    PrecioVenta DECIMAL(10,2) NOT NULL,
    PrecioCosto DECIMAL(10,2) NOT NULL DEFAULT 0,
    StockActual INT NOT NULL DEFAULT 0,
    StockMinimo INT NOT NULL DEFAULT 5,
    StockMaximo INT NULL,
    Destacado BIT NOT NULL DEFAULT 0,
    GarantiaMeses INT NOT NULL DEFAULT 12,
    ImagenUrl VARCHAR(500) NULL,
    UbicacionAlmacen VARCHAR(100) NULL,
    PesoKg DECIMAL(8,2) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_TProducto_TMarca FOREIGN KEY (IdMarca) REFERENCES TMarca(IdMarca),
    CONSTRAINT FK_TProducto_TCategoria FOREIGN KEY (IdCategoria) REFERENCES TCategoria(IdCategoria),
    CONSTRAINT UQ_TProducto_Codigo UNIQUE (Codigo)
);
GO

-- 4. Roles de usuario (ADMIN, VENDEDOR, ALMACEN, CLIENTE)
CREATE TABLE TRol (
    IdRol INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(200) NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- 5. Usuarios del sistema
CREATE TABLE TUsuario (
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
    IdRol INT NOT NULL,
    Username VARCHAR(50) NOT NULL,
    PasswordHash VARCHAR(500) NOT NULL,
    Email VARCHAR(200) NULL,
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Telefono VARCHAR(20) NULL,
    UltimoAcceso DATETIME NULL,
    IntentosFallidos INT NOT NULL DEFAULT 0,
    Bloqueado BIT NOT NULL DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_TUsuario_TRol FOREIGN KEY (IdRol) REFERENCES TRol(IdRol),
    CONSTRAINT UQ_TUsuario_Username UNIQUE (Username),
    CONSTRAINT UQ_TUsuario_Email UNIQUE (Email)
);
GO

-- 6. Transportistas / empresas de envío
CREATE TABLE TTransportista (
    IdTransportista INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL,
    RUC VARCHAR(11) NULL,
    Telefono VARCHAR(20) NULL,
    Email VARCHAR(200) NULL,
    Direccion VARCHAR(300) NULL,
    TarifaBase DECIMAL(10,2) NULL DEFAULT 0,
    PlazoEntregaHoras INT NULL DEFAULT 48,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- 7. Configuraciones del sistema (clave-valor)
CREATE TABLE TConfiguracion (
    IdConfiguracion INT IDENTITY(1,1) PRIMARY KEY,
    Clave VARCHAR(100) NOT NULL,
    Valor VARCHAR(500) NOT NULL,
    Descripcion VARCHAR(300) NULL,
    TipoDato VARCHAR(20) NOT NULL DEFAULT 'STRING',
    Modificable BIT NOT NULL DEFAULT 1,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT UQ_TConfiguracion_Clave UNIQUE (Clave)
);
GO

-- 8. Métodos de pago (Yape, Plin, Tarjeta)
CREATE TABLE TMetodoPago (
    IdMetodoPago INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Codigo VARCHAR(20) NOT NULL,
    Descripcion VARCHAR(200) NULL,
    IconoUrl VARCHAR(500) NULL,
    NumeroCuenta VARCHAR(50) NULL,
    Titular VARCHAR(100) NULL,
    ComisionPorcentaje DECIMAL(5,2) NULL DEFAULT 0,
    OrdenPrioridad INT NOT NULL DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UQ_TMetodoPago_Codigo UNIQUE (Codigo)
);
GO

-- 9. Tipos de comprobante (Comprobante, Boleta, Factura)
CREATE TABLE TTipoComprobante (
    IdTipoComprobante INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Codigo VARCHAR(20) NOT NULL,
    Descripcion VARCHAR(200) NULL,
    RequiereDNI BIT NOT NULL DEFAULT 0,
    RequiereRUC BIT NOT NULL DEFAULT 0,
    RequiereDireccion BIT NOT NULL DEFAULT 0,
    SerieDefecto VARCHAR(5) NULL,
    CorrelativoActual INT NOT NULL DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UQ_TTipoComprobante_Codigo UNIQUE (Codigo)
);
GO

-- =============================================
-- TABLAS DE VEHÍCULOS (Buscador por vehículo)
-- =============================================

-- 10. Marcas de vehículos (Toyota, Honda, etc.)
CREATE TABLE TVehiculoMarca (
    IdVehiculoMarca INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UQ_TVehiculoMarca_Nombre UNIQUE (Nombre)
);
GO

-- 11. Modelos de vehículos
CREATE TABLE TVehiculoModelo (
    IdVehiculoModelo INT IDENTITY(1,1) PRIMARY KEY,
    IdVehiculoMarca INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TVehiculoModelo_TVehiculoMarca FOREIGN KEY (IdVehiculoMarca) REFERENCES TVehiculoMarca(IdVehiculoMarca),
    CONSTRAINT UQ_TVehiculoModelo_MarcaModelo UNIQUE (IdVehiculoMarca, Nombre)
);
GO

-- 12. Años de vehículos
CREATE TABLE TVehiculoAnio (
    IdVehiculoAnio INT IDENTITY(1,1) PRIMARY KEY,
    IdVehiculoModelo INT NOT NULL,
    Anio INT NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_TVehiculoAnio_TVehiculoModelo FOREIGN KEY (IdVehiculoModelo) REFERENCES TVehiculoModelo(IdVehiculoModelo),
    CONSTRAINT UQ_TVehiculoAnio_ModeloAnio UNIQUE (IdVehiculoModelo, Anio)
);
GO

-- 13. Relación: qué batería es compatible con qué vehículo (tabla puente)
CREATE TABLE TProductoVehiculo (
    IdProductoVehiculo INT IDENTITY(1,1) PRIMARY KEY,
    IdProducto INT NOT NULL,
    IdVehiculoMarca INT NOT NULL,
    IdVehiculoModelo INT NULL,
    IdVehiculoAnio INT NULL,
    TipoVehículo VARCHAR(50) NULL,
    Observacion VARCHAR(300) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TProductoVehiculo_TProducto FOREIGN KEY (IdProducto) REFERENCES TProducto(IdProducto),
    CONSTRAINT FK_TProductoVehiculo_TVehiculoMarca FOREIGN KEY (IdVehiculoMarca) REFERENCES TVehiculoMarca(IdVehiculoMarca),
    CONSTRAINT FK_TProductoVehiculo_TVehiculoModelo FOREIGN KEY (IdVehiculoModelo) REFERENCES TVehiculoModelo(IdVehiculoModelo),
    CONSTRAINT FK_TProductoVehiculo_TVehiculoAnio FOREIGN KEY (IdVehiculoAnio) REFERENCES TVehiculoAnio(IdVehiculoAnio)
);
GO

-- =============================================
-- TABLAS DE CLIENTES Y PEDIDOS
-- =============================================

-- 14. Clientes
CREATE TABLE TCliente (
    IdCliente INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario INT NULL,
    TipoDocumento CHAR(1) NOT NULL DEFAULT 'D',
    NumeroDocumento VARCHAR(15) NULL,
    Nombres VARCHAR(100) NULL,
    Apellidos VARCHAR(100) NULL,
    RazonSocial VARCHAR(200) NULL,
    Email VARCHAR(200) NULL,
    Telefono VARCHAR(20) NULL,
    Direccion VARCHAR(300) NULL,
    Ciudad VARCHAR(100) NULL,
    Departamento VARCHAR(100) NULL,
    CodigoPostal VARCHAR(10) NULL,
    FechaNacimiento DATE NULL,
    EsEmpresa BIT NOT NULL DEFAULT 0,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_TCliente_TUsuario FOREIGN KEY (IdUsuario) REFERENCES TUsuario(IdUsuario)
);
GO

-- 15. Pedidos (cabecera)
CREATE TABLE TPedido (
    IdPedido INT IDENTITY(1,1) PRIMARY KEY,
    IdCliente INT NOT NULL,
    IdUsuarioRegistro INT NULL,
    CodigoPedido VARCHAR(20) NOT NULL,
    FechaPedido DATETIME NOT NULL DEFAULT GETDATE(),
    FechaEntrega DATETIME NULL,
    Estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    Subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    Descuento DECIMAL(10,2) NOT NULL DEFAULT 0,
    IGV DECIMAL(10,2) NOT NULL DEFAULT 0,
    Total DECIMAL(10,2) NOT NULL DEFAULT 0,
    Observaciones VARCHAR(500) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_TPedido_TCliente FOREIGN KEY (IdCliente) REFERENCES TCliente(IdCliente),
    CONSTRAINT FK_TPedido_TUsuario FOREIGN KEY (IdUsuarioRegistro) REFERENCES TUsuario(IdUsuario),
    CONSTRAINT UQ_TPedido_Codigo UNIQUE (CodigoPedido)
);
GO

-- 16. Detalle del pedido (líneas)
CREATE TABLE TDetallePedido (
    IdDetallePedido INT IDENTITY(1,1) PRIMARY KEY,
    IdPedido INT NOT NULL,
    IdProducto INT NOT NULL,
    Cantidad INT NOT NULL DEFAULT 1,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    DescuentoLinea DECIMAL(10,2) NOT NULL DEFAULT 0,
    SubtotalLinea DECIMAL(10,2) NOT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TDetallePedido_TPedido FOREIGN KEY (IdPedido) REFERENCES TPedido(IdPedido),
    CONSTRAINT FK_TDetallePedido_TProducto FOREIGN KEY (IdProducto) REFERENCES TProducto(IdProducto)
);
GO

-- =============================================
-- TABLAS DE PAGOS
-- =============================================

-- 17. Pagos (cabecera)
CREATE TABLE TPago (
    IdPago INT IDENTITY(1,1) PRIMARY KEY,
    IdPedido INT NOT NULL,
    IdMetodoPago INT NOT NULL,
    IdCliente INT NOT NULL,
    CodigoOperacion VARCHAR(100) NULL,
    FechaPago DATETIME NOT NULL DEFAULT GETDATE(),
    Monto DECIMAL(10,2) NOT NULL,
    Estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    ComprobanteUrl VARCHAR(500) NULL,
    Observaciones VARCHAR(300) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_TPago_TPedido FOREIGN KEY (IdPedido) REFERENCES TPedido(IdPedido),
    CONSTRAINT FK_TPago_TMetodoPago FOREIGN KEY (IdMetodoPago) REFERENCES TMetodoPago(IdMetodoPago),
    CONSTRAINT FK_TPago_TCliente FOREIGN KEY (IdCliente) REFERENCES TCliente(IdCliente)
);
GO

-- 18. Detalle del pago (split de pagos)
CREATE TABLE TDetallePago (
    IdDetallePago INT IDENTITY(1,1) PRIMARY KEY,
    IdPago INT NOT NULL,
    NumeroTarjetaHash VARCHAR(200) NULL,
    UltimosDigitos CHAR(4) NULL,
    TitularTarjeta VARCHAR(200) NULL,
    FechaVencimiento VARCHAR(10) NULL,
    CodigoTransaccion VARCHAR(100) NULL,
    EstadoTransaccion VARCHAR(30) NULL,
    MensajeRespuesta VARCHAR(300) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TDetallePago_TPago FOREIGN KEY (IdPago) REFERENCES TPago(IdPago)
);
GO

-- =============================================
-- TABLAS DE FACTURACIÓN / COMPROBANTES
-- =============================================

-- 19. Facturas / comprobantes (cabecera)
CREATE TABLE TFactura (
    IdFactura INT IDENTITY(1,1) PRIMARY KEY,
    IdPedido INT NOT NULL,
    IdCliente INT NOT NULL,
    IdTipoComprobante INT NOT NULL,
    Serie VARCHAR(5) NOT NULL,
    Correlativo INT NOT NULL,
    NumeroComprobante AS (Serie + '-' + RIGHT(REPLICATE('0', 8) + CAST(Correlativo AS VARCHAR(8)), 8)),
    FechaEmision DATETIME NOT NULL DEFAULT GETDATE(),
    FechaVencimiento DATETIME NULL,
    RUC VARCHAR(11) NULL,
    DNI VARCHAR(8) NULL,
    RazonSocialCliente VARCHAR(200) NULL,
    DireccionFiscal VARCHAR(300) NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    IGV DECIMAL(10,2) NOT NULL,
    Total DECIMAL(10,2) NOT NULL,
    Moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    Estado VARCHAR(30) NOT NULL DEFAULT 'EMITIDO',
    CodigoQR VARCHAR(500) NULL,
    HashSunat VARCHAR(500) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_TFactura_TPedido FOREIGN KEY (IdPedido) REFERENCES TPedido(IdPedido),
    CONSTRAINT FK_TFactura_TCliente FOREIGN KEY (IdCliente) REFERENCES TCliente(IdCliente),
    CONSTRAINT FK_TFactura_TTipoComprobante FOREIGN KEY (IdTipoComprobante) REFERENCES TTipoComprobante(IdTipoComprobante),
    CONSTRAINT UQ_TFactura_Numero UNIQUE (Serie, Correlativo)
);
GO

-- 20. Detalle de factura (líneas del comprobante)
CREATE TABLE TDetalleFactura (
    IdDetalleFactura INT IDENTITY(1,1) PRIMARY KEY,
    IdFactura INT NOT NULL,
    IdProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    Descripcion VARCHAR(300) NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    DescuentoLinea DECIMAL(10,2) NOT NULL DEFAULT 0,
    ImporteLinea DECIMAL(10,2) NOT NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TDetalleFactura_TFactura FOREIGN KEY (IdFactura) REFERENCES TFactura(IdFactura),
    CONSTRAINT FK_TDetalleFactura_TProducto FOREIGN KEY (IdProducto) REFERENCES TProducto(IdProducto)
);
GO

-- =============================================
-- TABLAS DE LOGÍSTICA / ENVÍOS
-- =============================================

-- 21. Logística (envíos)
CREATE TABLE TLogistica (
    IdLogistica INT IDENTITY(1,1) PRIMARY KEY,
    IdPedido INT NOT NULL,
    IdTransportista INT NULL,
    CodigoSeguimiento VARCHAR(100) NULL,
    FechaEnvio DATETIME NULL,
    FechaEntregaEstimada DATETIME NULL,
    FechaEntregaReal DATETIME NULL,
    DireccionOrigen VARCHAR(300) NOT NULL,
    DireccionDestino VARCHAR(300) NOT NULL,
    CostoEnvio DECIMAL(10,2) NOT NULL DEFAULT 0,
    Estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    PesoTotalKg DECIMAL(8,2) NULL,
    Observaciones VARCHAR(500) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME NULL,
    CONSTRAINT FK_TLogistica_TPedido FOREIGN KEY (IdPedido) REFERENCES TPedido(IdPedido),
    CONSTRAINT FK_TLogistica_TTransportista FOREIGN KEY (IdTransportista) REFERENCES TTransportista(IdTransportista)
);
GO

-- 22. Historial de la logística (tracking)
CREATE TABLE THistorialLogistica (
    IdHistorialLogistica INT IDENTITY(1,1) PRIMARY KEY,
    IdLogistica INT NOT NULL,
    EstadoAnterior VARCHAR(30) NULL,
    EstadoNuevo VARCHAR(30) NOT NULL,
    Ubicacion VARCHAR(200) NULL,
    Descripcion VARCHAR(500) NULL,
    FechaEvento DATETIME NOT NULL DEFAULT GETDATE(),
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_THistorialLogistica_TLogistica FOREIGN KEY (IdLogistica) REFERENCES TLogistica(IdLogistica)
);
GO

-- =============================================
-- TABLAS DE INVENTARIO / STOCK
-- =============================================

-- 23. Movimientos de inventario
CREATE TABLE TMovimientoInventario (
    IdMovimiento INT IDENTITY(1,1) PRIMARY KEY,
    IdProducto INT NOT NULL,
    IdUsuario INT NULL,
    TipoMovimiento CHAR(1) NOT NULL,
    Cantidad INT NOT NULL,
    StockAnterior INT NOT NULL,
    StockNuevo INT NOT NULL,
    Motivo VARCHAR(300) NULL,
    Referencia VARCHAR(100) NULL,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_TMovimientoInventario_TProducto FOREIGN KEY (IdProducto) REFERENCES TProducto(IdProducto),
    CONSTRAINT FK_TMovimientoInventario_TUsuario FOREIGN KEY (IdUsuario) REFERENCES TUsuario(IdUsuario)
);
GO

-- 24. Alertas de stock bajo
CREATE TABLE TAlertaStock (
    IdAlerta INT IDENTITY(1,1) PRIMARY KEY,
    IdProducto INT NOT NULL,
    StockActual INT NOT NULL,
    StockMinimo INT NOT NULL,
    Leida BIT NOT NULL DEFAULT 0,
    Atendida BIT NOT NULL DEFAULT 0,
    FechaAlerta DATETIME NOT NULL DEFAULT GETDATE(),
    FechaAtencion DATETIME NULL,
    CONSTRAINT FK_TAlertaStock_TProducto FOREIGN KEY (IdProducto) REFERENCES TProducto(IdProducto)
);
GO

-- =============================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
-- =============================================

CREATE INDEX IX_TProducto_IdMarca ON TProducto(IdMarca);
CREATE INDEX IX_TProducto_IdCategoria ON TProducto(IdCategoria);
CREATE INDEX IX_TProducto_StockActual ON TProducto(StockActual);
CREATE INDEX IX_TProducto_Destacado ON TProducto(Destacado) WHERE Destacado = 1;
CREATE INDEX IX_TProducto_Activo ON TProducto(Activo) WHERE Activo = 1;

CREATE INDEX IX_TPedido_IdCliente ON TPedido(IdCliente);
CREATE INDEX IX_TPedido_Estado ON TPedido(Estado);
CREATE INDEX IX_TPedido_Fecha ON TPedido(FechaPedido DESC);

CREATE INDEX IX_TPago_IdPedido ON TPago(IdPedido);
CREATE INDEX IX_TPago_Estado ON TPago(Estado);

CREATE INDEX IX_TFactura_IdPedido ON TFactura(IdPedido);
CREATE INDEX IX_TFactura_Fecha ON TFactura(FechaEmision DESC);

CREATE INDEX IX_TMovimientoInventario_IdProducto ON TMovimientoInventario(IdProducto);
CREATE INDEX IX_TMovimientoInventario_Fecha ON TMovimientoInventario(FechaRegistro DESC);

CREATE INDEX IX_TAlertaStock_Leida ON TAlertaStock(Leida) WHERE Leida = 0;

CREATE INDEX IX_TProductoVehiculo_IdProducto ON TProductoVehiculo(IdProducto);
CREATE INDEX IX_TProductoVehiculo_IdVehiculoMarca ON TProductoVehiculo(IdVehiculoMarca);
GO

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista de productos con marca y categoría
CREATE OR ALTER VIEW V_ProductosCompleto AS
SELECT 
    p.IdProducto,
    p.Codigo,
    p.Nombre,
    p.Descripcion,
    m.Nombre AS Marca,
    c.Nombre AS Categoria,
    p.Voltaje,
    p.Amperaje,
    p.PotenciaArranque,
    p.PrecioVenta,
    p.PrecioCosto,
    (p.PrecioVenta - p.PrecioCosto) AS Margen,
    p.StockActual,
    p.StockMinimo,
    CASE WHEN p.StockActual <= p.StockMinimo THEN 'BAJO' ELSE 'NORMAL' END AS EstadoStock,
    p.Destacado,
    p.GarantiaMeses,
    p.ImagenUrl,
    p.Activo
FROM TProducto p
INNER JOIN TMarca m ON p.IdMarca = m.IdMarca
INNER JOIN TCategoria c ON p.IdCategoria = c.IdCategoria;
GO

-- Vista del dashboard (resumen)
CREATE OR ALTER VIEW V_DashboardResumen AS
SELECT
    (SELECT COUNT(*) FROM TProducto WHERE Activo = 1) AS TotalBaterias,
    (SELECT COUNT(*) FROM TProducto WHERE StockActual <= StockMinimo AND Activo = 1) AS StockBajo,
    (SELECT ISNULL(SUM(Total), 0) FROM TPedido WHERE MONTH(FechaPedido) = MONTH(GETDATE()) AND YEAR(FechaPedido) = YEAR(GETDATE())) AS VentasDelMes,
    (SELECT COUNT(*) FROM TPedido WHERE MONTH(FechaPedido) = MONTH(GETDATE()) AND YEAR(FechaPedido) = YEAR(GETDATE())) AS PedidosDelMes,
    (SELECT COUNT(*) FROM TPedido WHERE Estado = 'PENDIENTE') AS PedidosPendientes,
    (SELECT COUNT(*) FROM TCliente WHERE Activo = 1) AS TotalClientes,
    (SELECT ISNULL(AVG(Total), 0) FROM TPedido WHERE MONTH(FechaPedido) = MONTH(GETDATE()) AND YEAR(FechaPedido) = YEAR(GETDATE())) AS TicketPromedio,
    (SELECT COUNT(*) FROM TAlertaStock WHERE Leida = 0) AS AlertasPendientes;
GO

-- Vista de ventas del día
CREATE OR ALTER VIEW V_VentasHoy AS
SELECT
    p.IdPedido,
    p.CodigoPedido,
    p.FechaPedido,
    c.Nombres + ' ' + c.Apellidos AS Cliente,
    c.RazonSocial,
    p.Total,
    p.Estado,
    pg.CodigoOperacion,
    mp.Nombre AS MetodoPago
FROM TPedido p
INNER JOIN TCliente c ON p.IdCliente = c.IdCliente
LEFT JOIN TPago pg ON p.IdPedido = pg.IdPedido
LEFT JOIN TMetodoPago mp ON pg.IdMetodoPago = mp.IdMetodoPago
WHERE CAST(p.FechaPedido AS DATE) = CAST(GETDATE() AS DATE);
GO

PRINT '================================================';
PRINT 'ESQUEMA COMPLETO CREADO EXITOSAMENTE';
PRINT 'Total de tablas creadas: 24';
PRINT 'Total de vistas creadas: 3';
PRINT 'Total de índices creados: 12';
PRINT '================================================';
GO
