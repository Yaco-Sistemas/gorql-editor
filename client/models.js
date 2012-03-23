/*jslint vars: false, browser: true, nomen: true */
/*global QBA: true, Backbone, _ */

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
        return this.name;
    }
});

QBA.models.Collection = Backbone.Model.extend({
    defauts: function () {
        "use strict";
        return {
            name: '',
            url: '',
            fields: Backbone.Collection.extend({ model: QBA.models.Field })
        };
    },

    getCheckedFields: function () {
        "use strict";
        return this.fields.filter(function (field) {return field.checked; });
    }
});

QBA.models.Category = Backbone.Model.extend({
    defaults: function () {
        "use strict";
        return {
            name: '',
            prefixes: {},
            fieldList: Backbone.Collection.extend({ model: QBA.models.Field }),
            collectionList: Backbone.Collection.extend({ model: QBA.models.Collection })
        };
    },

    toJSON: function () {
        "use strict";
        var result = {
            meta: {}
        };

        result.meta.name = this.name;
        result.meta.prefixes = this.prefixes;
        result.meta.fields = this.fieldList.toJSON();
        result.collections = this.collectionList.toJSON();
        return result;
    }
});

QBA.models.CategoryList = Backbone.Collection.extend({
    model: QBA.models.Category
});
