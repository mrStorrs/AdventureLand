/* ----------------------------------------------------------------
 * This script is used by the fighters to send items in their inventory
 * to the merchant.
 * --------------------------------------------------------------*/
var merchant_name; //will be set in send_items function
var slot_to_start = 2;


function send_items(merchant) {
    merchant_name = merchant.name;
    //check if sufficent items in invtory to send to merchant, and if the merch is close
    if (distance(character, merchant) < 500) {
        game_log("merchant in range");
        if (character.esize < 36) {
            send_to_merchant(slot_to_start, merchant_name);
        }
    } else {
        game_log("merchant too far away!!")
    }
}

//send everything starting at the index given
function send_to_merchant(index, merchant_name) {
    for (i = index; i < 43; i++) {
        if (character.items[i] != null) { //make sure slot is not empty.
            send_item(merchant_name, i, 999);
        }
    }
}

