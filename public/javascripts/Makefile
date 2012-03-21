# Copyright 2012 Yaco Sistemas S.L.
#
# Developed by Yaco Sistemas <ablanco@yaco.es>
#
# Licensed under the EUPL, Version 1.1 or – as soon they
# will be approved by the European Commission - subsequent
# versions of the EUPL (the "Licence");
# You may not use this work except in compliance with the
# Licence.
# You may obtain a copy of the Licence at:
#
# http://joinup.ec.europa.eu/software/page/eupl
#
# Unless required by applicable law or agreed to in
# writing, software distributed under the Licence is
# distributed on an "AS IS" basis,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
# express or implied.
# See the Licence for the specific language governing
# permissions and limitations under the Licence.

UJS=../../node_modules/uglify-js/bin/uglifyjs
UJSFLAGS=-nc

all: ../../node_modules/uglify-js/bin/uglifyjs underscore.js ../../node_modules/backbone/backbone-min.js ../../client/models.js jqtpl-min.js ../../client/models.js ../../client/events.js
	echo "// Copyright 2012 Yaco Sistemas S.L. - Developed by <ablanco@yaco.es> - EUPL 1.1 License - http://joinup.ec.europa.eu/software/page/eupl" > qba.min.js
	$(UJS) $(UJSFLAGS) underscore.js >> qba.min.js
	cat ../../node_modules/backbone/backbone-min.js >> qba.min.js
	cat jqtpl-min.js >> qba.min.js
	$(UJS) $(UJSFLAGS) ../../client/models.js >> qba.min.js
	$(UJS) $(UJSFLAGS) ../../client/events.js >> qba.min.js

clean: qba.min.js
	rm -f qba.min.js

debug: ../../node_modules/backbone/backbone.js ../../client/models.js ../../client/events.js
	cp ../../node_modules/backbone/backbone.js .
	cp ../../client/models.js .
	cp ../../client/events.js .

cleandebug: backbone.js models.js
	rm -f backbone.js
	rm -f models.js
	rm -f events.js