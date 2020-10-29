/* ----------------------------------------------------------------
 * Main Merchant Script and interval here.
 * --------------------------------------------------------------*/

//get the merchant object from config script
merchant = get_player();
items_to_upgrade = merchant_name.items_to_upgrade;


setInterval(function () {
    items = character.items //set items (easier to type)

    //check if need basic scrolls
    if (character.items[0].q < 10) {
        buy('scroll0', 100);
    }

    //check if any items in inventory need upgrading
    //starts at 1 because I keep scrolls from 0-1. change as needed.
    for (i = 1; i < items.length; i++) {

        if (items[i] != null) { //check if item present in inv slot.
            //check if needs to be upgraded.
            if (items[i].name in items_to_upgrade &&
                items_to_upgrade[items[i].name][0] > items[i].level) {
                set_message("upgrading");

                //call upgrade item function
                upgrade_item(i, items[i].level,
                    items_to_upgrade[items[i].name][1]); //upgrade

                break; //end  when item found
            } 
            
            /* this will sell trash items. removing for now.
            else if (items[i].name in sell_item
                && sell_item[items[i].name] == items[i].level) {
                sell(i, 1);
            }
            */
        }
    }
}, 1000 / 4); // Loops every 4x every second