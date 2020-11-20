/* ----------------------------------------------------------------
 * Main Merchant Script and interval here.
 * --------------------------------------------------------------*/

//get the merchant object from config script
merchant = get_player();

//set items to compound and upgrade.
items_to_upgrade = merchant.items_to_upgrade;
items_to_compound = merchant.items_to_compound;

//set keyboard snippet shortcuts
parent.keymap["4"].code = "smart_move('arcticbee')"
parent.keymap["5"].code = "change_server('EU', 'PVP')"
parent.keymap["6"].code = "change_server('US', 'III')"

//set the time of last collection (used for getting items from fighters.)
last_collection = new Date() / 1000;

//get mob that is being farmed
mob_being_farmed = get_mob();

//main interval
setInterval(function () {
    //set the current time in seconds
    current_time = new Date() / 1000; //convert to seconds

    //check if need to heal!
    if (character.hp < character.max_hp - 100) {
        use('regen_hp');
    }
    //curently set to use the skill, not potions
    if (character.mp < character.max_mp - 100) {
        use('regen_mp');
    }

    if (!smart.moving && !smart.pathing) {
        set_message("Bored!");
        if (character.q.upgrade == undefined) {
            go_upgrade();
        }
        if (character.q.compound == undefined) {
            go_compound();
        }
    }

    //go to location of mob to collect items every 30 minutes
    if (current_time - last_collection > 1800 && !smart.moving && !smart.pathing) {
        smart_move(mob_being_farmed); //move to mob location.
        set_message("collecting");
        last_collection = new Date() / 1000; //reset last collection time.
    }

}, 1000);