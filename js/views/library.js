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
//        this.$el.remove('.bookContainer');
//        console.log('removing ' + $('.bookContainer', this.el).length + ' items');
//        var out = this.$el.filter('.bookContainer').remove();
//        console.log(out);
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

        if (this.filter.keywords != undefined)
            _.each(item.get('keywords'), function(i, item) {
                ok = ok && (item.indexOf(this.filter.keywords) >= 0);
            }, this);

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

        var formData = this.getFormData();
        this.collection.create( formData );
    },

    filterBooks: function()
    {
        this.filter = this.getFormData();
        console.log(this.filter);
        this.render();
    },

    getFormData: function()
    {
        var formData = {};

        $( '#addBook div' ).children( 'input' ).each( function( i, el ) {

//            console.log(i);
//            console.log(el);
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


            // Clear input field value
            $( el ).val('');
        });

        formData['_id'] = '';

        return formData;
    }

});