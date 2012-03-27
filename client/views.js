/*jslint vars: false, browser: true */
/*global QBA: true, Backbone, $ */

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

QBA.views = {};

QBA.views.jQueryUI = function () {
    "use strict";
    $(".tabable").tabs();
    $(".accordionable").accordion();
};

QBA.views.Step = Backbone.View.extend({
    tagName: "section",

    initialize: function (options) {
        "use strict";
        this.step = options.step;
    },

    render: function () {
        "use strict";
        var stepIdx = parseInt(this.step.substr(4), 10),
            html = $.tmpl(this.step, QBA.theQuery.schema.toJSON(stepIdx));
        this.$el.html(html);
        QBA.views.jQueryUI();
        return this;
    }
});

QBA.views.Filter = Backbone.View.extend({
    tagName: "div",

    className: "filter",

    initialize: function (options) {
        "use strict";
        this.filters = options.filters;
        this.chosenFilter = 0;
        this.filterNumber = options.filterNumber;
        this.widget = QBA.utils.getFilterWidget(this.filters.at(this.chosenFilter));
    },

    events: {
        "change select.filter-type": "updateFilterWidget"
    },

    render: function () {
        "use strict";
        var html,
            widget;

        html = "<label for='filter_type_" + this.filterNumber + "'>" + this.model.get("field").get("name") + "</label>";
        html += "<select name='filter_type_" + this.filterNumber + "' class='filter-type'>";
        this.filters.each(function (filter, i) {
            html += "<option value='" + i + "'>" + filter.get("name") + "</option>";
        });
        html += "</select>";
        html += this.widget.html(this.filterNumber);

        $(this.el).html(html);

        return this;
    },

    updateFilterWidget: function () {
        "use strict";
        var node = this.$el.find(".filter-type")[0],
            value = node.options[node.selectedIndex].value;

        this.$el.find(".filter-widget").remove();
        this.chosenFilter = parseInt(value, 10);
        this.widget = QBA.utils.getFilterWidget(this.filters.at(this.chosenFilter));

        this.$el.append($(this.widget.html(this.filterNumber)));
    }
});
