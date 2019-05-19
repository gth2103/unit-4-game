var attacker;
var defender;
var enemies = [];
var initialPower;
var gameOver = false;


 
var roundBegun = false;

var characters  = [{
    	name: 'Obi-Wan Kenobi',
    	src: './assets/images/obi.png',
    	life: 120,
    	power: 8
	},
	{
    	name: 'Luke Skywalker',
    	src: './assets/images/luke.png',
    	life: 100,
    	power: 5
	},
	{
    	name: 'Darth Sidious',
    	src: './assets/images/sidious.png',
    	life: 150,
    	power: 20
	},
	{
    	name: 'Darth Maul',
    	src: './assets/images/maul.png',
    	life: 180,
    	power: 25
	}
]

var displayCharacter = function(){
	$('.character').on('click', function(){
		 $('.characters').addClass('disappear');

		  var name = $(this).find('header').text()

		  characters.forEach(function(character){

		  	if(character.name === name){
		  		displayAttacker(character);
		  	    attacker = character;
		  	    initialPower = attacker.power;
		  	}
		  	else {
		  		displayEnemy(character);
		  		enemies.push(character);
		  	}
		});
	})	
}

var displayAttacker = function(character){

	var attacker = '<div class="col-2 p-1 m-2 text-center d-inline rounded border border-success attacker"><header>' + character.name + '</header><img src="' + character.src + '" class="rounded" alt=""><br><span class="life">' + character.life +'</span></div>'

	$('.attackers').html(attacker);
}

var displayEnemy  = function(character){

    var  enemy = '<div class="col-2 p-1 m-2 text-center d-inline rounded border border-dark enemy"> <header>' + character.name + '</header> <img src="' + character.src + '" class="rounded"><br> <span class="life">' + character.life +'</span> </div>'

	$('.enemies').append(enemy);
}

var displayDefender  = function(character){

    var  defender = '<div class="col-2 p-1 m-2 text-center d-inline rounded border border-success defender"><header>' + character.name + '</header><img src="' + character.src + '" class="rounded"><br><span class="life">' + character.life +'</span></div>'

	$('.defenders').html(defender);
}

var okToChooseEnemy = function(){
	if(defender !=  null && !defenderDefeated()){
		return false;
	}
	return true;
}

var roundEnded = function(){
	return (roundBegun && !okToAttack)
}

var chooseEnemies = function(){

	$(document).on('click', 'div.enemy', function(){

		if(okToChooseEnemy()){

			$('.results').empty()

			var name = $(this).find('header').text()

			$('.enemies').empty();

			for(var i = 0; i < enemies.length; i++){
				if(enemies[i].name === name){
					displayDefender(enemies[i])
					defender = enemies[i];
		  	    	enemies.splice(i, 1);
		  	    	i--;
		  		}
		  		else{
		  	    	displayEnemy(enemies[i]);
		  		}
			}
		}
	});	
}

var restart = function(){
		location.reload();
}

var okToAttack = function(){
	if(defender !=  null && !defenderDefeated() && !attackerDefeated()){
		return true;
	}
	return false;
}

var attackerDefeated = function(){
	return (attacker !=  null &&  attacker.life <= 0)
}

var defenderDefeated = function(){
	return (defender != null && defender.life <= 0)
}

var displayRound = function(){

	$('.results').html("You attacked " + defender.name + " for " + attacker.power + " damage.<br>" + defender.name + " attacked you back for " + defender.power + " damage.");
}

var displayAttackerDefeated = function(){

	button = $('<button class="restart btn btn-outline-warning">Restart</button>')

	$('.results').html("You've been defeated. GAME OVER!<br>")
	$('.results').append(button)	

	$('.results').on('click', '.restart', function(){
		restart();
	});	
}

var displayDefenderDefeated = function(){

	$('.defender').css('visibility', 'hidden')
	$('.results').html("You have defeated " + defender.name +  "! You can choose to fight nother enemy above.")

	defender = null
}

var displayNoEnemyFound = function() {
     $('.results').html("No enemy here.")
}


var displayWin = function(){

	button = $('<button class="restart btn btn-outline-warning">Restart</button>')

	$('.results').html("Congratulations, you won! GAME OVER!<br>")
	$('.results').append(button)	

	$('.results').on('click', '.restart', function(){
		restart();
	});	
}

var checkMate = function(){
	return (defender.life - attacker.power <= 0)
}


var win = function(){
  return (enemies.length == 0 && roundBegun && checkMate())
}

var attack = function(){

	$('.attack').on('click',  function(){
		if(!gameOver){
			roundBegun=!win();
			if(okToAttack()){
				defender.life = defender.life - attacker.power
				if(!defenderDefeated()) {
					attacker.life = attacker.life - defender.power
				}
				displayDefender(defender)
				displayAttacker(attacker)
				displayRound();
				attacker.power += initialPower
			}
			if(win()){
				displayWin();
				gameOver =  true;
			}
			else if(attackerDefeated()){
				roundBegun=false;
				displayAttackerDefeated();

			}
			else if (defenderDefeated()){
				displayDefenderDefeated();
			}
			else if (!okToAttack()){
				displayNoEnemyFound();
			}
		}
	});
}

$(document).ready(function(){

	displayCharacter();
	chooseEnemies();
	attack();

});