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

//main interval
setInterval(function () {

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

}, 1000);