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

QBA.models = {};

QBA.models.UserFilter = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            collection: undefined,
            field: undefined,
            filter: undefined,
            value: undefined,
            number: -1
        };
    },

    isReady: function () {
        "use strict";
        return (typeof this.attributes.collection !== "undefined") &&
            (typeof this.attributes.field !== "undefined") &&
            (typeof this.attributes.filter !== "undefined") &&
            (typeof this.attributes.value !== "undefined") &&
            (this.attributes.number > -1);
    }
});

QBA.models.UserFilterList = Backbone.Collection.extend({
    model: QBA.models.UserFilter
});

QBA.models.Join = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            source_collection: undefined,
            source_field: undefined,
            target_collection: undefined,
            number: -1
        };
    }
});

QBA.models.JoinList = Backbone.Collection.extend({
    model: QBA.models.Join
});

QBA.models.Field = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: '',
            checked: false,
            type: '',
            parameters: {},
            userFilterList: new QBA.models.UserFilterList(),
            joinList: new QBA.models.JoinList()
        };
    },

    toJSON: function () {
        "use strict";
        var result = {};

        result.name = this.attributes.name;
        result.checked = this.attributes.checked;

        return result;
    }
});

QBA.models.FieldList = Backbone.Collection.extend({
    model: QBA.models.Field,

    getUserFilterList: function () {
        "use strict";
        var checkedFields = this.filter(function (field) {
            return field.get("checked");
        });
        return _.flatten(_.map(checkedFields, function (field) {
            return field.get("userFilterList").toArray();
        }));
    }
});

QBA.models.Collection = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: '',
            identifier: '',
            definition: [],
            checked: false,
            prefixes: {},
            fieldList: new QBA.models.FieldList()
        };
    },

    toJSON: function (step) {
        "use strict";
        var result = {};
        step = step || 1;
        result.name = this.attributes.name;
        result.checked = this.attributes.checked;
        if (step > 2) {
            result.fields = _.map(this.getCheckedFields(), function (field) {
                return field.toJSON(step);
            });
        } else {
            result.fields = this.attributes.fieldList.map(function (field) {
                return field.toJSON(step);
            });
        }
        return result;
    },

    getCheckedFields: function () {
        "use strict";
        return this.attributes.fieldList.filter(function (field) {
            return field.get("checked");
        });
    },

    addField: function (field) {
        "use strict";
        this.attributes.fieldList.add(new QBA.models.Field(field));
    }
});

QBA.models.CollectionList = Backbone.Collection.extend({
    model: QBA.models.Collection,

    toJSON: function (step) {
        "use strict";
        return this.map(function (collection) {
            return collection.toJSON(step);
        });
    },

    getUserFilterList: function () {
        "use strict";
        var checkedCollections = this.filter(function (collection) {
            return collection.get("checked");
        });
        return _.flatten(_.map(checkedCollections, function (collection) {
            return collection.get("fieldList").getUserFilterList();
        }));
    }
});

QBA.models.Category = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: '',
            collectionList: new QBA.models.CollectionList()
        };
    },

    toJSON: function (step) {
        "use strict";
        var result = {};

        step = step || 1;

        result.name = this.attributes.name;
        if (step > 1) {
            result.collections = _.map(this.getCheckedCollections(), function (collection) {
                return collection.toJSON(step);
            });
        } else {
            result.collections = this.attributes.collectionList.toJSON(step);
        }
        return result;
    },

    getCheckedCollections: function () {
        "use strict";
        return this.attributes.collectionList.filter(function (collection) {
            return collection.get("checked");
        });
    },

    addCollection: function (category) {
        "use strict";
        this.attributes.collectionList.add(category);
    }
});

QBA.models.CategoryList = Backbone.Collection.extend({
    model: QBA.models.Category,

    toJSON: function (step) {
        "use strict";
        var categories = this.map(function (category) {
                return category.toJSON(step);
            });

        return {
            categories: _.filter(categories, function (category) {
                return category.collections.length > 0;
            })
        };
    },

    toSPARQL: function () {
        "use strict";
        var SPARQL = "",
            collectionsDef = "",
            fieldsDef = "",
            selectVbles = "",
            joinPatterns = "",
            filterPatterns = "",
            usedPrefixes = [],
            checkedCollections,
            prefixes,
            fieldsByCollections,
            collectionId,
            fieldId,
            generator,
            i;

        checkedCollections = this.map(function (category) {
            return category.getCheckedCollections();
        });

        prefixes = _.flatten(_.map(checkedCollections, function (collections) {
            return _.map(collections, function (collection) {
                return collection.get("prefixes");
            });
        }));

        // PREFIXES
        _.each(prefixes, function (prefix) {
            _.each(_.keys(prefix), function (key) {
                if (_.indexOf(usedPrefixes, key) === -1) {
                    usedPrefixes.push(key);
                    SPARQL += "PREFIX " + key + ": " + prefix[key] + " ";
                }
            });
        });

        fieldsByCollections = _.flatten(_.map(checkedCollections, function (collections) {
            return _.flatten(_.map(collections, function (collection) {
                return {
                    collection: collection,
                    fields: collection.getCheckedFields()
                };
            }));
        }));

        i = 0;
        _.each(fieldsByCollections, function (data) {
            collectionId = "?" + data.collection.get("identifier");

            // WHERE - Create collections variables
            _.each(data.collection.get("definition"), function (def) {
                collectionsDef += collectionId + " " + def + " . ";
            });

            // Per field
            _.each(data.fields, function (field) {
                fieldId = "?" + field.get("name").split(":")[1] + i + "Vble";

                // SELECT
                selectVbles += fieldId + " ";

                // WHERE - Create fields variables
                fieldsDef += collectionId + " " + field.get("name") + " " + fieldId + " . ";

                // JOIN
                field.get("joinList").each(function (join) {
                    joinPatterns += collectionId + " " + field.get("name") + " ?" + join.get("target_collection").get("identifier") + " . ";
                });

                // FILTERS
                field.get("userFilterList").each(function (userFilter) {
                    if (userFilter.isReady()) {
                        filterPatterns += "FILTER (";
                        generator = QBA.filters.getFilterSPARQL(field.get("type"), userFilter.get("filter"));
                        filterPatterns += generator(fieldId, userFilter.get("value")) + ") . ";
                    }
                });

                i += 1;
            });
        });

        SPARQL += "SELECT " + selectVbles;
        SPARQL += "WHERE { " + collectionsDef + fieldsDef + joinPatterns + filterPatterns + "}";
        return SPARQL;
    },

    getCategoriesWithCheckedCollections: function () {
        "use strict";
        return this.filter(function (category) {
            return category.getCheckedCollections().length > 0;
        });
    },

    getHigherNumber: function (data) {
        "use strict";
        var num = _.max(_.map(data, function (elem) {
            return elem.get("number");
        }));
        if (!isFinite(num)) {
            num = -1;
        }
        return num + 1;
    },

    getUserFilterList: function () {
        "use strict";
        return _.flatten(this.map(function (category) {
            return category.get("collectionList").getUserFilterList();
        }));
    },

    getHigherUserFilterNumber: function () {
        "use strict";
        return this.getHigherNumber(this.getUserFilterList());
    },

    getJoinList: function () {
        "use strict";
        return _.flatten(this.map(function (category) {
            return _.flatten(category.getCheckedCollections().map(function (collection) {
                return _.flatten(collection.getCheckedFields().map(function (field) {
                    return field.get("joinList").toArray();
                }));
            }));
        }));
    },

    getHigherJoinNumber: function () {
        "use strict";
        return this.getHigherNumber(this.getJoinList());
    }
});

QBA.theQuery = new QBA.models.CategoryList();

QBA.models.loadSchema = function () {
    "use strict";
    var category,
        categoryObj,
        collection,
        collectionObj,
        i,
        j,
        h;

    QBA.theSchema = JSON.parse($("#schema").html());

    for (i = 0; i < QBA.theSchema.length; i += 1) {
        category = QBA.theSchema[i];
        categoryObj = new QBA.models.Category({
            name: category.name
        });

        for (j = 0; j < category.collections.length; j += 1) {
            collection = category.collections[j];
            collectionObj = new QBA.models.Collection({
                name: collection.name,
                identifier: collection.identifier,
                definition: collection.definition,
                prefixes: collection.prefixes
            });
            for (h = 0; h < collection.fields.length; h += 1) {
                collectionObj.addField(collection.fields[h]);
            }
            categoryObj.addCollection(collectionObj);
        }
        QBA.theQuery.add(categoryObj);
    }
};

QBA.models.ChartParameter = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: "",
            value: ""
        };
    }
});

QBA.models.ChartParameterList = Backbone.Collection.extend({
    model: QBA.models.ChartParameterList
});

QBA.theChart = new Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            type: "",
            params: new QBA.models.ChartParameterList()
        };
    }
});
