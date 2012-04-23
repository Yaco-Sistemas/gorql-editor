/*jslint vars: false, browser: true, nomen: true */
/*global QBA: true, _, $, alert */

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

QBA.utils = {};

QBA.utils.getUrl = function () {
    "use strict";
    var query = QBA.theQuery.toSPARQL();
    return QBA.preview.viewer + "/viewer/?query=" + encodeURIComponent(query);
};

QBA.utils.openViewerData = function () {
    "use strict";
    var url = QBA.utils.getUrl();
    window.open(url, "_blank");
};

QBA.utils.openViewerChartAndData = function () {
    "use strict";
    var url = QBA.utils.getUrl(),
        radio = _.find($("input[name=chart_type]"), function (radio) { return radio.checked; }),
        params;

    try {
        params = QBA.preview.getChartParams(radio.value);
    } catch (err) {
        alert(err);
    }

    url += "&chart=" + radio.value;
    _.each(_.keys(params), function (key) {
        url += "&" + key + "=" + params[key];
    });

    window.open(url, "_blank");
};