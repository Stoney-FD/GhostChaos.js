/**
 *
 *	SmokeMonster.js
 *
 *	What is SmokeMonster?
 *		SmokeMonster is John Locke, or is he?
 *		But seriously, SmokeMonster.js is a small graphics library based on DOM.
 *    This library depends on Modernizr, still using Modernizr is optional.   
 *
 *  Why SmokeMonster?
 *		Well, there had to be some kind of nemesis on the island, right?
 *		But seriously, we here at Freeze Development have been making video games
 *		for over two centuries and with our...
 *		But seriously seriously we are working on ElysionWeb, a HTML5 game framwork
 *		using Canvas, WebGL and SVG/VML with Raphael as its rendering backends.
 *		So want if you want to use the DOM to put together some small simple game
 *		you are doomed if you wanted to use ElysionWeb here. Well, "doomed" is such
 *    a strong word here. ;)
 *    
 *    This is what SmokeMonster was made for:
 *      It's a tiny web graphics library based on Document Object Model (DOM).
 *    
 *    You can make quick and simple Javascript games based on DOM. 
 *    But you should definitely give ElysionWeb a try once it's finished.
 * 
 *    
 *
 *  How is SmokeMonster?
 *  	Oh, you wanna see how it's done? Here ya go:
 *			You don't need to initialize anything, just begin creating your
 *			objects.
 *
 *
 *      var mySprite = new SmokeMonster.Sprite();
 *      mySprite.loadFromFile("freckles.png");
 *      mySprite.position.make(50, 50);
 *      mySprite.draw();
 * 
 *      This will draw a sprite called mySprite at x: 50 and y: 50. You can
 *		manipulate additional attributes, like rotation, scaling, opacity, etc.
 *		Take a look at this:
 *
 *		mySprite.alpha = 128;
 *		mySprite.angle = 22.5;
 *		mySprite.scale.x = 2.5;
 *
 *		Now our sprite is being drawn with at half opacity, rotated 22.5 degrees
 *		and its witdth scale at factor 2.5.
 *
 *
 *		var myContainer = new SmokeMonster.Container();
 *		myContainer.width = 50;
 *		myContainer.height = 50;
 *		myContainer.position.make(60, 60);
 *		myContainer.backgroundColor.make(255, 255, 0);
 *		myContainer.borderRadius.make(15, 15);
 *		myContainer.draw();
 *
 *		A container can be actually be everything you want it to be, for example
 *		a rect, a rounded rect (which it is in this example), or just an object
 *		for grouping child objects.
 *		The constructor takes width and height parameter, after that the position
 *		will be set to Left: 60 | Top: 60, with a yellow background color and
 *		a barder radius of 15 pixels.
 *		The draw() method needs to be called on every object to be displayed
 *		on the page.
 *
 *
 *		Grouping objects:
 *      The first parameter of an object can also take the parent object, in which
 *		case the new object will be the child object of the specified object.
 *		The child object position is then relative, the parent object's position
 *		is still absolute.
 *			If you want to get the absolute position of an object, use the
 *			the method getAbsolutePosition() which will return the position
 *			as elVector.
 *
 *		mySprite = new elSprite(myContainer);
 *      mySprite.position.make(40, 40);
 *
 *		mySprite will now be drawn at Left: 100 | Top: 100.
 *
 *
 *
 *  So, that were the basics, if you want to know more take a look at the
 *  examples and read the documentation.
 * 
 * 
 *  This whole SmokeMonster thing was made in just a few days. It hasn't been
 *  a constant development though, just a few hours every now and then.
 *
 *  There won't probably be much new features after this initial relase, as
 *  we will concentrate our efforts on ElysionWeb. There may be a bug fix release
 *  if users find some nasty bugs.
 * 
 * 
 *  License:
 *  Copyright (C) 2011 by Johannes Stein, Freeze Development (http://www.freeze-dev.com)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// SmokeMonster namepace - He is coming for you next (I really need to quit on the Lost references, right?)
if (typeof SmokeMonster == 'undefined') var SmokeMonster = {};

// You probably already know Modernizr is cool, we use Modernizr to test for CSS3 stuff
if (typeof Modernizr == 'undefined') var Modernizr = {};

var objectCount = 0,
	  IE = document.all ? true : false;

function createNewUniqueID(objectName)
{
	objectCount++;
	return objectName + "-" + ("00000" + objectCount).slice(-5);
}

// Format string, something we need quite often
String.prototype.format = function()
{
    var formatted = this;
    for (var i = 0; i < arguments.length; i++)
    {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

/**
 *
 * SmokeMonster General functions
 *
 */

SmokeMonster.add = function(parentObject, childObject)
{
    if (typeof parentObject == "string")
        document.getElementsByTagName(parentObject)[0].appendChild(childObject);
    else
        parentObject.appendChild(childObject);
}

SmokeMonster.remove = function(parentObject, childObject)
{
    if (typeof parentObject == "string")
        document.getElementsByTagName(parentObject)[0].removeChild(childObject);
    else
        parentObject.removeChild(childObject);
}


/**
 * 
 * SmokeMonster Types
 * 
 */

// Color
SmokeMonster.Color = function(r, g, b, a)
{
  // Private
  var fAlpha = 0;
  
  // Public
  
  // Constructor
  if ((typeof(r) !== "undefined") && 
    (typeof(g) === "undefined") && 
    (typeof(b) === "undefined")) // <-- Not really necessary, just so you know what I'm doing here
  {
    this.r = r;
    this.g = r;
    this.b = r;
    this.a = 1;
  }
  else
  {
    this.r = (typeof(r) === "undefined") ? 0 : r;
    this.g = (typeof(g) === "undefined") ? 0 : g;
    this.b = (typeof(b) === "undefined") ? 0 : b;
    this.a = (typeof(a) === "undefined") ? 1 : a;
  }
  
  // Returns Javascript Color Code
  this.get = function()
  {
    if ((a > 0) && (a < 1)) return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
    
    if ((a > 1) && (a < 255))
    {
      fAlpha = a / 255;
      return "rgba("+this.r+","+this.g+","+this.b+","+fAlpha+")";
    }
    else return "rgb("+this.r+","+this.g+","+this.b+")";
  }
  
  this.toString = function()
  {
    return this.get();  
  }
  
  this.toHex = function()
  {
    return "#{0}{1}{2}".format(this.r.toString(16), this.g.toString(16), this.b.toString(16));
  }

  this.make = function(newR, newG, newB, newA)
  {
    this.r = (typeof(newR) === "undefined") ? this.r : newR;
    this.g = (typeof(newG) === "undefined") ? this.g : newG;
    this.b = (typeof(newB) === "undefined") ? this.b : newB;
    this.a = (typeof(newA) === "undefined") ? this.a : newA;
  }
  
};

SmokeMonster.UnitType =
{
  stPixel: "px",
  stPercent: "%"
}

SmokeMonster.Vector = function(x, y, z)
{
  // Public
  this.type = SmokeMonster.UnitType.stPixel;
  
  // Constructor
  this.x = (typeof(x) === "undefined") ? 0.0 : x;
  this.y = (typeof(y) === "undefined") ? 0.0 : y;
  this.z = (typeof(z) === "undefined") ? 0.0 : z;

  
  // Vector to String
  this.toString = function()
  {
  	var retString = "";

    if (this.x != 0.0) retString = retString + "X: " + this.x + this.type + "; ";
    if (this.y != 0.0) retString = retString + "Y: " + this.y + this.type + "; ";
    if (this.z != 0.0) retString = retString + "Z: " + this.z + this.type + "; ";

    return retString;
  }
  
  this.multiply = function(multi)
  {
    this.x = this.x * multi;
    this.y = this.y * mulit;
    this.z = this.z * multi;
  }

  this.make = function(newX, newY, newZ)
  {
    this.x = (typeof(newX) === "undefined") ? this.x : newX;
    this.y = (typeof(newY) === "undefined") ? this.y : newY;
    this.z = (typeof(newZ) === "undefined") ? this.z : newZ;
  }
};

SmokeMonster.Rect = function(x, y, w, h)
{
   // Public
  
  // Constructor
  this.x = (typeof(x) === "undefined") ? 0 : x;
  this.y = (typeof(y) === "undefined") ? 0 : y;
  this.w = (typeof(w) === "undefined") ? 0 : w;
  this.h = (typeof(h) === "undefined") ? 0 : h;
  
  // Rect to String
  this.toString = function()
  {
    return "X: " + this.x + "; Y: " + this.y + "; W: " + this.w + "; H: " + this.h;
  }
  
  this.get = function()
  {
    return "rect(" + this.x + "px, " + this.y + "px, " + this.w + "px, " + this.h + "px)";
  }
  
  this.area = function()
  {
    return (2 * this.w + 2 * this.h); 
  }

  this.isEmpty = function()
  {
  	if ((this.x == 0) && (this.y == 0) && (this.w == 0) && (this.h == 0))
      return true;
    else
      return false;
  }
  
  this.isSameValue = function()
  {
    if ((this.x == this.y) && (this.y == this.w) && (this.w == this.h))
      return true;
    else
      return false;
  }

  this.make = function(newX, newY, newW, newH)
  {
    this.x = (typeof(newX) === "undefined") ? this.x : newX;
    this.y = (typeof(newY) === "undefined") ? this.y : newY;
    this.w = (typeof(newW) === "undefined") ? this.w : newW;
    this.h = (typeof(newH) === "undefined") ? this.h : newH;
  }
  
};

SmokeMonster.ShadowType =
{
  stDefault: "",
  stInset: "inset",
  stInner: "inner"
}

SmokeMonster.Shadow = function()
{
  this.color = new SmokeMonster.Color();
  this.position = new SmokeMonster.Vector(2, 2);
  this.blur = 0;
  this.spread = 0;
  this.type = SmokeMonster.ShadowType.stDefault;
  this.visible = false;
}

SmokeMonster.Border = function()
{
  this.width = 0;
  this.style = "solid";
  this.color = new SmokeMonster.Color();
  this.radius = new SmokeMonster.Rect();
}

// TODO: Change this to module pattern!
var _Screen = new function()
{
  this.width = 0;
  this.height = 0;

  this.refresh = function()
  {
    if ( typeof( window.innerWidth ) == 'number' )
    {
      //Non-IE
      if (this.width != window.innerWidth) { this.width = window.innerWidth; changed = true; }
      if (this.height != window.innerHeight) { this.height = window.innerHeight; changed = true; }
    }
    else if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
    {
      //IE 6+ in 'standards compliant mode'
      if (this.width != document.documentElement.clientWidth) { this.width = document.documentElement.clientWidth; changed = true; }
      if (this.height != document.documentElement.clientHeight) { this.height = document.documentElement.clientHeight; changed = true; }
    }
    else if (document.body && ( document.body.clientWidth || document.body.clientHeight ) )
    {
      //IE 4 compatible
      if (this.width != document.body.clientWidth) { this.width = document.body.clientWidth; changed = true; }
      if (this.height != document.body.clientHeight) { this.height = document.body.clientHeight; changed = true; }
    }

  }
  
};

SmokeMonster.Screen = _Screen;
_Screen.refresh(); //< Call _Screen.refresh to set width/height variable

if (window.addEventListener)       //< Also: Refresh values if windows has been resized
	window.addEventListener('resize', function (event) { _Screen.refresh(); } , false);
else
{
	if (window.attachEvent)
		window.attachEvent('onresize', function (event) { _Screen.refresh(); } );
}


SmokeMonster.Cursor = new SmokeMonster.Vector();

function updateCursor(event)
{
  /*if (IE)
  {
    SmokeMonster.Cursor.x = window.event.clientX + document.body.scrollLeft;
    SmokeMonster.Cursor.y = window.event.clientY + document.body.scrollTop;
  }
  else
  {
    SmokeMonster.Cursor.x = event.pageX;
    SmokeMonster.Cursor.y = event.pageY;
  }*/

  SmokeMonster.Cursor.x = event.pageX;
  SmokeMonster.Cursor.y = event.pageY;
}

if (!IE) document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = updateCursor;




SmokeMonster.Texture = function()
{
  // Public
  var loaded = false,
      error = false,
      _width = 0,
      _height = 0;
  
  this.img = new Image();
  this.img.onload = function()
  {
    loaded = true;
    error = false;
    
    _width = this.width;
    _height = this.height;
  }

  this.img.onerror = function()
  {
    loaded = false;
    error = true;
  }
  
  this.width = 0;
  this.height = 0;
  
  this.src = "";
  
  this.loadFromFile = function(aFilename)
  {
    this.src = aFilename;
    this.img.src = aFilename;
    
    _width = this.img.width;
    _height = this.img.height;
  }
  
  this.isLoaded = function()
  {
    // Bit of a dirty hack here, but it works
    if (this.width == 0) this.width = _width;
    if (this.height == 0) this.height = _height;
    
    return loaded;
  }
};

SmokeMonster.ObjectOffset = function()
{
  this.position = new SmokeMonster.Vector();
  this.transform = new SmokeMonster.Vector(50, 50);
  this.transform.type = SmokeMonster.UnitType.stPercent;
}

SmokeMonster.Container = function(parentNode)
{
  // Private
  var margin = new SmokeMonster.Vector(),
      styleText = "",
      transText = "",
      anim = new Array(),
	  hyperlink;

  // Public
  this.parent = null;
  this.width = 100;
  this.height = 75;
  
  if (typeof(parentNode) != "undefined")
  {
	if (typeof(parentNode) == "number")
	{
	  this.width = parentNode;
	  this.height = arg_w;
	}
	else
	{
	  this.parent = parentNode;
	  if (typeof(arg_w) == "number") this.width = arg_w;
	  if (typeof(arg_h) == "number") this.height = arg_h;
	}
  }

  this.id = createNewUniqueID("container");

  this.node = document.createElement("div");
  this.node.id = this.id;
  
  SmokeMonster.add('body', this.node);

  this.alpha = 255;
  this.angle = 0.0;
  this.backgroundColor = new SmokeMonster.Color(0, 0, 0, 0);
  this.border = new SmokeMonster.Border();
  this.cursor = "default";
  
  this.offset = new SmokeMonster.ObjectOffset();
  this.position = new SmokeMonster.Vector();
  this.scale = new SmokeMonster.Vector(1.0, 1.0);
  this.skew = new SmokeMonster.Vector(0.0, 0.0);
  this.shadow = new SmokeMonster.Shadow();

  this.sticky = false;

  this.href = "";
  
  
  this.extraParams = ""; //< Will be inserted at the end after all other css properties have been applied
  this.extraTransform = ""; //< Will be inserted in transform: computedProperties extraTransform ; ...

  this.visible = true;
    
  this.className = "";

// Events
  this.click = function(evtClick)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('click', evtClick, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onclick', evtClick);
	}
  }
  
  ///// Click-Event for hyperlinks
  this.click(function (event)
  {
    if (hyperlink != "")
	  location.href = hyperlink;
  });
  ////
  
  this.dblclick = function(evtDblClick)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('dblclick', evtDblClick, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('ondblclick', evtDblClick);
	}
  }
  
  this.mousedown = function(evtMouseDown)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mousedown', evtMouseDown, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmousedown', evtMouseDown);
	}
  }
  
  this.mousemove = function(evtMouseMove)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mousemove', evtClick, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmousemove', evtClick);
	}
  }
  
  this.mouseout = function(evtMouseOut)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mouseout', evtMouseOut, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmouseout', evtMouseOut);
	}
  }
  
  this.mouseover = function(evtMouseOver)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mouseover', evtMouseOver, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmouseover', evtMouseOver);
	}
  }
  
  this.mouseup = function(evtMouseUp)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mouseup', evtMouseUp, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmouseup', evtMouseUp);
	}
  }
  
  this.hover = function(evtMouseOver, evtMouseOut)
  {
	this.mouseover(evtMouseOver);
	this.mouseout(evtMouseOut);
  }
  
  this.unclick = function(evtClick)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('click', evtClick, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onclick', evtClick);
	}
  }
  
  this.undblclick = function(evtDblClick)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('dblclick', evtDblClick, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('ondblclick', evtDblClick);
	}
  }
  
  this.unmousedown = function(evtMouseDown)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mousedown', evtMouseDown, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmousedown', evtMouseDown);
	}
  }
  
  this.unmousemove = function(evtMouseMove)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mousemove', evtClick, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmousemove', evtClick);
	}
  }
  
  this.unmouseout = function(evtMouseOut)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mouseout', evtMouseOut, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmouseout', evtMouseOut);
	}
  }
  
  this.unmouseover = function(evtMouseOver)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mouseover', evtMouseOver, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmouseover', evtMouseOver);
	}
  }
  
  this.unmouseup = function(evtMouseUp)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mouseup', evtMouseUp, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmouseup', evtMouseUp);
	}
  }
  
  this.unhover = function(evtMouseOver, evtMouseOut)
  {
	this.unmouseover(evtMouseOver);
	this.unmouseout(evtMouseOut);
  }
  
  // Animator
  this.addAnimation = function(property, duration, effect, delay)
  {
    if (typeof(effect) == "undefined") effect = "linear";
    if (typeof(delay) == "undefined") delay = 0;

    var tprop = "";

    switch (property)
    {
      case "alpha": case "opacity": tprop = "opacity"; break;
      case "position.x": case "left": tprop = "left"; break;
      case "position.y": case "top": tprop = "top"; break;
      case "position.z": tprop = "z-index"; break;
      case "width": tprop = "width"; break;
      case "height": tprop = "height"; break;
      case "all": tprop = "all"; break;
      default: tprop = property; break;
    }

	for (var i = 0; i < this.getAnimCount(); i++)
	{
	  if (anim[i] == "{0} {1}ms {2} {3}ms".format(tprop, duration, effect, delay))
		return;
	}
	anim.push("{0} {1}ms {2} {3}ms".format(tprop, duration, effect, delay));
  }
  
  this.removeAnimation = function(property, duration, effect, delay)
  {
	for (var i = 0; i < this.getAnimCount(); i++)
	{
	  if (anim[i] == "{0} {1}ms {2} {3}ms".format(tprop, duration, effect, delay))
	  {
		anim.splice(i, 1);
		return;
	  }
	}
  }

  this.getAnimCount = function()
  {
	return anim.length;
  }
  
  this.resetAnimation = function()
  {
  	anim.splice(0, this.getAnimCount());
  }

  this.getAbsolutePosition = function()
  {
  	if (this.parent == null)
      return this.position;
    else
  	  return new SmokeMonster.Vector(this.position.x + parent.getAbsolutePosition().x, this.position.y + parent.getAbsolutePosition().y, this.position.z + parent.getAbsolutePosition().z);
  }
    
  this.draw = function()
  {
    // Reset style to reapply style
    if (styleText != "") styleText = "";
    if (transText != "") transText = "";


    if (!this.visible) styleText += "display:none;";
	
	if (this.href != "") 
	{
	  this.cursor = "pointer";
	  hyperlink = this.href;
	}
	if (this.cursor != "default") styleText += "cursor: " + this.cursor + ";";
	
	if (this.backgroundColor.a != 0)
	{
	  if (this.backgroundColor.a == 255)
	    styleText += "background: {0} url({1});".format(this.backgroundColor.toHex(), this.texture.src);
	  else
	    {
	      if (Modernizr.rgba)
          styleText += "background: {0} url({1});".format(this.backgroundColor.get(), this.texture.src);
        else
          styleText += "background: {0} url({1});".format(this.backgroundColor.toHex(), this.texture.src);
      }
	}

    if ((Modernizr.opacity) && (this.alpha != 255))
      styleText += "filter:alpha(opacity={0}); -moz-opacity:{1}; -khtml-opacity:{1}; opacity:{1}; ".format(this.alpha, this.alpha / 255);
	  
    if ((this.position.x != 0) || (this.position.y != 0))
    {
      if (this.sticky)
      	styleText += "position:fixed;";
      else
      	styleText += "position:absolute;";

      if (this.position.x != 0)
      {
        switch (this.position.type)
        {
          case "px":
          {
            if (this.offset.position.x != 0)
            {
              switch (this.offset.position.type)
              {
                case "px":
              	  margin.x = this.offset.position.x; break;
                case "%":
                  margin.x = (this.offset.position.x / 100) * (this.width * this.scale.x); break;
              }
            }

            break;
          }
          case "%":
          {
            if (this.offset.position.x != 0)
            {
              switch (this.offset.position.type)
              {
                case "px":
              	  margin.x = (this.offset.position.x / _Screen.width) * 100; break;
                case "%":
                  margin.x = (((this.offset.position.x / 100) * this.width) / _Screen.width) * 100; break;
              }
            }

            break;
          }
        }

        var posx = (margin.x != 0) ? (this.position.x - margin.x) : this.position.x;
        styleText += "left: {0}{1};".format(posx, this.position.type);
      }
      if (this.position.y != 0)
      {
        switch (this.position.type)
        {
          case "px":
          {
            if (this.offset.position.y != 0)
            {
              switch (this.offset.position.type)
              {
                case "px":
              	  margin.y = this.offset.position.y; break;
                case "%":
                  margin.y = (this.offset.position.y / 100) * (this.height * this.scale.y); break;
              }
            }

            break;
          }
          case "%":
          {
            if (this.offset.position.y != 0)
            {
              switch (this.offset.position.type)
              {
                case "px":
              	  margin.y = (this.offset.position.y / _Screen.height) * 100; break;
                case "%":
                  margin.y = (((this.offset.position.y / 100) * this.height) / _Screen.height) * 100; break;
              }
            }

            break;
          }
        }

        var posy = (margin.y != 0) ? (this.position.y - margin.y) : this.position.y;
        styleText += "top: {0}{1};".format(posy, this.position.type);
      }
    }

    if (this.position.z != 0)
      	styleText += "z-index:{0};".format(this.position.z);
	
	if ((Modernizr.boxshadow) && (this.shadow.visible))
      styleText += "-moz-box-shadow: {0} {1}{2} {3}{2} {4}{2} {5}{2} {6}; -webkit-box-shadow: {0} {1}{2} {3}{2} {4}{2} {5}{2} {6}; box-shadow: {0} {1}{2} {3}{2} {4}{2} {5}{2} {6};".format(this.shadow.type, this.shadow.position.x, this.shadow.position.type, this.shadow.position.y, this.shadow.blur, this.shadow.spread, this.shadow.color.toHex());

	if (this.border.width != 0)
	  styleText += "border:{0}px {1} {2};".format(this.border.width, this.border.style, this.border.color.toHex());
	  	  

    if ((Modernizr.borderradius) && (!this.border.radius.isEmpty()))
	{
	  if (this.border.radius.isSameValue())
	    styleText += "border-radius: {0}{1}; -webkit-border-radius: {0}{1}; -moz-border-radius: {0}{1};".format(this.border.radius.x, "px");
	  else
	    styleText += "border-radius: {0}{1} {2}{1} {3}{1} {4}{1}; -webkit-border-radius: {0}{1} {2}{1} {3}{1} {4}{1}; -moz-border-radius: {0}{1} {2}{1} {3}{1} {4}{1};".format(this.border.radius.x, "px", this.border.radius.y, this.border.radius.w, this.border.radius.h);
	}


    // Transform properties
    // Those are being handled differently, they need to be in this form: transfrom: property1 property2 property3 etc.

    if (Modernizr.csstransforms)
    {
      if ((this.angle / 360) != 0)
      transText += "rotate({0}deg)".format(this.angle);

    	switch (this.offset.transform.type)
    	{
    	  case "%": styleText += "-moz-transform-origin: {0}{1} {2}{1}; -webkit-transform-origin: {0}{1} {2}{1}; -o-transform-origin: {0}{1} {2}{1}; -ms-transform-origin: {0}{1} {2}{1}; -transform-origin: {0}{1} {2}{1};".format((this.offset.transform.x / 100) * this.width, "px", (this.offset.transform.y / 100) * this.height); break;
    	  default: styleText += "-moz-transform-origin: {0}{1} {2}{1}; -webkit-transform-origin: {0}{1} {2}{1}; -o-transform-origin: {0}{1} {2}{1}; -ms-transform-origin: {0}{1} {2}{1}; -transform-origin: {0}{1} {2}{1};".format(this.offset.transform.x, this.offset.transform.type, this.offset.transform.y); break;
    	}

      if (this.skew.x != 0) transText += " skewX({0}deg)".format(this.skew.x);
      if (this.skew.y != 0) transText += " skewY({0}deg)".format(this.skew.y);

      if ((this.scale.x != 0.0) && (this.scale.x != 1.0)) transText += " scaleX({0})".format(this.scale.x);
      if ((this.scale.y != 0.0) && (this.scale.y != 1.0)) transText += " scaleY({0})".format(this.scale.x);

      if ((transText != "") || (this.extraTransform != ""))
      	styleText += "-moz-transform: {0} {1}; -webkit-transform: {0} {1}; -o-transform: {0} {1}; -ms-transform: {0} {1}; transform: {0} {1};".format(transText, this.extraTransform);
    }

    // Set width & height
    styleText += "min-width: {0}px; min-height: {1}px; max-width: {0}px; max-height: {1}px; width: {0}px; height: {1}px;".format(this.width + this.border.width, this.height + this.border.width);

      // Add animation if any
    if ((Modernizr.csstransitions) && (this.getAnimCount() > 0))
      styleText += "transition: {0} -webkit-transition: {0} -moz-transition: {0} -o-transition: {0} -ms-transition: {0}".format(anim.join(",") + ";");

    // Add class name if any
    if (this.className != "") this.node.className = this.className;

    // Add extra parameters without checking if they are valid, that's how we roll :D
    if (this.extraParams != "") styleText += this.extraParams;

	
    // Apply style sheet to node
    this.node.style.cssText = styleText;
  }
}

SmokeMonster.Sprite = function(parentNode)
{
  // Private
  var margin = new SmokeMonster.Vector(),
      styleText = "",
      transText = "",
      anim = new Array(),
	  hyperlink = null;

  // Public

  this.id = createNewUniqueID("sprite");

  this.node = document.createElement("div");
  this.node.id = this.id;

  this.parent = parentNode;

  (typeof(parentNode) == "undefined") ? SmokeMonster.add('body', this.node) : SmokeMonster.add(parentNode, this.node);


  this.alpha = 255;
  this.angle = 0.0;
  this.backgroundColor = new SmokeMonster.Color(0, 0, 0, 0);
  this.border = new SmokeMonster.Border();
  this.clipRect = new SmokeMonster.Rect();
  this.cursor = "default";
  
  this.offset = new SmokeMonster.ObjectOffset();
  this.position = new SmokeMonster.Vector();
  this.scale = new SmokeMonster.Vector(1.0, 1.0);
  this.scaleClipRect = false;
  this.skew = new SmokeMonster.Vector(0.0, 0.0);
  this.shadow = new SmokeMonster.Shadow();
  this.texture = new SmokeMonster.Texture();

  this.sticky = false;

  this.href = "";
  
  
  this.extraParams = ""; //< Will be inserted at the end after all other css properties have been applied
  this.extraTransform = ""; //< Will be inserted in transform: computedProperties extraTransform ; ...

  this.width;
  this.height;

  this.visible = true;
  
  
  this.className = "";

  
  this.loadFromFile = function(aFilename, aClipRect)
  {
    this.texture.loadFromFile(aFilename);

    this.width = this.texture.width;
    this.height = this.texture.height;

    if (typeof aClipRect != "undefined")
    	this.clipRect = aClipRect;
  }
  
  this.loadFromTexture = function(aTexture, aClipRect)
  {
    this.texture = aTexture;

    this.width = aTexture.width;
    this.height = aTexture.height;

    if (typeof aClipRect != "undefined")
    	this.clipRect = aClipRect;
  }

  // Events
  this.click = function(evtClick)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('click', evtClick, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onclick', evtClick);
	}
  }
  
  ///// Click-Event for hyperlinks
  this.click(function (event)
  {
    if ((hyperlink == "") || (hyperlink == null)) return;

	location.href = hyperlink;
  });
  ////
  
  this.dblclick = function(evtDblClick)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('dblclick', evtDblClick, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('ondblclick', evtDblClick);
	}
  }
  
  this.mousedown = function(evtMouseDown)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mousedown', evtMouseDown, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmousedown', evtMouseDown);
	}
  }
  
  this.mousemove = function(evtMouseMove)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mousemove', evtClick, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmousemove', evtClick);
	}
  }
  
  this.mouseout = function(evtMouseOut)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mouseout', evtMouseOut, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmouseout', evtMouseOut);
	}
  }
  
  this.mouseover = function(evtMouseOver)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mouseover', evtMouseOver, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmouseover', evtMouseOver);
	}
  }
  
  this.mouseup = function(evtMouseUp)
  {
	if (this.node.addEventListener)
		this.node.addEventListener('mouseup', evtMouseUp, false);
	else
	{
		if (this.node.attachEvent)
			this.node.attachEvent('onmouseup', evtMouseUp);
	}
  }
  
  this.hover = function(evtMouseOver, evtMouseOut)
  {
	this.mouseover(evtMouseOver);
	this.mouseout(evtMouseOut);
  }
  
  this.unclick = function(evtClick)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('click', evtClick, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onclick', evtClick);
	}
  }
  
  this.undblclick = function(evtDblClick)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('dblclick', evtDblClick, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('ondblclick', evtDblClick);
	}
  }
  
  this.unmousedown = function(evtMouseDown)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mousedown', evtMouseDown, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmousedown', evtMouseDown);
	}
  }
  
  this.unmousemove = function(evtMouseMove)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mousemove', evtClick, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmousemove', evtClick);
	}
  }
  
  this.unmouseout = function(evtMouseOut)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mouseout', evtMouseOut, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmouseout', evtMouseOut);
	}
  }
  
  this.unmouseover = function(evtMouseOver)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mouseover', evtMouseOver, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmouseover', evtMouseOver);
	}
  }
  
  this.unmouseup = function(evtMouseUp)
  {
	if (this.node.removeEventListener)
		this.node.removeEventListener('mouseup', evtMouseUp, false);
	else
	{
		if (this.node.detachEvent)
			this.node.detachEvent('onmouseup', evtMouseUp);
	}
  }
  
  this.unhover = function(evtMouseOver, evtMouseOut)
  {
	this.unmouseover(evtMouseOver);
	this.unmouseout(evtMouseOut);
  }
  
  // Animator
  this.addAnimation = function(property, duration, effect, delay)
  {
    if (typeof(effect) == "undefined") effect = "linear";
    if (typeof(delay) == "undefined") delay = 0;

    var tprop = "";

    switch (property)
    {
      case "alpha": case "opacity": tprop = "opacity"; break;
      case "position.x": case "left": tprop = "left"; break;
      case "position.y": case "top": tprop = "top"; break;
      case "position.z": tprop = "z-index"; break;
      case "width": tprop = "width"; break;
      case "height": tprop = "height"; break;
      case "all": tprop = "all"; break;
      default: tprop = property; break;
    }

	for (var i = 0; i < this.getAnimCount(); i++)
	{
	  if (anim[i] == "{0} {1}ms {2} {3}ms".format(tprop, duration, effect, delay))
		return;
	}
	anim.push("{0} {1}ms {2} {3}ms".format(tprop, duration, effect, delay));
  }
  
  this.removeAnimation = function(property, duration, effect, delay)
  {
	for (var i = 0; i < this.getAnimCount(); i++)
	{
	  if (anim[i] == "{0} {1}ms {2} {3}ms".format(tprop, duration, effect, delay))
	  {
		anim.splice(i, 1);
		return;
	  }
	}
  }

  this.getAnimCount = function()
  {
	return anim.length;
  }
  
  this.resetAnimation = function()
  {
  	anim.splice(0, this.getAnimCount());
  }

  this.getAbsolutePosition = function()
  {
  	if (this.parent == null)
      return this.position;
    else
  	  return new SmokeMonster.Vector(this.position.x + parent.getAbsolutePosition().x, this.position.y + parent.getAbsolutePosition().y, this.position.z + parent.getAbsolutePosition().z);
  }

  this.remove = function()
  {
    if (typeof(parentNode) == "string")
      SmokeMonster.remove(parentNode, this.node);
    else
    {
      if (parentNode == "undefined")
        SmokeMonster.remove('body', this.node);
      else
        SmokeMonster.remove(parentNode, this.node);
    }
  }

  this.draw = function()
  {
    if (!this.texture.isLoaded()) return;
	
	  this.width = (this.clipRect.w != 0) ? this.clipRect.w : this.texture.width;
	  this.height = (this.clipRect.h != 0) ? this.clipRect.h : this.texture.height;

    // Reset style to reapply style
    if (styleText != "") styleText = "";
    if (transText != "") transText = "";


    if (!this.visible) styleText += "display:none;";
	
  	if (this.href != "") 
  	{
  	  this.cursor = "pointer";
  	  hyperlink = this.href;
  	}
  	
  	if (this.cursor != "default") styleText += "cursor: " + this.cursor + ";";
  	
  	if (this.backgroundColor.a != 0)
  	{
  	  if (this.backgroundColor.a == 255)
  	    styleText += "background: {0} url({1});".format(this.backgroundColor.toHex(), this.texture.src);
  	  else
	    {
	      if (Modernizr.rgba)
	        styleText += "background: {0} url({1});".format(this.backgroundColor.get(), this.texture.src);
	      else
	        styleText += "background: {0} url({1});".format(this.backgroundColor.toHex(), this.texture.src);
	    }
  	}
  	else
  	  styleText += "background: url({0});".format(this.texture.src);

    styleText += "background-repeat:no-repeat;";

    if ((Modernizr.opacity) && (this.alpha != 255))
      styleText += "filter:alpha(opacity={0}); -moz-opacity:{1}; -khtml-opacity:{1}; opacity:{1}; ".format((this.alpha / 255) * 100, this.alpha / 255);
  	  
    if ((this.position.x != 0) || (this.position.y != 0) || (this.offset.position.x != 0) || (this.offset.position.y != 0))
    {
      if (this.sticky)
      	styleText += "position:fixed;";
      else
      	styleText += "position:absolute;";

      if (this.position.x != 0)
      {
        switch (this.position.type)
        {
          case "px":
          {
            if (this.offset.position.x != 0)
            {
              switch (this.offset.position.type)
              {
                case "px":
              	  margin.x = this.offset.position.x; break;
                case "%":
                  margin.x = (this.offset.position.x / 100) * (this.width * this.scale.x); break;
              }
            }

            break;
          }
          case "%":
          {
            if (this.offset.position.x != 0)
            {
              switch (this.offset.position.type)
              {
                case "px":
              	  margin.x = (this.offset.position.x / _Screen.width) * 100; break;
                case "%":
                  margin.x = (((this.offset.position.x / 100) * this.width) / _Screen.width) * 100; break;
              }
            }

            break;
          }
        }

        var posx = (margin.x != 0) ? (this.position.x - margin.x) : this.position.x;
        styleText += "left: {0}{1};".format(posx, this.position.type);
      }
      if (this.position.y != 0)
      {
        switch (this.position.type)
        {
          case "px":
          {
            if (this.offset.position.y != 0)
            {
              switch (this.offset.position.type)
              {
                case "px":
              	  margin.y = this.offset.position.y; break;
                case "%":
                  margin.y = (this.offset.position.y / 100) * (this.height * this.scale.y); break;
              }
            }

            break;
          }
          case "%":
          {
            if (this.offset.position.y != 0)
            {
              switch (this.offset.position.type)
              {
                case "px":
              	  margin.y = (this.offset.position.y / _Screen.height) * 100; break;
                case "%":
                  margin.y = (((this.offset.position.y / 100) * this.height) / _Screen.height) * 100; break;
              }
            }

            break;
          }
        }

        var posy = (margin.y != 0) ? (this.position.y - margin.y) : this.position.y;
        styleText += "top: {0}{1};".format(posy, this.position.type);
      }
    }

    if (this.position.z != 0)
      	styleText += "z-index:{0};".format(this.position.z);
    if (!this.clipRect.isEmpty())
    {
    	if (this.scaleClipRect)
        {
            if ((this.clipRect.x != 0) || (this.clipRect.y != 0)) styleText += "background-position: {0}px {1}px;".format(-(this.clipRect.x * this.scale.x), -(this.clipRect.y * this.scale.y));
        	styleText += "clip:rect({0}px {1}px {2}px {3}px); ".format(0, (this.clipRect.w + this.clipRect.x) * this.scale.x, (this.clipRect.h + this.clipRect.y) * this.scale.y, 0);
        }
        else
        {
            if ((this.clipRect.x != 0) || (this.clipRect.y != 0)) styleText += "background-position: {0}px {1}px;".format(-this.clipRect.x, -this.clipRect.y);
    		styleText += "clip:rect({0}px {1}px {2}px {3}px); ".format(0, (this.clipRect.w + this.clipRect.x), (this.clipRect.h + this.clipRect.y), 0);
        }
    }
	
	if ((Modernizr.boxshadow) && (this.shadow.visible))
      styleText += "-moz-box-shadow: {0} {1}{2} {3}{2} {4}{2} {5}{2} {6}; -webkit-box-shadow: {0} {1}{2} {3}{2} {4}{2} {5}{2} {6}; box-shadow: {0} {1}{2} {3}{2} {4}{2} {5}{2} {6};".format(this.shadow.type, this.shadow.position.x, this.shadow.position.type, this.shadow.position.y, this.shadow.blur, this.shadow.spread, this.shadow.color.toHex());

	if (this.border.width != 0)
	  styleText += "border:{0}px {1} {2};".format(this.border.width, this.border.style, this.border.color.toHex());
	  	  
	if ((Modernizr.borderradius) && (!this.border.radius.isEmpty()))
	{
	  if (this.border.radius.isSameValue())
	    styleText += "border-radius: {0}{1}; -webkit-border-radius: {0}{1}; -moz-border-radius: {0}{1};".format(this.border.radius.x, "px");
	  else
	    styleText += "border-radius: {0}{1} {2}{1} {3}{1} {4}{1}; -webkit-border-radius: {0}{1} {2}{1} {3}{1} {4}{1}; -moz-border-radius: {0}{1} {2}{1} {3}{1} {4}{1};".format(this.border.radius.x, "px", this.border.radius.y, this.border.radius.w, this.border.radius.h);
	} 


    // Transform properties
    // Those are being handled differently, they need to be in this form: transfrom: property1 property2 property3 etc.

    if (Modernizr.csstransforms)
    {
      if ((this.angle / 360) != 0)
      transText += "rotate({0}deg)".format(this.angle);
	
    	switch (this.offset.transform.type)
    	{
    	  case "%": styleText += "-moz-transform-origin: {0}{1} {2}{1}; -webkit-transform-origin: {0}{1} {2}{1}; -o-transform-origin: {0}{1} {2}{1}; -ms-transform-origin: {0}{1} {2}{1}; -transform-origin: {0}{1} {2}{1};".format((this.offset.transform.x / 100) * this.width, "px", (this.offset.transform.y / 100) * this.height); break;
    	  default: styleText += "-moz-transform-origin: {0}{1} {2}{1}; -webkit-transform-origin: {0}{1} {2}{1}; -o-transform-origin: {0}{1} {2}{1}; -ms-transform-origin: {0}{1} {2}{1}; -transform-origin: {0}{1} {2}{1};".format(this.offset.transform.x, this.offset.transform.type, this.offset.transform.y); break;
    	}
  
      if (this.skew.x != 0) transText += " skewX({0}deg)".format(this.skew.x);
      if (this.skew.y != 0) transText += " skewY({0}deg)".format(this.skew.y);
  
      if ((this.scale.x != 0.0) && (this.scale.x != 1.0)) transText += " scaleX({0})".format(this.scale.x);
      if ((this.scale.y != 0.0) && (this.scale.y != 1.0)) transText += " scaleY({0})".format(this.scale.x);
  
      if ((transText != "") || (this.extraTransform != ""))
      	styleText += "-moz-transform: {0} {1}; -webkit-transform: {0} {1}; -o-transform: {0} {1}; -ms-transform: {0} {1}; transform: {0} {1};".format(transText, this.extraTransform);
    }
    
    // Set width & height
    styleText += "min-width: {0}px; min-height: {1}px; max-width: {0}px; max-height: {1}px; width: {0}px; height: {1}px;".format(this.width + this.border.width, this.height + this.border.width);
      
      // Add animation if any
    if ((Modernizr.csstransitions) && (this.getAnimCount() > 0))
      styleText += "transition: {0} -webkit-transition: {0} -moz-transition: {0} -o-transition: {0} -ms-transition: {0}".format(anim.join(",") + ";");

    // Add class name if any
    if (this.className != "") this.node.className = this.className;

    // Add extra parameters without checking if they are valid, that's how we roll :D
    if (this.extraParams != "") styleText += this.extraParams;

	
    // Apply style sheet to node
    this.node.style.cssText = styleText;
  }
};

SmokeMonster.Label = function(parentNode)
{
  // Private
  var styleText = "";

  // Public
  this.parent = (typeof(parentNode) == "undefined") ? null : parentNode;

  this.node = document.createElement('div');
  this.color = new SmokeMonster.Color();
  this.caption = "";
  this.visible = true;
  
  this.draw = function()
  {
    
  }
};


SmokeMonster.Button = function(parentNode)
{
  this.container = new SmokeMonster.Container();
  this.label = new SmokeMonster.Label();
  
  this.parent = null;
  (typeof(parentNode) == "undefined") ? null : parentNode;


  
  this.node = document.createElement('div');
  
  
  this.draw = function()
  {
    
  }
};

SmokeMonster.ImageButton = function(parentNode)
{
  
  
}
