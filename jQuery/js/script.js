$(document).ready(function(){
		var szerokosc1=$('.box1').width();
		var wysokosc1=$('.box2').height();
		zrob_respawn(szerokosc1);
	  zrob_przeciwnika(szerokosc1);
		oblicz_zmienne();
		test1();
		rusz_statkiem();
	});
	//zmienne globalne
	var time = 5000; // zmianiając zmienną time przyśpieszasz animację po chwili przykład w funkcji dupa gdzie po 10s zmieniam time;
	var scena = 0;
	var max_ruch_w_prawo = 0;
	var pozycja_statku = 0; //zawsze liczę od lewej bo zmieniam TYLKO LEFT


	function oblicz_zmienne(){
		scena = $('.box1').width();
		max_ruch_w_prawo = scena - $('.statek').width();
		pozycja_statku = (scena/2) - ($('.statek').width()/2);
		zmien_pozycje_statku();//funkcja na dole
	}

	function test1(){
		$( '.box2' ).animate({
			top: '0%'
		}, time, "linear", function(){
			$( '.box2' ).css('top', '-100%');
			test1();
		});
	}

	function rusz_statkiem(){
		$( window ).keydown(function(e) {
			if(e.keyCode==37){
				//strzałka w lewo
				pozycja_statku-=5;
				zmien_pozycje_statku();
			}else if(e.keyCode==39){
				//strzałka w prawo
				pozycja_statku+=5;
				zmien_pozycje_statku();
			}else if(e.keyCode==32){
				//spacja - strzał
			var	strzal = '<div class="strzal"></div>';
				strzal = pozycja_statku;
				console.log('strzelam z pozycji: '+pozycja_statku+' od lewej strony czyli z tego miejsca leci laser do góry czy czym tam strzelacie');
			}
			console.log(e.keyCode); // jak odkomentujesz to przyda sie do dodawania kolejnych funkcji pod knefle
		});
	}
	function zmien_pozycje_statku(){
		if(pozycja_statku<0){ pozycja_statku = 0; }
		if(pozycja_statku>max_ruch_w_prawo){pozycja_statku=max_ruch_w_prawo;}
		$('.statek').css('left', pozycja_statku+'px');
	}
	function zrob_respawn(szerokosc1)
	{

	  $('.enemy').css({
	    'width': szerokosc1,
	    'height': '30px',
	    'position':'relative',
	    'top': '-50px'
	  });
	}
var losujj = Math.floor((Math.random() * 4) + 1);
	function przeciwnik1(szerokosc1)
	{
	  this.wysokosc= '55px';
	  this.szerokosc= '55px';
	  this.pozycja= '10%';
	  this.tlo= 'url(img/1.png)';
	  var losuj= Math.floor(Math.random()*(szerokosc1-30));

	  this.pojaw=function()
	  {
	    $('.enemy').append('<div class="przeciwnik" style="position:absolute; left:'+losuj+'px; height:'+this.wysokosc+'; width:'+this.szerokosc+'; background-image:'+this.tlo+'; background-size:contain; background-position:center center; z-index: 10000;"></div>');
	    $('.przeciwnik').animate(
	      {
	        'top': 1000
	      },time)
	  }
	}
	function przeciwnik2(szerokosc1)
	{
	  this.wysokosc= '55px';
	  this.szerokosc= '55px';
	  this.pozycja= '10%';
	  this.tlo= 'url(img/2.png)';
	  var losuj= Math.floor(Math.random()*(szerokosc1-30));

	  this.pojaw=function()
	  {
	    $('.enemy').append('<div class="przeciwnik" style="position:absolute; left:'+losuj+'px; height:'+this.wysokosc+'; width:'+this.szerokosc+'; background-image:'+this.tlo+'; background-size:contain; background-position:center center; z-index: 10000;"></div>');
	    $('.przeciwnik').animate(
	      {
	        'top': 1000
	      },time)
	  }
	}

	function przeciwnik3(szerokosc1)
	{
	  this.wysokosc= '55px';
	  this.szerokosc= '55px';
	  this.pozycja= '10%';
	  this.tlo= 'url(img/3.png)';
	  var losuj= Math.floor(Math.random()*(szerokosc1-30));

	  this.pojaw=function()
	  {
	    $('.enemy').append('<div class="przeciwnik" style="position:absolute; left:'+losuj+'px; height:'+this.wysokosc+'; width:'+this.szerokosc+'; background-image:'+this.tlo+'; background-size:contain; background-position:center center; z-index: 10000;"></div>');
	    $('.przeciwnik').animate(
	      {
	        'top': 1000
	      },time)
	  }
	}

	function przeciwnik4(szerokosc1)
	{
	  this.wysokosc= '55px';
	  this.szerokosc= '55px';
	  this.pozycja= '10%';
	  this.tlo= 'url(img/4.png)';
	  var losuj= Math.floor(Math.random()*(szerokosc1-30));

	  this.pojaw=function()
	  {
	    $('.enemy').append('<div class="przeciwnik" style="position:absolute; left:'+losuj+'px; height:'+this.wysokosc+'; width:'+this.szerokosc+'; background-image:'+this.tlo+'; background-size:contain; background-position:center center; z-index: 10000;"></div>');
	    $('.przeciwnik').animate(
	      {
	        'top': 1000
	      },time)
	  }
	}

	function zrob_przeciwnika(szerokosc1)
	{
		var losuj = Math.floor((Math.random() * 1000) + 100);
	  maly=new przeciwnik1(szerokosc1);
	  maly.pojaw();
	  setTimeout(function()
	  {
	      delete maly;
	      zrob_przeciwnika(szerokosc1);
	  },losuj)
	}
