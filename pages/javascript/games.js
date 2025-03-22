const respostaErrada = new CustomEvent("respostaErrada");
const respostaCerta = new CustomEvent("respostaCerta");
const vidasEsgotadas = new CustomEvent("vidasEsgotadas");
const proximaEtapa = new CustomEvent("proximaEtapa");

const atualizarInfo = new CustomEvent("atualizarInfo");


// Etapas
function explanacao(){}

function caractereQuiz(){}

const AudioQuiz = (pergunta, resposta, audio, listaOpcoes) => {
    class InternalAudioQuiz{
        constructor (pergunta, resposta, audio, listaOpcoes){
            this.pergunta = pergunta;
            this.resposta = resposta;
            this.audio = audio;
            this.listaOpcoes = listaOpcoes;
        }

        HTMLIstance(){
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
            confirmarBtn.hidden = true;

            fieldSetOpcoes.onchange = () => {
                confirmarBtn.hidden = false;
            };

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
    }

    return new InternalAudioQuiz(pergunta, resposta, audio, listaOpcoes);
}

// Sub-Elementos

function InterfaceInicial(){
    return `
    <div>
        <span> 5 Vidas</span>
        <progress max="10" value="1">Etapa 1</progress>
    </div>
    `
}

function popUpAcerto(){
    const popUP = document.createElement("div");
    popUP.classList.add("popUp");

    popUP.innerHTML =  `<p>Você Acertou</p>`;

    const botaoContinuar = document.createElement("button");
    botaoContinuar.onclick = () => dispatchEvent(proximaEtapa);
    botaoContinuar.innerText = "Continuar";

    popUP.appendChild(botaoContinuar);

    return popUP;
}

function popUpErro(){
    const popUP = document.createElement("div");
    popUP.classList.add("popUp");

    popUP.innerHTML =  `<p>Você Errou </p>`;

    const botaoContinuar = document.createElement("button");
    botaoContinuar.onclick = () => dispatchEvent(proximaEtapa);
    botaoContinuar.innerText = "Continuar";

    popUP.appendChild(botaoContinuar);

    return popUP;
}

function popUpVidasEsgotadas(){
    const popUP = document.createElement("div");
    popUP.classList.add("popUp");

    popUP.innerHTML =  `<p>Vidas esgotadas</p>`;

    const botaoContinuar = document.createElement("button");
    botaoContinuar.onclick = () => dispatchEvent(proximaEtapa);
    botaoContinuar.innerText = "Continuar";

    popUP.appendChild(botaoContinuar);

    return popUP;
}

function popUpLicaoConcluida(){
    const popUP = document.createElement("div");
    popUP.classList.add("popUp");

    popUP.innerHTML =  `<p>Você completou a Lição</p>`;

    const botaoContinuar = document.createElement("button");
    botaoContinuar.onclick = () => dispatchEvent(proximaEtapa);
    botaoContinuar.innerText = "Continuar";

    popUP.appendChild(botaoContinuar);

    return popUP;
}

// Controlador
class Controlador{
    constructor(etapas){
        this.vida = 5;
        this.numeroEtapa = 0;

        this.etapas = etapas;

        this.documentElement = document.createElement('div');
        this.documentElement.classList.add("controlador");

        const vidaSpan = document.createElement("span");
        vidaSpan.innerText = `${this.vida} Vidas`;

        const progress = document.createElement("progress")
        progress.value = 0;
        progress.max = this.etapas.length;

        this.etapaAtual = this.etapas.reverse().pop();

        const divIu = document.createElement("div");
        divIu.id = "divIu";
        divIu.appendChild(vidaSpan);
        divIu.appendChild(progress);

        this.documentElement.appendChild(divIu);
        this.documentElement.appendChild(this.etapaAtual.HTMLIstance());

        document.body.appendChild(this.documentElement);

        addEventListener("respostaCerta", () => this.exibirAcerto())
        addEventListener("respostaErrada", () => this.exibirErro())
        addEventListener("proximaEtapa", () => this.exibirProximaEtapa())
        addEventListener("atualizarInfo", () => this.atualizarInfo())
    }


    atualizarInfo(){
        console.log("atualizando infos")
        const divIu = document.getElementById("divIu");
        const vidaSpan = divIu.querySelector("span");
        const progress = divIu.querySelector("progress");

        vidaSpan.innerText = `${this.vida} Vidas`
        progress.value = this.numeroEtapa;
    }

    exibirProximaEtapa(){
        const etapaAtual = document.getElementById("etapa");
        if (etapaAtual) etapaAtual.remove();

        const popUps = document.querySelectorAll(".popUp");
        popUps.forEach(value => value.remove());
        
        if (this.vida < 1){
            this.documentElement.appendChild(popUpVidasEsgotadas());
            return;
        }

        const proximaEtapa = this.etapas.reverse().pop();
        if (proximaEtapa){
            this.etapaAtual = proximaEtapa;
            this.documentElement.appendChild(proximaEtapa.HTMLIstance());
        } else {
            this.documentElement.appendChild(popUpLicaoConcluida());
        }
    }

    exibirAcerto(){
        this.numeroEtapa += 1;
        dispatchEvent(atualizarInfo)
        this.documentElement.appendChild(popUpAcerto());
    }

    exibirErro(){
        this.vida -= 1;
        dispatchEvent(atualizarInfo);

        this.etapas.push(this.etapaAtual);

        this.documentElement.appendChild(popUpErro())
    }
}