
--------------------------------------------------------------------------------------

PRODUCTOS:

GET /: Devuelve todos los productos.

GET /:id: Devuelve un producto específico por su id.

POST /: Crea un nuevo producto.

POST /activo: Crea un nuevo producto con el estado activo configurado a true.

PUT /:id: Actualiza un producto existente.

DELETE /:id: Elimina un producto específico.

--------------------------------------------------------------------------------------

USUARIOS:

GET /: Devuelve todos los usuarios.

GET /:id: Devuelve un usuario específico por su id.

POST /: Crea un nuevo usuario.

POST /auth: Autentica un usuario basado en el correo y la contraseña.

PUT /:id: Actualiza los datos de un usuario existente.

DELETE /:id: Elimina un usuario y sus ventas asociadas (si las tiene).

--------------------------------------------------------------------------------------

VENTAS:

GET /: Devuelve todas las ventas.

GET /:id: Devuelve una venta específica por su id.

POST /: Crea una nueva venta, validando la existencia de los productos y usuarios.

POST /activa: Crea una venta solo si los productos están activos.

PUT /:id: Actualiza una venta específica.

DELETE /:id: Elimina una venta específica.

--------------------------------------------------------------------------------------