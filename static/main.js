/**
 * Port of CNU Mobile App Dining Services. Requires
 * Node.js to run locally. Fetches dining information
 * for a specified location.
 * @author juanvallejo
 * @date 4/24/15
 */

/**
 * @event
 * Initializes page on load
 */
window.addEventListener('load', function() {
	main();
});

/**
 * Main function to execute
 * on all events ready.
 */
function main() {

	// define buttons and item container
	var buttons 		= document.getElementsByClassName(Globals.widget_buttons);
	var button_drawer 	= document.getElementsByClassName(Globals.widget_button_drawer_class).item(0);
	var item_drawer 	= document.getElementsByClassName(Globals.widget_item_drawer_class).item(0);


	// initialize button properties
	for(var i = 0; i < buttons.length; i++) {

		buttons.item(i).background 			= 'rgba(85,6,18,0.15)';
		buttons.item(i).activeBackground 	= 'rgba(85,6,18,0.3)';
		buttons.item(i).identifier 			= i;

		buttons.item(i).addEventListener('click', function() {
			Handlers.handleRestaurantButtonClick(this, button_drawer, item_drawer);
		});

	}

}