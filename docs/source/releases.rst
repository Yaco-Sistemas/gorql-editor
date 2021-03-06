1.2.0
=====

Lista de cambios
----------------

- Nuevas versiones de las dependencias, soporte de nodejs 0.8.X.
- Desactivación de los botones de navegación cuando el usuario no ha escogido
  las opciones mínimas en un paso del asistente.
- Generación de nombres legibles y amigables para la tabla de resultados, se
  envían en la query generada para el Viewer.
- Eliminación de la posibilidad de escoger más de un campo para los datos en
  las gráficas de sectores, dado que en dichas gráficas las series de datos se
  ignorar.

1.1.0
=====

Lista de cambios
----------------

- Soporte de chkconfig.
- Diagrama de componentes.
- Documentación de actualización.

1.0.0
=====

Lista de funcionalidades
------------------------

Administración
~~~~~~~~~~~~~~

- Fácilmente escalable.
- Definición de los datos disponibles para el usuario a partir de los
  disponibles en el endpoint SPARQL.
- Definición de categorías como conjunto de colecciones.
- Definición de colecciones como conjunto de patrones SPARQL sobre los datos
  del endpoint.
- Selección de campos a mostrar en cada colección.
- Parámetros para los filtros según cada campo.
- Filtro de idioma por defecto.
- Número de elementos mostrados en la previsualización configurable.
- Gráficos disponibles para el usuario configurables.
- Personalización de la cabecera, mediante un logo y mensaje.

Interfaz de usuario
~~~~~~~~~~~~~~~~~~~

- Fácil creación de consultas SPARQL.
- Escoger las colecciones y campos a obtener con la consulta.
- Conexión entre los datos de varias colecciones.
- Filtrado de los campos de las colecciones para eliminar resultados no
  deseados.
- Filtros personalizados según tipo del campo.
- Sistema de previsualización de los resultados de la consulta.
- Posibilidad de configurar un gráfico sobre los datos obtenidos por la
  consulta.
- Controles específicos según el tipo de gráfico.
- Previsualización del gráfico configurado.
- Posibilidad de abrir el informe generado en GORQL Viewer.
