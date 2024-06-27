function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}

let website_arr = [];
let del = [];


function populate(){
  
    const tab = document.querySelector("table");
    
    tab.innerHTML = `<tr>
                     <th>Website</th>
                     <th>Username</th>
                     <th>Password</th>
                     <th>Delete</th>
                    </tr>`

    let arr = removeDuplicates(website_arr);                
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        const user = localStorage.getItem(`${element}.username`);
        const pass = localStorage.getItem(`${element}.password`);
        tab.innerHTML = tab.innerHTML + `<tr>
                         <td>${element}</td>
                         <td>${user}</td>
                         <td>${pass}</td>
                         <td class = "delete">delete</td>
                     </tr>`
    }                
}

function auto_populate(){
    for (const key in localStorage) {
        if(key.endsWith(".username")){
         if(key.split(".")[0]){
           
             website_arr.push(key.split(".")[0]);
         }
            
        }
        if(key.endsWith(".password")){
         if(key.split(".")[0]!=""){
             website_arr.push(key.split(".")[0]);
         }
            
        }
     }

     populate();
}

auto_populate();

document.getElementById("submit").addEventListener("click",(e)=>{
    e.preventDefault();
    

    website_arr.push(Website.value);
    localStorage.setItem(`${Website.value}.username`,`${Username.value}`);
    localStorage.setItem(`${Website.value}.password`,`${Password.value}`);

    populate();
    location.reload(true);
    
})


del = Array.from(document.querySelectorAll(".delete"));
del.forEach((e)=>{
    e.addEventListener("click",()=>{
        const web = e.parentElement.firstElementChild.innerHTML;
        localStorage.removeItem(`${web}.username`);
        localStorage.removeItem(`${web}.password`);
        location.reload(true);
    })
})


