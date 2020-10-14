// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!
load_code("goldmeter");
load_code("SendItems");


var attack_mode = true
var monster_target = ["goo"]
var mob2farm = ["minimush"];

function party() {
    send_party_invite("Boomybob", false);
    send_party_invite("SliceNdice", false);
}

//invite to party on reconnect
if (character.name == "MoyaTesh") {
    party();
}

//uncomment to see current location
game_log(character.real_x + " " + character.real_y);

//this will run @ beg of script incase of server reload.
setInterval(function () {

    if (character.hp < character.max_hp - 300) {
        use('use_hp');
    }
    if (character.mp < character.max_mp - 300
        || character.mp < 10) {
        use('use_mp');
    }
    loot();

    if (!attack_mode || character.rip || is_moving(character)) return;

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

    //function for finding neaerest target
    function find_target() {
        //filter for monster
        function filterMonsters(monster) {
            if (get_socket()["io"]["engine"]["hostname"] == "uspvp.adventure.land"
                || get_socket()["io"]["engine"]["hostname"] == "eupvp.adventure.land"
                && monster.citizen == undefined
                && monster.type != "monster"
                && monster.name != 'NickyNickel'
                && monster.name != 'BoomyBob'
                && monster.name != 'MoyaTesh'
            ) {
                change_server("US", "III");
                game_log('enemy found');
            }
            if (monster.mtype == mob2farm[0]
                //&& get_target_of(get_entity("Boomybob")) != monster
                //&& get_target_of(get_entity("MoyaTesh")) != monster
                //&& get_target_of(get_entity("SliceNdice")) != monster
                || monster.target == character.name
                //|| monster.target == null
            ) {
                //-------------------
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


    //change this to cycle through monster array		
    var target = get_targeted_monster();
    if (!target) {
        //target=get_nearest_monster({min_xp:100,max_att:120});
        //game_log(character.real_x + " " + character.real_y);
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
            smart_move({ to: mob2farm[0] });

            set_message("Moving");
            return;
        }
    }

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
    //check if in range then attack.
    if (!is_in_range(target)) {
        move_to_target(target);

    }
    else if (can_attack(target)) {
        set_message("Attacking");
        attack(target);

    }

}, 1000 / 4); // Loops every 1/4 seconds.

