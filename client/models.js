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

QBA.models.Field = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: '',
            checked: false
        };
    },

    toJSON: function (step) {
        "use strict";
        return this.attributes.name;
    }
});

QBA.models.FieldList = Backbone.Collection.extend({
    model: QBA.models.Field,

    toJSON: function (step) {
        "use strict";
        return _.map(this.models, function (field) {
            return field.toJSON(step);
        });
    }
});

QBA.models.Collection = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: '',
            url: '',
            checked: false,
            fieldList: new QBA.models.FieldList()
        };
    },

    toJSON: function (step) {
        "use strict";
        var result = {};
        step = step || 1;
        result.name = this.attributes.name;
        result.url = this.attributes.url;
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

    addField: function (name) {
        "use strict";
        this.attributes.fieldList.add(
            new QBA.models.Field({ name: name })
        );
    }
});

QBA.models.CollectionList = Backbone.Collection.extend({
    model: QBA.models.Collection,

    toJSON: function (step) {
        "use strict";
        return _.map(this.models, function (collection) {
            return collection.toJSON(step);
        });
    }
});

QBA.models.Category = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: '',
            prefixes: {},
            fieldList: new QBA.models.FieldList(),
            collectionList: new QBA.models.CollectionList()
        };
    },

    toJSON: function (step) {
        "use strict";
        var result = {
            meta: {}
        };

        step = step || 1;

        result.meta.name = this.attributes.name;
        result.meta.prefixes = this.attributes.prefixes;
        result.meta.fields = this.attributes.fieldList.toJSON();
        if (step > 1) {
            result.collection = _.map(this.getCheckedCollections(), function (collection) {
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

    addField: function (name) {
        "use strict";
        this.attributes.fieldList.add(
            new QBA.models.Field({ name: name })
        );
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
        return {
            categories: _.map(this.models, function (category) {
                return category.toJSON(step);
            })
        };
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
            name: category.meta.name,
            prefixes: category.meta.prefixes
        });
        for (j = 0; j < category.meta.fields.length; j += 1) {
            categoryObj.addField(category.meta.fields[j]);
        }
        for (j = 0; j < category.collections.length; j += 1) {
            collection = category.collections[j];
            collectionObj = new QBA.models.Collection({
                name: collection.name,
                url: collection.url
            });
            for (h = 0; h < collection.fields.length; h += 1) {
                collectionObj.addField(collection.fields[h]);
            }
            categoryObj.addCollection(collectionObj);
        }
        QBA.theQuery.add(categoryObj);
    }
};
