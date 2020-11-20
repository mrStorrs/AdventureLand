/* ----------------------------------------------------------------
 * WORK IN PROGRESS!
 * This will become the main script that all characters run. I am creating this
 * because it will be much easier to run all characters off one single script
 * instead of havig to switch between each character and changing their
 * individual scripts.
 * 
 * When completed:
 *  + Everything will be state dependent(moving, attacking, upgrading, etc..)
 *  + Will have config for all the 4 characters you can run at one time
 *  + This will include options for choosing Main Tank / Pulling
 *  + Will have skill sets depending on what class the character is
 *  + This particular file will not run an interval. The code blocks that the
 *      character loads will be what contains the intervals.
 * --------------------------------------------------------------*/

var player; //used to hold the current characters object information

//Fighter objects
function Fighter(name) {
    this.name = name;
    //will the character attempt to kite the mob.
    this.is_kiteing = false;
    /* determines what the character will do in a pvp situation. Options:
     *   "aggresive" = will attack others on sight.
     *   "scared"    = will switch server on sight.
     *   "bravish"   = will switch server when attacked. */
    this.pvp =
        //scripts to load.
        this.activities = ["Combat", "SendItems", "goldmeter"]
    //this will set the fighter to try to grab aggro or pull targets.
    this.is_tank = false;
    //mobs to farm go here. order is priority.
    this.mobs_to_farm = ["arcticbee"]
}

//array creating and holding all fighter objects.
all_fighters = [
    fighter_1 = new Fighter("MoyaTesh"),
    fighter_2 = new Fighter("Boomybob"),
    fighter_3 = new Fighter("SliceNdice")
]

/* ----------------------------------------------------------------
 *Modify your fighters to do differant things here. You may change
 * whether they are tank, range, what activities they have, what order
 * those activities come in, and anything else here 
 * --------------------------------------------------------------*/
//fighter_1 --  "MoyaTesh"

//fighter_2 --  "Boomybob"

//fighter_3 --  "SliceNdice"

/* ----------------------------------------------------------------
 * Configure your merchant here.
 * --------------------------------------------------------------*/
merchant = {
    name: "NickyNickel",
    activities: ["Merchant2", "UpgradeTest", "CompoundTest"],
    //Items to upgrade go here. 1st param is desired level. 2nd is rarity
    items_to_upgrade: {
        'wshoes': [8, 2],
        'wcap': [8, 2],
        'cclaw': [8, 2],
        'wgloves': [8, 2],
        'wbreeches': [8, 2],
        'mushroomstaff': [9, 2],
        'wattire': [8, 2],
        'frostbow': [6, 3],
        'phelmet': [5, 3],
        'gphelmet': [5, 3],
        'blade': [7, 1],
    },
    items_to_compound: {
        'ringsj': [3, 1],
        'intamulet': [3, 1],
        'stramulet': [4, 1],
        'dexamulet': [3, 1],
        'intring': [3, 1],
        'dexring': [3, 1],
        'strring': [3, 1],
        'vitring': [3, 1],
    }
}

/* ----------------------------------------------------------------
 * Logic for fighters deciding which scripts to load goes here.
 * --------------------------------------------------------------*/
//find the currently loaded character/player
if (character.name == merchant.name) {
    player = merchant;
    game_log("Merchant:" + player.name + " is ready for merchanting!")
} else {
    for (current_fighter of all_fighters) {
        if (character.name == current_fighter.name) {
            player = current_fighter;
            game_log("Fighter:" + player.name + " is ready for battle!")
        }
    }
}

//load scripts
for (activity of player.activities) {
    load_code(activity);
}

//get player info (used inside other scripts)
function get_player() {
    return player;
}

function get_player_names() {
    player_names = {
        fighters: [fighter_1.name, fighter_2.name, fighter_3.name],
        merchant: merchant.name
    }
    return player_names
}

function get_mob() {
    return fighter_1.mobs_to_farm[0]
}
