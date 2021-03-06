==================
Manual del usuario
==================

Pasos de definición de la consulta
==================================

La generación de una consulta está subdividida en una serie de pasos o
pestañas. En cada uno de los pasos se van definiendo los diferentes aspectos de
la consulta. Está organizado en pasos porque cada uno depende de los
anteriores, por lo que los cambios que se hagan en los primeros pasos
afectarían a los siguientes.

Escoger colecciones
-------------------

Se muestra un listado de colecciones, agrupadas por categorías. El usuario
puede escoger qué colecciones intervendrán en las consulta. Para ello sólo
tiene que marcar las colecciones que quiera utilizar.

.. image:: _images/selec_categ.png

Se pueden escoger varias colecciones, de una o más categorías.

Escoger campos
--------------

Se muestra un listado de campos, agrupados según las colecciones escogidas en
el paso anterior. El usuario puede escoger qué campos solicitar al *endpoint*
en la consulta.

.. image:: _images/selec_fields.png

Es posible escoger más de un campo por colección, y campos de más de una
colección.

Además se le ofrece al usuario una serie de opciones avanzadas que permiten
refinar la consulta.

Conectar colecciones
~~~~~~~~~~~~~~~~~~~~

En el momento en que se escoge un campo que permite realizar conexiones entre
colecciones (aparecen resaltados), se muestra la interfaz para conectar
colecciones que hasta entonces permanece oculta.

En dicha interfaz se muestra un selector con un listado de los campos escogidos
que son de tipo *uri*, es decir, que apuntan a otros recursos. Al escoger uno
de estos campos en el selector se crea una nueva conexión, que se termina
escogiendo a continuación la colección de destino.

Es decir, que la conexión entre dos colecciones se realiza partiendo de un
campo de tipo *uri* de la colección origen, y el destino es una colección
entera. Lo que quiere decir que ese campo de un recurso de una colección, es
la *uri* (identificador) de un recurso de otra colección.

De esta forma los resultados correspondientes a la segunda colección serán
aquellos apuntados por los recursos de la primera, creándose así una conexión
entre ambas colecciones.

.. image:: _images/join.png

Una conexión se puede eliminar mediante el botón con la "X" de la derecha.

Filtrar resultados
~~~~~~~~~~~~~~~~~~

Los filtros se encuentran en el segundo paso, bajo las *Opciones avanzadas*.

Se muestra un selector con los campos escogidos. Cuando el usuario escoge un
campo se le muestra un listado de filtros aplicables al campo según el tipo al
que pertenezca dicho campo.

El usuario puede escoger entonces el filtro a aplicar, y el valor o valores
límite.

.. image:: _images/filter.png

Un filtro se puede eliminar mediante el botón con la "X" de la derecha.

Añadir gráfico
--------------

Este paso es opcional, pero altamente recomendable.

Se ofrecen los diferentes tipos de gráficos soportados por el componente GORQL
Viewer, y también controles para determinar los parámetros de configuración del
gráfico escogido. Estos controles cambiarán según que se escoja un tipo de
gráfico u otro.

.. image:: _images/chart1.png

Entre los parámetros del gráfico se encuentran los selectores de los campos
que servirán para construir el gráfico. Es decir, los campos escogidos de las
colecciones en el paso anterior y de los que ahora se sacarán los datos para
generar el gráfico. Sólo se mostrarán aquellos campos que sean del tipo
compatible con el gráfico escogido. Por ejemplo, un campo de tipo fecha no
sirve para hacer un gráfico de sectores, hacen falta campos numéricos.

.. image:: _images/chart2.png

Dependiendo de qué gráfico se haya escogido se muestran unos controles u otros,
y unos campos u otros en los selectores.

Previsualización
================

La solapa para *Vista previa* está presente en el segundo y tercer paso, pero
tiene un significado diferente en cada uno de ellos.

.. image:: _images/preview1.png

Al pulsar en la solapa se abre la previsualización de la consulta.

En el segundo paso, la previsualización generada es la tabla de datos con los
resultados obtenidos por la consulta.

.. image:: _images/preview2.png

En el otro caso, durante el tercer paso, la previsualización generada será el
gráfico escogido.

.. image:: _images/preview3.png

Es posible actualizar la previsualización con los cambios en la consulta que se
hayan hecho. Para ello hay que pulsar en el botón *Actualice la vista previa*,
que aparece al mostrarse las previsualizaciones.

Al cerrar y volver a abrir la previsualización también se actualiza ésta con
los últimos cambios.

Ver datos y gráfico en GORQL Viewer
===================================

En el paso de escoger campos y en el de definición del gráfico se muestran
sendos botones para abrir el informe construido en GORQL Viewer. Estos botones,
resaltados con un borde negro, abrirán en una nueva ventana/pestaña el
componente GORQL Viewer con el informe.

Si se pulsa el botón del segundo paso, el informe que se abrirá no tendrá
ningún gráfico.

Si en cambio se pulsa el del paso del gráfico, el informe contendrá la tabla de
resultados y el gráfico definido.

La url abierta será la url del informe, y se puede utilizar para compartirlo
con otras personas.
