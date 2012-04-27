/*jslint vars: false, nomen: true */
/*global QBA: true, exports, $, Backbone, _ */

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
    var QBA = {};
}

if (typeof QBA.filters === 'undefined') {
    QBA.filters = {};
}

QBA.filters.getFiltersFromType = function (type) {
    "use strict";
    var result;
    if (typeof QBA.filters.filtersByType === "undefined") {
        QBA.filters.filtersByType = QBA.lingua.filters;
    }
    if (QBA.filters.filtersByType.hasOwnProperty(type)) {
        result = QBA.filters.filtersByType[type];
    } else {
        // Default
        result = ["Equal"];
    }
    return result;
};

QBA.filters.filterWidgets = {
    string: Backbone.View.extend({
        events: {
            "change input.filter-widget": "process"
        },

        render: function () {
            "use strict";
            var html = "<input type='text' class='filter-widget' name='filter_widget_" + this.model.get("number") + "'";
            if (!_.isUndefined(this.model.get("value")) && _.isString(this.model.get("value"))) {
                html += " value='" + this.model.get("value") + "'";
            }
            html += "/>";
            this.$el.append(html);
            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find("input.filter-widget").remove();
        },

        process: function () {
            "use strict";
            var value = this.$el.find("input.filter-widget").val();
            this.model.set({ value: value });
        }
    }),

    number: Backbone.View.extend({
        events: {
            "change input.filter-widget": "process"
        },

        render: function () {
            "use strict";
            var parameters = this.model.get("field").get("parameters"),
                html = "",
                value = parseFloat(this.model.get("value")),
                $el = this.$el,
                model = this.model;

            if (!_.isNumber(value)) {
                value = parameters.min;
            }

            html += "<input type='number' class='filter-widget' name='filter_widget_" + this.model.get("number") + "' min='" + parameters.min + "' max='" + parameters.max + "' step='" + parameters.step + "' value='" + value + "' />";
            this.$el.append(html);

            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find(".filter-widget").remove();
        },

        process: function () {
            "use strict";
            var value = this.$el.find("input.filter-widget").val();
            this.model.set({ value: value });
        }
    }),

    number_range: Backbone.View.extend({
        render: function () {
            "use strict";
            var parameters = this.model.get("field").get("parameters"),
                html = "<div class='filter-widget range'></div>",
                value = this.model.get("value"),
                $el = this.$el,
                model = this.model;

            if (!_.isArray(value)) {
                value = [parseFloat(parameters.min), parseFloat(parameters.max)];
            } else {
                value = [parseFloat(value[0]), parseFloat(value[1])];
            }

            html += "<span class='filter-widget hint'>(From " + parameters.min + " to " + parameters.max + ")</span>";
            html += "<input type='number' class='filter-widget range from' name='filter_widget_" + this.model.get("number") + "_from' min='" + parameters.min + "' max='" + parameters.max + "' step='" + parameters.step + "' disabled='true' value='" + value[0] + "' /> to ";
            html += "<input type='number' class='filter-widget range to' name='filter_widget_" + this.model.get("number") + "_to' min='" + parameters.min + "' max='" + parameters.max + "' step='" + parameters.step + "' disabled='true' value='" + value[1] + "' />";
            this.$el.append(html);

            this.$el.find("div.filter-widget.range").slider({
                range: true,
                min: parseFloat(parameters.min),
                max: parseFloat(parameters.max),
                step: parseFloat(parameters.step),
                values: value,
                slide: function (event, ui) {
                    $el.find("input.filter-widget.range.from").val(ui.values[0]);
                    $el.find("input.filter-widget.range.to").val(ui.values[1]);
                    model.set({ value: ui.values });
                }
            });

            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find(".filter-widget").remove();
        }
    }),

    date: Backbone.View.extend({
        events: {
            "change input.filter-widget": "process"
        },

        render: function () {
            "use strict";
            var value = this.model.get("value"),
                html;

            if (!_.isString(value)) {
                value = "";
            }

            html = "<input type='date' class='filter-widget datepicker' name='filter_widget_" + this.model.get("number") + "' value='" + value + "'/>";
            this.$el.append(html);

            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find(".filter-widget").remove();
        },

        process: function () {
            "use strict";
            var value = this.$el.find("input.filter-widget").val();
            this.model.set({ value: value });
        }
    }),

    date_range: Backbone.View.extend({
        events: {
            "change input.filter-widget.from": "process",
            "change input.filter-widget.to": "process"
        },

        render: function () {
            "use strict";
            var value = this.model.get("value"),
                html;

            if (!_.isArray(value)) {
                value = ["", ""];
            }

            html = "<input type='date' class='filter-widget from datepicker' name='filter_widget_" + this.model.get("number");
            html += "_from' value='" + value[0] + "'/>";
            html += "<span class='filter-widget'> to </span>";
            html += "<input type='date' class='filter-widget to datepicker' name='filter_widget_" + this.model.get("number");
            html += "_to' value='" + value[1] + "'/>";
            this.$el.append(html);
            return this;
        },

        remove: function () {
            "use strict";
            this.$el.find(".filter-widget").remove();
        },

        process: function () {
            "use strict";
            var value = [
                this.$el.find("input.filter-widget.from").val(),
                this.$el.find("input.filter-widget.to").val()
            ];
            this.model.set({ value: value });
        }
    })
};

QBA.filters.getFilterWidgetView = function (type, selected) {
    "use strict";
    if (type === "coord") {
        type = "number";
    }

    var key = type,
        result;

    if ((selected === 3) && (type === "number" || type === "date")) {
        key += "_range";
    }

    if (QBA.filters.filterWidgets.hasOwnProperty(key)) {
        result = QBA.filters.filterWidgets[key];
    } else {
        // Default
        result = QBA.filters.filterWidgets.string;
    }

    return result;
};

QBA.filters.filterSPARQL = {
    equal: function (vble, value, casting) {
        "use strict";
        return casting + "(" + vble + ") = " + casting + "(\"" + value + "\")";
    },
    dateequal: function (vble, value, casting) {
        "use strict";
        return vble + " = " + casting + "(\"" + value + "\")";
    },
    contains: function (vble, value, casting) {
        "use strict";
        return "regex(" + casting + "(" + vble + "), \"^.*" + value + ".*$\", \"i\")";
    },
    less: function (vble, value, casting) {
        "use strict";
        return casting + "(" + vble + ") < " + casting + "(" + value + ")";
    },
    dateless: function (vble, value, casting) {
        "use strict";
        return vble + " < " + casting + "(\"" + value + "\")";
    },
    greater: function (vble, value, casting) {
        "use strict";
        return casting + "(" + vble + ") > " + casting + "(" + value + ")";
    },
    dategreater: function (vble, value, casting) {
        "use strict";
        return vble + " > " + casting + "(\"" + value + "\")";
    },
    range: function (vble, value, casting) {
        "use strict";
        return casting + "(" + value[0] + ") < " + casting + "(" + vble + ") && " + casting + "(" + vble + ") < " + casting + "(" + value[1] + ")";
    },
    daterange: function (vble, value, casting) {
        "use strict";
        return casting + "(\"" + value[0] + "\") < " + vble + " && " + vble + " < " + casting + "(\"" + value[1] + "\")";
    }
};

QBA.filters.castingsSPARQL = {
    string: "xsd:string",
    number: "xsd:float",
    date: "xsd:date",
    coord: "xsd:float"
};

QBA.filters.getFilterSPARQL = function (type, selected) {
    "use strict";
    var generator;

    if ((selected === 3) && (type === "number" || type === "coord")) {
        generator = QBA.filters.filterSPARQL.range;
    } else if ((selected === 3) && (type === "date")) {
        generator = QBA.filters.filterSPARQL.daterange;
    } else if ((selected === 2) && (type === "number" || type === "coord")) {
        generator = QBA.filters.filterSPARQL.greater;
    } else if ((selected === 2) && (type === "date")) {
        generator = QBA.filters.filterSPARQL.dategreater;
    } else if ((selected === 1) && (type === "number" || type === "coord")) {
        generator = QBA.filters.filterSPARQL.less;
    } else if ((selected === 1) && (type === "date")) {
        generator = QBA.filters.filterSPARQL.dateless;
    } else if ((selected === 1) && (type === "string" || type === "uri")) {
        generator = QBA.filters.filterSPARQL.contains;
    } else if (type !== "date") {
        generator = QBA.filters.filterSPARQL.equal;
    } else {
        generator = QBA.filters.filterSPARQL.dateequal;
    }

    return function (vble, value) {
        return generator(vble, value, QBA.filters.castingsSPARQL[type]);
    };
};

// Browser
if (typeof exports !== "undefined") {
    exports.getFilterWidgetView = QBA.filters.getFilterWidgetView;
}
