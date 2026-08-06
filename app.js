// Ativa o suporte a PWA (Service Worker)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW falhou:', err));
    });
}

const appContent = document.getElementById('app-content');
const tabbar = document.getElementById('tabbar');
const tabBtns = document.querySelectorAll('.tab-btn');

// --- TELAS ---
const telaLogin = `
    <section class="login-screen">
        <div class="welcome-header">
            <h2>Vamos começar?</h2>
            <p>Insira suas credenciais para acessar seu Psistudy.</p>
        </div>
        <div class="card input-card">
            <input type="email" placeholder="Digite seu e-mail">
            <input type="password" placeholder="Digite sua senha">
            <button class="btn-primary" id="btn-entrar">ENTRAR →</button>
            <a href="#" class="form-link">Esqueceu a senha?</a>
        </div>
        <div style="margin-top: 5px; text-align: center;">
            <a class="form-link" id="btn-ir-cadastro" style="cursor:pointer;">
                Ainda não tem conta? <span>Crie sua conta aqui!</span>
            </a>
            <div style="font-size: 24px; margin-top: 10px;">🤖</div>
        </div>
    </section>
`;

const telaCadastro = `
    <section class="login-screen">
        <div class="welcome-header">
            <h2>Nova Conta</h2>
            <p>Preencha os dados abaixo para iniciar sua jornada.</p>
        </div>
        <div class="card input-card">
            <input type="text" placeholder="Nome Completo">
            <input type="email" placeholder="E-mail">
            <input type="password" placeholder="Crie uma Senha">
            <input type="password" placeholder="Confirme a Senha">
            <button class="btn-primary" id="btn-finalizar-cadastro">CADASTRAR</button>
        </div>
        <div style="margin-top: 5px; text-align: center;">
            <a class="form-link" id="btn-voltar-login" style="cursor:pointer;">
                Já possui uma conta? <span style="color: #333;">Voltar para o Login</span>
            </a>
        </div>
    </section>
`;

const telaInicial = `
    <div class="card" style="border-left: 5px solid #FFD700;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2>CALENDÁRIO</h2><span style="font-size: 0.9em; color: #555; font-weight: bold;">Prioridades 🚦</span>
        </div>
        <div class="grid-calendario dia-semana">
            <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
        </div>
        <div class="grid-calendario">
            <div class="dia-inativo">30</div><div class="dia-inativo">31</div><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
            <div>6</div><div>7 <br>🚥</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div>
            <div>13</div><div>14</div><div class="dia-hoje">15 <br>🚦</div><div>16</div><div>17</div><div>18</div><div>19</div>
        </div>
    </div>
    <div class="card" style="border-left: 5px solid #FFD700;">
        <h2 style="font-size: 1.2em; margin-bottom: 15px;">Lista de Estudos de Hoje</h2>
        <label class="tarefa-item">
            <input type="checkbox" style="width: 20px; height: 20px; accent-color: #FFD700;"> 
            <span style="font-size: 1.1em; flex-grow: 1;">Neurotransmissores (Revisão)</span><span style="font-size: 1.2em;">🟢</span>
        </label>
        <label class="tarefa-item">
            <input type="checkbox" style="width: 20px; height: 20px; accent-color: #FFD700;"> 
            <span style="font-size: 1.1em; flex-grow: 1;">Ler Artigo Freud</span><span style="font-size: 1.2em;">🟡</span>
        </label>
    </div>
`;

const telaEstudo = `
    <div class="card" style="border-left: 5px solid #FFD700; text-align: center;">
        <h2 style="margin-bottom: 20px; color: #333;">TDAH</h2>
        <div id="cartao-flashcard" style="background-color: #FFFDE7; border: 1px solid #FCD660; border-radius: 12px; padding: 40px 20px; min-height: 220px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px; transition: transform 0.3s;">
            <h3 id="texto-flashcard" style="font-size: 1.4em; color: #222;">Quais os principais sintomas em adultos?</h3>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 10px;">
            <button style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background-color: #FF4444; color: white;">Revisar</button>
            <button style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background-color: #FFD700; color: #333;">Difícil</button>
            <button style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background-color: #2F7C2F; color: white;">Dominado</button>
        </div>
    </div>
`;

const telaPaciente = `
    <div class="card" style="border-left: 5px solid #FFD700; padding: 15px;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <div style="font-size: 40px; background: #f0f0f0; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">👴</div>
            <div>
                <h2 style="font-size: 1.2em; color: #333;">Carlos (Idoso)</h2>
                <p style="color: #666; font-size: 0.9em;">70 anos</p>
                <p style="color: #CC0000; font-size: 0.85em; font-weight: bold; margin-top: 2px;">Queixa: Lapsos de Memória</p>
            </div>
        </div>
        <div style="background-color: #F8F8F4; border-radius: 12px; padding: 15px; height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
            <div style="align-self: flex-start; background-color: #FFFFFF; padding: 10px 15px; border-radius: 12px 12px 12px 0; max-width: 85%; font-size: 0.95em;">
                <span style="font-size: 0.8em; color: #888; display: block; margin-bottom: 3px;">IA (Carlos)</span>
                Doutora, eu não sei o que está acontecendo. Ontem eu esqueci onde guardei as chaves de casa de novo...
            </div>
            <div style="align-self: flex-end; background-color: #FCD660; padding: 10px 15px; border-radius: 12px 12px 0 12px; max-width: 85%; font-size: 0.95em; color: #222;">
                <span style="font-size: 0.8em; color: #777; display: block; margin-bottom: 3px;">Terapeuta</span>
                Entendo, Carlos. Isso deve estar gerando bastante angústia. Quando foi a primeira vez que notou isso?
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background-color: #FFD700; color: #333;">🎤 Falar</button>
            <button style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background-color: #FFFFFF; border: 1px solid #ccc; color: #333;">⌨️ Digitar</button>
        </div>
    </div>
`;

const telaMaterias = `
    <div class="card" style="border-left: 5px solid #FFD700;">
        <h2 style="margin-bottom: 15px;">MATÉRIAS</h2>
        <div style="background: #F8F8F4; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <div><h3 style="font-size: 1.1em; color: #333;">Neurociências</h3><p style="font-size: 0.9em; color: #666;">Módulo 1</p></div>
            <div style="font-size: 24px;">✅</div>
        </div>
        <div style="background: #FFEAEA; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #FCC;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <h3 style="font-size: 1.1em; color: #CC0000;">Áreas Corticais</h3><span style="font-size: 0.8em; font-weight: bold; color: #CC0000;">Atrasado 🔴</span>
            </div>
            <div style="height: 8px; background: #FFC0C0; border-radius: 4px; width: 100%;"><div style="height: 100%; background: #CC0000; width: 40%; border-radius: 4px;"></div></div>
        </div>
        <div style="background: #EAFCEE; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #CFC;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <h3 style="font-size: 1.1em; color: #2F7C2F;">Módulo 3 Fitera</h3><span style="font-size: 0.8em; font-weight: bold; color: #2F7C2F;">Em dia 🟢</span>
            </div>
            <div style="height: 8px; background: #C0E8C0; border-radius: 4px; width: 100%;"><div style="height: 100%; background: #2F7C2F; width: 80%; border-radius: 4px;"></div></div>
        </div>
    </div>
`;

const telaPerfil = `
    <div class="card" style="border-left: 5px solid #FFD700;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
            <div style="font-size: 35px; background: #f0f0f0; border-radius: 50%; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border: 3px solid #FFD700;">M</div>
            <div>
                <h2 style="font-size: 1.4em; color: #333;">Marina</h2>
                <p style="color: #666; font-size: 0.9em;">marina@exemplo.com</p>
                <span style="background: #FFD700; color: #333; padding: 3px 10px; border-radius: 12px; font-size: 0.8em; font-weight: bold; display: inline-block; margin-top: 5px;">Nível 80 🏆</span>
            </div>
        </div>
        <div style="margin-bottom: 25px;">
            <h3 style="font-size: 1.1em; margin-bottom: 10px; color: #444;">Integrações</h3>
            <button style="width: 100%; padding: 12px; background: #FFFFFF; border: 1px solid #ccc; border-radius: 8px; font-weight: bold; margin-bottom: 10px;">🔺 Vincular Google Drive</button>
            <button style="width: 100%; padding: 12px; background: #FFFFFF; border: 1px solid #ccc; border-radius: 8px; font-weight: bold;">🐙 Sincronizar GitHub</button>
        </div>
        <button id="btn-sair" style="width: 100%; padding: 12px; background: #FF4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">SAIR DA CONTA ➔</button>
    </div>
`;

// --- LÓGICA DE NAVEGAÇÃO E API ---
function carregarLogin() {
    appContent.innerHTML = telaLogin;
    tabbar.style.display = 'none';
    
    setTimeout(() => {
        const btnEntrar = document.getElementById('btn-entrar');
        const btnIrCadastro = document.getElementById('btn-ir-cadastro');
        
        btnEntrar.addEventListener('click', async () => {
            const inputs = document.querySelectorAll('.input-card input');
            const email = inputs[0].value;
            const senha = inputs[1].value;
            
            if (!email || !senha) {
                alert("Por favor, preencha e-mail e senha!");
                return;
            }
            
            btnEntrar.innerText = "CARREGANDO...";
            
            try {
                // MÁGICA AQUI: O hostname vai se adaptar automaticamente ao IP ou localhost
                const apiUrl = `http://${window.location.hostname}:5000/api/login`;
                
                const resposta = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, senha: senha })
                });
                
                const dados = await resposta.json();
                
                if (dados.sucesso) {
                    alert(dados.mensagem);
                    carregarInicio();
                } else {
                    alert(dados.mensagem);
                    btnEntrar.innerText = "ENTRAR →";
                }
            } catch (erro) {
                console.error("Erro:", erro);
                alert("Servidor offline. Verifique sua conexão com o backend!");
                btnEntrar.innerText = "ENTRAR →";
            }
        });

        btnIrCadastro.addEventListener('click', carregarCadastro);
    }, 50);
}

function carregarCadastro() {
    appContent.innerHTML = telaCadastro;
    tabbar.style.display = 'none';
    
    setTimeout(() => {
        const btnFinalizarCadastro = document.getElementById('btn-finalizar-cadastro');
        const btnVoltarLogin = document.getElementById('btn-voltar-login');
        
        btnFinalizarCadastro.addEventListener('click', async () => {
            const inputs = document.querySelectorAll('.input-card input');
            const nome = inputs[0].value;
            const email = inputs[1].value;
            const senha = inputs[2].value;
            const confirmaSenha = inputs[3].value;
            
            if (!nome || !email || !senha) {
                alert("Por favor, preencha todos os campos!");
                return;
            }
            if (senha !== confirmaSenha) {
                alert("As senhas não coincidem!");
                return;
            }
            
            btnFinalizarCadastro.innerText = "CADASTRANDO...";
            
            try {
                // MÁGICA AQUI TAMBÉM
                const apiUrl = `http://${window.location.hostname}:5000/api/cadastro`;

                const resposta = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: nome, email: email, senha: senha })
                });
                
                const dados = await resposta.json();
                
                if (dados.sucesso) {
                    alert(dados.mensagem);
                    carregarLogin(); 
                } else {
                    alert(dados.mensagem);
                    btnFinalizarCadastro.innerText = "CADASTRAR";
                }
            } catch (erro) {
                console.error("Erro:", erro);
                alert("Servidor offline. Verifique sua conexão com o backend!");
                btnFinalizarCadastro.innerText = "CADASTRAR";
            }
        });

        btnVoltarLogin.addEventListener('click', carregarLogin);
    }, 50);
}

function carregarInicio() {
    appContent.innerHTML = telaInicial;
    tabbar.style.display = 'flex';
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-module="inicio"]').classList.add('active');
}

// INICIALIZA O APP NA TELA DE LOGIN
carregarLogin();

// CONTROLE DA BARRA INFERIOR E TROCA DE TELAS PRINCIPAIS
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const modulo = btn.dataset.module;
        
        if (modulo === 'inicio') appContent.innerHTML = telaInicial;
        else if (modulo === 'materias') appContent.innerHTML = telaMaterias;
        else if (modulo === 'estudo') {
            appContent.innerHTML = telaEstudo;
            setTimeout(() => {
                const cartao = document.getElementById('cartao-flashcard');
                const texto = document.getElementById('texto-flashcard');
                let virado = false;
                if(cartao) {
                    cartao.addEventListener('click', () => {
                        virado = !virado;
                        if (virado) {
                            cartao.style.backgroundColor = "#FFFFFF";
                            texto.innerHTML = "Desatenção, hiperatividade mental, impulsividade e regulação emocional.";
                            texto.style.color = "#2F7C2F"; 
                        } else {
                            cartao.style.backgroundColor = "#FFFDE7";
                            texto.innerHTML = "Quais os principais sintomas em adultos?";
                            texto.style.color = "#222";
                        }
                    });
                }
            }, 50);
        }
        else if (modulo === 'paciente') appContent.innerHTML = telaPaciente;
        else if (modulo === 'perfil') {
            appContent.innerHTML = telaPerfil;
            setTimeout(() => document.getElementById('btn-sair').addEventListener('click', carregarLogin), 50);
        }
    });
});