// http://www.naden.de/blog/zufallszahlen-in-javascript-mit-mathrandom
function getRandom(min,max )
{
  if (min > max) return -1;
  if (min == max) return min;

  return min + parseInt(Math.random() * (max-min+1));
}

// http://jsperf.com/javascript-trunc
function trunc(number) { return (number | 0); }

// Global variables
var iOS = false,
	iPad = false,
    iPhone = false,
    iPod = false,
    mobile = false,
    contentScale = false,
	difficulty = 0,
    frameRate = 60,
    canvasPosX = 0,
    canvasPosY = 0,
    ghost = [],
    timeleft = 0,
    ghostsleft = 0,
    maxGhosts = 0,
    radius = 0,
    gameOver = false,
    nextLevel = false,
    highQuality = true,
    timeSetter,
    updateSetter,
    animateSetter,
    bgMusic,
    booSound;

DisplayOrientation =
{
  Landscape: 0,
  Portrait: 1
};

// Ghost pseudo-class
objGhost = function()
{
  var _sprite;

  this.dead = false;

  _sprite = new SmokeMonster.Sprite(document.getElementById('game'));

  _sprite.loadFromFile('img/ghost.png', new SmokeMonster.Rect(0, 0, 45, 45));
  $(_sprite.node).css('left', getRandom(23, 460 - 23));
  $(_sprite.node).css('top', getRandom(23, 320 - 23));
  _sprite.position.z = 7;
  _sprite.className = "objGhost";
  _sprite.addAnimation("alpha", 100, "ease-out", 0);

  _sprite.position.x = getRandom(23, 460 - 23);
  _sprite.position.y = getRandom(23, 320 - 23);

  _sprite.offset.position.x = (45 / 2);
  _sprite.offset.position.y = (45 / 2);

  _sprite.alpha = 255;

  _sprite.mousedown(function()
  {
    if (!this.dead)
    {
      _sprite.alpha = 0;
      timeleft = timeleft - 1.5;
      updateTimeOverlay();
    }
  });

  _sprite.visible = false;

  this.frame = 0;
  this.frameRow = 0;

  this.sprite = _sprite;
  this.velocity = new SmokeMonster.Vector(0, 0);
  this.rotateStep = getRandom(0, 100) / 100;

  var _setRandomMovement = function()
  {
    var randomVelX = getRandom(0, 100),
        randomVelY = getRandom(0, 100);

    if (randomVelX > 50) this.velocity.x = this.velocity.x * (-1);
    if (randomVelY > 50) this.velocity.y = this.velocity.y * (-1);
  }

  this.setRandomMovement = _setRandomMovement;
};


// Game "Singleton": Revealing module pattern
Game = function()
{
  var _posx = 0,
      _posy = 0,
      _scale = 0.0,
      _hole,
      _displayOrientation = 0,
      _width = 460,
      _height = 320,
      
      resize = function()
      {
        if (trunc($(window).width() / $(window).height()) >= 1)
          _displayOrientation = 0;
        else
          _displayOrientation = 1;

        var scaleX = $(window).width() / _width,
        	scaleY = $(window).height() / _height;
        	
        	
        if (scaleX < scaleY) _scale = scaleX;
        else _scale = scaleY;


        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Bada/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i))
        {
          mobile = true;
          contentScale = true;

          if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))
          {
            if (navigator.userAgent.match(/iPhone/i)) iPhone = true;
            if (navigator.userAgent.match(/iPod/i)) iPod = true;
            if (navigator.userAgent.match(/iPad/i)) iPad = true;

            iOS = true;
          }
        }

        canvasPosX = ($(window).width() - $('#content').width()) / 2;
        canvasPosY = ($(window).height() - $('#content').height()) / 2;

		if (contentScale) 
		{
		  var downScale;
		  
		  if (_scale < 1.0) downScale = 0.05;
		  else downScale = 0.15;
		  
		  // Mobile scale will be capped at 1.25x because scaling is quite performance-intensive
		  if (mobile)
		  {
			if (_scale > 1.4) _scale = 1.4;
		  }
		  
		  
		  document.getElementById('content').style.transform = "scale(" + (_scale - downScale) + ")";
		  document.getElementById('content').style.webkitTransform = "scale(" + (_scale - downScale) + ")";
		  document.getElementById('content').style.mozTransform = "scale(" + (_scale - downScale) + ")";
		}

		
      },
      
      initialize = function()
      {
        // Using document ready in order to reduce screw-ups :)
        $(document).ready(function()
        {
        	$('body').width($(window).width());
        	$('body').height($(window).height());
        
        	$('div#content').width(_width);
            $('div#content').height(_height);
    
            $('div.gameState').width(_width);
    
            $('div#loading').width(_width);
            $('div#loading').height(_height);
    
            $('div.blackrect').width(_width);
            $('div.blackrect').height(_height);
    
            $('div#mouserect').width(_width);
            $('div#mouserect').height(_height);
            
            // Load data from local storage
            if (Modernizr.localstorage)
            {
            	if ((typeof(localStorage["GhostChaos.Config.Scale"]) != "undefined") && (localStorage["GhostChaos.Config.Scale"] != null) && (localStorage["GhostChaos.Config.Scale"] != "")) 
            	{
            	  contentScale = localStorage["GhostChaos.Config.Scale"];
            	  updateScaleLabel();
            	  Game.resize();
            	}
            	
            	if ((typeof(localStorage["GhostChaos.Config.HighQuality"]) !== "undefined") && (localStorage["GhostChaos.Config.HighQuality"] != null) && (localStorage["GhostChaos.Config.HighQuality"] != ""))
            	{
            	  setQuality(localStorage["GhostChaos.Config.HighQuality"]);
            	}
            }
            
        });

        // Resize-moi!
        resize();

		_hole = new SmokeMonster.Sprite(document.getElementById('game'));
        _hole.loadFromFile("img/holes.png");

        _hole.offset.position.x = 128;
        _hole.offset.position.y = 128;


        _posx = ($('#game').width() - _hole.width) / 2;
        _posy = ($('#game').height() - _hole.height) / 2;
        _hole.position.z = 3;

        $('#mouserect').mousemove(function(e)
        {
          _posx = e.pageX - canvasPosX;
          _posy = e.pageY - canvasPosY;
          //_posx = (SmokeMonster.Cursor.x - canvasPosX);
          //_posy = (SmokeMonster.Cursor.y - canvasPosY);
        });

        $('body').mousemove(function(e)
        {
          _posx = e.pageX - canvasPosX;
          _posy = e.pageY - canvasPosY;
          //_posx = (SmokeMonster.Cursor.x - canvasPosX);
          //_posy = (SmokeMonster.Cursor.y - canvasPosY);
        });

        // Touch move events for iPhone/Android
        function holeTouchMoveEvent(e)
        {
          e.preventDefault();

          var touch = event.touches[0];

          _posx = (touch.pageX - canvasPosX);
          _posy = (touch.pageY - canvasPosY);
        }

        if (Modernizr.touch || mobile)
        {
          document.getElementById('mouserect').addEventListener('touchmove', holeTouchMoveEvent, false);
          document.body.addEventListener('touchmove', holeTouchMoveEvent, false);
          
          $('#btnScale').hide();
        }


        $('#overlayPause').click(function()
        {
          switchGameState('pauselevel');
        });
      },
      
      updateHole = function(difficulty)
      {
        if (highQuality) 
        {
          $('.blackrect').css('opacity', 0.75);
          _hole.alpha = 192;
        }
        else 
        {
          $('.blackrect').css('opacity', 1.0);
          _hole.alpha = 255;
        }
      
        _hole.clipRect.make(256 * difficulty, 0, 256, 256);
      },
      
      draw = function()
      {
        for (var i = 0; i < ghost.length; i++)
          ghost[i].sprite.draw();

        _hole.position.x = _posx;
        _hole.position.y = _posy;


        $('div#left.blackrect').css('clip', 'rect({0}px, {1}px, {2}px, {3}px)'.format(0, _posx - 128, _height, 0));
        $('div#right.blackrect').css('clip', 'rect({0}px, {1}px, {2}px, {3}px)'.format(0, _width, _height, _posx + 128));

        $('div#top.blackrect').css('clip', 'rect({0}px, {1}px, {2}px, {3}px)'.format(0, _posx + 128, _posy - 128, _posx - 128));
        $('div#bottom.blackrect').css('clip', 'rect({0}px, {1}px, {2}px, {3}px)'.format(_posy + 128, _posx + 128, _height, _posx - 128));


        _hole.draw();
      },
      
      update = function()
      {
        for (var i = 0; i < ghost.length; i++)
        {
          ghost[i].sprite.position.x += ghost[i].velocity.x;
          ghost[i].sprite.position.y += ghost[i].velocity.y;

          ghost[i].sprite.angle += ghost[i].rotateStep;
          if (ghost[i].sprite.angle >= 360.0) ghost[i].sprite.rotation = 0.0;


          if ((ghost[i].sprite.position.x <= (45 /2)) || (ghost[i].sprite.position.x >= (460 - (45 /2)))) ghost[i].velocity.x = ghost[i].velocity.x * (-1);
          if ((ghost[i].sprite.position.y <= (45 /2)) || (ghost[i].sprite.position.y >= (320 - (45 /2)))) ghost[i].velocity.y = ghost[i].velocity.y * (-1);



          var diffX = Math.abs(ghost[i].sprite.position.x - _posx),
        	  diffY = Math.abs(ghost[i].sprite.position.y - _posy),
        	  distance = Math.sqrt(diffX * diffX + diffY * diffY);


          if (distance < radius)
          {
        	if (!ghost[i].dead)
        	{
        	  ghost[i].sprite.visible = true;

        	  if (ghost[i].sprite.alpha > 0)
        	    ghost[i].sprite.alpha--;
        	  else
        	  {
        	    ghost[i].dead = true;
        	    ghostsleft--;

        	    if (typeof(booSound) != "undefined") booSound.play();
        	  }
        	}
        	else ghost[i].sprite.visible = false;

          }
          else
          {
        	ghost[i].sprite.visible = false;

        	if (!ghost[i].dead) ghost[i].sprite.alpha = 255;
          }

        }

        if (timeleft <= 0) gameOver = true;
        if (ghostsleft <= 0) nextLevel = true;

        if (gameOver) switchGameState('gameover');
        if (nextLevel) switchGameState('nextlevel');

        $('#overlayGhosts').html('x ' + ghostsleft);
      };
      
  return {
    width: _width,
  	height: _height,
  	displayOrientation: _displayOrientation,
  	resize: resize,
  	initialize: initialize,
  	updateHole: updateHole,
  	draw: draw,
  	update: update
  };
  
}();

// Achievement "Singleton": Revealing module pattern
Achievements = function()
{
	//Private object "array" stores all achievements
	var array = {},
		_localStorageKey,
	
	initialize = function(localStorageKey)
	{
		// Saves localStorage key internally
		_localStorageKey = localStorageKey;
	
		// Loads achievements from local storage if any
		if (Modernizr.localstorage)
			if ((typeof(localStorage[_localStorageKey]) != "undefined") && (localStorage[_localStorageKey] != null) && (localStorage[_localStorageKey] != "")) array = jQuery.parseJSON(localStorage[_localStorageKey]);
	},
	
	register = function(text, description, icon)
	{
		array[text] = { active: false };
		if (typeof(description) !== "undefined") array[text]["description"] = description;
		if (typeof(icon) !== "undefined") array[text]["icon"] = icon;
	},
	
	getCount = function()
	{
		var count = 0;
		for (var i in array) count++;
		return count;
	}
	
	getUnlockedCount = function()
	{
		var count = 0;
		for (var i in array)
		{
			if (array[i]["active"]) count++;
		}
		return count;
	}
	
	list = function()
	{
		// Locked achievements will be shown in a grey-ish color
		var result = "";
		for (var i in array)
		{
			if (array[i]["active"]) result += '<div class="ach_box unlocked"><span class="ach_unlocked">' + i + '</span><br /><span class="ach_details">' + array[i]["description"] + '</span></div><br /><br />';
			else result += '<div class="ach_box locked"><span class="ach_locked">' + i + '</span><br /><span class="ach_details">' + array[i]["description"] + '</span></div><br /><br />';
		}
		
		return result;
	}
	
	show = function(text)
	{
		// If someone forget to register an achievement
		if (array[text] === "undefined") register(text);
	
		if (!array[text]["active"])
		{
			if ((typeof(array[text].icon) != "undefined") && (array[text].icon != "")) $('#achievement_box').css("background-image", "url(" + array[text].icon + ")");
			
			
			$('#ach_text').html(text);
			$('#achievement_box').css({opacity: 0.0});
			
			$('#achievement_box').animate({opacity: 1.0, bottom: '8px'}, 750);
			
			setTimeout(function() 
			{ 
			  $('#achievement_box').animate({opacity: 0.0, bottom: '-80px'}, 750);
			}, 2500);
			
			array[text].active = true;
		}
		
		if (Modernizr.localstorage) localStorage[_localStorageKey] = JSON.stringify(array);
	};
	
	return {
		initialize: initialize,
		getCount: getCount,
		getUnlockedCount: getUnlockedCount,
		list: list,
		register: register,
		show: show
	};
}();



function animateGhosts()
{
  if (!highQuality) return;

  // Animation
  for (var i = 0; i < ghost.length; i++)
  {
    ghost[i].frame++;
    if (ghost[i].frame == 20)
    {
      ghost[i].frame = 0;
      if (ghost[i].frameRow == 1)
        ghost[i].frameRow = 0;
      else
        ghost[i].frameRow++;
    }

    ghost[i].sprite.clipRect.make(45 * ghost[i].frame, 45 * ghost[i].frameRow, 45, 45);
  }
}

function setQuality(isHighQuality)
{
  highQuality = isHighQuality;

  if (highQuality)
  {
    if ($('#content').hasClass('lowQuality')) $('#content').removeClass('lowQuality');
    if ($('#mouseover_box').hasClass('lowQuality')) $('#mouseover_box').removeClass('lowQuality');
    if ($('#achievement_box').hasClass('lowQuality')) $('#achievement_box').removeClass('lowQuality');
    if ($('.buttonQuality').hasClass('lowQuality')) $('.buttonQuality').removeClass('lowQuality');
    if ($('.overlay').hasClass('lowQuality')) $('.overlay').removeClass('lowQuality');
    if ($('span').hasClass('lowQuality')) $('span').removeClass('lowQuality');
    
    document.getElementById("btnLowQuality").style.backgroundColor = '#000';
    document.getElementById("btnHighQuality").style.backgroundColor = '#aaaa00';
  }
  else
  { 
    $('#content').addClass('lowQuality');
    $('#mouseover_box').addClass('lowQuality');
    $('#achievement_box').addClass('lowQuality');
    $('.buttonQuality').addClass('lowQuality');
    $('.overlay').addClass('lowQuality');
    $('span').addClass('lowQuality');
    
    document.getElementById("btnLowQuality").style.backgroundColor= '#aaaa00';
    document.getElementById("btnHighQuality").style.backgroundColor = '#000';
  }
  
  if (Modernizr.localStorage)
  	localStorage["GhostChaos.Config.HighQuality"] = highQuality;
}

function onBtnLowQualityOver()
{
  $('#mouseover_box').css('opacity', 1.0);
  $('#mouseover_text').html('Low Quality');

  if (!highQuality) document.getElementById("btnLowQuality").style.backgroundColor= '#888800';
  else
    document.getElementById("btnLowQuality").style.backgroundColor= '#444400';
}

function onBtnLowQualityOut()
{
  $('#mouseover_box').css('opacity', 0.0);
  
  if (highQuality)
    document.getElementById("btnLowQuality").style.backgroundColor= '#000';
  else
    document.getElementById("btnLowQuality").style.backgroundColor= '#aaaa00';
}

function onBtnHighQualityOver()
{
  $('#mouseover_box').css('opacity', 1.0);
  $('#mouseover_text').html('High Quality');

  if (highQuality) document.getElementById("btnHighQuality").style.backgroundColor= '#888800';
  else
    document.getElementById("btnHighQuality").style.backgroundColor= '#444400';
}

function onBtnHighQualityOut()
{
  $('#mouseover_box').css('opacity', 0.0);
  
  if (highQuality)
    document.getElementById("btnHighQuality").style.backgroundColor= '#aaaa00';
  else
    document.getElementById("btnHighQuality").style.backgroundColor= '#000';
}

function switchScale()
{
	contentScale =! contentScale;
	
	if (Modernizr.localstorage) localStorage["GhostChaos.Config.Scale"] = contentScale;
	
	updateScaleLabel();
	
	Game.resize();
}

function onBtnAchUp()
{
	$('#ach_list').scrollTop($('#ach_list').scrollTop() - 40);
}

function onBtnAchDown()
{
	$('#ach_list').scrollTop($('#ach_list').scrollTop() + 40);
}

function updateScaleLabel()
{
	if (contentScale) $('#btnScale').html('<a href="javascript:void(0)" onclick="switchScale()" style="font-size: 70%">Scale: On</a>');
	else 
	{
	  $('#btnScale').html('<a href="javascript:void(0)" onclick="switchScale()" style="font-size: 70%">Scale: Off</a>');
	  document.getElementById('content').style.webkitTransform = "scale(1.0)";
	}
}


function init()
{
  // Hack for hiding adress bar on iOS devices
  if (iOS) window.top.scrollTo(0, 1);
  
  $('#mouseover_box').css('opacity', 0.0);
  
  // Load achievements
  Achievements.register('Who you gonna call?', 'Master level 1 on an easy difficulty setting'); // Master level 1 (easy)
  Achievements.register('OMG! Double Ghost all the way!', 'Master level 1 on a normal difficulty setting'); // Master level 1 (normal)
  Achievements.register('Good Ghost Hunting', 'Master level 1 on a hard difficulty setting'); // Master level 1 (hard)
  Achievements.register('Those things are getting fast', 'Master level 7 on an easy difficulty setting'); // Master level 7 (easy)
  Achievements.register('I see dead... err... ghosts', 'Master level 7 on a normal difficulty setting'); // Master level 7 (normal)
  Achievements.register('Anyone got a better light?', 'Master level 7 on a hard difficulty setting'); // Master level 7 (hard)
  Achievements.register('Ghost Apocalypse', 'Master level 21 on an easy difficulty setting'); // Master level 21 (easy)
  Achievements.register('Getting the hang of this', 'Master level 21 on a normal difficulty setting'); // Master level 21 (normal)
  Achievements.register('Mission Impossible', 'Master level 21 on  a hard difficulty setting'); // Master level 21 (hard)
  Achievements.register('Someone made this game?', 'View credits screen'); // Clicking on 'Credits'
  
  Achievements.initialize("GhostChaos.Achievements");

  // Initialize objects here
  Game.initialize();
  
  switchGameState("loading");
  
  if (!bgMusic) 
  { 
    bgMusic = document.getElementById("music");  
  }
  
  if (bgMusic) 
  {
    bgMusic.addEventListener('ended', function(){ this.currentTime = 0 }, false);
    bgMusic.play();
    
  }
  
  
  if (!booSound)
  {
    booSound = document.getElementById("boo");
  }
 

  // Init sound

  // Initialize SoundManager2
  /*soundManager.url = ''; // directory where SM2 .SWFs live

  soundManager.useHTML5Audio = true;
  soundManager.useFlashBlock = false;

  soundManager.debugMode = false;

  soundManager.onready(function(oStatus) {
  // check if SM2 successfully loaded..
    if (oStatus.success)
    {
      // SM2 has loaded - now you can create and play sounds!
      var bgmusic = soundManager.createSound({
        id: 'music',
        url: 'sounds/music.mp3',
        loop: 'infinite'
      });

      bgmusic.play();

      booSound = soundManager.createSound({
        id: 'boo',
        url: 'sounds/boo.wav'
      });
    }
  });*/

  switchGameState("mainmenu");
}


if (window.addEventListener)       //< Also: Refresh values if windows has been resized
	window.addEventListener('resize', function (event) { Game.resize(); } , false);
else
{
	if (window.attachEvent)
		window.attachEvent('onresize', function (event) { Game.resize(); } );
}

if (mobile)
{
	body.onorientationchange = function()
    {
      Game.resize();
    }
}


function switchGameState(stateName)
{
  $('.gameState').hide();

  $('#'+stateName).show();
  
  if (stateName == 'credits') Achievements.show('Someone made this game?');

  if ((stateName == 'gameover') || (stateName == 'nextlevel') || (stateName == 'pauselevel'))
  {
    clearInterval(updateSetter);
    clearInterval(timeSetter);
    clearInterval(animateGhosts);

    if (stateName == 'nextlevel')
    {
      var dfcString = "";

      switch (difficulty)
      {
        case 0: 
        {
        	dfcString = "Easy"; 
        	
        	switch (maxGhost - 1)
        	{
        		case 1: Achievements.show('Who you gonna call?'); break;
        		case 7: Achievements.show('Those things are getting fast'); break;
        		case 21: Achievements.show('Ghost Apocalypse'); break;
        	}
        	
        	break;
        }
        case 1: 
        {
        	dfcString = "Normal"; 
        	
        	switch (maxGhost - 1)
        	{
        		case 1: Achievements.show('OMG! Double Ghost all the way!'); break;
        		case 7: Achievements.show('I see dead... err... ghosts'); break;
        		case 21: Achievements.show('Getting the hang of this'); break;
        	}
        	
        	break;
        }
        case 2: 
        {
        	dfcString = "Hard"; 
        	
        	switch (maxGhost - 1)
        	{
        		case 1: Achievements.show('Good Ghost Hunting'); break;
        		case 7: Achievements.show('Anyone got a better light?'); break;
        		case 21: Achievements.show('Mission Impossible'); break;
        	}
        	
        	break;
        }
      }

      $('#congratz').html('You mastered Level ' + (maxGhost - 1) + ' (' + dfcString + ').');
      
    }
  }
  
  if (stateName == 'achievements')
  {
    $('#ach_state').html("{0} / {1} Achievements unlocked".format(Achievements.getUnlockedCount(), Achievements.getCount()));
    
    $('#ach_list').html(Achievements.list());
  }
}

function resumeGame()
{
  switchGameState('game');
  timeSetter = setInterval(timeCount, 1000);
  updateSetter = setInterval(update, frameRate / 1000);
  animateSetter = setInterval(animateGhosts, 250);
}


function updateTimeOverlay()
{
  $('#overlayTime').html(function()
  {
    var minutes, seconds;

    if (Math.floor(timeleft / 60) < 10)
      minutes = "0" + trunc(timeleft / 60);
    else
      minutes = "" + trunc(timeleft / 60);

    if (Math.floor(timeleft % 60) < 10)
      seconds = "0" + trunc(timeleft % 60);
    else
      seconds = "" + trunc(timeleft % 60);

    return minutes + ":" + seconds;
  });
}

function timeCount()
{
  timeleft--;
  updateTimeOverlay();
}

function startGame(difficultyLevel, ghostMax)
{
  gameOver = false;
  nextLevel = false;

  difficulty = difficultyLevel;
  ghostsleft = ghostMax;
  maxGhost = ghostMax;

  var argument = (6 - (difficultyLevel * 1.25)) * ghostMax;
  timeleft = Math.round(Math.sqrt(argument) * Math.log(argument));
  updateTimeOverlay();

  switchGameState('game');

  Game.updateHole(difficulty);

  radius = 128 - (difficultyLevel * 32) - 23;


  for (var i = 0; i < ghost.length; i++)
    ghost[i].sprite.remove();

  ghost.splice(0, ghost.length);

  ghost[ghostMax - 1] = 0;

  for (var i = 0; i < ghost.length; i++)
  {
    ghost[i] = new objGhost();
    ghost[i].velocity.x = 0.1 * (difficultyLevel + 1) * (i + 1);
    ghost[i].velocity.y = 0.1 * (difficultyLevel + 1) * (i + 1);

    ghost[i].setRandomMovement();
  }

  timeSetter = setInterval(timeCount, 1000);
  updateSetter = setInterval(update, frameRate / 1000);
  animateSetter = setInterval(animateGhosts, 250);
}

function incStartGame()
{
  maxGhost++; //< Do not delete the second maxGhost++; for some reason it won't work w/o it (evil hack)
  var newValue = maxGhost++;
  startGame(difficulty, newValue);
}



function update()
{
  // Draw objects here
  Game.draw();
  Game.update();
}

