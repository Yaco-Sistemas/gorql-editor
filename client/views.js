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

        if (this.step === "step4") {
            this.renderS4();
        }

        QBA.views.jQueryUI();
        return this;
    },

    renderS4: function () {
        "use strict";
        _.each(QBA.theQuery.getUserFilterList(), function (userFilter) {
            var view = new QBA.views.Filter({
                model: userFilter
            });
            $("#step4 #filters").append(view.render().el);
        });
    }
});

QBA.views.Filter = Backbone.View.extend({
    tagName: "div",

    className: "filter",

    initialize: function (options) {
        "use strict";
        var View = QBA.utils.getFilterWidgetView(this.model.get("filter").get("widget"));
        this.widgetView = new View({
            model: this.model,
            el: this.el
        });
    },

    events: {
        "click input.remove": "remove",
        "change select.filter-type": "updateFilterWidget"
    },

    render: function () {
        "use strict";
        var filter = this.model.get("filter"),
            html;

        html = "<input type='submit' class='remove' value='X' />";
        html += "<label for='filter_type_" + this.model.get("number") + "'>" + this.model.get("collection").get("name") + " - " + this.model.get("field").get("name") + "</label>";
        html += "<select name='filter_type_" + this.model.get("number") + "' class='filter-type'>";
        this.model.get("field").get("filterList").each(function (f, i) {
            html += "<option value='" + i + "'";
            if (filter.cid === f.cid) {
                html += " selected='selected'";
            }
            html += ">" + f.get("name") + "</option>";
        });
        html += "</select>";
        $(this.el).html(html);

        this.widgetView.render();

        QBA.views.jQueryUI(this.el);

        return this;
    },

    remove: function (evt) {
        "use strict";
        evt.stopPropagation();
        evt.preventDefault();
        this.model.get("field").get("userFilterList").remove(this.model);
        this.$el.remove();
    },

    updateFilterWidget: function () {
        "use strict";
        var node = this.$el.find(".filter-type")[0],
            value = node.options[node.selectedIndex].value,
            filter,
            View;

        this.widgetView.remove();
        filter = this.model.get("field").get("filterList").at(parseInt(value, 10));
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

QBA.views.Join = Backbone.View.extend({
    tagName: "div",

    className: "join",

    events: {
        "click input.remove": "remove"
    },

    render: function () {
        "use strict";
        var compatibleFields = QBA.theQuery.getCompatibleCheckedFields(this.model.get("source_field")),
            aux,
            auxFunc,
            html,
            i;

        html = "<input type='submit' class='remove' value='X' />";
        html += "<label for='join_target_" + this.model.get("number") + "'>" + this.model.get("source_collection").get("name") + " - " + this.model.get("source_field").get("name") + "</label>";
        html += "<select name='join_target_" + this.model.get("number") + "' class='join-target'>";
        auxFunc = function (field) {
            html += "<option value='" + this.category.cid + "-" + this.collection.cid + "-" + field.cid + "'>";
            html += field.get("name") + "</option>";
        };
        for (i = 0; i < compatibleFields.length; i += 1) {
            aux = compatibleFields[i];
            html += "<optgroup label='" + aux.collection.get("name") + "'>";
            _.each(aux.fields, auxFunc, aux);
            html += "</optgroup>";
        }
        html += "</select>";
        $(this.el).html(html);

        return this;
    },

    remove: function (evt) {
        "use strict";
        evt.stopPropagation();
        evt.preventDefault();
        this.model.get("source_field").get("joinList").remove(this.model);
        this.$el.remove();
    }
});
