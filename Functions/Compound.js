//enter the items and desired level here, and rarity
// 1 = store bought. 2 = common. 3 =rare.
// 'nameOfItem' : [*level*, *rarity*]

var compound_item = {
    'ringsj': [3, 1],
    'hpamulet': [1, 1],
    'intamulet': [2, 1],
    'stramulet': [2, 1],
}

//this will be the logic for the compounding
function compound_items(index1, index2, index3, rarity) {
    if (distance(character, find_npc("newupgrade")) > 100) {
        smart_move(find_npc("newupgrade")); //move to upgrade loc
    } else { //upgrade
        compound(index1, index2, index3, 2);
    }
    return null;
}

/* ----------------------------------------------------------------
 * @todo -  move item check/ search to main "Merchant" script and only
 *          leave the actual functions to do the combining/upgrading here
 * @todo -  modify the scripts to be state dependendent so that it is not 
 *          just spamming upgrade/compound. 
 * --------------------------------------------------------------*/
setInterval(function () {
    items = character.items //set items (easier to type)

    //check if need basic compound scrolls
    if (character.items[2].q < 10) {
        buy('cscroll0', 100);
    }

    //loop that creates a dictionary for 
    //each item in the list of items to compound.
    //this will hold each compoundable item by its level
    var c_items = {};
    for (key in compound_item) {
        c_items[key] = { 0: [0], 1: [0], 2: [0], 3: [0], 4: [0], 5: [0] }
    }

    for (i = 3; i < items.length; i++) {

        if (items[i] != null) { //check if item present in inv slot.
            //check if needs to be upgraded.
            if (items[i].name in compound_item &&
                //this may need to be refactored look into later
                //may have a problem with more than 1 item in list
                compound_item[items[i].name][0] > items[i].level) {
                //additem to dictionary using it's name and key as the key
                c_items[items[i].name][items[i].level].push(i);
            }

        }
    }

    //check each item dict to see if there is items that can be compounded.
    for (item in c_items) {
        for (i = 0; i <= 5; i++) {
            if (c_items[item][i].length > 3) {
                //last paremter needs to be modified to use 
                game_log(c_items[item][i]);

                compound_items(c_items[item][i][1]
                    , c_items[item][i][2]
                    , c_items[item][i][3], 0);
            }
        }
    }
}, 5000); // Loops every 5 seconds.. Avoids upgrade spam.
