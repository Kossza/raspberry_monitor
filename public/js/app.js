//console.log('Lofasz na!')
const contactForm = document.querySelector('.contact-form');
const targy = document.getElementsByName("info");
let page = document.getElementById('page');
let bankok;
var allinfo = "";
var go, others = false;
if(page.value == "Munkáltatói igazolás"){
    bankok = document.getElementById('banklist');
    bankok.addEventListener('change', (e)=>{
        e.preventDefault();
        if (bankok.value == "Egyéb"){
            document.getElementById("otherinfo").style.visibility="visible";
            document.getElementById("otherinfo").style.height="48px";
            document.getElementById("otherinfo").style.marginTop="2rem";
            others = true;
        }else{
            document.getElementById("otherinfo").style.visibility="hidden";
            document.getElementById("otherinfo").style.height="0";
            document.getElementById("otherinfo").style.marginTop="0";
            others = false;
        }
    });
}

contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    //console.log(targy);
    for (let item of targy) {
        if(item.placeholder != undefined){
     allinfo = allinfo + item.placeholder + ": " +  item.value + "<br>";
    }
    else{
        allinfo = allinfo + item.title + ": " +  item.value + "<br>"; 
    }
     if(item.value == ""){
         go = false
         alert("Mindent tölts ki!")
         break;
     }else{
         go=true;
     }
    }
    if (others == true){
        allinfo = allinfo + document.getElementById("otherinfo").value + "<br>";
    }
    let formData = {
        page: page.value,
        allinfo: allinfo,
    }
    console.log(formData);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function(){
        console.log(xhr.responseText);
        if(xhr.responseText == 'success'){
            alert('Email elküldve');
            page.value = "";
            allinfo = "";
            location.reload();
        }else{
            alert('Valami hiba történt!')
            location.reload();
        }
    }
   if(go){
       xhr.send(JSON.stringify(formData));
    }
    page.value = "";
    allinfo = "";
    go = false;
})