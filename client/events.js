/*jslint vars: false, browser: true */
/*global QBA: true, $ */

// Copyright 2012 Yaco Sistemas S.L.
//
// Developed by Yaco Sistemas <ablanco@yaco.es>
//
// Licensed under the EUPL, Version 1.1 or – as soon they
// will be approved by the European Commission - subsequent
// versions of the EUPL (the "Licence");
// You may not use this work except in compliance with the
// Licence.
// You may obtain a copy of the Licence at:
//
// http://joinup.ec.europa.eu/software/page/eupl
//
// Unless required by applicable law or agreed to in
// writing, software distributed under the Licence is
// distributed on an "AS IS" basis,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied.
// See the Licence for the specific language governing
// permissions and limitations under the Licence.

if (typeof QBA === 'undefined') {
    window.QBA = {};
}

QBA.events = {
    views: {},

    navigation: function () {
        "use strict";
        $("li.tab a").click(function () {
            var step = this.href.split('#')[1],
                view;

            // Release old events of the target tab
            QBA.events[step].release();

            if (typeof QBA.events.views[step] === "undefined") {
                $.template(step, $("#" + step + "Tpl").html());
                view = new QBA.views.Step({
                    el: $('#' + step)[0],
                    template: step
                });
                QBA.events.views[step] = view;
            } else {
                view = QBA.events.views[step];
            }
            view.render();

            // Bind events to the new content of the target tab
            QBA.events[step].bind();
        });
    },

    step1: {
        bind: function () {
            "use strict";
        },

        release: function () {
            "use strict";
        }
    },

    step2: {
        bind: function () {
            "use strict";
        },

        release: function () {
            "use strict";
        }
    },

    step3: {
        bind: function () {
            "use strict";
        },

        release: function () {
            "use strict";
        }
    },

    step4: {
        bind: function () {
            "use strict";
        },

        release: function () {
            "use strict";
        }
    }
};