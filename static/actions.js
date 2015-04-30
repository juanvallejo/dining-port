var Actions = {};

Actions.makeInactive = function(object) {
	object.style.backgroundColor = object.background;
}

Actions.makeActive = function(object) {
	object.style.backgroundColor = object.activeBackground;
}

Actions.toggleActive = function(object, callback) {
	
	if(!object.isActive) {
		object.style.backgroundColor = object.activeBackground;
		object.isActive = true;
	} else {
		object.style.backgroundColor = object.background;
		object.isActive = false;
	}

	callback.call(this, object.isActive);
}

/**
 * Fetches the specified menu. Requires the type of menu
 * to fetch. If a menu type is not set, the default menu
 * method is used. If a menu has previously been fetched,
 * it is fetched from the menu cache.
 */
Actions.getMenu = function(place, container, defaultMenu) {

	if(!defaultMenu) {
		Actions.getRestaurantMenu(place, container);
	} else {
		Actions.getDefaultMenu(place, container);
	}

}

/**
 * Used for Regatta's and Commons xml feeds. Treats each item returned
 * as an individual date with a specific menu
 * @param place to fetch menu
 * @param container to place fetched menu items
 */
Actions.getRestaurantMenu = function(place, container) {

	// fetch regatta's menu
	Dining.get(place, function(error, response) {

		// clear container of existing items 
		container.innerHTML = '';

		if(error) {
			return container.innerHTML = '<li class="' + Globals.widget_item_class + '"><h3><br />' + error + '</h3></li>';
		}

		for(var i = 0; i < response.length; i++) {

			var item = document.createElement('li');
			item.className 			= Globals.widget_item_class;
			item.background 		= 'transparent';
			item.activeBackground 	= 'rgba(85,6,18,0.15)';
			item.identifier 		= i;
			item.menu 				= response[i].menu;
			item.innerHTML 			+= '<h1>' + response[i].date + '</h1>';
			item.innerHTML 			+= '<h2>' + response[i].meal + '</h2>';
			item.innerHTML 			+= '<h3>' + response[i].time + '</h3>';
			item.innerHTML 			+= '<span class="' + Globals.widget_item_content + '">' + response[i].menu + '</span>';

			// add click event listener
			item.addEventListener('click', function() {
				Handlers.handleWidgetItemClick(this, container);
			});

			// append child
			container.appendChild(item);

		}

	});

}

/**
 * Used for every other menu. Returns a single string of HTML
 */
Actions.getDefaultMenu = function(place, container) {

	Dining.get(place, function(error, response, times) {

		container.innerHTML = '';

		if(error) {
			return container.innerHTML = '<li class="' + Globals.widget_item_class + '"><h3><br />' + error + '</h3></li>';
		}

		if(times) {
			container.innerHTML += '<span class="widget-item-block">' + times + '</span>';
		}

		// container.innerHTML = '<span class="widget-item-block">' + times + '</span>'; 
		container.innerHTML += '<span class="widget-item-block">' + response + '</span>';

	});

}