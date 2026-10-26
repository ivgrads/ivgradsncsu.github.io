const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open)});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation')}));
const plan=document.querySelector('#plan-dialog');document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',()=>plan.showModal()));
document.querySelector('#connect-button').addEventListener('click',()=>document.querySelector('#contact-dialog').showModal());
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}})});
document.querySelector('#contact-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const body=`Hi IVGrads!\n\nMy name is ${data.get('name')}.${data.get('program')?' I’m studying '+data.get('program')+'.':''}\n\nI’d love to: ${data.get('interest')}.\n\n${data.get('message')||''}\n\nThanks!\n${data.get('name')}`;window.location.href='mailto:ivgradsncsu@gmail.com?subject='+encodeURIComponent('Hello from '+data.get('name'))+'&body='+encodeURIComponent(body);document.querySelector('#contact-status').textContent='Your email draft has been requested. Review and send it in your email app. If it did not open, email ivgradsncsu@gmail.com directly.'});
document.querySelector('#calendar-button').addEventListener('click',()=>{const now=new Date();const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const get=t=>Number(parts.find(p=>p.type===t).value);const next=new Date(Date.UTC(get('year'),get('month')-1,get('day')));const days=(2-next.getUTCDay()+7)%7||7;next.setUTCDate(next.getUTCDate()+days);const day=next.toISOString().slice(0,10).replaceAll('-','');const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const text=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//NC State IVGrads Website Concept//EN','CALSCALE:GREGORIAN','BEGIN:VTIMEZONE','TZID:America/New_York','BEGIN:DAYLIGHT','DTSTART:19700308T020000','RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU','TZOFFSETFROM:-0500','TZOFFSETTO:-0400','END:DAYLIGHT','BEGIN:STANDARD','DTSTART:19701101T020000','RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU','TZOFFSETFROM:-0400','TZOFFSETTO:-0500','END:STANDARD','END:VTIMEZONE','BEGIN:VEVENT','UID:ivgrads-tuesday-'+day+'@ivgrads-ncsu-concept','DTSTAMP:'+stamp,'DTSTART;TZID=America/New_York:'+day+'T191500','RRULE:FREQ=WEEKLY;COUNT=6','SUMMARY:IVGrads Tuesday Bible Study (confirm with chapter)','LOCATION:Contact ivgradsncsu@gmail.com for the meeting location','DESCRIPTION:Weekly schedule from the IVGrads fellowship website. Confirm each gathering with ivgradsncsu@gmail.com before attending.','END:VEVENT','END:VCALENDAR',''].join('\r\n');const url=URL.createObjectURL(new Blob([text],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ivgrads-tuesday-bible-study.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#calendar-status').textContent='Calendar file downloaded: six Tuesday reminders at 7:15 pm in Raleigh time. Please confirm individual meetings with the chapter.'});


const carousel=document.querySelector('.events-carousel');
const eventSlides=[...carousel.querySelectorAll('.event-slide')];
const eventDots=[...carousel.querySelectorAll('.event-dot')];
const eventNames=['Tuesday fellowship','Community events','Gathering updates'];
let eventIndex=0;
function showEvent(index){
 eventIndex=(index+eventSlides.length)%eventSlides.length;
 eventSlides.forEach((slide,i)=>{slide.hidden=i!==eventIndex});
 eventDots.forEach((dot,i)=>{dot.classList.toggle('active',i===eventIndex);if(i===eventIndex)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});
 carousel.querySelector('.event-count').textContent=String(eventIndex+1).padStart(2,'0')+' / '+String(eventSlides.length).padStart(2,'0');
 document.querySelector('#event-status').textContent='Slide '+(eventIndex+1)+' of '+eventSlides.length+': '+eventNames[eventIndex];
}
document.querySelector('#event-prev').addEventListener('click',()=>showEvent(eventIndex-1));
document.querySelector('#event-next').addEventListener('click',()=>showEvent(eventIndex+1));
eventDots.forEach((dot,i)=>dot.addEventListener('click',()=>showEvent(i)));
carousel.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showEvent(eventIndex+1)}else if(event.key==='ArrowLeft'){event.preventDefault();showEvent(eventIndex-1)}});
let touchOrigin=null;
carousel.addEventListener('touchstart',event=>{if(event.touches.length===1)touchOrigin={x:event.touches[0].clientX,y:event.touches[0].clientY}}, {passive:true});
carousel.addEventListener('touchend',event=>{if(!touchOrigin)return;const dx=event.changedTouches[0].clientX-touchOrigin.x;const dy=event.changedTouches[0].clientY-touchOrigin.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)showEvent(eventIndex+(dx<0?1:-1));touchOrigin=null},{passive:true});
carousel.addEventListener('touchcancel',()=>{touchOrigin=null},{passive:true});
