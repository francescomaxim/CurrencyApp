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
    let url = ` https://v6.exchangerate-api.com/v6/6069a5a93a02cced5d8cf202/latest/${fromCurrency.value}`;
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (exchangeRate * amountVal).toFixed(2);
        const exchangeRateTxt = document.querySelector(".exchange-rate");
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`
    });
}