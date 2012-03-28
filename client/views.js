/*jslint vars: false, browser: true, nomen: true */
/*global QBA: true, Backbone, $, _ */

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

QBA.views.jQueryUI = function (elem) {
    "use strict";
    if (typeof elem === 'undefined') {
        $(".tabable").tabs();
        $(".accordionable").accordion();
        $(".datepicker").datepicker();
    } else {
        $(elem).find(".tabable").tabs();
        $(elem).find(".accordionable").accordion();
        $(elem).find(".datepicker").datepicker();
    }
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
            html = $.tmpl(this.step, QBA.theQuery.toJSON(stepIdx));
        this.$el.html(html);

        if (this.step === "step3") {
            this.renderS3();
        }

        QBA.views.jQueryUI();
        return this;
    },

    renderS3: function () {
        "use strict";
        _.each(QBA.theQuery.getUserFilterList(), function (userFilter) {
            var view = new QBA.views.Filter({
                model: userFilter
            });
            $("#step3 #filters").append(view.render().el);
        });
    }
});

QBA.views.Filter = Backbone.View.extend({
    tagName: "div",

    className: "filter",

    initialize: function (options) {
        "use strict";
        var View = QBA.utils.getFilterWidgetView(this.model.get("field").get("filterList").at(0).get("widget"));
        this.chosenFilter = 0;
        this.widgetView = new View({
            model: this.model,
            el: this.el
        });
    },

    events: {
        "change select.filter-type": "updateFilterWidget"
    },

    render: function () {
        "use strict";
        var model = this.model,
            filter = this.model.get("field").get("filterList").at(this.chosenFilter),
            html;

        html = "<input type='submit' class='remove' value='X' />";
        html += "<label for='filter_type_" + this.model.get("number") + "'>" + this.model.get("collection").get("name") + " - " + this.model.get("field").get("name") + "</label>";
        html += "<select name='filter_type_" + this.model.get("number") + "' class='filter-type'>";
        this.model.get("field").get("filterList").each(function (filter, i) {
            html += "<option value='" + i + "'>" + filter.get("name") + "</option>";
        });
        html += "</select>";
        $(this.el).html(html);

        this.widgetView.render();

        $(this.el).find("input.remove").click(function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            model.get("field").get("userFilterList").remove(model);
            $(this.parentElement).remove();
        });
        QBA.views.jQueryUI(this.el);

        return this;
    },

    updateFilterWidget: function () {
        "use strict";
        var node = this.$el.find(".filter-type")[0],
            value = node.options[node.selectedIndex].value,
            filter,
            View;

        this.widgetView.remove();
        this.chosenFilter = parseInt(value, 10);
        filter = this.model.get("field").get("filterList").at(this.chosenFilter);
        this.model.set({ filter: filter });
        View = QBA.utils.getFilterWidgetView(filter.get("widget"));
        this.widgetView = new View({
            model: this.model,
            el: this.el
        });

        this.widgetView.render();

        QBA.views.jQueryUI(this.$el);
    }
});
