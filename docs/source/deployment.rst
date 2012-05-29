====================
Manual de despliegue
====================

Entorno de desarrollo
=====================

El proceso detallado para desplegar GORQL Editor para un entorno de desarrollo
se encuentra en el :doc:`developer`.

Dependencias
============

NodeJS
------

NodeJS es la tecnología sobre la que se ha construido GORQL Editor. Se puede
instalar a partir de un RPM:

*x86_64 RedHat 5*
 Descarga-NodeJS-RH5_

.. _Descarga-NodeJS-RH5: http://files.yaco.es/~ceic-ogov/dependencies/rh5/nodejs-0.6.17-1.x86_64.rpm

*x86_64 RedHat 6*
 Descarga-NodeJS-RH6_

.. _Descarga-NodeJS-RH6: http://files.yaco.es/~ceic-ogov/dependencies/rh6/nodejs-0.6.17-1.el6.x86_64.rpm

Una vez descargado el paquete se instala ejecutando (ej RH5):

.. code-block:: none

 # rpm -Uvh nodejs-0.6.17-1.x86_64.rpm

Este paquete provee NodeJS_ y NPM_ (el sistema de paquetería de NodeJS)
necesarios para el funcionamiento de GORQL Viewer.

.. _NodeJS: http://nodejs.org/
.. _NPM: http://npmjs.org/

Forever
-------

Forever_ es una utilidad que se encarga de monitorizar procesos, y relanzarlos
en caso de que se produzca algún tipo de error.

.. _Forever: https://github.com/nodejitsu/forever

Se puede instalar a partir de un RPM:

*x86_64 RedHat 5*
 Descarga-Forever-RH5_

.. _Descarga-Forever-RH5: http://files.yaco.es/~ceic-ogov/dependencies/rh5/forever-0.9.1-1.x86_64.rpm

*x86_64 RedHat 6*
 Descarga-Forever-RH6_

.. _Descarga-Forever-RH6: http://files.yaco.es/~ceic-ogov/dependencies/rh6/forever-0.9.1-1.x86_64.rpm

Una vez descargado el paquete se instala ejecutando:

.. code-block:: none

 # rpm -Uvh forever-0.9.1-1.x86_64.rpm

Otros
-----

Las librerías que requiere GORQL Editor se distribuyen en el paquete del mismo,
con lo que al instalarlo se instalan también sus dependencias.

GORQL Editor
============

Una vez instalado NodeJS, se puede desplegar GORQL Editor. Para ello se utiliza el
paquete RPM:

*x86_64 RedHat 5*
 Descarga-GORQL-Editor-RH5_

.. _Descarga-GORQL-Editor-RH5: http://files.yaco.es/~ceic-ogov/gorql-editor/devel/rh5/gorql-editor-1.0.0develhg186-2.x86_64.rpm

*x86_64 RedHat 6*
 Descarga-GORQL-Editor-RH6_

.. _Descarga-GORQL-Editor-RH6: http://files.yaco.es/~ceic-ogov/gorql-editor/devel/rh6/gorql-editor-1.0.0develhg186-2.x86_64.rpm

Una vez descargado el paquete se instala ejecutando:

::

 # rpm -Uvh gorql-editor-1.0.0develhg186-2.x86_64.rpm

Este paquete incluye GORQL Editor y todas las librerías que utiliza, y crea un
script de servicio para el arranque y parada del servidor.

Los contenidos del paquete se despliegan en `/opt/gorql-editor/`. Los logs se
encuentran en `/opt/gorql-editor/.forever/`.

El servidor escucha, con la configuración por defecto, en el **puerto 3010**.
La configuración del mismo se encuentra en el fichero `settings.js` en el
directorio `/etc/gorql-editor/`.

Gestión del servicio
--------------------

Gracias al script de servicio *gorql-editor* es muy sencillo gestionar el
**arranque**, **parada** y **monitorización** del servidor. Para ello tan sólo
hemos de invocar al servicio con el argumento *start*, *stop* o *status*,
respectivamente.

Para la gestión de este servicio se utiliza Forever_ que se encarga de que el
servidor se relance en caso de que ocurra algún problema.

*Ejemplos de salida*

::

 # service gorql-editor start
 info:   Forever processing file: /opt/gorql-editor/app.js

::

 # service gorql-editor stop
 info:   Forever stopped process:
 data:       uid  command script                 forever pid  logfile                           uptime
 data:   [0] ekL8 node    /opt/gorql-editor/app.js 8101    8102 /opt/gorql-editor/.forever/ekL8.log 0:0:40:0.5

::

 # service gorql-editor status
 info:   Forever processes running
 data:       uid  command script                 forever pid  logfile                           uptime
 data:   [0] ekL8 node    /opt/gorql-editor/app.js 8101    8102 /opt/gorql-editor/.forever/ekL8.log 0:0:39:15.924

Esquema del EndPoint SPARQL
---------------------------

La estructura de los datos del EndPoint se define en un fichero JSON. Dicho
fichero se puede guardar en cualquier parte, pero lo más habitual es que esté
dentro del directorio *endpoints*. En dicho directorio se encuentran dos
ficheros de ejemplo sobre datos de la DBpedia_, que es un proyecto que publica
los datos de la Wikipedia_ a través de un Virtuoso_ en forma de *linked data*.

.. _DBpedia: http://dbpedia.org/
.. _Wikipedia: http://www.wikipedia.org/
.. _Virtuoso: http://virtuoso.openlinksw.com/

TODO

Configuración
-------------

La configuración del editor se encuentra en el directorio `/etc/gorql-editor/`.

settings.js
~~~~~~~~~~~

Éste es el fichero principal de configuración de GORQL Editor. Incluye tres
grupos de parámetros: *global*, *development* y *production*. Que son opciones
globales para todos los casos, específicas para entornos de desarrollo, y
específicas para entornos de producción, respectivamente.

Por defecto, si se arranca el visor mediante el script de servicio, el modo
utilizado es *Production*.

El formato es JSON. Las opciones de desarrollo y producción son las mismas, se
utiliza un grupo u otro según se arranque el editor en un modo u otro.

El fichero trae una configuración de ejemplo.

Global
''''''

 - **staticUrl**: Ruta donde se sirven los ficheros estáticos, sólo es necesario
   modificar este parámetro si se desea servir los ficheros estáticos por
   separado. Por defecto, *""*.
 - **debug**: Modo depuración, para el funcionamiento normal debe estar
   desactivado. Por defecto, *false*.
 - **port**: Puerto en el que escucha el editor. Por defecto, *3010*.
 - **viewer**: Dominio en el que se encuentra GORQL Viewer. Por defecto,
   *http://gorql-viewer.ceic-ogov.yaco.es*. Es importante que no tenga */* al
   final de la url.
 - **schema**: Fichero JSON con la definición de las colecciones del endpoint a
   utilizar. Por defecto, *endpoints/dbpedia.json*.
 - **language**: Lista de idiomas para ofrecer al usuario en el filtro de
   idioma. No se trata del idioma en el que se sirve la plataforma, sino en los
   idiomas por los que se pueden filtrar los campos. Por defecto se incluye
   inglés y español. Se trata de un objeto JSON con el idioma por defecto y la
   lista de idiomas posibles.
 - **logo**: Ruta a la imagen para la cabecera del editor. Por defecto,
   *images/logo-big.png*.
 - **title**: Título del editor que aparecerá en la cabecera. Por defecto,
   *Asistente de Construcción de Consultas*.

Development y Production
''''''''''''''''''''''''

Las siguientes son opciones de la plataforma, el usuario final no podrá escoger
valores diferentes a los que el administrador haya configurado aquí:

 - **previewLimit**: Número máximo de registros mostrados en la tabla de
   resultados de la previsualización. Por ejemplo, *10*.
 - **availableCharts**: Objeto JSON con la lista de gráficos disponibles para
   el usuario, agrupados por familias. Para activar o desactivar un gráfico
   sólo hay que añadirlo o quitarlo de la familia correspondiente. La lista
   completa de gráficos según familias es:

   - **d3**: *bar*, *line* y *pie*
   - **simile**: *timeline*
   - **map**: *map* y *mapea*
