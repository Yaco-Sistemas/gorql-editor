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

all: qba-core
	cat qba-core.js > qba.min.js

qba-core: ../../node_modules/uglify-js/bin/uglifyjs ../../node_modules/jqtpl/lib/jqtpl.js ../../node_modules/backbone/backbone-min.js
	echo "// Copyright 2012 Yaco Sistemas S.L. - Developed by <ablanco@yaco.es> - EUPL 1.1 License - http://joinup.ec.europa.eu/software/page/eupl" > qba-core.js
	echo "var exports = {};" >> qba-core.js
	$(UJS) $(UJSFLAGS) ../../node_modules/jqtpl/lib/jqtpl.js >> qba-core.js
	cat ../../node_modules/backbone/backbone-min.js >> qba-core.js

clean: qba.min.js qba-core.js
	rm -f qba.min.js
	rm -f qba-core.js

qba-custom: qba-core
	cat qba-core.js > qba-custom.js # qba-core is mandatory, not optional
	# Add the 'cat' commands you need to append (>>) the qba-files you want
	# in your custom bundle. Don't forget to add the rules of those files
	# to this rule, so the corresponding js files get built

cleancustom: qba-custom.js
	rm -f qba-custom.js
