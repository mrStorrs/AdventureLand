/* ----------------------------------------------------------------
 * @todo -  move item check/ search to main "Merchant" script and only
 *          leave the actual functions to do the combining/upgrading here
 * @todo -  modify the scripts to be state dependendent so that it is not 
 *          just spamming upgrade/compound. 
 * --------------------------------------------------------------*/


//method to upgrade items
function upgrade_item(item_index, cur_lev, rarity) {
	if (distance(character, find_npc("newupgrade")) > 300) {
		game_log('test');
		if (!smart.moving) {
			game_log('test');
			smart_move(find_npc("newupgrade")); //move to upgrade loc
		}
	} else { //upgrade

		//check if need basic scrolls
		if (character.items[0].q < 10) {
			buy('scroll0', 100);
		}
		if (character.items[1].q < 10) {
			buy('scroll1', 100);
		}
		if (character.items[2].q < 10) {
			buy('cscroll0', 100);
		}
		//check if rarity and level matches
		if (cur_lev > 4 && rarity == 2) {
			upgrade(item_index, 1);
		} else if (rarity == 3) {
			upgrade(item_index, 1);
		} else {
			upgrade(item_index, 0);
		}
	}
	return null;
}

function go_upgrade() {

	items = character.items; //set items (easier to type)

	//check if any items in inventory need upgrading
	//starts at 1 because I keep scrolls from 0-1. change as needed.
	for (i = 1; i < items.length; i++) {

		if (items[i] != null) { //check if item present in inv slot.

			//check if needs to be upgraded.
			if (items[i].name in items_to_upgrade
				&& items_to_upgrade[items[i].name][0] > items[i].level) {

				set_message("upgrading");

				//call upgrade item function
				upgrade_item(i, items[i].level,
					items_to_upgrade[items[i].name][1]); //upgrade

				break; //end  when item found
			}
		}
	}
}