const BASE_URL = "https://api.currencyapi.com/v3/latest?apikey=cur_live_E2XUwRF0yPCgcZuOwBGx7rCJvWMrkOec4kJjg9m2"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  let response = await fetch(BASE_URL);
  let data = await response.json();

 
  console.log(data);
  let rate_from;
  let rate_to;
  for (const key of Object.keys(data["data"])) {
      // console.log(data["data"][key]["value"]);
      if(fromCurr.value == key){
        rate_from = data["data"][key]["value"];
      }
      else if(toCurr.value == key){
        rate_to = data["data"][key]["value"];
      }
  }

  let exchange_rate = rate_to/rate_from;
  if(fromCurr.value === toCurr.value){
    exchange_rate = 1;
  }
  console.log(exchange_rate);
//   console.log(data);
//   let rate = data[toCurr.value.toLowerCase()];

     let finalAmount = amtVal * exchange_rate;
     msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});