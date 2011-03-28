// http://www.naden.de/blog/zufallszahlen-in-javascript-mit-mathrandom
function getRandom(min,max )
{
  if( min > max )
    return ( -1 );

  if( min == max )
    return ( min );

  return ( min + parseInt( Math.random() * ( max-min+1 ) ) );
}

// http://jsperf.com/javascript-trunc
function trunc(number)
{
  return (number | 0);
}

// Global variables
var iOS = false,
	iPad = false,
    iPhone = false,
    iPod = false,
    mobile = false,
	difficulty = 0,
    frameRate = 60,
    canvasPosX = 0,
    canvasPosY = 0,
    ghost = new Array(),
    timeleft = 0,
    ghostsleft = 0,
    maxGhosts = 0,
    radius = 0,
    gameOver = false,
    nextLevel = false,
    timeSetter,
    updateSetter,
    animateSetter,
    booSound;

if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i))
{
  mobile = true;

  if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))
  {
    if (navigator.userAgent.match(/iPhone/i)) iPhone = true;
    if (navigator.userAgent.match(/iPod/i)) iPod = true;
    if (navigator.userAgent.match(/iPad/i))
    {
      iPad = true;
      document.getElementById("view").setAttribute('content','width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;');
    }

    iOS = true;
  }
}

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
}

var Game = new function()
{
  this.hole; //< This hole... ... ... I'm not gonna spell that out for ya...

  var _posx = 0,
      _posy = 0,
      _width = 460,
      _height = 320,
      _initialize = function()
      {
        this.hole = new SmokeMonster.Sprite(document.getElementById('game'));
        this.hole.loadFromFile("img/holes.png");
        this.hole.alpha = 192;

        this.hole.offset.position.x = 128;
        this.hole.offset.position.y = 128;


        _posx = ($('#game').width() - this.hole.width) / 2;
        _posy = ($('#game').height() - this.hole.height) / 2;
        this.hole.position.z = 3;

        $('#mouserect').mousemove(function()
        {
          _posx = (SmokeMonster.Cursor.x - canvasPosX);
          _posy = (SmokeMonster.Cursor.y - canvasPosY);
        });

        $('body').mousemove(function()
        {
          _posx = (SmokeMonster.Cursor.x - canvasPosX);
          _posy = (SmokeMonster.Cursor.y - canvasPosY);
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
        }


        $('#overlayPause').click(function()
        {
          switchGameState('pauselevel');
        });


      },
      _draw = function()
      {
        for (var i = 0; i < ghost.length; i++)
          ghost[i].sprite.draw();

        this.hole.position.x = _posx;
        this.hole.position.y = _posy;

        $('div#left.blackrect').width(_posx - 128);

        $('div#right.blackrect').css('left', _posx + 128);
        $('div#right.blackrect').width(_width - _posx - 127);

        $('div#top.blackrect').css('left', _posx - 128);
        $('div#top.blackrect').height(_posy - 128);

        $('div#bottom.blackrect').css('left', _posx - 128);
        $('div#bottom.blackrect').css('top', _posy + 128);
        $('div#bottom.blackrect').height(_height - _posy - 127);

        this.hole.draw();
      },
      _update = function()
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

                booSound.play();
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

        if (_posx <= 128) $('div#left.blackrect').hide();
          else $('div#left.blackrect').show();

        if (_posy <= 128) $('div#top.blackrect').hide();
          else $('div#top.blackrect').show();

        if (_posx >= (480 - 128)) $('div#right.blackrect').hide();
          else $('div#right.blackrect').show();

        if (_posy >= (360 - 128)) $('div#bottom.blackrect').hide();
          else $('div#bottom.blackrect').show();
      }



  this.initialize = _initialize;
  this.draw = _draw;
  this.update = _update;

  this.width = _width;
  this.height = _height;
}

function animateGhosts()
{
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


function setCanvasPos()
{
  canvasPosX = ($(document).width() - $('#content').width()) / 2;
  canvasPosY = ($(document).height() - $('#content').height()) / 2;

  $('#content').css('left', canvasPosX);
  $('#content').css('top', canvasPosY);
}

function init()
{
  switchGameState("loading");

  // Hack for hiding adress bar on iOS devices
  if (iOS) window.top.scrollTo(0, 1);


  // Init sound

  // Initialize SoundManager2
  soundManager.url = ''; // directory where SM2 .SWFs live

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
        // onload: [ event handler function object ],
        // other options here..
      });

      bgmusic.play();

      booSound = soundManager.createSound({
        id: 'boo',
        url: 'sounds/boo.wav'
      });
    }
  });

  setCanvasPos();

  // Initialize objects here
  Game.initialize();

  switchGameState("mainmenu");
}


if (window.addEventListener)       //< Also: Refresh values if windows has been resized
	window.addEventListener('resize', function (event) { setCanvasPos(); } , false);
else
{
	if (window.attachEvent)
		window.attachEvent('onresize', function (event) { setCanvasPos(); } );
}



function switchGameState(stateName)
{
  $('.gameState').hide();

  $('#'+stateName).show();


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
        case 0: dfcString = "Easy"; break;
        case 1: dfcString = "Normal"; break;
        case 2: dfcString = "Hard"; break;
      }

      $('#congratz').html('You mastered Level ' + (maxGhost - 1) + ' (' + dfcString + ').');
    }
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


  Game.hole.clipRect.make(256 * difficulty, 0, 256, 256);

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

