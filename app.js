const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open)});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation')}));
const plan=document.querySelector('#plan-dialog');document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',()=>plan.showModal()));
document.querySelector('#connect-button').addEventListener('click',()=>document.querySelector('#contact-dialog').showModal());
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}})});
document.querySelector('#contact-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const body=`Hi IVGrads!\n\nMy name is ${data.get('name')}.${data.get('program')?' I’m studying '+data.get('program')+'.':''}\n\nI’d love to: ${data.get('interest')}.\n\n${data.get('message')||''}\n\nThanks!\n${data.get('name')}`;window.location.href='mailto:ivgradsncsu@gmail.com?subject='+encodeURIComponent('Hello from '+data.get('name'))+'&body='+encodeURIComponent(body);document.querySelector('#contact-status').textContent='Your email draft has been requested. Review and send it in your email app. If it did not open, email ivgradsncsu@gmail.com directly.'});
document.querySelector('#calendar-button').addEventListener('click',()=>{const now=new Date();const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const get=t=>Number(parts.find(p=>p.type===t).value);const next=new Date(Date.UTC(get('year'),get('month')-1,get('day')));const days=(2-next.getUTCDay()+7)%7||7;next.setUTCDate(next.getUTCDate()+days);const day=next.toISOString().slice(0,10).replaceAll('-','');const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const text=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//NC State IVGrads Website Concept//EN','CALSCALE:GREGORIAN','BEGIN:VTIMEZONE','TZID:America/New_York','BEGIN:DAYLIGHT','DTSTART:19700308T020000','RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU','TZOFFSETFROM:-0500','TZOFFSETTO:-0400','END:DAYLIGHT','BEGIN:STANDARD','DTSTART:19701101T020000','RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU','TZOFFSETFROM:-0400','TZOFFSETTO:-0500','END:STANDARD','END:VTIMEZONE','BEGIN:VEVENT','UID:ivgrads-tuesday-'+day+'@ivgrads-ncsu-concept','DTSTAMP:'+stamp,'DTSTART;TZID=America/New_York:'+day+'T191500','RRULE:FREQ=WEEKLY;COUNT=6','SUMMARY:IVGrads Tuesday Bible Study (confirm with chapter)','LOCATION:Contact ivgradsncsu@gmail.com for the meeting location','DESCRIPTION:Weekly schedule from the IVGrads fellowship website. Confirm each gathering with ivgradsncsu@gmail.com before attending.','END:VEVENT','END:VCALENDAR',''].join('\r\n');const url=URL.createObjectURL(new Blob([text],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ivgrads-tuesday-bible-study.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#calendar-status').textContent='Calendar file downloaded: six Tuesday reminders at 7:15 pm in Raleigh time. Please confirm individual meetings with the chapter.'});


// Upcoming events come from a public Google Calendar and are added to the carousel
// right after the Tuesday fellowship slide. Leaders just add events in Google Calendar.
// Setup steps are in README.md under "Events calendar".
const GOOGLE_CALENDAR={
 id:'5f02d8bad6da17cfe7d175e16193845d21162119f52a7ed7a367728f3b31fdfa@group.calendar.google.com',     // e.g. 'abc123@group.calendar.google.com'
 apiKey:'AIzaSyDXg2Olakb891yrKkzVz6VJBu0eqT1SGew', // browser API key, restricted to this site's address
 maxEvents:4
};

const carousel=document.querySelector('.events-carousel');
const slideTrack=carousel.querySelector('.event-slides');
const pagination=carousel.querySelector('.event-pagination');
let eventSlides=[],eventDots=[],eventIndex=0;

// Rebuilds dots, numbering, and labels from whatever slides are in the track.
function refreshCarousel(){
 eventSlides=[...slideTrack.querySelectorAll('.event-slide')];
 pagination.textContent='';
 eventDots=eventSlides.map((slide,i)=>{
  slide.id='event-slide-'+(i+1);
  slide.setAttribute('aria-label',(i+1)+' of '+eventSlides.length+': '+slide.dataset.name);
  const dot=document.createElement('button');
  dot.type='button';dot.className='event-dot';
  dot.setAttribute('aria-label','Show '+slide.dataset.name);
  dot.setAttribute('aria-controls',slide.id);
  dot.addEventListener('click',()=>showEvent(i));
  pagination.append(dot);
  return dot;
 });
 showEvent(eventIndex,true);
}
function showEvent(index,quiet){
 eventIndex=(index+eventSlides.length)%eventSlides.length;
 eventSlides.forEach((slide,i)=>{slide.hidden=i!==eventIndex});
 eventDots.forEach((dot,i)=>{dot.classList.toggle('active',i===eventIndex);if(i===eventIndex)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});
 carousel.querySelector('.event-count').textContent=String(eventIndex+1).padStart(2,'0')+' / '+String(eventSlides.length).padStart(2,'0');
 if(!quiet)document.querySelector('#event-status').textContent='Slide '+(eventIndex+1)+' of '+eventSlides.length+': '+eventSlides[eventIndex].dataset.name;
}
// User navigation: show the slide and restart the autoplay countdown.
function goTo(index){showEvent(index);restartAutoplay()}
document.querySelector('#event-prev').addEventListener('click',()=>goTo(eventIndex-1));
document.querySelector('#event-next').addEventListener('click',()=>goTo(eventIndex+1));
pagination.addEventListener('click',restartAutoplay);
carousel.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();goTo(eventIndex+1)}else if(event.key==='ArrowLeft'){event.preventDefault();goTo(eventIndex-1)}});
let touchOrigin=null;
carousel.addEventListener('touchstart',event=>{if(event.touches.length===1)touchOrigin={x:event.touches[0].clientX,y:event.touches[0].clientY}}, {passive:true});
carousel.addEventListener('touchend',event=>{if(!touchOrigin)return;const dx=event.changedTouches[0].clientX-touchOrigin.x;const dy=event.changedTouches[0].clientY-touchOrigin.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)goTo(eventIndex+(dx<0?1:-1));touchOrigin=null},{passive:true});
carousel.addEventListener('touchcancel',()=>{touchOrigin=null},{passive:true});
refreshCarousel();

// Autoplay: advances every few seconds and keeps going after arrow, dot, or swipe
// navigation (the countdown just restarts). It holds only while a keyboard user is tabbing
// inside the carousel and while the browser tab is hidden. The pause button stops it, and it
// starts paused for visitors who ask their device to reduce motion.
const AUTOPLAY_MS=4000;
const toggleButton=document.querySelector('#event-toggle');
let autoplayTimer=null,userPaused=matchMedia('(prefers-reduced-motion: reduce)').matches,focusInside=false;
function autoplayActive(){return !userPaused&&!focusInside&&!document.hidden&&eventSlides.length>1}
function restartAutoplay(){
 clearInterval(autoplayTimer);autoplayTimer=null;
 if(autoplayActive())autoplayTimer=setInterval(()=>showEvent(eventIndex+1,true),AUTOPLAY_MS);
}
function updateToggle(){
 toggleButton.setAttribute('aria-label',userPaused?'Play slideshow':'Pause slideshow');
 toggleButton.classList.toggle('paused',userPaused);
}
toggleButton.addEventListener('click',()=>{userPaused=!userPaused;updateToggle();restartAutoplay()});
// Clicking or tapping a control also moves focus into the carousel, so focus that follows
// a pointer press doesn't count as "reading"; only keyboard focus holds the autoplay.
let pointerPressed=false;
carousel.addEventListener('pointerdown',()=>{pointerPressed=true;setTimeout(()=>{pointerPressed=false},0)});
carousel.addEventListener('focusin',event=>{focusInside=!pointerPressed&&event.target!==toggleButton;restartAutoplay()});
carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget)){focusInside=false;restartAutoplay()}});
document.addEventListener('visibilitychange',restartAutoplay);
updateToggle();restartAutoplay();

(function loadCalendarSlides(){
 if(!GOOGLE_CALENDAR.id||!GOOGLE_CALENDAR.apiKey)return; // not set up yet: keep the built-in slides
 const zone='America/New_York';
 const fmt=options=>new Intl.DateTimeFormat('en-US',{timeZone:zone,...options});
 const weekdayShort=fmt({weekday:'short'}),monthDay=fmt({month:'short',day:'numeric'}),longDate=fmt({weekday:'long',month:'long',day:'numeric'}),time=fmt({hour:'numeric',minute:'2-digit'});
 // All-day events arrive as 'YYYY-MM-DD'; pin them to noon UTC so the date can't shift a day.
 const parseStart=start=>start.dateTime?new Date(start.dateTime):new Date(start.date+'T12:00:00Z');
 // Calendar descriptions can contain HTML; keep only the text (DOMParser never runs scripts).
 const plainText=html=>{const doc=new DOMParser().parseFromString(html||'','text/html');doc.querySelectorAll('script,style').forEach(node=>node.remove());doc.querySelectorAll('br,p,li').forEach(node=>node.append(' '));return (doc.body.textContent||'').replace(/\s+/g,' ').trim()};
 const shorten=(text,max)=>text.length>max?text.slice(0,max).replace(/\s+\S*$/,'')+'…':text;
 const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node};
 const arrow=()=>{const s=el('span',null,'↗');s.setAttribute('aria-hidden','true');return s};

 function buildSlide(event,n){
  const start=parseStart(event.start);
  const title=event.summary||'IVGrads event';
  const slide=el('article','event-slide');
  slide.setAttribute('role','group');slide.setAttribute('aria-roledescription','slide');
  slide.dataset.name=title;slide.hidden=true;
  // Left panel: reuses the Instagram/Discord art styles, alternating colors.
  const art=el('div','event-art '+(n%2?'event-discord':'event-instagram'));
  art.setAttribute('aria-hidden','true');
  const big=el('div','event-art-title');
  big.append(weekdayShort.format(start)+'.',document.createElement('br'),el('em',null,monthDay.format(start)+'.'));
  const bottom=el('div','event-art-bottom','IVGRADS@NCSU ');bottom.append(el('span',null,'↗'));
  art.append(el('div','event-art-kicker','UPCOMING EVENT'),big,bottom);
  // If the event has an image attached (from Google Drive), swap it in for the color block.
  // The swap only happens once the image actually loads, so a private or broken file
  // just leaves the color block in place.
  const image=(event.attachments||[]).find(file=>file.fileId&&/^image\//.test(file.mimeType||''));
  if(image){
   const photo=new Image();
   photo.referrerPolicy='no-referrer';
   photo.alt=title;
   photo.decoding='async';
   photo.addEventListener('load',()=>{
    // Flyers come in any shape, so show the whole image (no cropping) and fill the
    // leftover space with a blurred, darkened copy of the same image.
    const panel=el('div','event-image event-poster');
    const backdrop=new Image();
    backdrop.className='event-poster-bg';backdrop.alt='';backdrop.setAttribute('aria-hidden','true');
    backdrop.referrerPolicy='no-referrer';backdrop.src=photo.src;
    panel.append(backdrop,photo);
    art.replaceWith(panel);
   },{once:true});
   photo.src='https://drive.google.com/thumbnail?id='+encodeURIComponent(image.fileId)+'&sz=w1600';
  }
  // Right panel: same structure as the built-in slides.
  const copy=el('div','event-copy');
  const category=el('span','event-category');category.append(el('span','live-dot'),' UPCOMING EVENT');
  const heading=el('h3',null,title);
  copy.append(category,heading);
  const description=shorten(plainText(event.description),220);
  if(description)copy.append(el('p',null,description));
  const meta=el('div','event-meta');
  meta.append(el('strong',null,longDate.format(start)+' · '+(event.start.dateTime?time.format(start).toLowerCase():'All day')));
  meta.append(el('span',null,event.location||'Contact us for the location'));
  copy.append(meta);
  if(event.htmlLink){
   const link=el('a','button red','View event ');link.href=event.htmlLink;link.target='_blank';link.rel='noopener';link.append(arrow());
   copy.append(link);
  }
  slide.append(art,copy);
  return slide;
 }

 const params=new URLSearchParams({key:GOOGLE_CALENDAR.apiKey,timeMin:new Date().toISOString(),singleEvents:'true',orderBy:'startTime',maxResults:'50'});
 fetch('https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(GOOGLE_CALENDAR.id)+'/events?'+params)
  .then(response=>{if(!response.ok)throw new Error('Google Calendar request failed: '+response.status);return response.json()})
  .then(data=>{
   // A repeating event (e.g. weekly) only gets one slide: its next occurrence.
   const seenSeries=new Set();
   const events=(data.items||[]).filter(event=>{
    if(event.status==='cancelled')return false;
    if(event.recurringEventId){if(seenSeries.has(event.recurringEventId))return false;seenSeries.add(event.recurringEventId)}
    return true;
   }).slice(0,GOOGLE_CALENDAR.maxEvents);
   if(!events.length)return;
   const anchor=slideTrack.querySelector('.event-slide'); // Tuesday fellowship stays first
   events.reverse().forEach((event,i)=>anchor.after(buildSlide(event,events.length-1-i)));
   refreshCarousel();
  })
  .catch(error=>console.error(error)); // on failure the built-in slides still work
})();

// Media section: a continuous photo strip. The photo list is duplicated once so the CSS
// animation (which slides the track left by half its width) loops without a visible jump.
// The copies are hidden from screen readers. Hovering or focusing the strip pauses it,
// and the button pauses it until pressed again.
(function setUpMarquee(){
 const section=document.querySelector('#media');
 const track=document.querySelector('#marquee-track');
 const toggle=document.querySelector('#media-toggle');
 if(!section||!track||!toggle)return;
 [...track.children].forEach(item=>{
  const copy=item.cloneNode(true);
  copy.setAttribute('aria-hidden','true');
  copy.querySelectorAll('img').forEach(img=>{img.alt=''});
  track.append(copy);
 });
 toggle.addEventListener('click',()=>{
  const paused=section.classList.toggle('paused');
  toggle.setAttribute('aria-pressed',String(paused));
  toggle.querySelector('.media-toggle-label').textContent=paused?'Play photos':'Pause photos';
 });
})();
