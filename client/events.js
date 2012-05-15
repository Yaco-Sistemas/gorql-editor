/*jslint vars: false, browser: true */
/*global QBA: true, $, alert */

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

            step = step.split('-')[0]; // For step2 wrapper

            // Release old events of the target tab
            QBA.events[step].release();

            if (typeof QBA.events.views[step] === "undefined") {
                $.template(step, $("#" + step + "Tpl").html());
                view = new QBA.views.Step({
                    el: $('#' + step)[0],
                    step: step
                });
                QBA.events.views[step] = view;
            } else {
                view = QBA.events.views[step];
            }
            view.render();

            // Bind events to the new content of the target tab
            QBA.events[step].bind();
        });

        $("#closePreview").click(function () {
            QBA.preview.slideEffect(false);
        });
    },

    step1: {
        bind: function () {
            "use strict";
            QBA.events.accordion.bind();

            $("#step1 input[type=checkbox]").change(function () {
                // collection has 10 chars
                var success = false,
                    indexes = this.name.substr(10).split('-'),
                    category = QBA.theQuery.at(parseInt(indexes[0], 10)),
                    collection;

                if (category) {
                    collection = category.get("collectionList").at(parseInt(indexes[1], 10));
                    if (collection) {
                        collection.set("checked", this.checked);
                        success = true;
                    }
                }

                if (!success) {
                    // TODO error
                    alert('error');
                }
            });

            $("#step1 #nextS1").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $("#ls2").trigger("click");
            });
        },

        release: function () {
            "use strict";
            // TODO
        }
    },

    step2: {
        bind: function () {
            "use strict";
            QBA.events.accordion.bind();

            $("#step2 input[type=checkbox]").change(function () {
                // field has 5 chars
                var success = false,
                    indexes = this.name.substr(5).split('-'),
                    category = QBA.theQuery.getCategoriesWithCheckedCollections()[parseInt(indexes[0], 10)],
                    collection,
                    field;

                if (category) {
                    collection = category.getCheckedCollections()[parseInt(indexes[1], 10)];
                    if (collection) {
                        field = collection.get("fieldList").at(parseInt(indexes[2], 10));
                        if (field) {
                            field.set("checked", this.checked);
                            success = true;
                        }
                    }
                }

                if (!success) {
                    // TODO error
                    alert('error');
                }

                if ($("#step2 input[type=checkbox]:checked+label+span.ui-icon-link").length > 0) {
                    $("#step3").removeClass("hidden");
                    // Refresh step 3
                    $("#ls3").trigger("click");
                } else {
                    $("#step3").addClass("hidden");
                }

                // Refresh step 4
                $("#ls4").trigger("click");
            });

            $("#openPreview").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.preview.updateTable();
            });

            $("#refreshPreview").click(function (evt) {
                QBA.preview.updateTable(true);
            });

            $("#step2-wrapper #prevS2").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $("#ls1").trigger("click");
            });

            $("#step2-wrapper #nextS2").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $("#ls5").trigger("click");
            });

            $("#step2-wrapper input[name=done]").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.chart.openViewerData();
            });

            $("#step2-wrapper #advanced").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $("#step4-wrapper").removeClass("hidden");
                $(this).addClass("hidden");
                $("#step2-wrapper #hideadvanced").removeClass("hidden");
                // Refresh step 4
                $("#ls4").trigger("click");
            });

            $("#step2-wrapper #hideadvanced").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $("#step4-wrapper").addClass("hidden");
                $("#step2-wrapper #advanced").removeClass("hidden");
                $(this).addClass("hidden");
            });
        },

        release: function () {
            "use strict";
            $("#openPreview").unbind("click");
            $("#refreshPreview").unbind("click");
            $("#step2-wrapper input[name=prevS2]").unbind("click");
            $("#step2-wrapper input[name=nextS2]").unbind("click");
            $("#step2-wrapper input[name=done]").unbind("click");
            // TODO
        }
    },

    step3: {
        bind: function () {
            "use strict";
            var categories = QBA.theQuery.getCategoriesWithCheckedCollections(),
                category,
                collections,
                disabled = true,
                i,
                j;

            // Look for checked fields, if none the add field select will be
            // disabled
            for (i = 0; i < categories.length && disabled; i += 1) {
                category = categories[i];
                collections = category.getCheckedCollections();
                for (j = 0; j < collections.length && disabled; j += 1) {
                    disabled = collections[j].getCheckedFields().length === 0;
                }
            }

            $("#step3 #addJoinField").attr("disabled", disabled);
            $("#step3 #addJoinButton").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var joinNumber = QBA.theQuery.getHigherJoinNumber(),
                    node = $("#step3 #addJoinField")[0],
                    option = node.options[node.selectedIndex],
                    indexes,
                    collection,
                    field,
                    join,
                    view;

                if (option.value === "false") {
                    return;
                }

                indexes = option.value.split('-');
                indexes = [
                    parseInt(indexes[0], 10),
                    parseInt(indexes[1], 10),
                    parseInt(indexes[2], 10)
                ];
                collection = categories[indexes[0]].getCheckedCollections()[indexes[1]];
                field = collection.getCheckedFields()[indexes[2]];

                join = new QBA.models.Join({
                    source_collection: collection,
                    source_field: field,
                    number: joinNumber
                });
                field.get("joinList").add(join);

                view = new QBA.views.Join({
                    model: join
                });
                $("#step3 #joins").append(view.render().el);
            });
        },

        release: function () {
            "use strict";
            // TODO
        }
    },

    step4: {
        bind: function () {
            "use strict";
            var categories = QBA.theQuery.getCategoriesWithCheckedCollections(),
                category,
                collections,
                disabled = true,
                i,
                j;

            // Look for checked fields, if none the add field select will be
            // disabled
            for (i = 0; i < categories.length && disabled; i += 1) {
                category = categories[i];
                collections = category.getCheckedCollections();
                for (j = 0; j < collections.length && disabled; j += 1) {
                    disabled = collections[j].getCheckedFields().length === 0;
                }
            }

            $("#step4 #addFilterField").attr("disabled", disabled);
            $("#step4 #addFilterButton").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var filterNumber = QBA.theQuery.getHigherUserFilterNumber(),
                    node = $("#step4 #addFilterField")[0],
                    option = node.options[node.selectedIndex],
                    indexes,
                    collection,
                    field,
                    userFilter,
                    view;

                if (option.value === "false") {
                    return;
                }

                indexes = option.value.split('-');
                indexes = [
                    parseInt(indexes[0], 10),
                    parseInt(indexes[1], 10),
                    parseInt(indexes[2], 10)
                ];
                collection = categories[indexes[0]].getCheckedCollections()[indexes[1]];
                field = collection.getCheckedFields()[indexes[2]];

                userFilter = new QBA.models.UserFilter({
                    collection: collection,
                    field: field,
                    filter: 0,
                    number: filterNumber
                });
                field.get("userFilterList").add(userFilter);

                view = new QBA.views.Filter({
                    model: userFilter
                });
                $("#step4 #filters").append(view.render().el);
            });
        },

        release: function () {
            "use strict";
            // TODO
        }
    },

    step5: {
        bind: function () {
            "use strict";
            $("#step5 #chartType input[type=radio]").change(function (evt) {
                var chart = this.value;
                $("#step5 .paramsContainer").css("display", "none");
                $("#step5 #" + chart + "Params").css("display", "block");
                QBA.chart.fillFormWithDefaultValues(chart);
                $(this).parent().parent().find("li.active").removeClass("active");
                $(this).parent().addClass("active");
            });

            $("#step5 #chartType li").click(function (evt) {
                var radio = $(this).find("input");
                radio.attr("checked", true);
                radio.trigger("change");
            });

            $("#step5 div.parameter input").change(QBA.chart.updateChartModel);
            $("#step5 div.parameter select").change(QBA.chart.updateChartModel);

            $("#openPreview").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.preview.updateChart();
            });

            $("#refreshPreview").click(function (evt) {
                QBA.preview.updateChart(true);
            });

            $("#step5 input[name=done-chart]").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.chart.openViewerChartAndData();
            });

            $("#step5 #prevS5").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $("#ls2").trigger("click");
            });

            QBA.chart.fillFormWithDefaultValues($("#step5 input[type=radio]:checked").val());
            QBA.chart.loadChartModel();
        },

        release: function () {
            "use strict";
            $("#openPreview").unbind("click");
            $("#refreshPreview").unbind("click");
            // TODO
        }
    }
};

QBA.events.init = function () {
    "use strict";
    QBA.events.navigation();
    QBA.events.step1.bind();
};

QBA.events.prevent = function (evt) {
    "use strict";
    evt.stopPropagation();
    evt.preventDefault();
};

QBA.events.accordion = {
    bind: function () {
        "use strict";
        $(".accordionable h3").unbind("click");
        $(".accordionable h3").click(function () {
            var node = $(this);
            if (node.hasClass("ui-state-active")) {
                node.removeClass("ui-state-active").addClass("ui-state-hover").removeClass("ui-state-focus");
                node.find("span.ui-icon").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
                node.attr("aria-expanded", false).attr("aria-selected", false);
            } else {
                node.addClass("ui-state-active");
                node.find("span.ui-icon").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
                node.attr("aria-expanded", true).attr("aria-selected", true);
            }
            node.next().toggle();
            return false;
        });
    }
};

QBA.events.radioButton = {
    create: function (container, icons) {
        "use strict";
        container.children().each(function (idx, button) {
            button = $(button);
            button.button({ icons: { primary: icons[idx] }, text: false });
            button.click(QBA.events.radioButton.click);
            button.unbind("mouseleave");
            button.mouseleave(QBA.events.radioButton.mouseleave);
        });
        container.buttonset();
    },

    click: function (evt) {
        "use strict";
        QBA.events.prevent(evt);
        var node = $(this);
        node.parent().children().each(function (idx, button) {
            $(button).removeClass("ui-state-active");
        });
        node.removeClass("ui-state-hover");
        node.addClass("ui-state-active");
    },

    mouseleave: function (evt) {
        "use strict";
        QBA.events.prevent(evt);
        $(this).removeClass("ui-state-hover");
    }
};
