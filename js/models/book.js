var app = app || {};

app.Book = Backbone.Model.extend({

    defaults: {
        coverImage: 'img/placeholder.png',
        title: 'No title',
        author: 'Unknown',
        releaseDate: 'Unknown',
        keywords: 'None'
    },

    validate: function(attrs) {
        var errors = [];
        if (attrs.title == '')
            errors.push('Title field cannot be empty');

        if (attrs.author == '')
            errors.push('Author field cannot be empty');

        var isDate = function(val) {
            var d = new Date(val);
            return !isNaN(d.valueOf());
        }
        if (!isDate(attrs.releaseDate))
            errors.push('Invalid date field');

        if(errors.length) {
            return errors;
        }
    },

    parse: function( response ) {
        response.id = response._id;
        return response;
    }
});