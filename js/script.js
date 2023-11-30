const converterPageBtn = document.getElementById("Converter-page"),
    currencyPageBtn = document.getElementById("Сurrency-rate-page"),
    converterPage = document.querySelector(".converter-container"),
    currencyPage = document.querySelector(".currencies-container"),
    selectOfCurr = document.getElementById("currency"),
    currencyRate = document.querySelector(".currency_rate"),
    conversionResult = document.querySelector('.result'),
    convertBtn = document.querySelector('.converter button'),
    convertInput = document.querySelector('.converter input')
let selectedCurr
converterPageBtn.addEventListener('click',()=>{
    currencyPage.style.display = "none"
    converterPage.style.display = "flex"
    converterPageBtn.classList.add("active");
    currencyPageBtn.classList.remove("active");
})
currencyPageBtn.addEventListener('click',()=>{
    converterPage.style.display = "none"
    currencyPage.style.display = "flex"
    currencyPageBtn.classList.add("active");
    converterPageBtn.classList.remove("active");
})
const currency = []
    fetch("https://v6.exchangerate-api.com/v6/e2f841bb70d60101f5a98283/latest/USD")
        .then(data => data.json()).then(data => {
            for (let curr in data["conversion_rates"]){
                currency.push(curr)
            }
            currency.sort()
    }).then(()=>{
        for(let curr of currency){
            const option = document.createElement("option")
            option.textContent = curr
            selectOfCurr.insertAdjacentElement("beforeend",option)
        }
    }).then(()=>selectedCurr = currency[0]).then(()=>courseOutput(selectedCurr))
selectOfCurr.addEventListener('change',()=>{
    selectedCurr = selectOfCurr.value
    courseOutput(selectedCurr)
})
function courseOutput(baseCurr){
    currencyRate.innerHTML = ""
    fetch(`https://v6.exchangerate-api.com/v6/e2f841bb70d60101f5a98283/latest/${baseCurr}`)
        .then(rate => rate.json())
        .then((rate)=>{
            for(let curr in rate["conversion_rates"]){
                if(curr !== selectedCurr){
                    const calculation = document.createElement("span")
                    calculation.textContent = `1 ${baseCurr} = ${rate["conversion_rates"][curr].toFixed(2)} ${curr} `
                    currencyRate.insertAdjacentElement('beforeend',calculation)
                }else{
                    continue
                }
            }
        })
}
function convertCurr(){
    const pattern = /^\d+\s[a-zA-Z]{3}\sin\s[a-zA-Z]{3}$/;
    if(convertInput.value === ""){
        return
    }
    if(pattern.test(convertInput.value)){
        const value = convertInput.value.split(" ")
        const quantity = value[0],
            currencyFrom = value[1].toUpperCase(),
            currencyTo = value[3].toUpperCase()
        fetch(`https://v6.exchangerate-api.com/v6/e2f841bb70d60101f5a98283/latest/${currencyFrom}`)
            .then(curr => curr.json())
            .then((data)=>{
                conversionResult.textContent = `${quantity} ${currencyFrom} = ${(data["conversion_rates"][currencyTo] * quantity).toFixed(2)} ${currencyTo}`
                convertInput.value = ""
            }).catch(()=>conversionResult.textContent = "Сheck the spelling of currencies")

    }
    else{
        conversionResult.textContent = "The input does not match the pattern"
    }
}
convertBtn.addEventListener('click',convertCurr)
convertInput.addEventListener('keydown',(e)=>{
    if (e.key === "Enter"){
        convertCurr()
    }
})

