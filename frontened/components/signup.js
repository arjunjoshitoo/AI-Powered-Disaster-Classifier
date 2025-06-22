const user = [];

document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const Users = JSON.parse(localStorage.getItem("USERNAME")) || []; // Retrieve existing users from local storage
    const Username = document.getElementById("signup-username").value;
    const Password = document.getElementById("signup-password").value;
    const Email = document.getElementById("signup-email").value;
    
    if(Username && Password && Email){
        if(Users.some(user => user.username === Username && user.password === Password)){
            alert("User already exists.");
            document.getElementById("signup-username").value = "";
            document.getElementById("signup-password").value = "";
           
        } else {
        Users.push({username: Username, password: Password, email: Email});;
        localStorage.setItem("USERNAME", JSON.stringify(Users));
        window.location.href = "login.html"
        }
} 
});

const companyName = "   R E S Q - A I";
const nameDisplay = document.getElementById("companyName");
const quote = document.getElementById("quote");

let index = 0;

function typeEffect() {
  if (index < companyName.length) {
    nameDisplay.textContent += companyName.charAt(index);
    index++;
    setTimeout(typeEffect, 150);
  } else {
    // Show the quote after typing is complete
    quote.classList.add("fade-in");    
   
    
  }
}

window.onload = () => {
  typeEffect();
};