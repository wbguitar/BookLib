
var app = app || {};

app.BookView = Backbone.View.extend({
    tagName: 'div',
    className: 'bookContainer',

    editing: false,

    render: function() {
        if (!this.editing)
        {
            var showTemplate = _.template( $( '#bookTemplate' ).html() );
            this.$el.html( showTemplate( this.model.toJSON() ) );

            this.$el.removeClass('bookEditContainer');
            this.$el.addClass('bookContainer');
        }
        else
        {
            var tpl = $( '#bookEditTemplate' );
            var editTemplate = _.template( tpl.html() );
            this.$el.html( editTemplate( this.model.toJSON() ) );

            var date = new Date(this.model.get('releaseDate'));
            $('#releaseDateEdit', this.el)
                .val($.format.date( date, 'ddd d MMMM yyyy' ))
                .datepicker({dateFormat: 'DD dd MM yy'});

            this.$el.removeClass('bookContainer');
            this.$el.addClass('bookEditContainer');
        }


        return this;
    },


    events: {
        'click .delete' : 'deleteBook',
        'click .edit' : 'editBook',
        'click .apply' : 'applyBookEdit',
        'click .cancel' : 'cancelBookEdit'
    },

    deleteBook: function(){
        //Delete model
        this.model.destroy();

        //Delete view
        this.remove();
    },

    editBook: function()
    {
        this.editing = true;

        this.render();
    },

    applyBookEdit: function()
    {
        this.className = 'bookContainer';

        this.editing = false;

        var keysVal = $('#keywordsEdit').val();
        var keys = [];
        if( keysVal != '' )
        {
            _.each( keysVal.split( ' ' ), function( keyword ) {
                if (keyword)
                    keys.push({ 'keyword': keyword });
            });
        }

        var coverImage = $('#coverImageEdit').val();

        this.model.set({
            title : $('#titleEdit').val(),
            releaseDate : $('#releaseDateEdit').datepicker( 'getDate' ).getTime(),
            coverImage : coverImage == '' ? 'img/placeholder.png' : coverImage,
            author : $('#authorEdit').val(),
            keywords : keys
        });


        this.model.save();
        this.render();
    },

    cancelBookEdit: function()
    {
        this.editing = false;
        this.render();
    }
});