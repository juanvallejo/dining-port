//defining the current environment state (check to see if testing locally or online)

var ENV_ONLINE              = 1;
var ENV_OFFLINE             = 2;
var ENV_OFFLINE_NOSERVER    = 3;

var ENV = window.location.hostname == 'localhost' ? ENV_OFFLINE : ENV_ONLINE;
var DEV = window.navigator.platform == 'iPhone' || 'iPad' || 'iPod' ? 'ios' : 'android';

if(window.location.hostname == '') {
    ENV = ENV_OFFLINE_NOSERVER;
} else if(window.location.hostname == 'dining.cnuapps.me') {
    ENV = ENV_OFFLINE;
}

var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var ABBREV_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var WEEK_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var ABBREV_WEEK_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var EVENT = {
    _call:{                             // functions called when phonecall is received
        ringing:[],
        offhook:[],
        idle:[]
    },
    startcallbutton:[],                 // functions called when accept call button is pressed
    endcallbutton:[],                   // functions called when decline call button is pressed
    pause:[],                           // functions called when app is put in background
    resume:[],                          // functions called when app resumed from background
    load:[]                             // functions called when app loads for first time
};

var Globals = {};

Globals.widget_buttons              = 'widget-button';
Globals.widget_button_drawer_class  = 'widget-button-drawer';
Globals.widget_item_drawer_class    = 'widget-item-drawer';
Globals.widget_item_class           = 'widget-item';
Globals.widget_item_content         = 'widget-item-content';