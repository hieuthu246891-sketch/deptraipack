import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyA3jfkHd8_FN2M-FBGoIWIz8ZuIYwb-v0c",
authDomain: "casino-slot-ec289.firebaseapp.com",
databaseURL: "https://casino-slot-ec289-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "casino-slot-ec289",
storageBucket: "casino-slot-ec289.firebasestorage.app",
messagingSenderId: "191169506693",
appId: "1:191169506693:web:18eae48ffff0922492e8ec",
measurementId: "G-V7RM6KZXVW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentUser;
let packs=[];
let currentPack=[];
let index=0;

const values={
"3":3,
"4":4,
"5":5,
"6":6,
"7":7,
"8":8,
"9":9,
"10":10,
"J":11,
"Q":12,
"K":13,
"A":20,
"2":25
};

const deck=[
"3","3","3","3",
"4","4","4","4",
"5","5","5","5",
"6","6","6","6",
"7","7","7","7",
"8","8","8","8",
"9","9","9","9",
"10","10","10","10",
"J","J","J","J",
"Q","Q","Q","Q",
"K","K","K","K",
"A","A",
"2","2"
];

function shuffle(a){
return a.sort(()=>Math.random()-0.5);
}

window.register=function(){
const email=document.getElementById("email").value
const pass=document.getElementById("password").value

createUserWithEmailAndPassword(auth,email,pass)
.then(user=>{
set(ref(db,"users/"+user.user.uid),{
money:500
})
})
}

window.login=function(){
const email=document.getElementById("email").value
const pass=document.getElementById("password").value

signInWithEmailAndPassword(auth,email,pass)
.then(res=>{
currentUser=res.user
loadUser()
})
}

window.logout=function(){
signOut(auth)
}

function loadUser(){

document.getElementById("userInfo").innerHTML=
"Email:"+currentUser.email+"<br>UID:"+currentUser.uid

get(ref(db,"users/"+currentUser.uid)).then(snap=>{
document.getElementById("money").innerText=
"Money:"+snap.val().money
})

randomPacks()
}

window.randomPacks=function(){

packs=[]

for(let i=0;i<6;i++){

let d=shuffle([...deck])
packs.push(d.slice(0,8))

}

drawPacks()
}

function drawPacks(){

const div=document.getElementById("packs")
div.innerHTML=""

packs.forEach((p,i)=>{

let el=document.createElement("div")
el.className="pack"
el.innerText="Pack "+(i+1)

el.onclick=()=>openPack(i)

div.appendChild(el)

})
}

async function openPack(i){

let snap=await get(ref(db,"users/"+currentUser.uid))
let money=snap.val().money

if(money<75){
alert("Not enough money")
return
}

update(ref(db,"users/"+currentUser.uid),{
money:money-75
})

currentPack=packs[i]
index=0

showCard()
}

function showCard(){

document.getElementById("card").innerText=
currentPack[index]+" ("+values[currentPack[index]]+")"

}

window.nextCard=function(){

index++

if(index>=currentPack.length){

let sum=0

currentPack.forEach(c=>{
sum+=values[c]
})

alert("Total:"+sum)

get(ref(db,"users/"+currentUser.uid)).then(snap=>{
update(ref(db,"users/"+currentUser.uid),{
money:snap.val().money+sum
})
})

return
}

showCard()

}
