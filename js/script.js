const dropList = document.querySelectorAll(".drop-list select");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".to select");
const myInput = document.getElementById("myInput");
const res = document.querySelector(".exchange-rate");
const latestDate = document.getElementById("latestDate");

myInput.setAttribute("autocomplete", "off");
fromCurrency.addEventListener('change', exchange);
toCurrency.addEventListener('change', exchange);
myInput.addEventListener('input', exchange);

startApp();

function startApp(){
    populateDropDowns();
    exchange();
}

function exchange(){
    checkDataLocalStorage();
    getExchangeRate();
}

/*

    RON -> EUR , WITH USD

    1 USD ------- 5 RON
    x USD ------- 10 RON

    1 USD ---- 0.8 EUR
    X USD ---- Y EUR


*/

function getExchangeRate(){
    if(!navigator.onLine && !JSON.parse(localStorage.getItem("exchangeData"))){
        res.innerHTML = 'OFFLINE USER & DON-T HAVE DATA';
    }else{
        let dataFromLocalStorage = JSON.parse(localStorage.getItem("exchangeData"));
        let a = dataFromLocalStorage[fromCurrency.value];
        let x = myInput.value / a;
        let b = dataFromLocalStorage[toCurrency.value];
        let y = (b * x).toFixed(2);
        displaySum(fromCurrency, toCurrency, myInput.value, y);
    }
}

function displaySum(fromCurrency, toCurrency, x, y){
    if(x != 0 && x != '' && x != ' '){
        res.innerHTML = `${x} ${fromCurrency.value} = ${y} ${toCurrency.value}`;
    }else{
        res.innerHTML = 'Exchange Rates';
    }
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    latestDate.innerHTML = "Data from : " + new Date(Number(localStorage.getItem("timeData"))).toLocaleDateString('en-GB', options);
}

function checkDataLocalStorage(){
    if(!JSON.parse(localStorage.getItem("exchangeData"))){
        saveDataToLocalStorage();
    }
    const diff = Math.floor((new Date().getTime() - localStorage.getItem("timeData")) / 86400000); // check if 2 day passed
    if(diff > 2){
        saveDataToLocalStorage();
    }
}

function saveDataToLocalStorage(){
    let url = ` https://v6.exchangerate-api.com/v6/6069a5a93a02cced5d8cf202/latest/USD`;
    fetch(url).then(response => response.json()).then(result => localStorage.setItem("exchangeData", JSON.stringify(result.conversion_rates)));
    localStorage.setItem("timeData", new Date().getTime());
}

function populateDropDowns(){
    for (let i = 0; i < dropList.length; i++) {
        for(currency_code in country_list){
            let optionTag = `<option value="${currency_code}">${currency_code}</option>`;
            dropList[i].insertAdjacentHTML("beforeend", optionTag);
        }
    }
    fromCurrency.value = "USD";
    toCurrency.value = "RON"
}
