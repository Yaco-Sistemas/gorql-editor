#!/bin/sh

case $1 in
    start)
        su query-assistant -c "NODE_ENV=production /opt/query-assistant/node_modules/forever/bin/forever start /opt/query-assistant/app.js" --shell=/bin/sh
        ;;
    stop)
        su query-assistant -c "/opt/query-assistant/node_modules/forever/bin/forever stop /opt/query-assistant/app.js" --shell=/bin/sh
        ;;
    restart)
        su query-assistant -c "NODE_ENV=production /opt/query-assistant/node_modules/forever/bin/forever restart /opt/query-assistant/app.js" --shell=/bin/sh
        ;;
    status)
        su query-assistant -c "/opt/query-assistant/node_modules/forever/bin/forever list" --shell=/bin/sh
        ;;
    *)
        echo $"Usage: $0 {start|stop|restart|status}"
        exit 1
esac
