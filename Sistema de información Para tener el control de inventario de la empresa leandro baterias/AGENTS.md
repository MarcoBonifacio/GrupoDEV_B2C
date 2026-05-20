# AGENTS.md - Leandro Baterías

## Project Overview
Peruvian battery inventory e-commerce system. Frontend: vanilla HTML/CSS/JS. Backend: ASP.NET Core Web API (Clean Architecture).

## Current Main File
- `Frontend/index7.html` - Final version with all features (63 batteries, 3 payment methods, 3 document types)

## File Versions (do not confuse)
- `index7.html` - CURRENT (all 63 batteries, Yape/Plin/Tarjeta, Comprobante/Boleta/Factura)
- `index6.html` - Consolidated all brands (63 batteries)
- `index5.1.html` to `index5.5.html` - Individual brand files (deprecated, use index7)
- `index4.html` - Old version (21 batteries, basic checkout)

## Frontend Structure
- Product data defined inline in HTML files (63 batteries across 6 brands)
- Cart stored in localStorage (key: `leandro_baterias_cart`)
- Dark mode persisted via localStorage (`theme` key)
- PDF generation uses jsPDF CDN (must load AFTER scripts using it)

## Key JS Components
- `ProductCard.renderGrid(products, containerId)` - Renders product cards
- `Carrito.addItem(producto)` / `Carrito.init()` - Cart management
- `Carrito.updateUI()` - Refreshes cart display
- `Toast.show(message, type)` - Notifications (success/warning/error/info)
- `Toast.init()` - Initialize toast system
- `Storage.getCart()` / `Storage.setCart(cart)` - LocalStorage wrapper
- `selectPayment(el)` - Payment method selector (pass `this` element)
- `selectDocumentType(el)` - Document type selector (comprobante/boleta/factura)

## Common Issues to Avoid
1. Payment selector requires click handler passing `this` - use `onclick="selectPayment(this)"`
2. Sidebar search and main header search are separate - each needs its own event listeners
3. When overriding Carrito.init, call original first then add custom behavior
4. jsPDF must load AFTER scripts that use it - check script order in HTML
5. Carrito.init override pattern:
   ```js
   const _origInit = Carrito.init;
   Carrito.init = function() {
       _origInit.call(this);
       // custom code here
   };
   ```

## Payment Methods
- Yape: 927 456 789 (icon: upload.wikimedia.org)
- Plin: 927 456 789 (icon: seeklogo.com)
- Tarjeta: Credit/debit cards (shows card fields when selected)

## Document Types (Facturación)
- `comprobante` - No document required, optional DNI
- `boleta` - Requires DNI (8 digits)
- `factura` - Requires RUC (11 digits), optional address
- Field visibility controlled by `document.getElementById('dni-field').classList.toggle('hidden')`

## Battery Brands (6 total, 63 products)
- Solite (9): 40B19L, 42B19L, 50B19L, 55B24L, 75D23L, 105D31L, CMF55066, CMF56219, CMF57412
- Enerjet (13): 11D56, 11T56, 11W75, 13W75, 13S85, 15M99, 15MB90, 17T114, 19P130, 23P159, 25P170, 27P190, 33P224
- Etna (10): HL-11, FF-11, FF-13, W-13, V-13NOR, FH-1215NOR, S-1215EM, SU-1217, S-1219, S-1223 N/I
- Ultrabat (5): HL-55, FF-66, W-70N, V-82N, S-96I
- Varta (9): 27R V5 1300, 31T V4 1400, 35 V4 850, 42IST V4 870, 42IST V5 950, 48IST V5 1150, 49ST V4 1250, 4DLTI V4 1500, 8DI V4 2650
- Capsa (17): U1R 500, NS40L 670, NS60L 700, NS60L 770, 42I 800, 42I 900, 24R 950, 27R 1150, 27 1150, 30H 1600, 31T 1600, 35 1100, 36IMX 770, 65 1100, 4D 1800, 4D 2000, 8DI 2600

## Pricing (corrected values to avoid confusion)
- Solite 40B19L: S/270 (NOT S/180)
- Capsa NS40L 670: S/280 (NOT S/170)
- IGV: 18%

## Backend / Database
- `Backend/docs/ScriptsSQL/SeedData.sql` - Contains all 63 batteries with real images
- SQL Server database with tables: Marcas, Baterias, Pedidos, Pagos, Facturas, Clientes, etc.
- Configuration keys in Configuraciones table: PAGO_YAPE_NUMERO, PAGO_PLIN_NUMERO, etc.

## Team (Scrum)
- Product Owner: Baca Medina
- Scrum Master: Cahuana Mendoza
- DevTeam: Bonifacio Ruiz, Llanos Luna
- Sponsor: Medina Carpio Alexsander

## Build / Run
- Frontend: No build step - open `index7.html` directly in browser
- Backend: ASP.NET Core Web API (requires Visual Studio or dotnet CLI)

## Documentation
- `ARQUITECTURA_SISTEMA_LEANDRO_BATERIAS.md` - Full system documentation with ER diagram
- `INFORME_PROYECTO_LEANDRO_BATERIAS.txt` - Complete project report