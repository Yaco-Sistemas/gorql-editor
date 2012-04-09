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
    },

    step1: {
        bind: function () {
            "use strict";
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

            $("#preview input[name=preview]").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.preview.updateTable();
            });
        },

        release: function () {
            "use strict";
            $("#preview input[name=preview]").unbind("click");
            // TODO
        }
    },

    step2: {
        bind: function () {
            "use strict";
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
            });

            $("#preview input[name=preview]").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.preview.updateTable();
            });
        },

        release: function () {
            "use strict";
            $("#preview input[name=preview]").unbind("click");
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

            $("#step3 #addJoinField").attr("disabled", disabled).change(function () {
                var option = this.options[this.selectedIndex],
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
                    source_field: field
                });
                field.get("joinList").add(join);

                view = new QBA.views.Join({
                    model: join
                });
                $("#step3 #joins").append(view.render().el);
                this.selectedIndex = 0;
            });

            $("#preview input[name=preview]").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.preview.updateTable();
            });
        },

        release: function () {
            "use strict";
            $("#preview input[name=preview]").unbind("click");
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

            $("#step4 #addFilterField").attr("disabled", disabled).change(function () {
                var filterNumber = QBA.theQuery.getHigherUserFilterNumber(),
                    option = this.options[this.selectedIndex],
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
                this.selectedIndex = 0;
            });

            $("#preview input[name=preview]").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.preview.updateTable();
            });
        },

        release: function () {
            "use strict";
            $("#preview input[name=preview]").unbind("click");
            // TODO
        }
    },

    step5: {
        bind: function () {
            "use strict";
            $("#step5 input[type=radio]").change(function (evt) {
                var chart = this.value;
                $("#step5 .paramsContainer").css("display", "none");
                $("#step5 #" + chart + "Params").css("display", "block");
            });

            $("#preview input[name=preview]").click(function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                QBA.preview.updateChart();
            });
        },

        release: function () {
            "use strict";
            $("#preview input[name=preview]").unbind("click");
            // TODO
        }
    }
};
