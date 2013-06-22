(function($, undefined) {

	$(document).ready(function() {
		$('#two-dim-slider').twoDimSlider();

		$(window).on('keyup', function(event) {
			// right arrow
			if(event.keyCode == 39) {
				$('#two-dim-slider').twoDimSlider('slide', 'right');
			}
			// right arrow
			if(event.keyCode == 37) {
				$('#two-dim-slider').twoDimSlider('slide', 'left');
			}
			// up arrow
			if(event.keyCode == 38) {
				$('#two-dim-slider').twoDimSlider('slide', 'top');
			}
			// down arrow
			if(event.keyCode == 40) {
				$('#two-dim-slider').twoDimSlider('slide', 'bottom');
			}				
		});		
	});

})(jQuery);