//show_json(character.items);

//enter the items and desired level here, and rarity
// 1 = store bought. 2 = common. 3 =rare.
// 'nameOfItem' : [*level*, *rarity*]

var upgrade_item = {
  'cclaw': [3, 1],
}
var last_upgrade = new Date().getTime() // used to stop upgrading spam

//this will be the logic for the upgrading

function upgrade_items(item_index, rarity) {
  if (distance(character, find_npc("newupgrade")) > 50) {
    smart_move(find_npc("newupgrade")); //move to upgrade loc
  } else { //upgrade
    last_upgrade = new Date().getTime();
    upgrade(item_index, 0);
  }
  return null;
}

setInterval(function () {
  var time = new Date().getTime();
  items = character.items //set items (easier to type)
  //if upgrading move to cue


  //check if any items in inventory need upgrading
  //starts at 1 because I keep scrolls in 1. change as needed.
  for (i = 1; i < items.length; i++) {

    if (items[i] != null) { //check if item present in inv slot.
      //check if needs to be upgraded.
      if (items[i].name in upgrade_item &&
        upgrade_item[items[i].name][0] > items[i].level) {
        set_message("upgrading");
        upgrade_items(i, 0); //upgrade
        break; //end  when item found

      }
    }
  }
}, 6000); // Loops every 6 seconds.. Avoids upgrade spam.

