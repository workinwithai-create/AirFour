const CDN = "https://cdn.jsdelivr.net/gh/workinwithai-create/PreEight@main/public/samples";
const STEPS = 16;
const DENSE = 8;
const AIR = 4;
const recipes = [
  { id:"kit-out", name:"Kit out", blurb:"Kick and snare leave. Hats whisper. Chairs stay." },
  { id:"pedal-only", name:"Pedal only", blurb:"Upright holds the root. Everything else is air." },
  { id:"one-chair", name:"One chair", blurb:"Only nylon or violin remains. Sparse figure." },
  { id:"half-air", name:"Half air", blurb:"Bars 9–10 dense pocket, 11–12 almost empty." },
  { id:"hold-swell", name:"Hold swell", blurb:"Piano and violin sustain. No new attacks." },
  { id:"stop-hits", name:"Stop hits", blurb:"One hit on the 1 of each bar. Then air." },
  { id:"bass-walk-out", name:"Bass walk out", blurb:"Upright walks down and exits on bar 12." },
  { id:"brass-breath", name:"Brass breath", blurb:"Trumpet long tone across the air. Kit gone." },
  { id:"ghost-pocket", name:"Ghost pocket", blurb:"Only rim and soft hat. No kick. Space opens." },
  { id:"full-drop", name:"Full drop", blurb:"Everything out for two bars, then soft return." }
];
function bar(symbol, piano, guitar, bass){ return { symbol, piano, guitar, bass }; }
const grooves = [
  { id:"amber", name:"Amber Walk", bpm:98, key:"A minor",
    dense:[bar("Am",[45,48,52,57],[45,52,57],33),bar("F",[41,45,48,53],[41,48,53],41),bar("C",[48,52,55,60],[48,52,55],36),bar("G",[43,47,50,55],[43,47,50],31),bar("Am",[45,48,52,57],[45,52,57],33),bar("F",[41,45,48,53],[41,48,53],41),bar("C",[48,52,55,60],[48,52,55],36),bar("G",[43,47,50,55],[43,47,50],31)],
    air:[bar("Am",[45,48,52,57],[45,52,57],33),bar("Am",[45,48,52,57],[45,52,57],33),bar("F",[41,45,48,53],[41,48,53],41),bar("Am",[45,48,52,57],[45,52,57],33)] },
  { id:"porch", name:"Porch Climb", bpm:86, key:"E major",
    dense:[bar("E",[40,44,47,52],[40,47,52],28),bar("B",[35,39,42,47],[35,42,47],23),bar("C#m",[44,47,51,56],[44,51,56],32),bar("A",[33,37,40,45],[33,40,45],33),bar("E",[40,44,47,52],[40,47,52],28),bar("B",[35,39,42,47],[35,42,47],23),bar("C#m",[44,47,51,56],[44,51,56],32),bar("A",[33,37,40,45],[33,40,45],33)],
    air:[bar("E",[40,44,47,52],[40,47,52],28),bar("E",[40,44,47,52],[40,47,52],28),bar("B",[35,39,42,47],[35,42,47],23),bar("E",[40,44,47,52],[40,47,52],28)] },
  { id:"fold", name:"Fold Radio", bpm:104, key:"D minor",
    dense:[bar("Dm",[38,41,45,50],[38,45,50],26),bar("Bb",[34,38,41,46],[34,41,46],34),bar("F",[41,45,48,53],[41,48,53],29),bar("C",[36,40,43,48],[36,43,48],24),bar("Dm",[38,41,45,50],[38,45,50],26),bar("Bb",[34,38,41,46],[34,41,46],34),bar("F",[41,45,48,53],[41,48,53],29),bar("C",[36,40,43,48],[36,43,48],24)],
    air:[bar("Dm",[38,41,45,50],[38,45,50],26),bar("Dm",[38,41,45,50],[38,45,50],26),bar("Bb",[34,38,41,46],[34,41,46],34),bar("Dm",[38,41,45,50],[38,45,50],26)] },
  { id:"stair", name:"Stair House", bpm:118, key:"G minor",
    dense:[bar("Gm",[43,46,50,55],[43,50,55],31),bar("Eb",[39,43,46,51],[39,46,51],27),bar("Bb",[34,38,41,46],[34,41,46],34),bar("F",[41,45,48,53],[41,48,53],29),bar("Gm",[43,46,50,55],[43,50,55],31),bar("Eb",[39,43,46,51],[39,46,51],27),bar("Bb",[34,38,41,46],[34,41,46],34),bar("F",[41,45,48,53],[41,48,53],29)],
    air:[bar("Gm",[43,46,50,55],[43,50,55],31),bar("Gm",[43,46,50,55],[43,50,55],31),bar("Eb",[39,43,46,51],[39,46,51],27),bar("Gm",[43,46,50,55],[43,50,55],31)] },
  { id:"carbon", name:"Carbon Verse", bpm:92, key:"C major",
    dense:[bar("C",[48,52,55,60],[48,52,55],36),bar("Am",[45,48,52,57],[45,52,57],33),bar("F",[41,45,48,53],[41,48,53],41),bar("G",[43,47,50,55],[43,47,50],31),bar("C",[48,52,55,60],[48,52,55],36),bar("Am",[45,48,52,57],[45,52,57],33),bar("F",[41,45,48,53],[41,48,53],41),bar("G",[43,47,50,55],[43,47,50],31)],
    air:[bar("C",[48,52,55,60],[48,52,55],36),bar("C",[48,52,55,60],[48,52,55],36),bar("G",[43,47,50,55],[43,47,50],31),bar("C",[48,52,55,60],[48,52,55],36)] }
];
const state = { groove: grooves[0], recipe: recipes[0], playing:false, bar:0, mode:null };
let ctx, bus, buffers = {};
async function load() {
  ctx = new AudioContext();
  bus = ctx.createGain(); bus.gain.value = 0.35; bus.connect(ctx.destination);
  const files = [
    ["kick",`${CDN}/drums/kick.mp3`],["snare",`${CDN}/drums/snare.mp3`],["hat",`${CDN}/drums/hihat.mp3`],["crash",`${CDN}/drums/crash.mp3`],
    ["pC3",`${CDN}/piano/C3.mp3`],["pC4",`${CDN}/piano/C4.mp3`],["pA3",`${CDN}/piano/A3.mp3`],
    ["bE1",`${CDN}/bass/E1.mp3`],["bA1",`${CDN}/bass/A1.mp3`],["bC2",`${CDN}/bass/C2.mp3`],
    ["gE2",`${CDN}/guitar/E2.mp3`],["gA2",`${CDN}/guitar/A2.mp3`],["gE3",`${CDN}/guitar/E3.mp3`],
    ["tC4",`${CDN}/trumpet/C4.mp3`],["vA3",`${CDN}/violin/A3.mp3`]
  ];
  let n=0;
  for (const [k,url] of files) {
    try { const r = await fetch(url); buffers[k] = await ctx.decodeAudioData(await r.arrayBuffer()); } catch (e) { console.warn(k, e); }
    n++; document.getElementById("status").textContent = `Seating chairs ${n}/${files.length}`;
  }
  document.getElementById("status").textContent = "Chairs seated · live FluidR3 + kit";
}
function playBuf(name, when, rate=1, gain=0.4) {
  const b = buffers[name]; if (!b || !ctx) return;
  const src = ctx.createBufferSource(); src.buffer = b; src.playbackRate.value = rate;
  const g = ctx.createGain(); g.gain.value = gain; src.connect(g); g.connect(bus); src.start(when);
}
function rateFromMidi(midi, baseMidi){ return Math.pow(2, (midi-baseMidi)/12); }
function chordAt(i){ return i < DENSE ? state.groove.dense[i] : state.groove.air[i-DENSE]; }
function scheduleBar(barIndex, t0, stepDur){
  const ch = chordAt(barIndex); const onAir = barIndex >= DENSE; const rec = state.recipe.id;
  const airBar = barIndex - DENSE;
  for (let s=0;s<STEPS;s++){
    const when = t0 + s*stepDur;
    let hatG = 0.07, kickG = 0.7, snareG = 0.45, playKick = (s===0), playSnare = (s===8), playHat = (s%2===0);
    if (onAir) {
      if (rec==="kit-out" || rec==="pedal-only" || rec==="one-chair" || rec==="hold-swell" || rec==="brass-breath") {
        playKick = false; playSnare = false; hatG = 0.02; playHat = (s%4===0);
      } else if (rec==="half-air") {
        if (airBar >= 2) { playKick = false; playSnare = false; hatG = 0.03; }
      } else if (rec==="stop-hits") {
        playKick = (s===0); playSnare = false; playHat = false;
      } else if (rec==="ghost-pocket") {
        playKick = false; playSnare = false; hatG = 0.05; playHat = (s%2===0);
      } else if (rec==="full-drop") {
        if (airBar < 2) { playKick = false; playSnare = false; playHat = false; }
        else { playKick = (s===0); playSnare = false; hatG = 0.04; }
      } else if (rec==="bass-walk-out") {
        if (airBar === 3) { playKick = false; playSnare = false; }
      }
    }
    if (playHat) playBuf("hat", when, 1, hatG);
    if (playKick) playBuf("kick", when, 1, kickG);
    if (playSnare) playBuf("snare", when, 1, snareG);
    if (s===0) {
      let pianoG = 0.28, bassG = 0.45, gtrG = 0.22, playPiano = true, playBass = true, playGtr = true;
      if (onAir) {
        if (rec==="pedal-only") { playPiano = false; playGtr = false; bassG = 0.55; }
        else if (rec==="one-chair") { playPiano = false; playBass = false; gtrG = 0.3; }
        else if (rec==="hold-swell") { playGtr = false; pianoG = 0.2; }
        else if (rec==="stop-hits") { playPiano = (airBar%2===0); playGtr = false; }
        else if (rec==="bass-walk-out") {
          if (airBar === 3) { playPiano = false; playGtr = false; bassG = 0.35; }
        } else if (rec==="full-drop" && airBar < 2) {
          playPiano = false; playBass = false; playGtr = false;
        } else if (rec==="brass-breath") { playGtr = false; playPiano = false; }
        else if (rec==="ghost-pocket") { playPiano = false; playGtr = false; bassG = 0.3; }
        else if (rec==="half-air" && airBar >= 2) { playPiano = false; playGtr = false; }
      }
      if (playPiano) {
        playBuf("pC4", when, rateFromMidi(ch.piano[2]||60, 60), pianoG);
        playBuf("pA3", when, rateFromMidi(ch.piano[1]||57, 57), pianoG * 0.8);
      }
      if (playBass) playBuf("bA1", when, rateFromMidi(ch.bass, 33), bassG);
      if (playGtr) playBuf("gA2", when, rateFromMidi(ch.guitar[0]||45, 45), gtrG);
    }
    if (onAir && rec==="hold-swell" && s===0) {
      playBuf("vA3", when, rateFromMidi(ch.piano[2]||60, 57), 0.22);
    }
    if (onAir && rec==="brass-breath" && s===0) {
      playBuf("tC4", when, rateFromMidi(ch.piano[3]||69, 60), 0.32);
    }
    if (onAir && rec==="one-chair" && s===8 && airBar===1) {
      playBuf("gE3", when, rateFromMidi(ch.guitar[1]||52, 52), 0.25);
    }
    if (onAir && rec==="bass-walk-out" && airBar===2 && s===0) {
      playBuf("bE1", when, rateFromMidi((ch.bass||33)-5, 28), 0.4);
    }
  }
}
let timer=null;
function stop(){ state.playing=false; state.mode=null; if(timer) clearTimeout(timer); timer=null; paintBars(); }
async function play(mode){
  if (!ctx) await load();
  if (ctx.state==="suspended") await ctx.resume();
  stop(); state.playing=true; state.mode=mode;
  const startBar = mode==="eight" ? DENSE : 0;
  const endBar = mode==="loop" ? DENSE : DENSE+AIR;
  const stepDur = 60/state.groove.bpm/4;
  let barIndex = startBar;
  const tick = () => {
    if (!state.playing) return;
    if (barIndex >= endBar) { if (mode==="loop") barIndex = startBar; else { stop(); return; } }
    state.bar = barIndex; paintBars();
    scheduleBar(barIndex, ctx.currentTime+0.02, stepDur);
    barIndex += 1;
    timer = setTimeout(tick, STEPS*stepDur*1000);
  };
  tick();
}
function punch(){
  const g=state.groove, r=state.recipe;
  return `AirFour punch list\n${g.name} · ${g.bpm} BPM · ${g.key} · ${r.name}\n\nThe problem: the section stays dense or the file fades. Session players write four live bars of strategic air so the next section hits with room.\nThe move: ${r.blurb}\n\nDense (bars 1-8)\n${g.dense.map((b,i)=>`  ${i+1}. ${b.symbol}`).join("\n")}\n\nAir (bars 9-12) — ${r.name}\n${g.air.map((b,i)=>`  ${i+9}. ${b.symbol}`).join("\n")}\n\nLive chairs only. Distinct from TagFour, LiftTwo, PreEight, AfterHook, EndEight, LastHook, BreakFour, StopFour.\nDrop the WAV on bars 9-12. Do not loop the dense part into the air.`;
}
function paintGrooves(){
  const el=document.getElementById("grooves"); el.innerHTML="";
  grooves.forEach(g=>{ const b=document.createElement("button"); b.className="card"+(state.groove.id===g.id?" on":""); b.innerHTML=`<b>${g.name}</b><span>${g.bpm} BPM · ${g.key}</span>`; b.onclick=()=>{ state.groove=g; render(); }; el.appendChild(b); });
}
function paintRecipes(){
  const el=document.getElementById("recipes"); el.innerHTML="";
  recipes.forEach(r=>{ const b=document.createElement("button"); b.className="card"+(state.recipe.id===r.id?" on":""); b.innerHTML=`<b>${r.name}</b><span>${r.blurb}</span>`; b.onclick=()=>{ state.recipe=r; render(); }; el.appendChild(b); });
}
function paintBars(){
  const el=document.getElementById("bars"); el.innerHTML="";
  for(let i=0;i<12;i++){ const ch=chordAt(i); const d=document.createElement("div"); d.className="bar"+(i>=8?" air":"")+(state.playing && state.bar===i?" active":""); d.innerHTML=`<div class="n">${i+1} · ${i>=8?"A":"D"}</div><div class="c">${ch.symbol}</div>`; el.appendChild(d); }
}
function render(){ paintGrooves(); paintRecipes(); paintBars(); document.getElementById("punch").textContent = punch(); }
document.getElementById("playA").onclick=()=>play("loop");
document.getElementById("playB").onclick=()=>play("cut");
document.getElementById("play8").onclick=()=>play("eight");
document.getElementById("stop").onclick=stop;
document.getElementById("copy").onclick=()=>navigator.clipboard.writeText(punch());
render();
load();
