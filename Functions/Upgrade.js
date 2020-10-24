
/* ----------------------------------------------------------------
 * @todo -  move item check/ search to main "Merchant" script and only
 *          leave the actual functions to do the combining/upgrading here
 * @todo -  modify the scripts to be state dependendent so that it is not 
 *          just spamming upgrade/compound. 
 * --------------------------------------------------------------*/
load_code("Compound");

//enter the items and desired level here, and rarity
// 1 = store bought. 2 = common. 3 =rare.
// 'nameOfItem' : [*level*, *rarity*]

var upgrade_item = {
						'wshoes' : [6, 1],
						'wcap' : [6, 1],
						'cclaw' : [5, 1],
						'wgloves' : [5, 1],
						'wbreeches' : [5, 1],
						'mushroomstaff' : [5, 1],

					}
//dict so i can use in operator. maybe use 1 for something later
var sell_item = {"stinger" : 0, "hpamulet" : 0, "hpbelt" : 0}

//method to upgrade items
function upgrade_items(item_index, cur_lev, rarity) {
	if (distance(character, find_npc("newupgrade")) > 300){
		smart_move(find_npc("newupgrade")); //move to upgrade loc
	} else { //upgrade
		//check if rarity and level matches
		if(cur_lev > 4 && rarity == 1){
			upgrade(item_index, 1);
		} else {
			upgrade(item_index, 0);
		}
		
	}
	return null;
}

setInterval(function(){
	items = character.items //set items (easier to type)
	
	//check if need basic scrolls
	if(character.items[0].q < 10)
	{
		buy('scroll0', 100);
    }
    
	//check if any items in inventory need upgrading
	//starts at 1 because I keep scrolls from 0-1. change as needed.
	for( i = 1; i < items.length; i++){
		
		if (items[i] != null){ //check if item present in inv slot.
			//check if needs to be upgraded.
			if (items[i].name in upgrade_item &&
					//this may need to be refactored look into later
					//may have a problem with more than 1 item in list
			  		upgrade_item[items[i].name][0] > items[i].level)
			{ 
				set_message("upgrading");
				upgrade_items(i, items[i].level,
							 upgrade_item[items[i].name][1] ); //upgrade
				
				break; //end  when item found
			} else if (items[i].name in sell_item
					   && sell_item[items[i].name] == items[i].level)
			{
				sell(i, 1);		   
			}
		}
	}
}, 5000); // Loops every 6 seconds.. Avoids upgrade spam.

