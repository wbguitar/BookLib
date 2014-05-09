var app = app || {};

app.LibraryView = Backbone.View.extend({
    el: '#books',
    filter: null,

    initialize: function( initialBooks ) {
        this.collection = new app.Library( initialBooks );
        this.collection.fetch({reset: true});
        this.listenTo(this.collection, 'add', this.renderBook);
        this.listenTo( this.collection, 'reset', this.render );
        this.render();
    },

    // render library by rendering each book in its collection
    render: function() {
//        // questi due non funzionano, why?
//        this.$el.remove('.bookContainer');
//        var out = this.$el.filter('.bookContainer').remove();
        // funziona
        $('div#container', this.$el).empty();

        this.collection.each(function( item ) {
            if (this.checkFilter(item))
                this.renderBook( item );
        }, this );
    },

    // torna true se l'item matcha il filter
    checkFilter: function(item)
    {
        if (this.filter == null)
            return true;

        var ok = true;

        if (this.filter.title != undefined)
            ok = ok && (item.get('title').indexOf(this.filter.title) >= 0);
        if (this.filter.author != undefined)
            ok = ok && (item.get('author').indexOf(this.filter.author) >= 0);
        if (this.filter.releaseDate != undefined)
            ok = ok && (new Date(item.get('releaseDate')).getTime() == this.filter.releaseDate);

        // controllo che ogni keyword del filtro sia contenuta in almeno una keyword del libro
        if (this.filter.keywords != undefined) {
            _.each(this.filter.keywords, function(filterKey) {
                var any = _.any(item.get('keywords'), function(itemKey) {

                    return itemKey.keyword.indexOf(filterKey.keyword) >= 0;
                }, this);
                ok &= any;
            }, this);
        }

        return ok;
    },

    // render a book by creating a BookView and appending the
    // element it renders to the library's element
    renderBook: function( item ) {
        var bookView = new app.BookView({
            model: item
        });
        $('div#container', this.$el).append( bookView.render().el );
    },

    events:{
        'click #add':'addBook',
        'click #filter': 'filterBooks'
    },

    addBook: function( e ) {
        e.preventDefault();

        this.filter = null;

        var formData = this.getFormData(true);
        this.collection.create( formData );
    },

    filterBooks: function()
    {
        this.filter = this.getFormData(false);
        this.render();
    },

    getFormData: function(clearFormData)
    {
        var formData = {};

        $( '#addBook div' ).children( 'input' ).each( function( i, el ) {

            if( $( el ).val() != '' )
            {
                if( el.id === 'keywords' ) {
                    formData[ el.id ] = [];
                    _.each( $( el ).val().split( ' ' ), function( keyword ) {
                        formData[ el.id ].push({ 'keyword': keyword });
                    });
                } else if( el.id === 'releaseDate' ) {
                    formData[ el.id ] = $( '#releaseDate' ).datepicker( 'getDate' ).getTime();
                } else {
                    formData[ el.id ] = $( el ).val();
                }
            }

            if (clearFormData)
            // Clear input field value
                $( el ).val('');
        });

        formData['_id'] = '';

        return formData;
    }

});