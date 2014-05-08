
var app = app || {};

app.BookEditView = Backbone.View.extend({
    tagName: 'div',
    className: 'bookEditContainer',
    template: _.template( $( '#bookEditTemplate' ).html() ),

    render: function() {
        //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        this.$el.html( this.template( this.model.toJSON() ) );

        return this;
    },


    events: {
        'click #apply' : 'applyBookEdit'
    },

    applyBookEdit: function(){
        this.model.save();
        $(this).hide();
        this.remove();
    }
});