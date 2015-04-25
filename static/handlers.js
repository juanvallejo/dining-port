var Handlers = {};

Handlers.handleWidgetItemClick = function(widgetItem, widgetItemContainer) {

	// determine if an item has been previously clicked
	if(widgetItemContainer.selectedItem != null || widgetItemContainer.selectedItem != undefined) {
		
		// hide the menu of the previously selected item
		widgetItemContainer.children[widgetItemContainer.selectedItem].getElementsByTagName('span').item(0).style.display = "none";
		Actions.makeInactive(widgetItemContainer.children[widgetItemContainer.selectedItem]);

		// check to see if the same item was clicked. If it was hide the menu.
		if(widgetItem.identifier == widgetItemContainer.selectedItem) {
			widgetItemContainer.selectedItem = null;
			return;
		}

	}
	
	// add active class to the current item
	Actions.makeActive(widgetItem);

	// show the menu for the current item
	widgetItem.getElementsByTagName('span').item(0).style.display = 'inline';

	// mark this item as the currently selecte one
	widgetItemContainer.selectedItem = widgetItem.identifier;

}

Handlers.handleRestaurantButtonClick = function(button, buttonContainer, menuItemContainer) {

	// determine if an item has been previously clicked
	if(buttonContainer.selectedItem != null || buttonContainer.selectedItem != undefined) {
		
		// hide the menu of the previously selected item
		menuItemContainer.innerHTML = '';
		Actions.makeInactive(buttonContainer.children[buttonContainer.selectedItem]);

		// check to see if the same item was clicked. If it was hide the menu.
		if(button.identifier == buttonContainer.selectedItem) {
			buttonContainer.selectedItem = null;
			return;
		}

	}
	
	// add active class to the current item
	Actions.makeActive(button);

	// show the menu for the current item
	if(button.id == Dining.REGATTAS || button.id == Dining.COMMONS) {
		Actions.getMenu(Dining[button.id], menuItemContainer);
	} else {
		Actions.getMenu(Dining[button.id], menuItemContainer, Dining.USE_DEFAULT_MENU);
	}

	// mark this item as the currently selecte one
	buttonContainer.selectedItem = button.identifier;

}