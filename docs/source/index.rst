.. GORQL Editor documentation master file, created by
   sphinx-quickstart on Mon Apr 30 11:13:40 2012.

============
GORQL Editor
============

:Author: `Yaco Sistemas S.L. <http://www.yaco.es/>`_
:Website: https://github.com/Yaco-Sistemas/gorql-editor/
:Release: |release|

GORQL Editor es el segundo componente del sistema GORQL. Su objetivo es
ayudar al usuario a elaborar consultas sobre los datos disponibles, así como
definir representaciones gráficas de los resultados obtenidos. Los resultados y
el gráfico se muestran mediante GORQL Viewer.

GORQL Editor se distribuye con licencia `EUPL o Licencia Pública de la Unión
Europea <http://ec.europa.eu/idabc/eupl>`_. Esta licencia es una de las
licencias aceptadas como software libre por la `FSF (Free Software Foundation)
<http://www.fsf.org>`_.

Introducción
============

.. toctree::
   :maxdepth: 1

   intro

Manuales
========

.. toctree::
   :maxdepth: 1

   deployment
   user
   developer

Notas de publicación
====================

.. toctree::
   :maxdepth: 1

   releases

Cómo obtener GORQL Editor
=========================

GORQL Editor se distribuye en formato RPM y ha sido testeado en sistemas
CentOS/6.2. Los paquetes de cada uno de sus componentes están disponibles en el
`siguiente servidor de Yaco <http://files.yaco.es/~ceic-ogov/>`_ de forma
provisional. Para más información sobre cómo instalar el editor de consultas,
consulte el :doc:`deployment`.

Puede obtener las fuentes del proyecto utilizando un cliente Git:

.. code-block:: bash

    git clone git://github.com/Yaco-Sistemas/gorql-editor.git
