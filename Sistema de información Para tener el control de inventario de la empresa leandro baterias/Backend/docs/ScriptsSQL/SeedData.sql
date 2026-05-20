-- =============================================
-- SEED DATA - Leandro Baterías
-- Productos actualizados con imágenes reales
-- =============================================

USE LeandroBaterias;
GO

-- Eliminar datos existentes (en orden correcto por FK)
DELETE FROM MovimientosInventario;
DELETE FROM AlertasStock;
DELETE FROM FacturasDetalle;
DELETE FROM Facturas;
DELETE FROM PagosDetalle;
DELETE FROM Pagos;
DELETE FROM LogisticasHistorial;
DELETE FROM Logisticas;
DELETE FROM DetallesPedido;
DELETE FROM Pedidos;
DELETE FROM Clientes;
DELETE FROM Baterias;
DELETE FROM Anios;
DELETE FROM Modelos;
DELETE FROM Categorias;
DELETE FROM Marcas;
DELETE FROM Transportistas;
DELETE FROM Configuraciones;
DELETE FROM Usuarios;
DELETE FROM Roles;

-- Resetear identity
DBCC CHECKIDENT ('Roles', RESEED, 0);
DBCC CHECKIDENT ('Marcas', RESEED, 0);
DBCC CHECKIDENT ('Categorias', RESEED, 0);
DBCC CHECKIDENT ('Baterias', RESEED, 0);

-- Insertar Marcas de Baterías
INSERT INTO Marcas (Nombre, Descripcion, LogoUrl, Activo) VALUES
('Solite', 'Baterías de alta calidad con garantía oficial', 'https://placehold.co/200x60/1a73e8/fff?text=Solite', 1),
('Enerjet', 'Baterías de alto rendimiento y durabilidad', 'https://placehold.co/200x60/ff6d00/fff?text=Enerjet', 1),
('Etna', 'Baterías económicas y confiables', 'https://placehold.co/200x60/00c853/fff?text=Etna', 1),
('Ultrabat', 'Baterías de tecnología avanzada', 'https://placehold.co/200x60/9c27b0/fff?text=Ultrabat', 1),
('Varta', 'Baterías alemanas premium con tecnología europea', 'https://placehold.co/200x60/e63946/fff?text=Varta', 1),
('Capsa', 'Baterías nacionales de confianza', 'https://placehold.co/200x60/4caf50/fff?text=Capsa', 1);

-- Insertar Categorías
INSERT INTO Categorias (Nombre, Descripcion, Activo) VALUES
('Convencional', 'Baterías convencionales de ácido-plomo', 1),
('AGM', 'Baterías de fibra de vidrio absorbida', 1),
('Gel', 'Baterías de electrolito gelificado', 1),
('Premium', 'Baterías de gama alta', 1);

-- Insertar Roles
INSERT INTO Roles (Nombre, Descripcion, Activo) VALUES
('ADMIN', 'Administrador del sistema', 1),
('VENDEDOR', 'Personal de ventas', 1),
('ALMACEN', 'Personal de almacén', 1),
('CLIENTE', 'Cliente del sistema', 1);

-- Insertar Usuario Administrador
INSERT INTO Usuarios (IdRol, Username, PasswordHash, Email, Nombres, Apellidos, Telefono, Activo)
VALUES (1, 'admin', '$2a$11$8K1p/a0dL4E5R6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N', 'admin@leandrobaterias.com', 'Administrador', 'Sistema', '999999999', 1);

-- Insertar Transportistas
INSERT INTO Transportistas (Nombre, RUC, Telefono, Email, Activo) VALUES
('Olva Courier', '20511027033', '0800-11112', 'ventas@olva.com.pe', 1),
('Shalom', '20442509218', '014270101', 'envios@shalom.com.pe', 1),
('Delivery Express', '20987654321', '015550000', 'contacto@deliveryexpress.pe', 1);

-- Insertar Configuraciones
INSERT INTO Configuraciones (Clave, Valor, Descripcion, TipoDato, Activo) VALUES
('IGV_PORCENTAJE', '18.00', 'Porcentaje del IGV', 'NUMERO', 1),
('MONEDA_DEFAULT', 'PEN', 'Moneda predeterminada', 'STRING', 1),
('SERIE_FACTURA', 'F001', 'Serie para facturas', 'STRING', 1),
('SERIE_BOLETA', 'B001', 'Serie para boletas', 'STRING', 1),
('ENVIO_GRATIS_MONTO', '200', 'Monto mínimo para envío gratis', 'NUMERO', 1),
('TELEFONO_WHATSAPP', '927456789', 'Número de WhatsApp', 'STRING', 1),
('TELEFONO_FIJO', '012345678', 'Teléfono fijo', 'STRING', 1),
('DIRECCION_EMPRESA', 'Av. Principal 1234, Lima', 'Dirección de la empresa', 'STRING', 1);

-- =============================================
-- BATERÍAS SOLITE (9 modelos)
-- =============================================
INSERT INTO Baterias (IdMarca, IdCategoria, Codigo, Nombre, Descripcion, Voltaje, Amperaje, PotenciaArranque, Precio, PrecioCosto, StockActual, StockMinimo, Destacado, GarantiaMeses, ImagenUrl, Activo) VALUES
(1, 1, '40B19L', 'Batería Solite 40B19L', 'Batería para automóviles medianos', '12', 35, '300 CCA', 270.00, 180.00, 15, 5, 0, 12, 'https://www.boliche.cl/wp-content/uploads/2019/12/8809376160019.jpg', 1),
(1, 1, '42B19L', 'Batería Solite 42B19L', 'Batería de promedio rendimiento', '12', 42, '400 CCA', 280.00, 190.00, 18, 5, 1, 12, 'https://bateriaskallpa.com/wp-content/uploads/2023/09/solite-42B19L.jpg', 1),
(1, 1, '50B19L', 'Batería Solite 50B19L', 'Batería de alta capacidad', '12', 50, '450 CCA', 300.00, 200.00, 15, 5, 1, 18, 'https://bateriaskallpa.com/wp-content/uploads/2023/09/solite-65B24L.jpg', 1),
(1, 1, '55B24L', 'Batería Solite 55B24L', 'Batería para autos premium', '12', 55, '500 CCA', 320.00, 210.00, 12, 5, 1, 18, 'https://bateriaskallpa.com/wp-content/uploads/2023/09/solite-55B24LS.jpg', 1),
(1, 1, '75D23L', 'Batería Solite 75D23L', 'Batería para SUV y pick-up', '12', 75, '700 CCA', 430.00, 290.00, 10, 5, 1, 18, 'https://ditesac.com/wp-content/uploads/2024/09/BSO0034-768x745.jpg', 1),
(1, 1, '105D31L', 'Batería Solite 105D31L', 'Batería para vehículos pesados', '12', 105, '900 CCA', 480.00, 320.00, 8, 4, 1, 24, 'https://www.daitocar.cl/wp-content/uploads/2025/06/bas206-l.webp', 1),
(1, 2, 'CMF55066', 'Batería Solite CMF55066', 'Batería AGM para start-stop', '12', 55, '550 CCA', 380.00, 250.00, 10, 4, 0, 18, 'https://ditesac.com/wp-content/uploads/2024/09/BSO0047-768x726.jpg', 1),
(1, 2, 'CMF56219', 'Batería Solite CMF56219', 'Batería AGM de alta gama', '12', 62, '600 CCA', 400.00, 270.00, 8, 4, 0, 18, 'https://ditesac.com/wp-content/uploads/2024/09/BSO0052-768x706.jpg', 1),
(1, 2, 'CMF57412', 'Batería Solite CMF57412', 'Batería AGM premium 15 placas', '12', 74, '720 CCA', 480.00, 320.00, 6, 3, 1, 24, 'https://bateriaskallpa.com/wp-content/uploads/2023/09/Solite-CMF57412-15-PLACAS-600x600.jpg', 1);

-- =============================================
-- BATERÍAS ENERJET (13 modelos)
-- =============================================
INSERT INTO Baterias (IdMarca, IdCategoria, Codigo, Nombre, Descripcion, Voltaje, Amperaje, PotenciaArranque, Precio, PrecioCosto, StockActual, StockMinimo, Destacado, GarantiaMeses, ImagenUrl, Activo) VALUES
(2, 1, '11D56', 'Batería Enerjet 11D56', 'Batería para vehículos ligeros', '12', 11, '110 CCA', 290.00, 190.00, 20, 5, 0, 12, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F11d56p.jpg&w=3840&q=75', 1),
(2, 1, '11T56', 'Batería Enerjet 11T56', 'Batería para autos compactos', '12', 11, '120 CCA', 320.00, 210.00, 18, 5, 0, 12, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fffff.png&w=3840&q=75', 1),
(2, 1, '11W75', 'Batería Enerjet 11W75', 'Batería para sedanes', '12', 11, '130 CCA', 320.00, 210.00, 15, 5, 0, 12, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F11w63.jpg&w=3840&q=75', 1),
(2, 1, '13W75', 'Batería Enerjet 13W75', 'Batería para autos medianos', '12', 13, '200 CCA', 340.00, 220.00, 14, 5, 0, 15, 'https://media.falabella.com/sodimacPE/1839632_01/w=1004,h=1500,fit=pad', 1),
(2, 1, '13S85', 'Batería Enerjet 13S85', 'Batería de alto rendimiento', '12', 13, '220 CCA', 380.00, 250.00, 12, 5, 1, 15, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000019.png&w=3840&q=75', 1),
(2, 1, '15M99', 'Batería Enerjet 15M99', 'Batería premium para SUV', '12', 15, '250 CCA', 430.00, 280.00, 10, 4, 1, 18, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F15m99.png&w=3840&q=75', 1),
(2, 1, '15MB90', 'Batería Enerjet 15MB90', 'Batería para pick-up', '12', 15, '260 CCA', 410.00, 270.00, 12, 4, 1, 18, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000107.png&w=3840&q=75', 1),
(2, 2, '17T114', 'Batería Enerjet 17T114', 'Batería AGM para start-stop', '12', 17, '300 CCA', 510.00, 340.00, 8, 3, 1, 18, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F17t114.jpg&w=3840&q=75', 1),
(2, 2, '19P130', 'Batería Enerjet 19P130', 'Batería AGM premium', '12', 19, '350 CCA', 610.00, 400.00, 6, 3, 1, 24, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2F19p130.jpg&w=3840&q=75', 1),
(2, 2, '23P159', 'Batería Enerjet 23P159', 'Batería AGM alta capacidad', '12', 23, '400 CCA', 670.00, 450.00, 5, 3, 1, 24, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000011.png&w=3840&q=75', 1),
(2, 2, '25P170', 'Batería Enerjet 25P170', 'Batería AGM para SUV premium', '12', 25, '450 CCA', 730.00, 490.00, 4, 2, 1, 24, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000012.png&w=3840&q=75', 1),
(2, 2, '27P190', 'Batería Enerjet 27P190', 'Batería AGM para flota', '12', 27, '500 CCA', 770.00, 510.00, 4, 2, 1, 24, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000235.png&w=3840&q=75', 1),
(2, 2, '33P224', 'Batería Enerjet 33P224', 'Batería AGM máxima capacidad', '12', 33, '600 CCA', 900.00, 600.00, 3, 2, 1, 24, 'https://www.enerjet.com.pe/_next/image?url=https%3A%2F%2Fwww.enerjet.com.pe%2Fadmin%2Fuploads%2Fbaa0000106.png&w=3840&q=75', 1);

-- =============================================
-- BATERÍAS ETNA (10 modelos)
-- =============================================
INSERT INTO Baterias (IdMarca, IdCategoria, Codigo, Nombre, Descripcion, Voltaje, Amperaje, PotenciaArranque, Precio, PrecioCosto, StockActual, StockMinimo, Destacado, GarantiaMeses, ImagenUrl, Activo) VALUES
(3, 1, 'HL-11', 'Batería Etna HL-11', 'Batería económica para autos compactos', '12', 45, '450 CCA', 280.00, 185.00, 15, 5, 0, 12, 'https://ditesac.com/wp-content/uploads/2024/09/BET0032.png', 1),
(3, 1, 'FF-11', 'Batería Etna FF-11', 'Batería convencional de calidad', '12', 45, '450 CCA', 300.00, 195.00, 14, 5, 0, 12, 'https://promart.vteximg.com.br/arquivos/ids/6963206-380-380/150232.jpg?v=638182350717800000', 1),
(3, 1, 'FF-13', 'Batería Etna FF-13', 'Batería para autos medianos', '12', 55, '550 CCA', 320.00, 210.00, 12, 5, 1, 15, 'https://promart.vteximg.com.br/arquivos/ids/6963205-380-380/150233.jpg?v=638182350679130000', 1),
(3, 1, 'W-13', 'Batería Etna W-13', 'Batería confiable para sedanes', '12', 55, '550 CCA', 330.00, 215.00, 12, 5, 1, 15, 'https://promart.vteximg.com.br/arquivos/ids/6888016-380-380/149962.jpg?v=638155766389300000', 1),
(3, 1, 'V-13NOR', 'Batería Etna V-13NOR', 'Batería de alto rendimiento', '12', 60, '600 CCA', 370.00, 240.00, 10, 4, 1, 18, 'https://promart.vteximg.com.br/arquivos/ids/6888022-380-380/149972.jpg?v=638155766581970000', 1),
(3, 2, 'FH-1215NOR', 'Batería Etna FH-1215NOR', 'Batería AGM para start-stop', '12', 65, '650 CCA', 400.00, 260.00, 8, 3, 1, 18, 'https://promart.vteximg.com.br/arquivos/ids/6888017-380-380/149971.jpg?v=638155766421900000', 1),
(3, 1, 'S-1215EM', 'Batería Etna S-1215EM', 'Batería para SUV medianos', '12', 70, '700 CCA', 380.00, 250.00, 8, 4, 0, 18, 'https://promart.vteximg.com.br/arquivos/ids/6888019-380-380/149970.jpg?v=638155766487900000', 1),
(3, 2, 'SU-1217', 'Batería Etna SU-1217', 'Batería AGM premium', '12', 75, '750 CCA', 480.00, 320.00, 6, 3, 1, 24, 'https://ditesac.com/wp-content/uploads/2024/09/BET0093.png', 1),
(3, 2, 'S-1219', 'Batería Etna S-1219', 'Batería AGM para SUV grandes', '12', 85, '850 CCA', 580.00, 380.00, 5, 3, 1, 24, 'https://ditesac.com/wp-content/uploads/2024/09/BET0112.png', 1),
(3, 2, 'S-1223-NI', 'Batería Etna S-1223 N/I', 'Batería AGM máxima capacidad', '12', 95, '950 CCA', 630.00, 420.00, 4, 2, 1, 24, 'https://ditesac.com/wp-content/uploads/2024/09/BET0112.png', 1);

-- =============================================
-- BATERÍAS ULTRABAT (5 modelos)
-- =============================================
INSERT INTO Baterias (IdMarca, IdCategoria, Codigo, Nombre, Descripcion, Voltaje, Amperaje, PotenciaArranque, Precio, PrecioCosto, StockActual, StockMinimo, Destacado, GarantiaMeses, ImagenUrl, Activo) VALUES
(4, 1, 'HL-55', 'Batería Ultrabat HL-55', 'Batería económica de calidad', '12', 55, '550 CCA', 250.00, 165.00, 15, 5, 0, 12, 'https://elgatobaterias.com/wp-content/uploads/2025/07/HL-55N.jpg', 1),
(4, 1, 'FF-66', 'Batería Ultrabat FF-66', 'Batería para taxis y flotas', '12', 66, '660 CCA', 280.00, 185.00, 12, 5, 0, 18, 'https://elgatobaterias.com/wp-content/uploads/2025/07/FF66-N.jpg', 1),
(4, 1, 'W-70N', 'Batería Ultrabat W-70N', 'Batería confiable para sedanes', '12', 70, '700 CCA', 290.00, 190.00, 10, 5, 0, 18, 'https://elgatobaterias.com/wp-content/uploads/2025/07/W-70N-300x300.jpg', 1),
(4, 2, 'V-82N', 'Batería Ultrabat V-82N', 'Batería AGM para start-stop', '12', 82, '820 CCA', 330.00, 220.00, 8, 3, 1, 24, 'https://elgatobaterias.com/wp-content/uploads/2025/07/V-82I-300x300.jpg', 1),
(4, 2, 'S-96I', 'Batería Ultrabat S-96I', 'Batería AGM premium', '12', 96, '960 CCA', 360.00, 240.00, 6, 3, 1, 24, 'https://elgatobaterias.com/wp-content/uploads/2025/07/S96-I.jpg', 1);

-- =============================================
-- BATERÍAS VARTA (9 modelos)
-- =============================================
INSERT INTO Baterias (IdMarca, IdCategoria, Codigo, Nombre, Descripcion, Voltaje, Amperaje, PotenciaArranque, Precio, PrecioCosto, StockActual, StockMinimo, Destacado, GarantiaMeses, ImagenUrl, Activo) VALUES
(5, 2, '27R-V5-1300', 'Batería Varta 27R V5 1300', 'Batería alemán premium alta gama', '12', 75, '1300 CCA', 520.00, 350.00, 8, 4, 1, 24, 'https://ditesac.com/wp-content/uploads/2024/09/BVA0027.png', 1),
(5, 2, '31T-V4-1400', 'Batería Varta 31T V4 1400', 'Batería AGM máxima potencia', '12', 95, '1400 CCA', 550.00, 370.00, 6, 3, 1, 24, 'https://api.implementos.com.pe/file/sku/1000/CAPBAT0004_1.jpg', 1),
(5, 1, '35-V4-850', 'Batería Varta 35 V4 850', 'Batería para autos europeos', '12', 60, '850 CCA', 400.00, 270.00, 10, 5, 0, 18, 'https://ditesac.com/wp-content/uploads/2024/09/BVA0030-768x768.png', 1),
(5, 1, '42IST-V4-870', 'Batería Varta 42IST V4 870', 'Batería para SUV medianos', '12', 42, '870 CCA', 380.00, 255.00, 12, 5, 0, 18, 'https://ditesac.com/wp-content/uploads/2024/09/BVA0016.jpg', 1),
(5, 1, '42IST-V5-950', 'Batería Varta 42IST V5 950', 'Batería start-stop estándar', '12', 42, '950 CCA', 420.00, 280.00, 10, 4, 1, 18, 'https://ditesac.com/wp-content/uploads/2024/09/BVA0046-768x768.png', 1),
(5, 2, '48IST-V5-1150', 'Batería Varta 48IST V5 1150', 'Batería AGM para SUV', '12', 48, '1150 CCA', 460.00, 310.00, 8, 3, 1, 24, 'https://ditesac.com/wp-content/uploads/2024/09/BVA0007-768x768.png', 1),
(5, 2, '49ST-V4-1250', 'Batería Varta 49ST V4 1250', 'Batería AGM premium', '12', 75, '1250 CCA', 550.00, 370.00, 6, 3, 1, 24, 'https://ditesac.com/wp-content/uploads/2024/09/BVA0031-49STV41250-3-768x768.jpg', 1),
(5, 2, '4DLTI-V4-1500', 'Batería Varta 4DLTI V4 1500', 'Batería para vehículos pesados', '12', 150, '1500 CCA', 730.00, 490.00, 4, 2, 1, 24, 'https://api.implementos.com.pe/file/sku/1000/VARBAT3003_1.jpg', 1),
(5, 2, '8DI-V4-2650', 'Batería Varta 8DI V4 2650', 'Batería para maquinaria pesada', '12', 200, '2650 CCA', 950.00, 640.00, 3, 2, 1, 24, 'https://api.implementos.com.pe/file/sku/1000/VARBAT3002_1.jpg', 1);

-- =============================================
-- BATERÍAS CAPSA (17 modelos)
-- =============================================
INSERT INTO Baterias (IdMarca, IdCategoria, Codigo, Nombre, Descripcion, Voltaje, Amperaje, PotenciaArranque, Precio, PrecioCosto, StockActual, StockMinimo, Destacado, GarantiaMeses, ImagenUrl, Activo) VALUES
(6, 1, 'U1R-500', 'Batería Capsa U1R 500', 'Batería para autos compacto', '12', 45, '500 CCA', 200.00, 135.00, 10, 5, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/09/U1R-500.png', 1),
(6, 1, 'NS40L-670', 'Batería Capsa NS40L 670', 'Batería para sedanes', '12', 40, '670 CCA', 280.00, 185.00, 12, 5, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2021/04/NS40L550.png', 1),
(6, 1, 'NS60L-700', 'Batería Capsa NS60L 700', 'Batería para autos medianos', '12', 60, '700 CCA', 300.00, 200.00, 8, 5, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2021/04/NS60LS700.png', 1),
(6, 1, 'NS60L-770', 'Batería Capsa NS60L 770', 'Batería premium nacional', '12', 60, '770 CCA', 320.00, 210.00, 8, 4, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/09/NS60LS-770.png', 1),
(6, 1, '42I-800', 'Batería Capsa 42I 800', 'Batería para SUV', '12', 42, '800 CCA', 315.00, 205.00, 10, 5, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/09/42I-800.png', 1),
(6, 1, '42I-900', 'Batería Capsa 42I 900', 'Batería de alta potencia', '12', 42, '900 CCA', 320.00, 210.00, 10, 5, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/09/42-900.png', 1),
(6, 1, '24R-950', 'Batería Capsa 24R 950', 'Batería para pick-up', '12', 70, '950 CCA', 350.00, 230.00, 8, 4, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/11/24R-1100.png', 1),
(6, 1, '27R-1150', 'Batería Capsa 27R 1150', 'Batería para SUV grandes', '12', 80, '1150 CCA', 430.00, 280.00, 6, 4, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/09/27R-1150.png', 1),
(6, 1, '27-1150', 'Batería Capsa 27 1150', 'Batería convencional premium', '12', 80, '1150 CCA', 430.00, 280.00, 6, 4, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/09/27-1150.png', 1),
(6, 1, '30H-1600', 'Batería Capsa 30H 1600', 'Batería para camionetas', '12', 90, '1600 CCA', 490.00, 320.00, 5, 3, 1, 18, 'https://bateriascapsa.com/wp-content/uploads/2025/09/30H-1600.png', 1),
(6, 1, '31T-1600', 'Batería Capsa 31T 1600', 'Batería para buses', '12', 95, '1600 CCA', 500.00, 330.00, 4, 3, 1, 18, 'https://bateriascapsa.com/wp-content/uploads/2025/09/31T-1600.png', 1),
(6, 1, '35-1100', 'Batería Capsa 35 1100', 'Batería para SUVs medianos', '12', 65, '1100 CCA', 370.00, 245.00, 6, 4, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/09/35-1100.png', 1),
(6, 1, '36IMX-770', 'Batería Capsa 36IMX 770', 'Batería para 11 placas', '12', 65, '770 CCA', 290.00, 190.00, 8, 4, 0, 12, 'https://bateriascapsa.com/wp-content/uploads/2025/09/36I-650.png', 1),
(6, 1, '65-1100', 'Batería Capsa 65 1100', 'Batería para flota', '12', 75, '1100 CCA', 520.00, 350.00, 5, 3, 1, 18, 'https://bateriascapsa.com/wp-content/uploads/2025/09/65-1100.png', 1),
(6, 1, '4D-1800', 'Batería Capsa 4D 1800', 'Batería para vehículos pesados', '12', 180, '1800 CCA', 680.00, 450.00, 4, 2, 1, 24, 'https://bateriascapsa.com/wp-content/uploads/2025/09/4D1800.png', 1),
(6, 1, '4D-2000', 'Batería Capsa 4D 2000', 'Batería para buses y camiones', '12', 200, '2000 CCA', 700.00, 470.00, 3, 2, 1, 24, 'https://bateriascapsa.com/wp-content/uploads/2025/09/4D2000.png', 1),
(6, 1, '8DI-2600', 'Batería Capsa 8DI 2600', 'Batería para maquinaria pesada', '12', 260, '2600 CCA', 850.00, 570.00, 2, 2, 1, 24, 'https://bateriascapsa.com/wp-content/uploads/2025/09/8DI-2600.png', 1);

-- =============================================
-- DATOS DE PRUEBA - Clientes
-- =============================================
INSERT INTO Clientes (IdUsuario, TipoDocumento, NumeroDocumento, Nombres, Apellidos, RazonSocial, Email, Telefono, Direccion, Ciudad, Departamento, Activo) VALUES
(NULL, 'D', '12345678', 'Juan', 'Pérez García', NULL, 'juan.perez@email.com', '987654321', 'Av. Lima 123', 'Lima', 'Lima', 1),
(NULL, 'R', '20123456789', 'Empresa ABC S.A.C.', NULL, 'Empresa ABC S.A.C.', 'ventas@empresaabc.com', '988776655', 'Av. Industrial 456', 'Lima', 'Lima', 1);

-- =============================================
-- CONFIGURACIÓN DE MÉTODOS DE PAGO
-- =============================================
INSERT INTO Configuraciones (Clave, Valor, Descripcion, TipoDato, Activo) VALUES
('PAGO_YAPE_NUMERO', '927456789', 'Número de Yape para pagos', 'STRING', 1),
('PAGO_PLIN_NUMERO', '927456789', 'Número de Plin para pagos', 'STRING', 1),
('PAGO_TARJETA_HABILITADO', 'true', 'Habilitar pago con tarjeta', 'BOOLEANO', 1),
('MONTO_ENVIO_GRATIS', '200', 'Monto mínimo para envío gratis', 'NUMERO', 1);

PRINT 'Base de datos actualizada con 63 baterías de 6 marcas.';
PRINT 'Incluye: Solite(9), Enerjet(13), Etna(10), Ultrabat(5), Varta(9), Capsa(17)';
GO