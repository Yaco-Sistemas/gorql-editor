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

    toJSON: function () {
        "use strict";
        return this.attributes.name;
    }
});

QBA.models.FieldList = Backbone.Collection.extend({
    model: QBA.models.Field
});

QBA.models.Collection = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: '',
            url: '',
            fields: new QBA.models.FieldList()
        };
    },

    getCheckedFields: function () {
        "use strict";
        return this.attributes.fields.filter(function (field) {return field.checked; });
    },

    addField: function (name) {
        "use strict";
        this.attributes.fields.add(
            new QBA.models.Field({ name: name })
        );
    }
});

QBA.models.CollectionList = Backbone.Collection.extend({
    model: QBA.models.Collection
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

    toJSON: function () {
        "use strict";
        var result = {
            meta: {}
        };

        result.meta.name = this.attributes.name;
        result.meta.prefixes = this.attributes.prefixes;
        result.meta.fields = this.attributes.fieldList.toJSON();
        result.collections = this.attributes.collectionList.toJSON();
        return result;
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

    toJSON: function () {
        "use strict";
        return {
            categories: _.map(this.models, function (category) {
                return category.toJSON();
            })
        };
    }
});

QBA.theQuery = new QBA.models.CategoryList();

QBA.models.loadSchema = function () {
    "use strict";
    var schema = JSON.parse($("#schema").html()),
        category,
        categoryObj,
        collection,
        collectionObj,
        i,
        j,
        h;

    for (i = 0; i < schema.length; i += 1) {
        category = schema[i];
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
