/*jslint vars: false, browser: true, nomen: true */
/*global QBA: true, _, $, alert, DV */

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

QBA.chart = {};

QBA.chart.families = {
    d3: [],
    simile: [],
    map: []
};

QBA.chart.init = function (availableCharts) {
    "use strict";
    if (availableCharts.hasOwnProperty("d3")) {
        QBA.chart.families.d3 = availableCharts.d3;
    }
    if (availableCharts.hasOwnProperty("simile")) {
        QBA.chart.families.simile = availableCharts.simile;
    }
    if (availableCharts.hasOwnProperty("map")) {
        QBA.chart.families.map = availableCharts.map;
    }
};

QBA.chart.getUrl = function () {
    "use strict";
    var query = QBA.theQuery.toSPARQL(),
        labels = QBA.theQuery.getPrettyLabels();
    return QBA.preview.viewer + "/viewer/?query=" + encodeURIComponent(query) +
        "&prettyHeaders=" + encodeURIComponent(labels);
};

QBA.chart.openViewerData = function () {
    "use strict";
    var url = QBA.chart.getUrl();
    window.open(url, "_blank");
};

QBA.chart.openViewerChartAndData = function () {
    "use strict";
    var url = QBA.chart.getUrl(),
        radio = _.find($("input[name=chart_type]"), function (radio) { return radio.checked; }),
        params;

    try {
        params = QBA.chart.getChartParams(radio.value);
    } catch (err) {
        alert(err);
    }

    url += "&chart=" + radio.value;
    _.each(_.keys(params), function (key) {
        url += "&" + key + "=" + params[key];
    });

    window.open(url, "_blank");
};

QBA.chart.fillFormWithDefaultValues = function (chart) {
    "use strict";
    if (typeof DV === "undefined") {
        return;
    }
    if (typeof DV.defaults === "undefined") {
        return;
    }

    var defaults = DV.defaults[chart],
        params;

    if (typeof defaults === "undefined") {
        return;
    }

    params = $("#step5 #" + chart + "Params div.parameter input");

    _.each(params, function (input) {
        var name = $(input).attr("name").split('-')[1];
        if (defaults.hasOwnProperty(name) && $(input).val() === "") {
            $(input).val(defaults[name]);
        }
    });

    params = $("#step5 #" + chart + "Params div.parameter select");

    _.each(params, function (select) {
        var name = $(select).attr("name").split('-')[1];
        if (defaults.hasOwnProperty(name) && $(select).val() === "") {
            $(select).val(defaults[name]);
        }
    });
};

QBA.chart.getFieldVbleName = function (indexes) {
    "use strict";
    var idxAux = 0,
        categories,
        field,
        idx;

    indexes = [
        parseInt(indexes[0], 10),
        parseInt(indexes[1], 10),
        parseInt(indexes[2], 10)
    ];

    categories = QBA.theQuery.getCategoriesWithCheckedCollections();
    // Generate variable name for field
    _.each(categories, function (category, idxCat) {
        _.each(category.getCheckedCollections(), function (collection, idxCol) {
            _.each(collection.getCheckedFields(), function (f, idxFie) {
                if (idxCat === indexes[0] && idxCol === indexes[1] && idxFie === indexes[2]) {
                    idx = idxAux;
                    field = f;
                }
                idxAux += 1;
            });
        });
    });

    return field.get("code").split(":")[1] + idx + "Vble";
};

QBA.chart.sizes = {
    small: [400, 300],
    medium: [600, 500],
    large: [1000, 750],
    hlsmall: 5,
    hlmedium: 30,
    hllarge: 70
};

QBA.chart.getChartParams = function (chart, ignoreRequire, extraInfo) {
    "use strict";
    var params = $("#step5 #" + chart + "Params div.parameter input"),
        result = {},
        options,
        aux;

    options = _.map(params, function (p) {
        p = $(p);
        var value = p.val(),
            key = p.attr("name").split('-')[1];

        if (p.attr("type") === "checkbox") {
            value = String(p.is(":checked"));
        }
        if (!ignoreRequire && p.is(".required")) {
            if (value === "") {
                throw QBA.lingua.required;
            }
        }

        return {
            key: key,
            value: value
        };
    });

    params = $("#step5 #" + chart + "Params div.parameter button.ui-state-active");
    aux = _.flatten(_.map(params, function (p) {
        var keys = p.id.split('-'),
            values,
            result;

        if (keys[1] === "size") {
            values = QBA.chart.sizes[keys[2]];
            result = [{
                key: "sizeX",
                value: values[0],
                type: "radio",
                chosen: keys[1] + "-" + keys[2]
            }, {
                key: "sizeY",
                value: values[1],
                type: "radio",
                chosen: keys[1] + "-" + keys[2]
            }];
        } else {
            result = {
                type: "radio",
                chosen: keys[1] + "-" + keys[2]
            };
            if (keys[1] === "sizeHighlight") {
                result.key = "sizeHighlight";
                result.value = QBA.chart.sizes[keys[2]];
            } else if (keys[1] === "landscape") {
                result.key = "landscape";
                result.value = String(keys[2] === "landscape");
            } else if (keys[1] === "area") {
                result.key = "area";
                result.value = String(keys[2] === "area");
            }
        }

        return result;
    }));
    options = options.concat(aux);

    params = $("#step5 #" + chart + "Params div.parameter select");
    aux = _.map(params, function (p) {
        p = $(p);
        var value = p.val(),
            valueOption = "",
            indexes;

        if (value === null || typeof value === "undefined") {
            value = "";
        }
        if (!ignoreRequire && p.is(".required")) {
            if (value === "") {
                throw QBA.lingua.required;
            }
        }

        if (value.pop && value.push) {
            indexes = value;
            value = "";
            _.each(indexes, function (indexesStr, idx) {
                var name = QBA.chart.getFieldVbleName(indexesStr.split('-'));
                if (idx > 0) {
                    value += ",";
                    valueOption += ",";
                }
                value += name;
                valueOption += indexesStr;
            });
        } else {
            valueOption = value;
            indexes = value.split('-');
            if (indexes.length === 3) {
                value = QBA.chart.getFieldVbleName(indexes);
            }
        }

        return {
            key: p.attr("name").split('-')[1],
            value: value,
            type: "select",
            chosen: valueOption
        };
    });
    options = options.concat(aux);

    aux = [];
    if (chart === "timeline") {
        aux = [{
            key: "detailRes",
            value: QBA.chart.timelineSliderValues[$("#timeline-detailRes-param").slider("value")]
        }, {
            key: "overviewRes",
            value: QBA.chart.timelineSliderValues[$("#timeline-overviewRes-param").slider("value")]
        }];
    }
    options = options.concat(aux);

    _.each(options, function (opt) {
        if (opt.value !== "") {
            if (extraInfo) {
                result[opt.key] = opt;
            } else {
                result[opt.key] = opt.value;
            }
        }
    });

    return result;
};

QBA.chart.updateChartModel = function () {
    "use strict";
    var type = $("#step5 #chartType input[type=radio]:checked").val(),
        params = QBA.chart.getChartParams(type, true, true),
        paramList = new QBA.models.ChartParameterList(),
        p;

    _.each(_.keys(params), function (key) {
        p = {
            name: key,
            value: params[key].value
        };
        if (params[key].type) {
            p.type = params[key].type;
            p.chosen = params[key].chosen;
        }
        paramList.add(new QBA.models.ChartParameter(p));
    });

    QBA.theChart.set({
        type: type,
        paramList: paramList
    });
};

QBA.chart.compatibleCharts = function (one, two) {
    "use strict";
    var result = false;
    if (_.include(QBA.chart.families.d3, one) && _.include(QBA.chart.families.d3, two)) {
        result = true;
    } else if (_.include(QBA.chart.families.simile, one) && _.include(QBA.chart.families.simile, two)) {
        result = true;
    } else if (_.include(QBA.chart.families.map, one) && _.include(QBA.chart.families.map, two)) {
        result = true;
    }
    return result;
};

QBA.chart.loadChartModel = function (suggested) {
    "use strict";
    var type = QBA.theChart.get("type"),
        overviewResIdx = -1;
    if (type !== "") {
        if (QBA.chart.compatibleCharts(type, suggested)) {
            $("#step5 #chartType li.active").removeClass("active");
            $("#step5 #chartType input[type=radio]:checked").attr("checked", false);
            $("#step5 #chartType #" + type + "_chart").attr("checked", "checked").parent().addClass("active");
            $("#step5 .paramsContainer").css("display", "none");
            $("#step5 #" + type + "Params").css("display", "block");
            QBA.theChart.get("paramList").each(function (param) {
                var name = type + "-" + param.get("name") + "-param",
                    idx,
                    min,
                    button;

                if (param.get("type") === "select") {
                    $("#step5 #" + type + "Params div.parameter select[name=" + name + "]").val(param.get("chosen"));
                } else if (param.get("type") === "radio") {
                    button = $("#step5 #" + type + "Params div.parameter button#" + type + "-" + param.get("chosen"));
                    button.parent().find("button").removeClass("ui-state-active");
                    button.addClass("ui-state-active");
                } else {
                    $("#step5 #" + type + "Params div.parameter input[name=" + name + "]").val(param.get("value"));
                }

                if (name === "timeline-detailRes-param" || name === "timeline-overviewRes-param") {
                    idx = _.indexOf(QBA.chart.timelineSliderValues, param.get("value"));
                    if (name === "timeline-detailRes-param") {
                        min = idx < 10 ? idx + 1 : 10;
                        $("#timeline-overviewRes-param").slider("option", "min", min);
                        if (overviewResIdx > 0) {
                            // If overviewRes was loaded before detailRes then
                            // the min value for overviewRes wasn't set
                            // properly, so now the value must be set again
                            $("#timeline-overviewRes-param").slider("value", idx);
                        }
                    } else {
                        overviewResIdx = idx;
                    }
                    $("#" + name).slider("value", idx);
                    $("#" + name + "-span").text(QBA.lingua.timelineSliderValues[idx]);
                }
            });
        }
        return type;
    }
    return suggested;
};

QBA.chart.autoSelectOptions = function (chart) {
    "use strict";
    var params = $("#step5 #" + chart + "Params div.parameter select");

    _.each(params, function (select) {
        var options = $(select).find("option").filter(function (idx, opt) { return opt.value !== ""; });
        if (options.length === 1) {
            options.attr("selected", "selected");
        }
    });
};

QBA.chart.selectBestChart = function () {
    "use strict";
    var map = false,
        timeline = false,
        chart = QBA.chart.families.d3[0],
        fields = _.flatten(_.map(QBA.theQuery.getCategoriesWithCheckedCollections(), function (category) {
            return _.map(category.getCheckedCollections(), function (collection) {
                return collection.getCheckedFields();
            });
        }));

    if (typeof chart === "undefined") {
        chart = _.flatten(_.values(QBA.chart.families))[0];
    }

    _.each(fields, function (field) {
        var type = field.get("type");
        if (type === "coord") {
            map = true;
        } else if (type === "date") {
            timeline = true;
        }
    });

    $("#step5 #chartType li.active").removeClass("active");
    $("#step5 #chartType input[type=radio]:checked").attr("checked", false);
    if (map && QBA.chart.families.map.length > 0) {
        chart = QBA.chart.families.map[0];
    } else if (timeline && QBA.chart.families.simile.length > 0) {
        chart = QBA.chart.families.simile[0];
    }
    $("#step5 #chartType #" + chart + "_chart").attr("checked", "checked").parent().addClass("active");
    $("#step5 .paramsContainer").css("display", "none");
    $("#step5 #" + chart + "Params").css("display", "block");

    return chart;
};

QBA.chart.timelineSliderValues = [
    "millisecond", "second", "minute", "hour", "day", "week", "month",
    "year", "decade", "century", "millennium"
];

QBA.chart.timelineSliderDefaults = {
    "timeline-detailRes-param": {value: 7, min: 0},
    "timeline-overviewRes-param": {value: 8, min: 8}
};

QBA.chart.timelineSliders = function () {
    "use strict";
    $("#timelineParams div.slider").each(function (idx, node) {
        var id = node.id;
        $(node).slider({
            value: QBA.chart.timelineSliderDefaults[id].value,
            min: QBA.chart.timelineSliderDefaults[id].min,
            max: 10,
            step: 1,
            slide: function (event, ui) {
                $("#" + id + "-span").text(QBA.lingua.timelineSliderValues[ui.value]);
                if (id === "timeline-detailRes-param") {
                    var newMin = ui.value < 10 ? ui.value + 1 : 10,
                        $el = $("#timeline-overviewRes-param"),
                        value;
                    $el.slider("option", "min", newMin);
                    value = $el.slider("value");
                    $("#timeline-overviewRes-param-span").text(QBA.lingua.timelineSliderValues[value]);
                    $el.slider("value", value);
                }
                $("#" + id).slider("value", ui.value);
                QBA.chart.updateChartModel();
            }
        });
        $("#" + id + "-span").text(QBA.lingua.timelineSliderValues[QBA.chart.timelineSliderDefaults[id].value]);
    });
};
