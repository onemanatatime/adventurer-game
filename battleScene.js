const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({position: {x:0, y:0}, image: battleBackgroundImage})

let enemy;
let fighter;
let renderedSprites;
let battleAnimationId;
let queue;

let randomMonster = () => {
    if (adv.attr.level === 1){
        document.querySelector("#enemyName").innerHTML = "Momo"
        return monsters.Momo;
    }
    else if (adv.attr.level === 2){
        if (Math.random() < 0.4) {
            document.querySelector("#enemyName").innerHTML = "Momo"
            return monsters.Momo;
        } else {
            document.querySelector("#enemyName").innerHTML = "Draggle"
            return monsters.Draggle;
        }
    }
    else if (adv.attr.level === 3){
        if (Math.random() < 0.35) {
            document.querySelector("#enemyName").innerHTML = "Momo"
            return monsters.Momo;
        } else if (Math.random() > 0.6) {
            document.querySelector("#enemyName").innerHTML = "Draggle"
            return monsters.Draggle;
        } else {
            document.querySelector("#enemyName").innerHTML = "Emby"
            return monsters.Emby;
        }
    }
    else if (adv.attr.level === 4){
        if (Math.random() < 0.1) {
            document.querySelector("#enemyName").innerHTML = "Momo"
            return monsters.Momo;
        } else if (Math.random() < 0.2) {
            document.querySelector("#enemyName").innerHTML = "Draggle"
            return monsters.Draggle;
        } else if (Math.random() < 0.5) {
            document.querySelector("#enemyName").innerHTML = "Emby"
            return monsters.Emby;
        } else {
            document.querySelector("#enemyName").innerHTML = "Woodle"
            return monsters.Woodle;
        }
    }
    else if (adv.attr.level >= 5){
        if (Math.random() < 0.025) {
            document.querySelector("#enemyName").innerHTML = "Momo"
            return monsters.Momo;
        } else if (Math.random() < 0.05) {
            document.querySelector("#enemyName").innerHTML = "Draggle"
            return monsters.Draggle;
        } else if (Math.random() < 0.1) {
            document.querySelector("#enemyName").innerHTML = "Emby"
            return monsters.Emby;
        } else if (Math.random() < 0.3) {
            document.querySelector("#enemyName").innerHTML = "Woodle"
            return monsters.Woodle;
        } else if (Math.random() < 0.65) {
            document.querySelector("#enemyName").innerHTML = "Rocky"
            return monsters.Rocky;
        } else {
            document.querySelector("#enemyName").innerHTML = "Beradin"
            return monsters.Beradin;
        }
    }
}

function initBattle() {
    document.querySelector("#userInterface").style.display = "block";
    document.querySelector("#dialogueBox").style.display = "none";
    document.querySelector("#enemyHealthBar").style.width = "100%";
    document.querySelector("#playerHealthBar").style.width = "100%";
    document.querySelector("#attacksBox").replaceChildren();

    // set fight scene's player name as the Adventurer name
    document.querySelector("#playerName").innerHTML = adv.name;

    // clear/reset log
    document.querySelector("#battleLogItems").replaceChildren();

    // RESET MONSTER POSITIONS
    monsters.Adventurer.position = {x:260, y:280};
    monsters.Momo.position = {x:800, y:100}, 
    monsters.Draggle.position = {x:800, y:100}, 
    monsters.Emby.position = {x:800, y:100}, 
    monsters.Woodle.position = {x:785, y:65}, 
    monsters.Rocky.position = {x:740, y:60}, 
    monsters.Beradin.position = {x:780, y:55}, 

    
    enemy = new Monster(randomMonster());
    fighter = new Monster(monsters.Adventurer);
    renderedSprites = [fighter, enemy];
    queue = [];
    fighter.name = adv.name;

    // show HP of adv & monster for start of game
    document.querySelector("#playerHP").innerHTML = `HP: ${fighter.health}/${fighter.healthMax}`; 
    document.querySelector("#enemyHP").innerHTML = `HP: ${enemy.health}/${enemy.healthMax}`;

    fighter.attacks.forEach(attack => {
        // populate attacksBox dynamically with player's available attacks
        const button = document.createElement('button');
        button.innerHTML = attack.name;
        button.setAttribute("id", "fightButton");
        document.querySelector("#attacksBox").append(button);
    })

    // event listeners related to battle
    document.querySelectorAll("#fightButton").forEach((button) => {
        button.addEventListener("click", (e)=>{
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            fighter.attack({ 
                attack: selectedAttack,
                recipient: enemy,
                renderedSprites
            })

            // IF PLAYER WINS THE BATTLE
            if (enemy.health <= 0) {
                // handle drops
                let newKey = enemy.drops[0];
                if (Math.random() < 0.75) {
                    if (!adv.bag[`${newKey}`]) adv.bag[`${newKey}`] = 0; // if no such key, initiate it
                    adv.bag[`${newKey}`] += 1; // 75% chance to get normal drop
                }

                // handle rare drops
                let newKeyRare = enemy.rareDrops[0];
                if (Math.random() < 0.2) {
                    if (!adv.bag[`${newKeyRare}`]) adv.bag[`${newKeyRare}`] = 0; 
                    adv.bag[`${newKeyRare}`] += 1; // 20% chance to get rare drop
                    console.log(`you found a rare item (${newKeyRare})!`)
                }

                // show on UI
                // document.querySelector("#itemOverlay").innerHTML = `ITEMS: [x]`;
                // TODO: show obj length? https://stackoverflow.com/a/6700

                // handle gold
                adv.gold += enemy.gold - Math.floor(Math.random() * enemy.gold/4); // e.g. minus (up to ~25%)
                document.querySelector("#goldOverlay").innerHTML = `GOLD: ${adv.gold}`;

                // handle XP gained
                adv.attr.xp += enemy.xp;

                // log level before win fight
                let levelBefore = adv.attr.level;

                // handle leveling up
                if (adv.attr.xp >= 30 && adv.attr.xp < 80) adv.attr.level = 2;
                else if (adv.attr.xp >= 80 && adv.attr.xp < 150) adv.attr.level = 3;
                else if (adv.attr.xp >= 150 && adv.attr.xp < 250) adv.attr.level = 4;
                else if (adv.attr.xp >= 250 && adv.attr.xp < 400) adv.attr.level = 5;
                else if (adv.attr.xp >= 400 && adv.attr.xp < 600) adv.attr.level = 6;
                else if (adv.attr.xp >= 600 && adv.attr.xp < 850) adv.attr.level = 7;
                else if (adv.attr.xp >= 850 && adv.attr.xp < 1150) adv.attr.level = 8;
                else if (adv.attr.xp >= 1150 && adv.attr.xp < 1500) adv.attr.level = 9;
                else if (adv.attr.xp >= 1500 && adv.attr.xp < 2000) adv.attr.level = 10;

                // log level after win fight
                let levelAfter = adv.attr.level;

                // display LEVEL and XP
                document.querySelector("#xpOverlay").innerHTML = `LEVEL: ${adv.attr.level} (${adv.attr.xp} XP)`;

                queue.push(()=>{
                enemy.faint();
                })
                queue.push(()=>{
                    gsap.to("#overlappingDiv", {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId);
                            animate();
                            document.querySelector("#userInterface").style.display = `none`;
                            gsap.to("#overlappingDiv", {
                                opacity: 0
                            })
                            // end battle - player won
                            battle.initiated = false;
                            audio.Map.play();
                            // open level up screen
                            if (levelBefore !== levelAfter) {
                                // show screen
                                document.querySelector("#levelUpOverlay").style.display = "block";

                                // populate title
                                document.querySelector("#levelUpTitle").innerHTML = `YOU HAVE REACHED LEVEL ${levelAfter}!`;
                                
                                // populate text based on level
                                if (levelAfter === 2){
                                    // select class
                                    document.querySelector("#levelUpText").innerHTML = `
                                    <div id="classBox">Select Class:
                                        <select id="chooseClass">
                                            <option value="Warrior">Warrior</option>
                                            <option value="Archer">Archer</option>
                                            <option value="Wizard">Wizard</option>
                                        </select>
                                    </div>
                                    `;
                                } else if (levelAfter >= 4){
                                    // clear old text
                                    document.querySelector("#levelUpText").replaceChildren();

                                    // +3 stats points to add to attributes
                                    document.querySelector("#levelUpText").innerHTML =`
                                    <div id="addStatsBox">Increase Attributes with Stats Points:
                                        <div id="chooseStats">
                                            <p id="chooseStatsStr">STR: ${adv.attr.strength}</p><input id="addStr" value=0 type="number" min="0" max="3">
                                            <p id="chooseStatsAgi">AGI: ${adv.attr.agility}</p><input id="addAgi" value=0 type="number" min="0" max="3">
                                            <p id="chooseStatsWis">WIS: ${adv.attr.wisdom}</p><input id="addWis" value=0 type="number" min="0" max="3">
                                        </div>
                                    </div>
                                    `;
                                } 
                                
                                if (levelAfter === 5){
                                    // equip weapon if available
                                    if (adv.class === "Warrior" && adv.bag.sword > 0){
                                        document.querySelector("#levelUpTextMore").innerHTML =`
                                            <div id="equipWeaponBox">
                                                <select id="equipWeapon">
                                                    <option value="sword">Sword: (${adv.bag.sword})</option>
                                                </select>
                                                </div>
                                            </div>
                                            `;
                                    }
                                    else if (adv.class === "Archer" && adv.bag.bow > 0){
                                        document.querySelector("#levelUpTextMore").innerHTML =`
                                        <div id="equipWeaponBox">
                                            <select id="equipWeapon">
                                                <option value="bow">Bow: (${adv.bag.bow})</option>
                                            </select>
                                            </div>
                                        </div>
                                        `;
                                    }
                                    else if (adv.class === "Wizard" && adv.bag.wand > 0){
                                        document.querySelector("#levelUpTextMore").innerHTML =`
                                        <div id="equipWeaponBox">
                                            <select id="equipWeapon">
                                                <option value="wand">Wand: (${adv.bag.wand})</option>
                                            </select>
                                            </div>
                                        </div>
                                        `;
                                    } 
                                    else {
                                        document.querySelector("#levelUpTextMore").innerHTML =`
                                            <div id="equipWeaponBox">
                                                <select id="equipWeapon">
                                                    <option value="none">None</option>
                                                </select>
                                                </div>
                                            </div>
                                            `;
                                    }
                                }

                                if (levelAfter === 3){
                                    // clear old text
                                    document.querySelector("#levelUpText").replaceChildren();

                                    // add a new attack
                                    if (adv.class === "Warrior"){
                                        monsters.Adventurer.attacks.push(attacks.Slash);
                                    } 
                                    else if (adv.class === "Archer"){
                                        monsters.Adventurer.attacks.push(attacks.Bullseye);
                                    } 
                                    else if (adv.class === "Wizard"){
                                        monsters.Adventurer.attacks.push(attacks.Fireball);
                                    } 

                                    document.querySelector("#levelUpTextMore").innerHTML =`
                                    <div id="newSkill">
                                        You have gained a new skill (${monsters.Adventurer.attacks[monsters.Adventurer.attacks.length-1].name})!
                                    </div>
                                    `;
                                }

                            }
                        }
                    })
                })
            }



            // enemy attacks
            const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];

            queue.push(()=>{
                enemy.attack({ 
                    attack: randomAttack,
                    recipient: fighter,
                    renderedSprites
                })
                if (fighter.health <= 0) {
                    queue.push(()=>{
                    fighter.faint();
                    })
                    queue.push(()=>{
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId);
                                animate();
                                document.querySelector("#userInterface").style.display = `none`;
                                gsap.to("#overlappingDiv", {
                                    opacity: 0
                                })
                                // end battle - player lost
                                battle.initiated = false;
                                audio.Map.play();
                            }
                        })
                    })
                }
            })
        })
    })

}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();

    renderedSprites.forEach(sprite => {
        sprite.draw()
    })
}

animate();
// initBattle();
// animateBattle();

document.querySelector("#dialogueBox").addEventListener("click", (e)=>{
    if (queue.length > 0){
        queue[0]();
        queue.shift();
    } else e.currentTarget.style.display = 'none';
})