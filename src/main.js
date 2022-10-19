/*
>>>Para rodar o projeto digitar no terminal npm run dev
  .Vamos começar modificando a cor do cartão, para isso vamos utilizar o document.querySelector ("caminho > g")
  .O > g refere-se ao primeiro nível g dai dentro desse primeiro nível vamos pegat o primerio filho
  .O elemento path é um elemento genérico para definir uma forma. Todas as formas básicas poderão ser criadas com elemento de caminho.
  .O elemento g é um recipiente utilizado para agrupar objetos
  .Para mudar um valor de um determinado elemento usados o setAttribute("propriedade","valor")
  .O objeto SecurityCodePattern é um obejto criado para que possamos fazer uma máscara no nosso input CVC, onde o mesmo irá aceitar somente números
    e não aceitará nenhuma letra 
  .Com a seguinte expressão new Date().getFullYear criamos um objeto que irá pegar o ano completo em que estamos (2022)
    >>new Date().getFullYear.slice(2) irá pegar os ultímos dois numeros do ano

    <__ExPRESSÕES REGULARES__>
      Também conhecidas como Regular expressions ou Regex é uma tecnologia usada para buscar padrões dentro de textos e funciona em diversas linguágens 
        Expressão:
          const re: /foo/, (/expressão regular/) >> vai procurar dentro da string um palavra com um f seguido de um o seguindo de um outro o
        Maneiras de usar:
        (1)Agrupar padrões um um array
            const matches - 'aBC'.match(/[A-Z/g]);      >> /expressão regular/g vai fazer procurar na strig toda isso
                                                        >> /[A-Z]/ vai procurar caracteres de A até Z que sejam maiusculo 
                                                        >> .match vai agrupar em um array as respostas
              output: array [B,C]

        (2)Pesquisa se existe ou não padrão
            const index = 'aBC'.search(/[A-Z]/); 
              output: 1
        (3)Substitui os padrãos por um novo valor
            const next = 'aBC'.replace(/a/,"A")
             output: ABC
        >>>USO DE COLCHETES: [XYZ] qualquer um x,y,z
                             [J-Z] qualquer caracter entre J e Z
                             [^xyz] nenhum x,y,z
*/

import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    nubank: ["#36094a", "#Ae29ed"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType
//security code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)
//Experation date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    //Esse bloco permitirá fazermos uma máscara na parte do mês do CVC permitindo somente números de 1 a 12
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
//Agora iremos começar a trabalhar com o número do cartão e também fazer a verificação de qual tipo ele é
const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/, //Esse cartão vai começar com 4 e vai ter a partir desse 4, 15 digitos
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7])\d{0,12}/,
      /*Regras do mastercard:
        (1)Começar com o número 5 e depois seguido de numero entre 1-5 ai depois digitios de 0 ou até 2 dígitos
        (2)Começar com 22 e depois número de 2-9 e depois um digito qualquer
        (3)Começar com 2 seguido de um número entre 3-7 e depois seguido de um digito   
      */
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "") //.replace(/\D/g,'') Está se referendi a não aceitar nenhuma palavra em todo o input e se achar retornar como vazio o valor
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão Adicionado")
})
document.querySelector("form").addEventListener("submit", (event) => {
  //Quando utilizamos um input click, a pagina recarrega e perdemos nosso conteudo, sendo assim usamos essa função para que ela
  event.preventDefault() //leia se aconteceu algum evento e se acontecer é para desabilitar o reload da pagina.
})

//--------------------------------Card Name-----------------------------------
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})
//-------------------------------------Security Code-------------------------
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})
function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}
//-----------------------------------Card Number----------------------------
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})
function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9101 1111" : number
}
//--------------------------------Expiration Date--------------------------
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})
function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra  .value ")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
