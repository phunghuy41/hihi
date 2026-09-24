const $ = (s) => document.querySelector(s);
const nameGrid = $("#nameGrid");
const searchBox = $("#searchBox");
const searchInput = $("#searchInput");
const emptyState = $("#emptyState");
const letterView = $("#letterView");
const letterGreeting = $("#letterGreeting");
const letterBody = $("#letterBody");
const letterSign = $("#letterSign");

let current = null;
let returnScroll = 0;

function createParticles(){
  const wrap = $("#particles");
  const count = window.innerWidth < 600 ? 12 : 18;
  for(let i=0;i<count;i++){
    const p=document.createElement("span");
    p.style.left=(Math.random()*100)+"%";
    p.style.animationDelay=(-Math.random()*8)+"s";
    p.style.animationDuration=(6+Math.random()*6)+"s";
    p.style.transform=`scale(${.5+Math.random()*.9})`;
    wrap.appendChild(p);
  }
}

function renderNames(list=girls){
  nameGrid.innerHTML="";
  list.forEach(person=>{
    const b=document.createElement("button");
    b.className="name-chip";
    b.type="button";
    b.dataset.id=person.id;
    const span=document.createElement("span");
    span.textContent=person.name;
    b.appendChild(span);
    b.addEventListener("click",()=>openLetter(person,b));
    nameGrid.appendChild(b);
  });
  emptyState.hidden=list.length!==0;
}

function scrollToWall(){
  $("#nameWall").scrollIntoView({behavior:"smooth"});
}

function genericLetter(person){
  return {
    greeting:`Gửi ${person.name.split(" ").slice(-1)[0]},`,
    body:[
      `20/10 này, không cần một lời chúc thật lớn. Chỉ muốn gửi bạn một lời nhắc nhỏ rằng: bạn đã làm nên một phần rất riêng của 10B4.`,
      `Có thể những ngày ở lớp sẽ trôi qua nhanh hơn mình nghĩ. Vì thế, mong bạn vẫn giữ được những điều khiến mình vui, những người khiến mình thấy được lắng nghe, và cả sự dịu dàng dành cho chính mình.`,
      `Chúc bạn luôn có đủ bình yên để mỉm cười, đủ can đảm để bước tiếp khi mọi chuyện không như ý, và đủ tin vào bản thân để biết rằng mình xứng đáng với những điều tốt đẹp.`
    ]
  };
}

function teacherLetter(){
  return {
    greeting:"Gửi cô,",
    body:[
      `20/10, chúng em muốn dành riêng một khoảng nhỏ để nói lời cảm ơn. Cảm ơn cô vì những điều đôi khi rất quen thuộc nên chúng em dễ quên mất rằng chúng đáng quý đến thế.`,
      `Một lớp học không chỉ được tạo nên bởi những bài học trong sách vở. Nó còn được tạo nên bởi cách một người thầy, người cô đồng hành, nhắc nhở, lắng nghe và kiên nhẫn với học trò của mình.`,
      `Chúc cô luôn thật nhiều sức khỏe, niềm vui và những ngày đến lớp thật nhẹ nhàng. Mong rằng khi nhớ về 10B4, cô cũng sẽ nhớ đến một tập thể với thật nhiều câu chuyện nhỏ — và thật nhiều lời cảm ơn chưa kịp nói thành lời.`
    ]
  };
}

function openLetter(person, button){
  current=person;
  returnScroll=window.scrollY;
  document.querySelectorAll(".name-chip").forEach(x=>x.classList.remove("selected"));
  button.classList.add("selected");
  $("#nameWall").classList.add("revealing");

  setTimeout(()=>{
    const data=genericLetter(person);
    showLetter(data);
  },700);
}

function showLetter(data){
  letterGreeting.textContent="";
  letterBody.innerHTML="";
  letterSign.classList.remove("show");
  letterView.classList.add("open");
  letterView.setAttribute("aria-hidden","false");
  typeText(letterGreeting,data.greeting,42,()=>{
    letterGreeting.classList.add("show");
    data.body.forEach((txt,i)=>{
      const p=document.createElement("p");
      p.textContent=txt;
      letterBody.appendChild(p);
      setTimeout(()=>p.classList.add("show"),250+i*430);
    });
    setTimeout(()=>letterSign.classList.add("show"),250+data.body.length*430);
  });
}

function typeText(el,text,speed,done){
  el.textContent="";
  let i=0;
  const timer=setInterval(()=>{
    el.textContent+=text[i++];
    if(i>=text.length){clearInterval(timer);done?.();}
  },speed);
}

function closeLetter(){
  letterView.classList.remove("open");
  letterView.setAttribute("aria-hidden","true");
  $("#nameWall").classList.remove("revealing");
  setTimeout(()=>window.scrollTo({top:returnScroll,behavior:"auto"}),450);
}

$("#enterBtn").addEventListener("click",scrollToWall);
$("#backBtn").addEventListener("click",closeLetter);
$("#searchToggle").addEventListener("click",()=>{
  searchBox.hidden=!searchBox.hidden;
  if(!searchBox.hidden){searchInput.focus();}
});
searchInput.addEventListener("input",()=>{
  const q=searchInput.value.trim().toLocaleLowerCase("vi");
  renderNames(girls.filter(x=>x.name.toLocaleLowerCase("vi").includes(q)));
});
$("#teacherEntry").addEventListener("click",()=>{
  returnScroll=window.scrollY;
  showLetter(teacherLetter());
});
window.addEventListener("keydown",(e)=>{if(e.key==="Escape" && letterView.classList.contains("open")) closeLetter();});

createParticles();
renderNames();
