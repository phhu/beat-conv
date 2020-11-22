/*import p5 from 'p5';
global.p5= p5;
import "p5/lib/addons/p5.sound";
//import 'p5/lib/addons/p5.dom';
*/

// https://p5js.org/reference/#/libraries/p5.sound

global.bass = undefined;
global.snare = undefined;
global.hhOpen = undefined;
global.hhClosed = undefined;

const sketchFunction = function(p) {
  window.p = p;
  let x = 100;
  let y = 100;
  //let bass,snare;
  p.preload = function() {
    bass = p.loadSound('sounds/Bass-Drum-1.wav');
    snare = p.loadSound('sounds/Ensoniq-ESQ-1-Snare-2.wav');
    hhOpen = p.loadSound('sounds/_808-OpenHiHats05.mp3');
    hhClosed = p.loadSound('sounds/_808-closed-hi-hat-9.mp3');
    global.keyToSound = {
      "32": bass,
      "z": bass,
      "13": snare,
      "90": snare,   //90=zz
      [p.SHIFT]: hhOpen,
      "191": hhClosed,    // / ?
    };
  }
  p.setup = function() {
    p.userStartAudio();
    if (p.getAudioContext().state !== 'running') {
      p.getAudioContext().resume();
    }
    p.createCanvas(700, 410);
    //bass.play(1);
    //  setTimeout(()=>snare.play(1),1000);
    function onEachStep(time, playbackRate) {
      bass.rate(playbackRate);
      bass.play(time);
    }
    
    const phrase = (part, pattern) => new p5.Phrase(part, (time,rate)=>{
      global[part].rate(rate); 
      global[part].play(time);
    }, pattern.split('').map(x=>parseInt(x))
    );

    //let bassPhrase =  makePhrase('bass', [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0] );   
    //let snarePhrase = makePhrase('snare',[0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1] );
    global.beat = new p5.Part();
    beat.addPhrase( phrase('bass', "1000100010001000" ) );
    beat.addPhrase( phrase('snare',"0010000100100001" ) );
    beat.setBPM(60);
    //beat.start();
    global.score = new p5.Score();
    score.parts.push(beat);  //score.parts.push(beat);score.parts.push(beat);
    score.setBPM(60);
    //score.loop(true);
    //score.start();
  };

  p.draw = function() {   
    p.background(0);
    // zp.fill(255);
    //p.rect(x, y, p.mouseX, p.mouseY);
  };

  p.keyPressed = function() {
    console.log("keyCode:",p.keyCode,keyToSound[  p.keyCode] );
    if (keyToSound[p.keyCode]){
      keyToSound[  p.keyCode].play();
      return false;
    }
    return true;
  };
};

const sketch = new p5(sketchFunction)