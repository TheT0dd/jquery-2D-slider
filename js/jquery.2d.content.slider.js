/**
 * @name                jQuery Two Dimensional Slider
 * @author              Christopher Varakliotis
 * @version             1
 * @url                 -
 * @license             MIT License
 */


(function($, undefined) {


	$.fn.twoDimSlider = function(options) {

		var name = "twoDimSlider";
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;


		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} 
		else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					// The new constructor only changes the options. 
					instance.options( options || {} );
				} 
				else {
					$.data( this, name, new $.twoDimSlider(this, options) );
				}
			});
		}

		return returnValue;
	};


	$.twoDimSlider = function(elem, options) {

		var self = this;
		// slider properties
		self.elem = $(elem);
		self.lists = $('ul.two-dim-list', self.elem);
		self.allListItems = $('li', self.lists);
		self.numOfLists = self.lists.length;
		self.position = [0, 0];  // 1st number referst to list number (0..numOfLists-1), 2nd number refers to li inside the ul
		self.animating = false;
		self.viewportWidth;
		self.viewportHeight;
		self.options = $.extend( {}, $.twoDimSlider.defaults, options );	

		// adjust slider dimensions for the first time
		self._adjustSlider();
		// adjust again on container element resize (custom event fired from artist.page.functions.js)
		// $(window).resize(_adjustSlider);	
	};


	$.twoDimSlider.prototype = {

		// Adjusts dimensions & position for slider contents
		_adjustSlider: function() {

			var self = this;

			self.viewportWidth = self.elem.width(),
			self.viewportHeight = self.elem.height(),

			self.elem.css({
				'position' : 'relative',
				'overflow' : 'hidden'
			});

			self.lists.css({
				'width' : '100%',
				'display': 'inline-block',
				'position' : 'absolute',
				'list-style-type': 'none'
			});

			self.allListItems.css({
				'width' : '100%',
				'height' : self.viewportHeight + 'px',
			});


			var left = 0;

			self.lists.each(function() {
				$(this).css({
					'top' : 0 + 'px',
					'left' : left + 'px'
				});
				left += self.viewportWidth;
			});

		},

		// Performs all the sliding: 'top', 'bottom', 'left', 'right'
		slide: function(direction) {

			var self = this;
			
			if( !self.animating ) {
				
				// mark content wrap as animating to avoid multiple stacking animations
				self.animating = true;	
			
				// horizontal scrolling
				if(direction == 'right' || direction == 'left') {

					// right
					if(direction == 'right') {
						self.position[0] = (self.position[0] + 1) % self.numOfLists;
					}

					// left
					else {
						self.position[0] = self.position[0] == 0 ? self.numOfLists - 1 : self.position[0] - 1;
					}

					self.lists.each(function(index) {
						var left = (index - self.position[0]) * self.viewportWidth;
						$(this).animate({'left': left + 'px'}, self.options.animateDuration, 'easeOutQuad', function() {
							if(index !== self.position[0]) {
								$(this).css({'top':'0'});
							}
							self.position[1] = 0;
							self.animating = false;
						}); 							
					});								
				}
				// vertical scrolling
				else if(direction == 'top' || direction == 'bottom') {

					var $currentList = $(self.lists[self.position[0]]);
					var listSize = $currentList.children('li').length;
					var noAnimation = false;

					// top
					if(direction == 'top' && (self.position[1] > 0)) {
						self.position[1]--;		
					}

					// bottom
					else if(direction == 'bottom' && (self.position[1] < listSize - 1)) {
						self.position[1]++;			
					}

					else {
						noAnimation = true;
					}


					if(noAnimation) {
						self.animating = false;
					}
					
					else {
						$currentList.animate({
							'top': (-self.position[1] * self.viewportHeight) + 'px'
						}, self.options.animateDuration, 'easeOutQuad', function() {
							self.animating = false;
						});						
					}							
				}
			}
		}
	};


	$.twoDimSlider.defaults = {
		animateDuration: 800
	};



})(jQuery);