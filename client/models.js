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

QBA.models.theQuery = {};

QBA.models.Collection = Backbone.Model.extend({
    defauts: function () {
        "use strict";
        return {
            fields: [],
            original_fields: []
        };
    },

    validate: function (attrs) {
        "use strict";
        var diff = _.difference(this.original_fields, _.union(attrs.fields, this.original_fields));
        if (diff.length > 0) {
            return "Field doesn't belong to the collection";
        }
    },

    addField: function (field) {
        "use strict";
        this.set({ fields: _.uniq(this.fields.push(field)) });
    },

    getChosenFields: function () {
        "use strict";
        return _.intersection(this.fields, this.original_fields);
    }
});

QBA.models.theQuery.collections = Backbone.Collection.extend({
    model: QBA.models.Collection
});
