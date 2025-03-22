const respostaErrada = new CustomEvent("respostaErrada");
const respostaCerta = new CustomEvent("respostaCerta");
const vidasEsgotadas = new CustomEvent("vidasEsgotadas");
const proximaEtapa = new CustomEvent("proximaEtapa");

function audioQuiz(pergunta, resposta, audio, listaOpcoes){
    const divQuiz = document.createElement("div");
    divQuiz.id = "etapa";

    //Pergunta
    const divPergunta = document.createElement("div");
    divPergunta.innerHTML = pergunta;

    // Implementação do Audio

    // Opções
    const fieldSetOpcoes = document.createElement("fieldset");
    fieldSetOpcoes.id = "pergunta"
    fieldSetOpcoes.setAttribute("value", resposta);

    listaOpcoes.forEach((element, index) => {
        fieldSetOpcoes.innerHTML += 
        `<input type="radio" id=${index} value=${element} name="resposta"> 
        <label for=${index}>${element}</label>`;
    });
    const confirmarBtn = document.createElement("button");
    confirmarBtn.innerText = "Confirmar";

    confirmarBtn.onclick = () => {
        let opcaoSelecionada = document.querySelector("#pergunta input[name='resposta']:checked");

        if (opcaoSelecionada.value === resposta){
            dispatchEvent(respostaCerta);
        }else{
            dispatchEvent(respostaErrada);
        }
    }

    fieldSetOpcoes.appendChild(confirmarBtn);

    divQuiz.appendChild(divPergunta);
    divQuiz.appendChild(fieldSetOpcoes);

    return divQuiz;
}

class Controlador{
    constructor(etapas){
        this.etapas = etapas.reverse();
        this.documentElement= document.createElement('div')
    
        this.documentElement.classList.add("controlador");

        //Adicionando Progress Bar
        const progresso = document.createElement("progress");
        progresso.value = 1;
        progresso.max = this.etapas.length;

        this.documentElement.appendChild(progresso);
        this.documentElement.appendChild(this.etapas.pop())
        
        document.body.appendChild(this.documentElement);

        addEventListener("respostaCerta", () => this.exibirAcerto())
        addEventListener("respostaErrada", () => this.exibirErro())
        addEventListener("proximaEtapa", () => this.exibirProximaEtapa())
    }

    exibirProximaEtapa(){
        const etapaAtual = document.getElementById("etapa");
        if (etapaAtual) etapaAtual.remove();
        
        const proximaEtapa = this.etapas.pop();
        if (proximaEtapa){
            this.documentElement.appendChild(proximaEtapa);
        } else {
            this.documentElement.innerHTML = "Parabens você venceu todas"
        }
    }

    exibirAcerto(){
        this.documentElement.innerHTML += `<div>Você acertou!</div>`;
        dispatchEvent(proximaEtapa);
    }

    exibirErro(){
        this.documentElement.innerHTML += `<div>Você Errou!</div>`;
    }
}