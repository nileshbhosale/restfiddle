define(function(require) {	
	"use strict";
	
	var Backbone = require('backbone');
	var _ = require('underscore');
	
	var TagModel = require('models/tag');
	var TagEvents = require('events/tag-event');

	var TaggedNodeView = require('views/tagged-node-view');
	
	var TagListItemView = Backbone.View.extend({	
		tagName : 'li',
		template : _.template($('#tpl-tag-list-item').html()),
		events : {
			"click a" : "showTaggedNodes",
			"click .hover-down-arrow" : "preventParentElmSelection",
            "click .edit-tag" : "editTag",
            "click .delete-tag" : "deleteTag"
		},
		
		render : function() {
			$(this.el).html(this.template({
				tag : this.model.toJSON()
			}));
			return this;
		},

		preventParentElmSelection : function(event){
			event.stopPropagation();
			
			var currentElm = $(event.currentTarget);

			if(currentElm.hasClass('open')){
				$('.btn-group').removeClass('open');
				currentElm.removeClass('open');
			}else{
				$('.btn-group').removeClass('open');
				currentElm.addClass('open');
				var rect = event.currentTarget.getBoundingClientRect();
			    currentElm.children("ul").css({"position": "fixed", "left":rect.left , "top": rect.bottom});
			}
		},
        
        editTag : function(){
            $("#editTagId").val(this.model.get('id'));
            $("#editTagTextField").val(this.model.get('name'));
            $("#editTagTextArea").val(this.model.get('description'));
            $("#editTagModal").modal("show");
        },
        
        deleteTag : function(){
            $("#deleteTagId").val(this.model.get('id'));
            $("#deleteTagModal").modal("show");
        },

		showTaggedNodes : function(){
			console.log("Inside showTaggedNodes");
            window.history.pushState("", "tag", APP.config.root + "workspaces/" + APP.appView.getCurrentWorkspaceId() + "/tags/"+this.model.get('id'));
			$('#rf-col-1-body').find('li').each(function(){
				$(this).removeClass('active');
			});
			this.$el.addClass("active");
			$('#starred-items').hide();
			$('#tree').hide();
			$('#history-items').hide();
			$('#tagged-items').show();
			var taggedNodeView = new TaggedNodeView();
			taggedNodeView.showTaggedNodes(this.model.get('id'));
		}
	});

var TagView = Backbone.View.extend({
    el : '#rfTags',
    addOne : function(model){
			var tagListView = new TagListItemView({model: model});
			this.$el.append(tagListView.render().el);
			tagListView.$el.find('a').trigger('click');
			return this;
		},
	initialize : function() {
		this.listenTo(APP.Events, TagEvents.FETCH, this.handleTags);
	},

	showTags : function(event){
        /*$.ajax({
            url : APP.config.baseUrl + '/workspaces/'+APP.appView.getCurrentWorkspaceId()+'/tags',
            type : 'get',
            contentType : "application/json",
            success : function(response) {
    			$("#rfTags").html('');
              
            //TagsView showTags() here:
            $("#tagLabels").empty();
			$(".label-dropdown-menu").empty();
			$(".label-dropdown-menu").append('<li>Select Tags</li>');
            console.log("-----Response -------------- "+response);
            }
        });	*/		
	},
		//TODO : Remove me!
		handleTags : function(event){
			APP.tags.fetch({success : function(response){
				response.each(function(tag) {
					var tagListView = new TagListItemView({
						model : tag
					});
				});
			}});
		},
		
		render : function(isDefautlView) {
            this.$el.html('');
			_.each(this.model,function(p, index){
				var tagListView = new TagListItemView({model: p});
				this.$el.append(tagListView.render().el);
			},this);
			console.log("TagView#render");
		}
	});

return TagView;

});
