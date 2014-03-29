/*!
 * jQuery Placeholder Plugin
 * https://github.com/tjgupta/jQuery-Placeholder
 *
 * Copyright 2014, Tim Gupta
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    // Sets label to enhanced placeholder behavior where text dims on focus,
    // and disappears only after text is added
    $.fn.placeholder = function(options) {

        // private properties

        // private methods
        function setPlaceholder(input, placeholderSet) {
            placeholderSet.addClass('set');
            if (input.val() == '') {
                // Set placeholder to empty
                input.attr('placeholder', '');
                placeholderSet.removeClass('hasContent');
            }
        }

        function removePlaceholder(placeholderSet) {
            placeholderSet.removeClass('set').addClass('hasContent');
        }

        function checkAutoComplete(input) {
            if (input.val() != '') {
                input.trigger('autocompleted');
            }
        }

        return this.each(function() {
            var $this = $(this),
                placeholderSet = $this.parent('.placeholderSet'),
                label = $this.siblings('.placeholderText'),
                isChanged = null,
                settings = $.extend({
                }, options);

            // First check if input has a value
            if ($this.val() != '') {
                placeholderSet.addClass('hasContent');
            } else {
                // Replace value with label text
                setPlaceholder($this, placeholderSet);
            }


            // On focus of input from keyboard or mouse
            $this.focus(function(e) {
                $(this).parent().addClass('focused');
            });

            // On click on label
            label.click(function(e) {
                $(this).siblings('.placeholder').get(0).focus();
            });

            // On blur of input
            $this.blur(function(e) {
                var input = $(this),
                    placeholderSet = input.parent();

                placeholderSet.removeClass('focused');
                if (input.val() == '') {
                    placeholderSet.removeClass('hasContent').addClass('set');
                    // Reset timer to check for autocomplete
                    isChanged = setInterval(function() {
                        checkAutoComplete(input)
                    }, 100);
                } else {
                    placeholderSet.addClass('hasContent');
                }

            });

            // On change of input
            $this.keyup(function(e) {
                var $this = $(this),
                    $placeholderSet = $this.parent();
                if ($this.val() != '') {
                    removePlaceholder($placeholderSet);
                } else {
                    setPlaceholder($this, $placeholderSet);
                }
            });

            // Listen for autocompleted event for inputs that don't have autocomplete disabled
            if ($this.attr('autocomplete') != 'off') {
                // Add listener for autocompleted event
                $this.bind('autocompleted', function(e) {
                    var $this = $(this),
                        $placeholderSet = $this.parent('.placeholderSet');
                    if ($this.val() != '') {
                        removePlaceholder($placeholderSet);
                        clearInterval(isChanged);
                    }
                });

                // Set up timer to check if input value changed from autocomplete, since many browsers don't properly fire event on autocomplete
                isChanged = setInterval(function() {
                    checkAutoComplete($this)
                }, 100);
            }

        });
    };
})(jQuery);