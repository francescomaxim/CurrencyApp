const dropList = document.querySelectorAll(".drop-list select");
getButton = document.querySelector("form button");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".to select");

for (let i = 0; i < dropList.length; i++) {
    for(currency_code in country_list){
        let optionTag = `<option value="${currency_code}">${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    
}

getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

function getExchangeRate(){
    const amount = document.querySelector(".amount input");
    let amountVal = amount.value;
    if(amountVal == "" || amountVal == "0"){
        amountVal = 1;
        amount.value = "1";
    }

    const currentDate = new Date();
    const diff = currentDate.getTime() - localStorage.getItem("lastDate");
    const y = Math.floor(diff / 86400000);

    const lastDate = localStorage.getItem("lastTime");
    const oldCurrency = JSON.parse(localStorage.getItem("lastCurrency"));

    let url = ` https://v6.exchangerate-api.com/v6/6069a5a93a02cced5d8cf202/latest/AED`;

    if(navigator.onLine){

        if(y > 2 || !oldCurrency){
                fetch(url).then(response => response.json()).then(result => localStorage.setItem("lastCurrency", JSON.stringify(result.conversion_rates)));
                localStorage.setItem("lastDate", currentDate.getTime());
                localStorage.setItem("date", currentDate);
        }

        let currencies = (JSON.parse(localStorage.getItem("lastCurrency")));

        let x = amountVal / currencies[fromCurrency.value];

        let totalExchangeRate = (x * currencies[toCurrency.value]).toFixed(2);
        const exchangeRateTxt = document.querySelector(".exchange-rate");
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`

    }else{
        if(!oldCurrency){
            const u = document.getElementById("latestDate");
            u.innerText = "You are offline and there is no data for use";
            u.style.color = "red";
        }else{
            let currencies = (JSON.parse(localStorage.getItem("lastCurrency")));

            let x = amountVal / currencies[fromCurrency.value];
        
            let totalExchangeRate = (x * currencies[toCurrency.value]).toFixed(2);
            const exchangeRateTxt = document.querySelector(".exchange-rate");
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`
        }
    }

}

function myFunction() {
    const lateDate = localStorage.getItem("date");
    const u = document.getElementById("latestDate");

    if (lateDate) {
        u.style.color = "black";
        u.innerText = lateDate;
    } else {
        if(navigator.onLine){
            u.innerText = "Latest date"; 
            u.style.color = "black";
        }else{
            u.innerText = "You are offline and there is no data for use";
            u.style.color = "red";
        }
    }
}

window.onload = myFunction;
window.addEventListener('online', (e) => {
    myFunction();
});

window.addEventListener('offline', (e) => {
    myFunction();
});