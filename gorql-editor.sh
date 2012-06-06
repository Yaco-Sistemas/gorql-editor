#!/bin/sh

# chkconfig: 2345 99 01
# description: The GORQL Editor server is a node.js application and it helps \
#              the user to make SPARQL queries.
# config: /etc/gorql-editor/settings.js
#
### BEGIN INIT INFO
# Required-Start: $local_fs $network
# Required-Stop: $local_fs $network
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: Start and stop the GORQL Editor component.
# Description: The GORQL Editor server is a node.js application and it helps
#              the user to make SPARQL queries.
### END INIT INFO

case $1 in
    start)
        su gorql-editor -c "NODE_ENV=production forever start /opt/gorql-editor/app.js" --shell=/bin/sh
        ;;
    stop)
        su gorql-editor -c "forever stop /opt/gorql-editor/app.js" --shell=/bin/sh
        ;;
    restart)
        su gorql-editor -c "NODE_ENV=production forever restart /opt/gorql-editor/app.js" --shell=/bin/sh
        ;;
    status)
        su gorql-editor -c "forever list" --shell=/bin/sh
        ;;
    *)
        echo $"Usage: $0 {start|stop|restart|status}"
        exit 1
esac
