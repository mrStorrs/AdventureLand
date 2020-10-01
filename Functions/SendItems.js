//enter your merchants name here
var merchName = "NickyNickel";
var slotToStart = 2;

//check if merchent is near by. 
//if it is then call senditems funciton
function find_merch(name) {
  var entities = parent.entities;
  for (i in entities) {
    if (get_entity(i).id == merchName) {
      if (distance(character, get_entity(i)) < 500) {
        return true;
      } else {
        return false;
      }
    }
  }
}

//send everything starting at the index given
function send_items(index) {
  for (i = index; i < 43; i++) {
    if (character.items[i] != null) { //make sure slot is not empty.
      send_item("NickyNickel", i, 999);
    }
  }
}

setInterval(function () {
  //check if inventory has suffiecient items in it		
  if (character.esize < 36) {
    //check if merch is nearby
    if (find_merch(merchName)) {
      //send items.
      send_items(slotToStart);
    }
  }
}, 5000);