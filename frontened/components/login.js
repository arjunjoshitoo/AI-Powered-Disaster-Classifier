document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const Username = document.getElementById("inputVal").value;
    const Password = document.getElementById("inputVal2").value;
    const Email = document.getElementById("inputVal3").value;
    const NewUser = JSON.parse(localStorage.getItem("USERNAME"));

    if (NewUser) {
        // Use .find to check if a matching user exists
        const validUser = NewUser.find(user => user.username === Username && user.password === Password && user.email === Email);

        if (validUser) {
            // Optional: you can store the user info or login state if needed
            // localStorage.setItem("currentUser", Username);
            localStorage.setItem("currentUser", JSON.stringify(validUser));
            window.location.href = "index.html";
        } else {
           
            if(NewUser.username !== Username || NewUser.email !== Email){
              alert("Username or Email is incorrect."); 

            } else {
              alert("Password is incorrect.");
              

            }
            document.getElementById("inputVal").value = "";
            document.getElementById("inputVal2").value = "";
            document.getElementById("inputVal3").value = "";
            
        }
    } else {
        alert("No users found. Please sign up first.");
    }
});
const companyName = "    R E S Q - A I";
const nameDisplay = document.getElementById("companyName");
const quote = document.getElementById("quote");

let index = 0;

function typeEffect() {
  if (index < companyName.length) {
    
    nameDisplay.textContent += companyName.charAt(index);
    index++;
    setTimeout(typeEffect, 140);
  } else {
    // Show the quote after typing is complete
    quote.classList.add("fade-in");    
   
  }
}

window.onload = () => {
  typeEffect();
};