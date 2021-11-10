const currencyOneEl = document.querySelector('[data-js="currency-one"]')
const currencyTwoEl = document.querySelector('[data-js="currency-two"]')
const convertedValueEl = document.querySelector('[data-js="converted-value"]')
const valuePrecionEl = document.querySelector('[data-js="conversion-precision"]')
const timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]')

let internalExchangeRate = {}
let currencyTwoSelected = ''
let currencyOneSelected = ''

const APIKey = 'daf56443438702dca1f50f2f'
const getURL = (currencyOneSelected) => `https://v6.exchangerate-api.com/v6/daf56443438702dca1f50f2f/latest/${currencyOneSelected}`

const getErrormessage = errorType =>  ({
  'unsupported-code': 'A moeda não existe em nosso banco de dados',
  'base-code-only-on-pro': 'Informações de moeda que não sejam USD ou EUR só podem ser acessadas a pa',
  'malformed-request': 'O endpoitn do seu request precisa seguir a estrutura à seguir: https://v6.exch',
  'invalid-key': 'A chave da API não é válida',
  'quota-reached': 'Sua conta alcançou o limite de requests permitidos em seu plano atual',
  'not-avaiable-on-plan': 'Seu plano atual não permite este tipo de request' 
})[errorType] || 'Não foi possível obter as informações'

const fetchExchangeRate = async (url) => {
  try{
    const response = await fetch(url)

    if(!response.ok) {
      throw new Error('Sua conexão falhou!')
    }

    const exchangeRateData = await response.json()

    if(exchangeRateData.result === 'error') {
      throw new Error(getErrormessage(exchangeRateData['error-type']))
    }

    return exchangeRateData
  } catch(err) {
    alert(err.message)
  }
}

const init = async () => {
  const exchangeRateData = await fetchExchangeRate(getURL('USD'))

  internalExchangeRate = { ... exchangeRateData}

  const getOptions = selectedCurrency => Object.keys(exchangeRateData.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
    .join('')

  
  currencyOneEl.innerHTML = getOptions('USD')
  currencyTwoEl.innerHTML = getOptions('BRL')

  convertedValueEl.textContent = exchangeRateData.conversion_rates.BRL.toFixed(2)
  valuePrecionEl.textContent = `1 USD = ${exchangeRateData.conversion_rates.BRL} BRL`

}

timesCurrencyOneEl.addEventListener('input', (e) =>
convertedValueEl.textContent = (e.target.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2)
)

currencyTwoEl.addEventListener('input', (e) => {
  currencyTwoSelected = e.target.value

  const currencyTwoValue =  (internalExchangeRate.conversion_rates[currencyTwoSelected]).toFixed(2)
  convertedValueEl.textContent = currencyTwoValue

  valuePrecionEl.textContent = `1 ${currencyOneSelected} = ${internalExchangeRate.conversion_rates[currencyTwoSelected]} ${currencyTwoSelected}`
  
})

currencyOneEl.addEventListener('input', async (e) => {
  currencyOneSelected = e.target.value

  internalExchangeRate = {...(await fetchExchangeRate(getURL(currencyOneSelected)))}

  const currencyOneValue =  (internalExchangeRate.conversion_rates[currencyOneSelected]).toFixed(2)

  convertedValueEl.textContent = (timesCurrencyOneEl.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2)

  valuePrecionEl.textContent = `1 ${currencyOneSelected} = ${internalExchangeRate.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value}`  
})


init()


