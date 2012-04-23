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
        } else if (this.step === "step4") {
            this.renderS4();
        }

        QBA.views.jQueryUI();
        return this;
    },

    renderS3: function () {
        "use strict";
        _.each(QBA.theQuery.getJoinList(), function (join) {
            var target = join.get("target_field"),
                view;
            if (typeof target === "undefined" || (typeof target !== "undefined" && target.get("checked"))) {
                view = new QBA.views.Join({
                    model: join
                });
                $("#step3 #joins").append(view.render().el);
            }
        });
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
        var View = QBA.filters.getFilterWidgetView(this.model.get("field").get("type"), this.model.get("filter"));
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
        _.each(QBA.filters.getFiltersFromType(this.model.get("field").get("type")), function (f, i) {
            html += "<option value='" + i + "'";
            if (filter === i) {
                html += " selected='selected'";
            }
            html += ">" + f + "</option>";
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
        this.model.set({ filter: parseInt(value, 10) });
        View = QBA.filters.getFilterWidgetView(this.model.get("field").get("type"), parseInt(value, 10));
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
        "click input.remove": "remove",
        "change select.join-target": "updateJoin"
    },

    render: function () {
        "use strict";
        var categs = QBA.theQuery.getCategoriesWithCheckedCollections(),
            model = this.model,
            html;

        html = "<input type='submit' class='remove' value='X' />";
        html += "<label for='join_target_" + model.get("number") + "'>" + model.get("source_collection").get("name") + " - " + model.get("source_field").get("name") + "</label>";
        html += "<select name='join_target_" + model.get("number") + "' class='join-target'>";
        html += "<option value='false'></option>";

        _.each(categs, function (category) {
            _.each(category.getCheckedCollections(), function (collection) {
                html += "<option value='" + category.cid + "-" + collection.cid + "'";
                if (typeof model.get("target_collection") !== "undefined") {
                    if (model.get("target_collection").cid === collection.cid) {
                        html += " selected='selected'";
                    }
                }
                html += ">" + collection.get("name") + "</option>";
            });
        });

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
    },

    updateJoin: function () {
        "use strict";
        var node = this.$el.find("select.join-target")[0],
            indexes = node.options[node.selectedIndex].value,
            category,
            collection,
            field;

        if (indexes !== "false") {
            indexes = indexes.split('-');
            category = QBA.theQuery.find(function (category) {
                return category.cid === indexes[0];
            });
            collection = category.get("collectionList").find(function (collection) {
                return collection.cid === indexes[1];
            });
            this.model.set({
                target_collection: collection
            });
        } else {
            this.model.set({
                target_collection: undefined
            });
        }
    }
});
