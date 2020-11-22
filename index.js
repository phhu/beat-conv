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
      "32": "bass",
      "z": "bass",
      "13": "snare",
      "90": "snare",   //90=zz
      [p.SHIFT]: "hhOpen",
      "191": "hhClosed",    // / ?
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
    global.played = [];
    sounds = ['','bass','snare','hhClosed','hhOpen'];
    global.phrase = (part, pattern) => {
      if(part=='bass'){played.push(pattern.substr(0,32));}
      return new p5.Phrase(part, (time,val)=>{
        /*if (part == 'bass'){
          played.push(val);
        }*/
        if (val ===9){
          clearRec();
        } else if (val === 8){
          dumpRec();
          addRec();
        } else if (val){
          let p2 = sounds[val];
          //global[p2].rate(rate); 
          global[p2].play(time);
        } 
        }, pattern.split('').map(x=>parseInt(x))
      )
    };

    //let bassPhrase =  makePhrase('bass', [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0] );   
    //let snarePhrase = makePhrase('snare',[0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1] );
    global.beat = new p5.Part();
    beat.addPhrase( phrase('bass', "1000200010000020".repeat(2) + "00".repeat(16).repeat(1) ) );
    //beat.addPhrase( phrase('snare',"0010000100100001" ) );
    beat.addPhrase( phrase('hh',("3000" + "3000".repeat(7)).repeat(32)) );
    beat.addPhrase( phrase('hh2',("4000" + "0000".repeat(7)).repeat(32)) );
    beat.addPhrase( phrase('control',("00" + "00".repeat(15) + "90" + "00".repeat(14) +"08" ) ) );

    beat.setBPM(120);
    //beat.start();
    global.score = new p5.Score();
    score.parts.push(beat);  //score.parts.push(beat);score.parts.push(beat);
    score.setBPM(120);
    //score.loop(true);
    //score.start();


    p5.Part.prototype.removePhrase = function (name) {
      for (var i in this.phrases) {
          if (this.phrases[i].name === name) {
              this.phrases.splice(i, 1);
          }
      }
    };
  };

  let boxW = 20;
  let boxH = 20;
  p.draw = function() {   
    //p.background(0);
    played.forEach((r,i)=>{
      let cells = r.split('');
      cells.forEach((c,j)=>{
        p.fill("white");
        if (c=="1"){p.fill("cyan")}
        if (c=="2"){p.fill("orange")}
        if (c=="0"){p.fill("black")}
        p.rect(j*boxW,i*boxH,boxW,boxH);
      })
    })



  };
  
  global.rec = [];

  global.clearRec = () => {
    rec=[];
    rec.start = Date.now()
    console.log("clearing rec");
  }
  global.dumpRec = () => {
    console.log(    // 87=w
      rec,
      recToArray({},rec).join("")
    )
  }
  global.addRec = () => {
    beat.removePhrase('bass');
    let newRec = recToArray({},rec).join("");
    played.push(newRec);
    beat.addPhrase(phrase('bass', alterRec(newRec) + "0".repeat(32) ))
  }

  global.alterRec = (x) => {
    const r = Math.floor(p.random(0,32))
    const a = x.split('');
    const c = a[r];
    let n = '0'
    if (c === "0"){n = p.random(["1","2"])} 
    if (c === "1"){n = p.random(["0","2"])} 
    if (c === "2"){n = p.random(["0","1"])} 
    a[r] = n;
    return a.join('');
  }



  p.keyPressed = function() {
    //console.log("keyCode:",p.keyCode,keyToSound[  p.keyCode] );
    if (p.keyCode == 81){clearRec()};    // 81=q
    if (p.keyCode == 87){dumpRec()};    // 81=q
    if (keyToSound[p.keyCode]){
      const soundName = keyToSound[p.keyCode];
      //if (rec.length < 1){rec.start = Date.now()};
      rec.push({
        //t:Date.now(),
        offset: Date.now() - rec.start,
        soundName,
        x: sounds.indexOf(soundName),
      });
      console.log(rec);  
      global[soundName].play();
      return false;

    }
    return true;   // allow other keys to pass through
  };
  global.recToArray = ({offset=60,bpm=120,subdivisions = 4}={},rec) => {
    const seq = Array.from({ length: 32 }, (v, i) => i)
    const m = (60 * 1000) / (bpm * subdivisions)
    return seq.map(i=>{
      const items = rec.filter(item => item.offset >= i*m && item.offset < (i+1)*m);
      if (items.length === 0){
        return 0
      } else {
        return items[0].x
      }
    });
    //return seq;
  }


};

const sketch = new p5(sketchFunction)