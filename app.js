// Ativa o suporte a PWA (Service Worker)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW falhou:', err));
    });
}

const appContent = document.getElementById('app-content');
const tabbar = document.getElementById('tabbar');
const tabBtns = document.querySelectorAll('.tab-btn');

const API_BASE = 'https://psistudy.onrender.com/api';

// ==========================================
// 1. TELAS (VISUAL)
// ==========================================

const telaLogin = `
    <section class="login-screen">
        <div class="welcome-header">
            <h2>Vamos começar?</h2>
            <p>Insira suas credenciais para acessar seu Psistudy.</p>
        </div>
        <div class="card input-card">
            <input type="email" placeholder="Digite seu e-mail" id="login-email">
            <input type="password" placeholder="Digite sua senha" id="login-senha">
            <button class="btn-primary" id="btn-entrar">ENTRAR →</button>
            <div style="text-align: center; margin-top: 20px;">
                <a href="#" style="color: #777; text-decoration: none; font-size: 0.95em;">Esqueceu a senha?</a>
            </div>
        </div>
        <div style="margin-top: 20px; text-align: center;">
            <span style="color: #666; font-size: 0.9em;">Ainda não tem conta?</span><br>
            <a class="form-link" id="btn-ir-cadastro" style="cursor:pointer; color: #28a745; font-weight: bold; text-decoration: none; display: inline-block; margin-top: 5px;">
                Crie sua conta aqui!
            </a>
            <div style="font-size: 24px; margin-top: 15px;">🤖</div>
        </div>
    </section>
`;

const telaCadastro = `
    <section class="login-screen">
        <div class="welcome-header">
            <h2>Nova Conta</h2>
            <p>Preencha os dados abaixo.</p>
        </div>
        <div class="card input-card">
            <input type="text" placeholder="Nome Completo" id="cad-nome">
            <input type="email" placeholder="E-mail" id="cad-email">
            <input type="password" placeholder="Crie uma Senha" id="cad-senha">
            <input type="password" placeholder="Confirme a Senha" id="cad-confirma">
            <button class="btn-primary" id="btn-finalizar-cadastro">CADASTRAR</button>
        </div>
        <div style="margin-top: 20px; text-align: center;">
            <a class="form-link" id="btn-voltar-login" style="cursor:pointer; color: #333; text-decoration: none;">
                Já possui uma conta? <b>Voltar para o Login</b>
            </a>
        </div>
    </section>
`;

const telaInicial = `
    <div class="card" style="border-left: 5px solid #FFD700;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2>Olá, <span id="nome-usuario-tela"></span>!</h2><span style="font-size: 0.9em; color: #555; font-weight: bold;">Prioridades 🚦</span>
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
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <input type="text" id="input-nova-tarefa" placeholder="O que você vai estudar?" style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px;">
            <button id="btn-add-tarefa" style="background: #FFD700; border: none; border-radius: 8px; font-weight: bold; padding: 0 15px; cursor: pointer;">+</button>
        </div>
        <div id="container-tarefas">
            <p style="text-align: center; color: #888;">Carregando tarefas...</p>
        </div>
    </div>
`;

const telaMaterias = `
    <div class="card" style="border-left: 5px solid #4CAF50;">
        <h2 style="margin-bottom: 15px; color: #333;">Minhas Matérias 📚</h2>
        
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            <input type="text" id="input-materia-nome" placeholder="Nome da Matéria (Ex: Psicanálise)" style="padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px;">
            <input type="text" id="input-materia-modulo" placeholder="Módulo (Ex: 3º Semestre)" style="padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px;">
            <button id="btn-add-materia" style="background: #4CAF50; color: white; border: none; border-radius: 8px; font-weight: bold; padding: 12px; cursor: pointer; font-size: 16px;">+ Adicionar Matéria</button>
        </div>

        <div id="container-materias">
            <p style="text-align: center; color: #888;">Carregando matérias...</p>
        </div>
    </div>
`;

const telaEstudo = `<div class="card" style="border-left: 5px solid #FFD700; text-align: center;"><h2>Em Breve: Flashcards Integrados!</h2></div>`;
const telaPaciente = `<div class="card" style="border-left: 5px solid #FFD700;"><h2>Em Breve: IA do Paciente!</h2></div>`;
const telaPerfil = `
    <div class="card" style="border-left: 5px solid #FFD700;">
        <h2>Perfil</h2>
        <button id="btn-sair" style="width: 100%; padding: 12px; background: #FF4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 20px;">SAIR DA CONTA ➔</button>
    </div>
`;

// ==========================================
// 2. LÓGICA DE NAVEGAÇÃO E API
// ==========================================

function carregarLogin() {
    appContent.innerHTML = telaLogin;
    tabbar.style.display = 'none';
    const perfilTopo = document.getElementById('perfil-topo');
    if(perfilTopo) perfilTopo.style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('btn-entrar').addEventListener('click', async () => {
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;
            const btn = document.getElementById('btn-entrar');
            
            if (!email || !senha) return alert("Preencha todos os campos!");
            
            btn.innerText = "CARREGANDO...";
            try {
                const resposta = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });
                
                const dados = await resposta.json();
                if (dados.sucesso) {
                    localStorage.setItem('usuario_id', dados.usuario_id);
                    localStorage.setItem('nome_usuario', dados.nome);
                    carregarInicio();
                } else {
                    alert(dados.mensagem);
                    btn.innerText = "ENTRAR →";
                }
            } catch (erro) {
                alert("Erro ao conectar com o servidor.");
                btn.innerText = "ENTRAR →";
            }
        });
        document.getElementById('btn-ir-cadastro').addEventListener('click', carregarCadastro);
    }, 50);
}

function carregarCadastro() {
    appContent.innerHTML = telaCadastro;
    tabbar.style.display = 'none';
    const perfilTopo = document.getElementById('perfil-topo');
    if(perfilTopo) perfilTopo.style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('btn-finalizar-cadastro').addEventListener('click', async () => {
            const nome = document.getElementById('cad-nome').value;
            const email = document.getElementById('cad-email').value;
            const senha = document.getElementById('cad-senha').value;
            const confirma = document.getElementById('cad-confirma').value;
            const btn = document.getElementById('btn-finalizar-cadastro');
            
            if (!nome || !email || !senha) return alert("Preencha todos os campos!");
            if (senha !== confirma) return alert("As senhas não coincidem!");
            
            btn.innerText = "CADASTRANDO...";
            try {
                const resposta = await fetch(`${API_BASE}/cadastro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });
                const dados = await resposta.json();
                alert(dados.mensagem);
                if (dados.sucesso) carregarLogin();
                else btn.innerText = "CADASTRAR";
            } catch (erro) {
                alert("Erro ao conectar com o servidor.");
                btn.innerText = "CADASTRAR";
            }
        });
        document.getElementById('btn-voltar-login').addEventListener('click', carregarLogin);
    }, 50);
}

function carregarInicio() {
    appContent.innerHTML = telaInicial;
    tabbar.style.display = 'flex';
    const perfilTopo = document.getElementById('perfil-topo');
    if(perfilTopo) perfilTopo.style.display = 'flex';

    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-module="inicio"]').classList.add('active');

    setTimeout(() => {
        document.getElementById('nome-usuario-tela').innerText = localStorage.getItem('nome_usuario') || 'Estudante';
        buscarTarefas();

        document.getElementById('btn-add-tarefa').addEventListener('click', async () => {
            const input = document.getElementById('input-nova-tarefa');
            if(!input.value) return;

            const usuarioId = localStorage.getItem('usuario_id');
            await fetch(`${API_BASE}/tarefas/${usuarioId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: input.value })
            });
            input.value = '';
            buscarTarefas();
        });
    }, 50);
}

async function buscarTarefas() {
    const usuarioId = localStorage.getItem('usuario_id');
    try {
        const resposta = await fetch(`${API_BASE}/tarefas/${usuarioId}`);
        const tarefas = await resposta.json();
        const container = document.getElementById('container-tarefas');
        
        if (tarefas.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #888;">Nenhuma tarefa ainda.</p>';
            return;
        }

        container.innerHTML = '';
        tarefas.forEach(tarefa => {
            const html = `
                <label class="tarefa-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 10px; border: 1px solid #eee; border-radius: 8px;">
                    <input type="checkbox" onchange="concluirTarefa(${tarefa.id})" style="width: 20px; height: 20px; accent-color: #FFD700;" ${tarefa.concluida ? 'checked' : ''}> 
                    <span style="font-size: 1.1em; flex-grow: 1; ${tarefa.concluida ? 'text-decoration: line-through; color: #888;' : ''}">${tarefa.descricao}</span>
                </label>
            `;
            container.innerHTML += html;
        });
    } catch (erro) {
        console.error("Erro ao buscar tarefas");
    }
}

window.concluirTarefa = async function(tarefaId) {
    await fetch(`${API_BASE}/tarefas/${tarefaId}/concluir`, { method: 'PUT' });
    buscarTarefas();
};

function carregarMaterias() {
    appContent.innerHTML = telaMaterias;
    buscarMaterias();

    setTimeout(() => {
        document.getElementById('btn-add-materia').addEventListener('click', async () => {
            const nome = document.getElementById('input-materia-nome').value;
            const modulo = document.getElementById('input-materia-modulo').value;
            
            if(!nome || !modulo) return alert("Preencha o nome e o semestre da matéria!");

            const usuarioId = localStorage.getItem('usuario_id');
            const btn = document.getElementById('btn-add-materia');
            btn.innerText = "Adicionando...";

            try {
                await fetch(`${API_BASE}/materias/${usuarioId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, modulo })
                });
                document.getElementById('input-materia-nome').value = '';
                document.getElementById('input-materia-modulo').value = '';
                buscarMaterias();
            } catch (e) {
                alert("Erro ao conectar com o servidor.");
            }
            btn.innerText = "+ Adicionar Matéria";
        });
    }, 50);
}

// O VISUAL COMPLETO DAS MATÉRIAS: Semáforo, Gráfico e Drive!
async function buscarMaterias() {
    const usuarioId = localStorage.getItem('usuario_id');
    try {
        const resposta = await fetch(`${API_BASE}/materias/${usuarioId}`);
        const materias = await resposta.json();
        const container = document.getElementById('container-materias');
        
        if (materias.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #888;">Nenhuma matéria cadastrada. Adicione a primeira acima!</p>';
            return;
        }

        container.innerHTML = '';
        materias.forEach(m => {
            let corStatus = '#28a745'; 
            let iconeStatus = '🟢';
            let progresso = m.progresso || 0;
            
            if (m.status === 'Atrasado') {
                corStatus = '#dc3545';
                iconeStatus = '🔴';
            } else if (m.status === 'Atenção') {
                corStatus = '#ffc107'; 
                iconeStatus = '🟡';
            } else if (m.status === 'Concluído') {
                corStatus = '#17a2b8'; 
                iconeStatus = '✅';
                progresso = 100;
            }

            const html = `
                <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; margin-bottom: 15px; background: #fafafa; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h3 style="margin: 0 0 5px 0; color: #333; display: flex; align-items: center; gap: 5px;">
                                ${iconeStatus} ${m.nome}
                            </h3>
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 0.9em;">Módulo: <b>${m.modulo}</b></p>
                        </div>
                        <a href="https://drive.google.com" target="_blank" style="background: #f1f3f4; color: #333; text-decoration: none; padding: 5px 10px; border-radius: 6px; font-size: 0.8em; display: flex; align-items: center; gap: 5px; border: 1px solid #ddd; font-weight: bold;">
                            📁 Drive
                        </a>
                    </div>
                    
                    <div style="margin-top: 10px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85em; color: #555; margin-bottom: 5px; font-weight: bold;">
                            <span>Progresso</span>
                            <span>${progresso}%</span>
                        </div>
                        <div style="width: 100%; background-color: #e9ecef; border-radius: 10px; height: 12px; overflow: hidden; border: 1px solid #ddd;">
                            <div style="width: ${progresso}%; background-color: ${corStatus}; height: 100%; transition: width 0.4s ease;"></div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button onclick="aumentarProgresso(${m.id}, ${progresso})" style="flex: 1; background: #fff; border: 1px solid #ccc; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 0.8em; font-weight: bold; color: #333;">+10% Progresso</button>
                        <select onchange="mudarStatusMateria(${m.id}, this.value)" style="flex: 1.5; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-size: 0.8em; font-weight: bold; color: #333; background: #fff;">
                            <option value="Em dia" ${m.status === 'Em dia' ? 'selected' : ''}>Em dia</option>
                            <option value="Atenção" ${m.status === 'Atenção' ? 'selected' : ''}>Atenção</option>
                            <option value="Atrasado" ${m.status === 'Atrasado' ? 'selected' : ''}>Atrasado</option>
                            <option value="Concluído" ${m.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
    } catch (erro) {
        console.error("Erro ao buscar matérias");
    }
}

// Funções para atualizar o gráfico e semáforo ao clicar!
window.aumentarProgresso = async function(id, progressoAtual) {
    let novoProgresso = progressoAtual + 10;
    if(novoProgresso > 100) novoProgresso = 100;
    
    await fetch(`${API_BASE}/materias/atualizar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progresso: novoProgresso })
    });
    buscarMaterias(); // Recarrega para animar a barra
};

window.mudarStatusMateria = async function(id, novoStatus) {
    let progresso = null;
    if (novoStatus === 'Concluído') progresso = 100;

    const body = progresso !== null ? { status: novoStatus, progresso } : { status: novoStatus };

    await fetch(`${API_BASE}/materias/atualizar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    buscarMaterias(); // Recarrega para mudar a cor do semáforo
};

// ==========================================
// 3. INICIALIZAÇÃO
// ==========================================
if (localStorage.getItem('usuario_id')) {
    carregarInicio();
} else {
    carregarLogin();
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const modulo = btn.dataset.module;
        if (modulo === 'inicio') carregarInicio();
        else if (modulo === 'materias') carregarMaterias();
        else if (modulo === 'estudo') appContent.innerHTML = telaEstudo;
        else if (modulo === 'paciente') appContent.innerHTML = telaPaciente;
        else if (modulo === 'perfil') {
            appContent.innerHTML = telaPerfil;
            setTimeout(() => {
                document.getElementById('btn-sair').addEventListener('click', () => {
                    localStorage.clear();
                    carregarLogin();
                });
            }, 50);
        }
    });
});