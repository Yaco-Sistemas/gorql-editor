========================
Manual del desarrollador
========================

Instalación del entorno de desarrollo
=====================================

Dependencias
------------

Es necesario tener instaladas las **utilidades de compilación** del sistema.

También es muy recomendable tener instalado algún navegador basado en
**webkit**. Es imprescindible para depurar el servidor usando node-inspector.

Instalar NodeJS
---------------

Es necesario descargar y compilar node: http://nodejs.org/#download

Compilar NodeJS
~~~~~~~~~~~~~~~

Primero se descarga el último tar disponible
(http://nodejs.org/dist/v0.6.17/node-v0.6.17.tar.gz) y luego se ejecutan los
siguientes comandos:

.. code-block:: bash

    tar xvf node-v0.6.17.tar.gz
    cd node-v0.6.17
    ./configure
    make
    sudo make install

En la documentación de node se pueden encontrar más detalles:
https://github.com/joyent/node/wiki/Installation

NPM es el manejador de paquetes de node, y es necesario para el despliegue,
pero no es necesario instalarlo porque ya viene incluido en NodeJS.

Despliegue de GORQL Editor
--------------------------

Lo primero es obtener el código del repositorio mercurial:

.. code-block:: bash

    hg clone https://hg.yaco.es/ceic-ogov-assistant

A continuación hay que instalar las dependencias del mismo, para ello se debe
ejecutar:

.. code-block:: bash

    cd ceic-ogov-assistant
    npm install -d

Por último se puede ajustar la configuración del editor editando el fichero
**settings.js**

Arranque del servidor
---------------------

Para arrancar el servidor basta con:

.. code-block:: bash

    node app.js

El servidor se lanzará y escuchará en: http://localhost:3010/

Depuración del editor
---------------------

Node-Inspector
~~~~~~~~~~~~~~

Para instalarlo en el sistema hay que ejecutar como **root**:

.. code-block:: bash

    npm install -g node-inspector

Arranque del servidor en modo debug
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Primero se debe lanzar node-inspector:

.. code-block:: bash

    node-inspector &

A continuación se puede arrancar el servidor en modo debug ejecutando:

.. code-block:: bash

    node --debug app.js

Accediendo a http://localhost:8080/debug?port=5858 con un navegador basado en
webkit se mostrarán las herramientas de depuración para depurar el servidor.

GORQL Editor estará disponible en http://localhost:3010/ igual que sin la
depuración activada.

Generación de los paquetes RPM
==============================

Lo primero es obtener el código del repositorio mercurial:

.. code-block:: bash

    hg clone https://hg.yaco.es/ceic-ogov-assistant

Una vez que se haya terminado de clonar el proyecto se puede proceder a la
generación de los RPM.

.. note::

    Para poder generar los RPM es necesario que estén instalados en el sistema
    *mercurial* y *rpm-build*

NodeJS
------

Dependencias
~~~~~~~~~~~~

Es necesario que estén instaladas las herramientas de compilación y algunas
librerías. Se pueden instalar mediante el sistema de paquetería del sistema
operativo:

.. code-block:: bash

    yum install gcc gcc-c++ make openssl-devel libstdc++-devel

Hay que descargar también el código fuente de NodeJS_ de la web, la versión
0.6.17 se encuentra disponible aquí_.

.. _NodeJS: http://nodejs.org/

.. _aquí: http://nodejs.org/dist/v0.6.17/node-v0.6.17.tar.gz

Generación
~~~~~~~~~~

Para generar el paquete hay que copiar el **spec** y el **tar.gz** a los
correspondientes directorios de generación:

.. code-block:: bash

    cp ceic-ogov-assistant/specs/nodejs.spec /usr/src/redhat/SPECS/
    cp node-v0.6.17.tar.gz /usr/src/redhat/SOURCES/

Con esto queda preparada la generación del paquete, para ello sólo hay que
ejecutar los siguientes comandos:

.. code-block:: bash

    cd /usr/src/redhat/SPECS/
    rpmbuild -ba nodejs.spec

Cuando termine el proceso se habrá generado el paquete RPM, que estará
disponible en */usr/src/redhat/RPMS/x86_64/nodejs-0.6.17-1.x86_64.rpm*

GORQL Editor
------------

Dependencias
~~~~~~~~~~~~

La generación del paquete RPM de GORQL Editor requiere que esté instalado el
paquete de NodeJS generado en el apartado anterior:

.. code-block:: bash

    rpm -Uvh nodejs-0.6.17-1.x86_64.rpm

También requiere de la utilidad *make*, que se puede instalar mediante el
sistema de paquetería del sistema operativo:

.. code-block:: bash

    yum install make

Generación
~~~~~~~~~~

Lo primero es editar el fichero *ceic-ogov-assistant/specs/gorql-editor.spec*
del editor y modificar la versión del paquete a la deseada, se trata de la
línea que comienza con **Version:**.

Luego hay que comprimir los fuentes en un **tar.gz**. Para ello hay que
ejecutar los siguientes comandos, **sustituyendo VERSION por la versión
especificada en el fichero .spec**:

.. code-block:: bash

    cd ceic-ogov-assistant
    hg archive -t tgz gorql-editor-VERSION.tar.gz

Para generar el paquete hay que copiar el **spec** y el **tar.gz** a los
correspondientes directorios de generación:

.. code-block:: bash

    cp ceic-ogov-assistant/specs/gorql-editor.spec /usr/src/redhat/SPECS/
    cp ceic-ogov-assistant/gorql-editor-VERSION.tar.gz /usr/src/redhat/SOURCES/

Con esto queda preparada la generación del paquete, para ello sólo hay que
ejecutar los siguientes comandos:

.. code-block:: bash

    npm cache clean
    cd /usr/src/redhat/SPECS/
    rpmbuild -ba gorql-editor.spec

Cuando termine el proceso se habrá generado el paquete RPM, que estará
disponible en */usr/src/redhat/RPMS/x86_64/gorql-editor-VERSION-1.x86_64.rpm*

.. note::

    Cuando se producen errores en la generación de un RPM es habitual que
    queden restos en los directorios temporales que hay que borrar antes de
    volver a intentar la generación de dicho RPM. Los directorios a limpiar
    son:

        - /usr/src/redhat/BUILD
        - /usr/src/redhat/BUILDROOT
        - /var/tmp
        - /tmp
        - /opt/gorql-editor
