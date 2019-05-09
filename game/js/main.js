 //stworzenie pola gry o wielkości: 95%, 99%, render CANVAS, stworzenie diva z grą
var game = new Phaser.Game ('88','100', Phaser.CANVAS,'loader');
//Zmienna tła
var spacefield;
//zmienna nowego pola
var pinkPanther;

//zmienna gracz / player / samolot / pojazd
var player;
//zmienna życie / hp / hapsy
var hp = 1;

//zmienna sterowanie / strzałki / ruch / kontrola pojazdu
var cursors;

// zmienna randomowego pojawiania przeciwników, początkowo 3, żeby zaczęli się spawnić
var randomization = 3;
//zmienna trudności / poziomu / level
var hardness = 4;

//zmienna pocisków / nabojów / strzałów
var bullets;
//zmienna
var bulletTime = 0;
//zmienna przycisku strzału / przycisk strzału/ strzał
var fireButton;
//zmienna o ilości amunicji
var shots=30;

//zmienna przeciwników (grupy)
var enemies;
//zmienna ilości przeciwników
var enemyCount=0;
//zmienna całkowitej ilości przeciwników
var enemyCountConstant=0;



//zmienna czasu, powiązana z wyświetlaczem postępu
var MyTime = 0;
//zmienna czasu, powiązana z wyświetlaczem postępu
var Cooldown = 0;
//zmienna wyniku/ wynik
var score =0;
//zmienna wyświetlacza wyniku
var scoreText;
//zmienna ekranu wygranej/ pułapu punktowego
var winText;
//zmienna ekranu przegranej
var looseText;
//zmienna tekstu ilości pocisków
var shootText

//deklaracje phasera
var mainState =
{
	//funkcje załadowania grafik
	preload:function()
	{
		//załadowanie grafik: tło / gracz / pocisk / wróg / ...
		game.load.image('starfield','img/1.jpg');
		game.load.image('player','img/plane.png');
		game.load.image('laser','img/laser.png');
		game.load.image('enemy', 'img/plane2.png');
		game.load.image('pink', 'img/pink.png');
		game.load.image('commete', 'img/commete.png');
	},
	//END preload -------------------------------------

	//funkcje tworzenia wszystkiego
	create:function()
	{
		//stworzenie granic gry, gra posiada wielkość zadeklarowaną wcześniej i poza nią nie mogą wyjechać obiekty zderzające się z granicami
		game.physics.setBoundsToWorld();
		//kolor diva gry
		game.stage.backgroundColor = '#dfdfbf';
		//dodanie wyglądu płytki: / pozycja top:0/ left:0/ szerokość diva gry/ wysokość diva gry/ o grafice 'starfield'/
		spacefield=game.add.tileSprite(0,0,game.width,game.height,'starfield');

		//dodanie nowego wyglądu płytki
		pinkPanther=game.add.sprite(-100, game.height, 'pink');
		//włączenie fizyk gry: dla: PinkPanther/ rodzaj fizyki: arkadowa fizyka Phasera/
		game.physics.enable(pinkPanther,Phaser.Physics.ARCADE);

		//funkcja torząca własny czas. Później trzeba ten czas zacząć
		MyTime = game.time.create(false);
		Cooldown = game.time.create(false);


		// dodanie wyglądu gracza: / pozycja: center/ center/ grafika: 'player'/
		player=game.add.sprite(game.world.centerX,game.world.centerY, 'player');
		//włączenie fizyk gry: dla: gracz/ rodzaj fizyki: arkadowa fizyka Phasera/
		game.physics.enable(player,Phaser.Physics.ARCADE);
		//ciało gracza zderza się z granicami diva: tak
		player.body.collideWorldBounds=true;

		//sterowanie= urządzenie wejścia klawiatura, utwórz przyciski sterujące()
		cursors= game.input.keyboard.createCursorKeys();

		//dodanie do gry grupy pociski
		bullets = game.add.group();
		//nadanie pociskom ciała fizycznego w grze
		bullets.enableBody=true;
		//typ fizyki dla ciała pocisków= arkadowa fizyka Phasera
		bullets.physicsBodyType=Phaser.Physics.ARCADE;
		// nwm
		bullets.createMultiple(30,'laser');
		//nwm
		bullets.setAll('anchor.x',0.3);
		//nwm
		bullets.setAll('anchor.y',1);
		//pociski sprawdzają granice gry
		bullets.setAll('checkWorldBounds',true);
		//pociski umierają po wyjściu poza granicę
		bullets.setAll('outOfBoundsKill',true);
		//przycisk sterujący strzelaniem: dodaj klawisz: klawisz spacji
		fireButton=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//dodaj grupę przeciwników
		enemies = game.add.physicsGroup(Phaser.Physics.ARCADE);
		//nadaj przeciwnikom ciało
		enemies.enableBody = true;

		//dodaj grupę komet
		commete = game.add.physicsGroup(Phaser.Physics.ARCADE);
		//nadaj komecie ciało
		commete.enableBody = true;

		//funkcja stwórz przeciwników
		createEnemies();

		//deklaracja tekstu wyniku
		scoreText=game.add.text(10,10, '',{font: '32px Arial', fill:'#ddd'});

		//deklaracja tekstu wygranej
		winText=game.add.text(game.world.centerX, game.world.centerY, '',{font: '32px Arial', fill:'#fff'});

		//deklaracja tekstu przegranej
		looseText=game.add.text(game.world.centerX-(game.width/7), game.world.centerY-game.height/8, '',{font: '40px Arial', fill:'#fff'});

		//deklaracja tekstu o ilości amunicji
		shootText=game.add.text(10,50,'Shots left:',{font:'30px Arial',fill:'#f00'});

		//ukrycie tekstów
		shootText.visible=true;
		winText.visible=false;
		looseText.visible=false;
	},
	//END create ----------------------------------------

	//funkcje powtarzające się co klatkę animacji
	update:function()
	{
		//stworzenie collisionHandlerów, które odpowiadają za zderzenia: pociski-wrogowie; gracz-wrogowie; wrogowie-koniec planszy, wrogowie-wrogowie;
		game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);
		game.physics.arcade.overlap(player,enemies,collisionHandler2,null,this);
		game.physics.arcade.overlap(pinkPanther,enemies,collisionHandler3,null,this);
		game.physics.arcade.overlap(enemies,enemies,collisionHandler4,null,this);



		////wyjściowa prędkość kiedy gracz się nie porusza wynosi 0
		player.body.velocity.x=0;
		//wyjściowa prędkość kiedy gracz się nie porusza wynosi 0
		player.body.velocity.y=0;
		//prędkość paralaksy zależy od 'backgroundv' i trudności
		spacefield.tilePosition.y+=hardness/2;

		if(cursors.left.isDown)
		{
			//prędkość w lewo
			player.body.velocity.x = -400;
		}
		if(cursors.right.isDown)
		{
			//prędkość w prawo
			player.body.velocity.x=400;
		}
		if(cursors.up.isDown)
		{
			//prędkość w górę
			player.body.velocity.y=-400;
		}
		if(cursors.down.isDown)
		{
			//prędkość w dół
			player.body.velocity.y=400;
		}
		if((fireButton.isDown) && (shots>0)){
			fireBullet();
		}
		createEnemies();

		//tworzenie tekstów
		scoreText.text='Score:'+score;
		looseText.text='Game Over\nScore:'+score;
		winText.text='Good Job!\nScore:'+score;
		if(shots==0)
		{
			shootText.text="COOLDOWN!!!";
			Cooldown.loop(4000, reload, this);
			//Czas stworzony przez nas musi byc własnoręcznie odpalony, inaczej sie nie zacznie
			Cooldown.start();
			//funkcja wykona się po 6000ms, zwiększa trudność, przywraca 'normalny' widok i zatrzymuje wszystkie funkcje 'updateCounter', które się zaczęły przez te 6 sekund, co sprawia wrażenie, że trudność zwiększa się tylko o 1 poziom zamiast o ok 30;
			function reload()
			{
				shots=30;
				Cooldown.stop();
			}
		}
		else {
			shootText.text="Shots Left:"+shots;
		}


		//jeśli wynki jest równy 40 to wyswietla się tekst postępu
		if(score>1 && score%50==0){
			winText.visible=true;
			scoreText.visible=false;
			//deklarujemy tu pętlę trwającą 6000ms, wywołuje updateCounter(5 linijek poniżej)
			MyTime.loop(6000, updateCounter, this);
			//Czas stworzony przez nas musi byc własnoręcznie odpalony, inaczej sie nie zacznie
			MyTime.start();
			//funkcja wykona się po 6000ms, zwiększa trudność, przywraca 'normalny' widok i zatrzymuje wszystkie funkcje 'updateCounter', które się zaczęły przez te 6 sekund, co sprawia wrażenie, że trudność zwiększa się tylko o 1 poziom zamiast o ok 30;
			function updateCounter()
			{
				winText.visible=false;
				scoreText.visible=true;
				hardness++;
				MyTime.stop();
			}
		}
		//jeśli hp jest mniejsze od 1 to wyświetla się tekst przegranej, a chowa się gracz, wrogowie i wynik;
		if(hp<=0){
			hardness=2;
			shootText.visible=false;
			looseText.visible=true;
			enemies.visible=false;
			bullets.visible=false;
			winText.visible=false;
			scoreText.visible=false;
			player.kill();
		}
	}
	// END update ---------------------------------------------------------
}
//START declarations ---------------------------------------------------

//tworzenie pocisków
function fireBullet()
{
	//jeśli czas gry jest wiekszy od czasu bulletTime
	if(game.time.now > bulletTime)
	{
		bullet = bullets.getFirstExists(false);

		if(bullet)
		{
			shots-=1;
			bullet.reset(player.x + 30,player.y);
			bullet.body.velocity.y = -400;
			bulletTime = game.time.now + 200;
		}
	}
}

//tworzenie wrogów
function createEnemies()
{
	//jeśli liczba wrogów jest mniejsza bądx równa trudności:
	if(enemyCount<=hardness)
	{
		//tworzy randomową liczbę z zakresu 1-4 i wykonuje tyle powtórzeń...
		for(var x = 0; x<=(Math.random()*4); x++)
		{
			//stwórz wroga, jako podklasę enemy, w randomowej szerokości mapy, w odległości 1000 px od 'topu', o wyglądzie i wymiarach 'enemy';
			enemy = enemies.create(x=(game.world.randomX-70), y=-100,'enemy');
			//zwiększ liczbę wrogów o 1;
			enemyCount++;
			//sprawia, że każdy wróg poza ekranem na szerokość się zabija
			if(enemy.position.x<0){
				enemy.kill();
				enemyCount--;
			}

			//zwiększ ogólną liczbę przeciwników
			enemyCountConstant++;
			//nadaj prędkość wrogowi równą trudności*(szerokość diva gry)/trudność*5;
			enemy.body.velocity.y = (hardness-1)*game.height/(hardness*5);
		}
	}
}

//po zderzeniu pocisku z wrogiem: zniszcz pocisk, zniszcz wroga, odejmij liczbe wrogów, dodaj 2 do wyniku;
function collisionHandler(bullet,enemy)
{
	bullet.kill();
	enemy.kill();
	enemyCount-=1;
	score+=2;
}
//zderzenia wrogów z '4 ścianą' : zabija wroga, odejmuje jego liczbę
function collisionHandler3(pinkPanther,enemy)
{
	enemy.kill();
	enemyCount-=1;
}
//po zderzeniu gracza z wrogiem: odejmij hp;
function collisionHandler2(player,enemy)
{
	hp-=1;
}
//po zderzeniu wróg-wróg usuwa tego, który jest niżej
function collisionHandler4(enemy,enemies)
{
	enemies.kill();
	enemyCount-=1;
}

game.state.add('mainState',mainState);
game.state.start('mainState');



// --------------------------------------------------------------------------------------------------------------------------- //



// nasłuchiwacz oczekujący załadowania się CANVAS-a z grą
$('CANVAS').ready(function(){
	//dodanie do loadera diva z reklamami
	$('#loader').append('<div id="add_right"> //addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR></div>');
	$('#loader').append('<div id="add_left"> //addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR>//addons// </BR></div>');
	// robienie przycisku przechodzącego do strony
	zrob_przycisk();
});
//nasłuchiwacz oczekujący załadowania całego dokumentu
$('document').ready(function() {
		// koloruje przycisk na czerwono
		$('#btn').css('backgroundColor','#c00');
		sluchaj_przycisk();
})

function zrob_przycisk(){
	// dodaje do boxa z reklamami przycisk
	$('#add_right').append('<div id="btn">Strona Załadowana</div>');
}

function sluchaj_przycisk()
{
	//czeka na kliknięcie
	$('#btn').on('click',function(){
		//chowa cały loader
		$('#loader').hide();
		//pokazuje reszte strony
		$('body').css('overflow','visible');
	});
}
