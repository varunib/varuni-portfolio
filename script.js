document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>document.querySelector(link.getAttribute('href'))?.focus?.()));
const targets=document.querySelectorAll('.project,.skill-group,.about-grid>*,.contact>*');
const skillsTicker=document.querySelector('.skill-scroll');
if(skillsTicker) skillsTicker.innerHTML=skillsTicker.innerHTML.replaceAll('DATA STRUCTURES <i>✦</i>','DATA STRUCTURES <i>✦</i> OOP <i>✦</i>');
const projectList=document.querySelector('.projects');
if(projectList){const cards=projectList.querySelectorAll(':scope > .project');if(cards.length>=4){projectList.insertBefore(cards[3],cards[2]);const reordered=projectList.querySelectorAll(':scope > .project');reordered[2].querySelector('.project-number').textContent='03 / AGENTIC AI';reordered[3].querySelector('.project-number').textContent='04 / GENERATIVE AI';}}
const ragVisual=document.querySelector('.project-visual.rag');
if(ragVisual){ragVisual.classList.add('rag-image');ragVisual.innerHTML='<img src="assets/rag-pipeline.png" alt="RAG pipeline: query, retrieve, augment, generate, and answer" /><span class="rag-step retrieve" aria-hidden="true"></span><span class="rag-step augment" aria-hidden="true"></span><span class="rag-step generate" aria-hidden="true"></span><span class="rag-step answer" aria-hidden="true"></span>';}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.14});
targets.forEach(item=>observer.observe(item));
const cursor=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',event=>{cursor.style.transform=`translate(${event.clientX}px,${event.clientY}px)`});
document.querySelectorAll('.project').forEach(card=>{card.addEventListener('pointermove',event=>{const box=card.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;card.style.setProperty('--tilt-x',`${y*-3}deg`);card.style.setProperty('--tilt-y',`${x*3}deg`);card.style.setProperty('--spot-x',`${((event.clientX-box.left)/box.width)*100}%`);card.style.setProperty('--spot-y',`${((event.clientY-box.top)/box.height)*100}%`)});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')})});
