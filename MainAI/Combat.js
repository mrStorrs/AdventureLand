//load_code("goldmeter");
//load_code("SendItems");

var attack_mode = true

//get the player obj from config script
player = get_player();

//get merchant name
merchant = get_player_names().merchant

//set targets to farm
var mobs_to_farm = player.mobs_to_farm;

/* ----------------------------------------------------------------
 * Invitations too party and accepting said invitatioins below.
 * --------------------------------------------------------------*/
function party() {
    send_party_invite("Boomybob", false);
    send_party_invite("SliceNdice", false);
}
//invite to party on reconnect
if (character.name == "MoyaTesh") {
    party();
}
//accept request from party members
function on_party_request(name) {
    if (name == 'Boomybob' || name == 'SliceNdice') {
        accept_party_request(name);
    }
}
//used to automatically accept from leader. 
function on_party_invite(name) {
    if (name == "MoyaTesh") {
        accept_party_invite(name);
    }
}
//automatically request an invite to party
send_party_request('MoyaTesh');

/* ----------------------------------------------------------------
 * Main combat interval
 * --------------------------------------------------------------*/
setInterval(function () {

    //check if need to heal!
    if (character.hp < character.max_hp - 300) {
        use('use_hp');
    }
    //curently set to use the skill, not potions
    if (character.mp < character.max_mp - 100
        || character.mp < 10) {
        use('regen_mp');
    }

    //get LOOOOTZ!
    loot();

    if (!attack_mode || character.rip || is_moving(character)) return;

    /* ----------------------------------------------------------------
     * Check inventory for potions and then buy more if needed. 
     * Will eventually be moving this to it's own script.
     * --------------------------------------------------------------*/

    //check item quantaty in inventory
    function numItems(item) {
        var itemCount = character.items.filter(i => i != null && i.name == item)
            .reduce(function (a, b) { return a + (b["q"] || 1); }, 0);
        return itemCount;
    }

    //deposit gold in bank
    function deposit_gold() {
        if (character.map != "bank") {
            smart_move(find_npc("goldnpc"));
        } else {
            bank_deposit(character.gold - 50000); //deposit all but
            move(0, -30); //move to base of bank
            transport("main", 3); // leave bank
        }
    }

    //buy potions
    function buy_potions() {
        smart_move(find_npc("fancypots"));
        buy("hpot0", 1000 - numItems("hpot0"));
        buy("mpot0", 1000 - numItems("mpot0"));

    }

    //check inventory and then do stuff.
    if (numItems("hpot0") < 10 || numItems("mpot0") < 10) {
        if (character.gold > 600000000000000000) {
            //deposit_gold();
        } else {
            if (character.map == "bank") {
                move(0, -30); //move to base of bank
                transport("main", 3); //leave bank
            } else {
                buy_potions();
            }

        }
    }

    /* ----------------------------------------------------------------
     * Targeting Logic. 
     * 
     * @todo: change pvp logic (change server etc.) to be dependent on
     *        player obj information.
     * @todo: fix target checking to loop through array of targets,
     *        prioritizing by index.
     * --------------------------------------------------------------*/
    //function for finding neaerest target
    function find_target() {
        //filter for monster
        function filterMonsters(monster) {
            //check if on a pvp server
            if (get_socket()["io"]["engine"]["hostname"] == "uspvp.adventure.land"
                || get_socket()["io"]["engine"]["hostname"] == "eupvp.adventure.land"
            ) {
                //if any targets are a player character (non NPC) and is not 
                //friendly change server.
                if (monster.citizen == undefined
                    && monster.type != "monster"
                    && monster.name != 'NickyNickel'
                    && monster.name != 'Boomybob'
                    && monster.name != 'SliceNdice'
                    && monster.name != 'MoyaTesh') {
                    change_server("US", "III");
                    game_log('enemy found: ' + monster.name);
                }
            }

            //check if monster is actually our merchant
            if (monster.name == merchant) {
                send_items(monster);
            }

            //target first monster in array (changing later)
            if (monster.mtype == mobs_to_farm[0]
                //&& get_target_of(get_entity("Boomybob")) != monster
                //&& get_target_of(get_entity("MoyaTesh")) != monster
                //&& get_target_of(get_entity("SliceNdice")) != monster
                || monster.target == character.name
                //|| monster.target == null
            ) {
                //change monster hp to higher to have all party attack
                if (monster.target == character.name
                    || parent.party_list.includes(monster.target)
                    && monster.hp > 500) { //change this to a var @ top
                    monster.attacking == 1;
                    game_log("party attacking");
                } else {
                    monster.attacking == 0;
                }
                return true;
            } else {
                return false;
            }
        }

        //create an array holding the filtered monsters
        var monsters = Object.values(parent.entities).filter(filterMonsters);

        //sort by distance from me
        monsters.sort(function (current, next) {
            if (current.attacking > next.attacking) {
                return -1;
            }
            var d_curr = distance(character, current);
            var d_next = distance(character, next);
            if (d_curr < d_next) {
                return -1;
            } else if (d_curr > d_next) {
                return 1;
            } else {
                return 0;
            }
        });
        return monsters;
    }

    function distance_to_point(x, y) {
        return Math.sqrt(Math.pow(character.real_x - x, 2)
            + Math.pow(character.real_y - y, 2));
    }

    var target = get_targeted_monster();
    if (!target) {
        target = find_target()[0];
        if (target) {
            //check if mob has a target.
            try {
                var name = get_target_of(target).name;
                game_log("targeting " + name);
            } catch (err) {
                change_target(target);
            }
        }
        else {
            //can't find monster so move to area
            smart_move({ to: mobs_to_farm[0] });
            set_message("Moving");
            return;
        }
    }
    /* ----------------------------------------------------------------
     * Movement
     * --------------------------------------------------------------*/
    //used to move towareds target
    function move_to_target(target) {
        if (can_move_to(target.real_x, target.real_y)) {
            smart.moving = false;
            smart.searching = false;
            move(
                character.x + (target.x - character.x) / 2,
                character.y + (target.y - character.y) / 2
            );
        } else {
            if (!smart.moving) {
                smart_move({ x: target.real_x, y: target.real_y });
            }
        }
    }

    /* ----------------------------------------------------------------
     * Combat / attack
     * --------------------------------------------------------------*/
    //check if in range then attack.
    if (!is_in_range(target)) {
        move_to_target(target);
    }

    //run away.
    else if (character.hp < character.max_hp / 2) {
        smart_move(find_npc("fancypots"));
    }
    //attack
    else if (can_attack(target)) {
        set_message("Attacking");
        attack(target);
    }

}, 1000 / 4); // Loops every 1/4 seconds.