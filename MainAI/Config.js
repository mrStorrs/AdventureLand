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
    this.activities = ["Fight", "SendItems"]
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
fighter_3.activities = [
    "TESTING",
    "goldmeter",
    "SendItems"
]

/* ----------------------------------------------------------------
 * Configure your merchant here.
 * --------------------------------------------------------------*/
merchant = {
    name: "NickyNickel",
    activities: ["Upgrade", "Compound", "FetchItems", "LuckBuff"]
}

/* ----------------------------------------------------------------
 * Logic for fighters deciding which scripts to load goes here.
 * --------------------------------------------------------------*/
//find the currently loaded fighter
for (current_fighter of all_fighters) {
    if (character.name == current_fighter.name) {
        fighter = current_fighter;
        game_log("Fighter:" + fighter.name + " is ready for battle!")
    }
}
//load scripts
for (activity of fighter.activities) {
    load_code(activity);
}


