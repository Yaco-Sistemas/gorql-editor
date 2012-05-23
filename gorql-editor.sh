#!/bin/sh

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
