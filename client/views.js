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

QBA.views.init = function () {
    "use strict";
    QBA.views.jQueryUI();
    $(".accordionable h3").each(function () {
        QBA.views.initAccordionPanel(this);
    });
};

QBA.views.jQueryUI = function (elem) {
    "use strict";
    if (typeof elem === 'undefined') {
        $(".tabable").tabs();
        $(".accordionable").accordion();
        $(".datepicker").datepicker({ "dateFormat": "yy-mm-dd" });
        $("#advanced, #addJoinButton, #addFilterButton").button({ icons: { primary: "ui-icon-plusthick" }});
        $("#hideadvanced").button({ icons: { primary: "ui-icon-minusthick" }});
        $("#prevS2, #prevS5").button({ icons: { primary: "ui-icon-arrowthick-1-w" }});
        $("#nextS1, #nextS2").button({ icons: { secondary: "ui-icon-arrowthick-1-e" }});
        $("#openPreview").button({ icons: { primary: "ui-icon-triangle-1-s" }});
        $("#closePreview").button({ icons: { primary: "ui-icon-triangle-1-n" }});
        $("#refreshPreview").button({ icons: { primary: "ui-icon-arrowrefresh-1-e" }});
        $(".remove").button({ icons: { primary: "ui-icon-closethick" }, text: false });
        QBA.events.radioButton.create($("#bar-size-param, #mapea-size-param, #map-size-param, #timeline-size-param, #pie-size-param, #line-size-param"), ["ui-icon-small", "ui-icon-medium", "ui-icon-large"]);
        QBA.events.radioButton.create($("#pie-sizeHighlight-param"), ["ui-icon-pie-small", "ui-icon-pie-medium", "ui-icon-pie-large"]);
        QBA.events.radioButton.create($("#bar-landscape-param"), ["ui-icon-portrait", "ui-icon-landscape"]);
        QBA.events.radioButton.create($("#line-area-param"), ["ui-icon-noarea", "ui-icon-area"]);
    } else {
        $(elem).find(".tabable").tabs();
        $(elem).find(".accordionable").accordion();
        $(elem).find(".datepicker").datepicker({ "dateFormat": "yy-mm-dd" });
        $(elem).find("#refreshPreview").button({ icons: { primary: "ui-icon-arrowrefresh-1-e" }});
        $(elem).find(".remove").button({ icons: { primary: "ui-icon-closethick" }, text: false });
    }
};

QBA.views.initAccordionPanel = function (headerNode) {
    "use strict";
    var node = $(headerNode),
        cond = node.parent().find("h3").length === 1;

    if (cond || node.next().find("input[type=checkbox]:checked").length > 0) {
        if (!(node.hasClass("ui-state-active"))) {
            node.addClass("ui-state-active");
            node.find("span.ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
            node.attr("aria-expanded", true).attr("aria-selected", true);
            node.next().toggle();
        }
    } else {
        if (node.hasClass("ui-state-active")) {
            node.removeClass("ui-state-active").removeClass("ui-state-hover").removeClass("ui-state-focus");
            node.find("span.ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
            node.attr("aria-expanded", false).attr("aria-selected", false);
            node.next().toggle();
        }
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
            schema = QBA.theQuery.toJSON(stepIdx);

        schema.fieldsCounts = QBA.theQuery.getFieldsCounts();
        this.$el.html($.tmpl(this.step, schema));
        QBA.views.jQueryUI();

        if (this.step === "step1") {
            this.renderS1();
        } else if (this.step === "step2") {
            this.renderS2();
        } else if (this.step === "step3") {
            this.renderS3();
        } else if (this.step === "step4") {
            this.renderS4();
        } else if (this.step === "step5") {
            this.renderS5();
        }

        return this;
    },

    renderS1: function () {
        "use strict";
        $("#preview").hide();
        $(".openPreview").addClass("hidden");
        $(".accordionable h3").each(function () {
            QBA.views.initAccordionPanel(this);
        });
    },

    renderS2: function () {
        "use strict";
        $("#step4-wrapper").addClass("hidden");
        $("#step2-wrapper #hideadvanced").addClass("hidden");
        $("#preview").hide();
        if ($("#step2 div.collections").children().length === 0) {
            $("#step2 .empty").removeClass("hidden");
            $("#step2 .hint").addClass("hidden");
            $("#step2-wrapper #advanced").addClass("hidden");
            $("#step2-wrapper hr").addClass("hidden");
            $("#step3").addClass("hidden");
            $(".openPreview").addClass("hidden");
        } else {
            $(".openPreview").removeClass("hidden");
            $("#step2-wrapper #advanced").removeClass("hidden");
            $("#step2-wrapper hr").removeClass("hidden");
            if ($("#step2 input[type=checkbox]:checked+label+span.ui-icon-link").length > 0) {
                $("#step3").removeClass("hidden");
                // Refresh step 3
                $("#ls3").trigger("click");
            } else {
                $("#step3").addClass("hidden");
            }
            $(".accordionable h3").each(function () {
                QBA.views.initAccordionPanel(this);
            });
        }
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
        var hasContent = false;
        QBA.theQuery.each(function (category) {
            _.each(category.getCheckedCollections(), function (collection) {
                hasContent = hasContent || (collection.getCheckedFields().length !== 0);
            });
        });
        if (!hasContent) {
            $("#step4 .empty").removeClass("hidden");
            $("#step4 .hint").addClass("hidden");
            $("#step4 #filterCreation").addClass("hidden");
            $("#step4 #filters").addClass("hidden");
        }

        _.each(QBA.theQuery.getUserFilterList(), function (userFilter) {
            var view = new QBA.views.Filter({
                model: userFilter
            });
            $("#step4 #filters").append(view.render().el);
        });
    },

    renderS5: function () {
        "use strict";
        var hasContent = false,
            chart_names,
            chart;
        QBA.theQuery.each(function (category) {
            _.each(category.getCheckedCollections(), function (collection) {
                hasContent = hasContent || (collection.getCheckedFields().length !== 0);
            });
        });
        $("#preview").hide();
        if (!hasContent) {
            $("#step5 .empty").removeClass("hidden");
            $("#step5 .hint").addClass("hidden");
            $("#step5 #chartType").addClass("hidden");
            $("#step5 #chartParams").addClass("hidden");
            $(".openPreview").addClass("hidden");
        } else {
            chart_names = _.flatten(_.values(QBA.chart.families));
            $("#chartType input[name=chart_type]").each(function (idx, radio) {
                var name = radio.id.split('_')[0];
                if (_.indexOf(chart_names, name) === -1) {
                    $(radio).parent().hide();
                }
            });
            $(".openPreview").removeClass("hidden");
            QBA.chart.timelineSliders();

            chart = QBA.chart.selectBestChart();
            chart = QBA.chart.loadChartModel(chart);
            QBA.chart.fillFormWithDefaultValues(chart);
            QBA.chart.autoSelectOptions(chart);
        }
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
        "click button.remove": "remove",
        "change select.filter-type": "updateFilterWidget"
    },

    render: function () {
        "use strict";
        var filter = this.model.get("filter"),
            type = this.model.get("field").get("type"),
            cond = (type === "string") && (typeof QBA.filters.defaultLanguage !== "undefined"),
            html;

        html = QBA.lingua.filterTpl.replace(/%%%collection%%%/g, this.model.get("collection").get("name").toLowerCase()).replace(/%%%field%%%/g, this.model.get("field").get("name").toLowerCase());
        html += "<select name='filter_type_" + this.model.get("number") + "' class='filter-type'>";
        _.each(QBA.filters.getFiltersFromType(type), function (f, i) {
            if (!(cond && i === 2)) { // i = 2 means language filter
                html += "<option value='" + i + "'";
                if (filter === i) {
                    html += " selected='selected'";
                }
                html += ">" + f + "</option>";
            }
        });
        html += "</select>";
        html += "<button class='remove'></button>";
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
        // (Shake, Shake, Shake) Shake Your Booty :)
        QBA.preview.shakeEffect();
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
        "click button.remove": "remove",
        "change select.join-target": "updateJoin"
    },

    render: function () {
        "use strict";
        var categs = QBA.theQuery.getCategoriesWithCheckedCollections(),
            model = this.model,
            isNew = true,
            numOpts = 0,
            html;

        html = QBA.lingua.joinTpl.replace(/%%%collection%%%/g, model.get("source_collection").get("name").toLowerCase()).replace(/%%%field%%%/g, model.get("source_field").get("name").toLowerCase());
        html += "<select name='join_target_" + model.get("number") + "' class='join-target'>";
        html += "<option value='false'></option>";

        _.each(categs, function (category) {
            _.each(category.getCheckedCollections(), function (collection) {
                if (model.get("source_collection").cid !== collection.cid) {
                    html += "<option value='" + category.cid + "-" + collection.cid + "'";
                    if (typeof model.get("target_collection") !== "undefined") {
                        if (model.get("target_collection").cid === collection.cid) {
                            html += " selected='selected'";
                            isNew = false;
                        }
                    }
                    html += ">" + collection.get("name") + "</option>";
                    numOpts += 1;
                }
            });
        });

        html += "</select>";
        html += "<button class='remove'></button>";
        this.$el.html(html);
        QBA.views.jQueryUI(this.el);

        if (isNew && numOpts === 1) {
            // Auto select the only available option
            $(this.$el.find("option")[1]).attr("selected", "selected");
            this.updateJoin();
        }

        return this;
    },

    remove: function (evt) {
        "use strict";
        evt.stopPropagation();
        evt.preventDefault();
        this.model.get("source_field").get("joinList").remove(this.model);
        this.$el.remove();
        // (Shake, Shake, Shake) Shake Your Booty :)
        QBA.preview.shakeEffect();
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

        // (Shake, Shake, Shake) Shake Your Booty :)
        QBA.preview.shakeEffect();
    }
});
