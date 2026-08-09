const API_BASE = 'https://psistudy.onrender.com/api';
const appContent = document.getElementById('app-content');
const tabbar = document.getElementById('tabbar');
const perfilTopo = document.getElementById('perfil-topo');
const tabBtns = document.querySelectorAll('.tab-btn');

let dataSelecionada = new Date();
let cronometroInterval = null;
let tempoRestante = 25 * 60;
let flashcardAtual = 0;
let todasTarefasApp = []; 

// ==========================================
// TELAS DO APP
// ==========================================

const telaLogin = `
    <div class="login-wrapper">
        <div style="text-align:center; margin-bottom:30px;">
            <h1 style="font-size:3.5em; color:#333;">Ψ</h1>
            <h2 style="color:#333; letter-spacing: 2px;">PSISTUDY</h2>
        </div>
        <div class="card">
            <input type="email" placeholder="E-mail" id="login-email" class="input-padrao">
            <input type="password" placeholder="Senha" id="login-senha" class="input-padrao">
            <button class="btn-primary" id="btn-entrar" style="margin-top:10px;">ENTRAR</button>
            <p style="text-align:center; margin-top:20px; font-size:0.9em; cursor:pointer; color:#555;" onclick="carregarCadastro()">Criar nova conta</p>
        </div>
    </div>
`;

const telaCadastro = `
    <div class="login-wrapper">
        <h2 style="text-align:center; margin-bottom:20px; color:#333;">Nova Conta</h2>
        <div class="card">
            <input type="text" placeholder="Nome Completo" id="cad-nome" class="input-padrao">
            <input type="email" placeholder="E-mail" id="cad-email" class="input-padrao">
            <input type="password" placeholder="Senha" id="cad-senha" class="input-padrao">
            <button class="btn-primary" id="btn-finalizar-cadastro" style="margin-top:10px;">CADASTRAR</button>
            <p style="text-align:center; margin-top:20px; font-size:0.9em; cursor:pointer; color:#555;" onclick="carregarLogin()">Voltar ao Login</p>
        </div>
    </div>
`;

const telaInicial = `
    <h2 style="color: #333; font-size: 1.8em;">Olá, <span id="nome-user"></span>!</h2>
    
    <div class="postit">
        <h3 style="font-size: 1em; margin-bottom: 10px;">📌 Metas da Semana</h3>
        <textarea id="texto-metas" style="background:transparent; border:none; width:100%; height:80px; font-family:inherit; resize:none; outline:none; font-size: 1.1em;" placeholder="Escreva suas metas aqui..."></textarea>
        <div style="text-align:right;"><button id="btn-salvar-meta" style="background:#333; color:#FFD700; border:none; padding:6px 15px; border-radius:4px; font-size:0.85em; font-weight:bold; cursor:pointer;">Salvar</button></div>
    </div>

    <div class="card" style="border-left: 5px solid #17a2b8;">
        <h3 style="font-size: 1.1em; margin-bottom: 10px;">📊 Desempenho</h3>
        <div id="grafico-colunas" style="display:flex; justify-content:space-around; align-items:flex-end; height:120px; border-bottom:1px solid #ddd; padding-bottom:5px;"></div>
    </div>

    <div class="card" style="border-left: 5px solid #FFD700;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="font-size: 1.1em;">📅 Calendário</h3>
            <span id="mes-ano-atual" style="font-weight:bold; font-size:0.9em; color:#555;"></span>
        </div>
        <div class="grid-calendario" style="font-weight:bold; color:#888; margin-bottom: 10px;"><div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div></div>
        <div class="grid-calendario" id="dias-calendario"></div>
    </div>

    <div class="card" style="border-left: 5px solid #FF4444;">
        <h3 style="font-size: 1.1em; margin-bottom: 15px;" id="titulo-tarefas">Lembretes do Dia</h3>
        <div style="display:flex; gap:8px; margin-bottom:15px;">
            <input type="time" id="input-hora" style="width:35%; padding:10px; border:1px solid #ccc; border-radius:6px; font-family:inherit;">
            <input type="text" id="input-tarefa" placeholder="Adicionar lembrete..." style="flex:1; padding:10px; border:1px solid #ccc; border-radius:6px;">
            <button id="btn-add-tarefa" style="background:#FF4444; color:#fff; border:none; border-radius:6px; padding:0 15px; font-weight:bold; cursor:pointer; font-size: 1.2em;">+</button>
        </div>
        <div id="container-tarefas"></div>
    </div>
`;

const telaMaterias = `
    <h2 style="color: #333; font-size: 1.8em;">Matérias 📚</h2>
    <div class="card" style="background: #fdfdfd; border-left: 5px solid #4CAF50;">
        <h3 style="font-size: 1em; margin-bottom: 15px; color:#555;">➕ Nova Disciplina</h3>
        <input type="text" id="input-materia-nome" placeholder="Nome da Matéria" class="input-padrao">
        <input type="text" id="input-materia-modulo" placeholder="Módulo (Ex: 1º Semestre)" class="input-padrao">
        <button id="btn-add-materia" class="btn-primary" style="background: #4CAF50; color: white;">Adicionar Matéria</button>
    </div>
    
    <div id="container-materias"></div>
`;

const telaEstudo = `
    <h2 style="color: #333; font-size: 1.8em;">Estudo 📖</h2>
    
    <div class="card" style="background: #f9f9f9; border-left: 5px solid #FFD700;">
        <h3 style="font-size:1em; margin-bottom:15px; color:#555;">➕ Criar Novo Flashcard</h3>
        <input type="text" id="nova-pergunta" placeholder="Digite a Pergunta..." class="input-padrao">
        <input type="text" id="nova-resposta" placeholder="Digite a Resposta..." class="input-padrao">
        <button onclick="salvarNovoFlashcard()" class="btn-primary" style="padding:10px;">Salvar Cartão</button>
    </div>

    <div id="container-flashcard"></div>
    <div style="display:flex; justify-content:space-between; gap:10px; margin-top: 10px;">
        <button onclick="proximoCard()" class="btn-primary" style="background:#dc3545; color:white; flex:1; padding: 15px;">Errei</button>
        <button onclick="proximoCard()" class="btn-primary" style="background:#ffc107; color:#333; flex:1; padding: 15px;">Difícil</button>
        <button onclick="proximoCard()" class="btn-primary" style="background:#28a745; color:white; flex:1; padding: 15px;">Acertei</button>
    </div>
    <button onclick="deletarFlashcardAtual()" class="btn-primary" style="background:transparent; color:#dc3545; border:2px solid #dc3545; padding:10px; margin-top:15px;">🗑️ Excluir este Cartão</button>

    <div class="card" style="border-left: 5px solid #FF4444; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 30px; margin-top:20px;">
        <p style="font-weight:bold; color:#555; font-size: 1.2em; margin-bottom: 15px;">Pomodoro Timer 🍅</p>
        <h2 id="display-tempo" style="font-size:3.5em; color:#333; margin-bottom: 20px;">25:00</h2>
        <div style="display:flex; gap:10px; margin-bottom:25px;">
            <button onclick="definirTempo(15)" style="padding:8px 15px; font-size:1em; cursor:pointer; border:1px solid #ccc; border-radius:6px; background:#fff; font-weight:bold;">15m</button>
            <button onclick="definirTempo(25)" style="padding:8px 15px; font-size:1em; cursor:pointer; border:1px solid #ccc; border-radius:6px; background:#fff; font-weight:bold;">25m</button>
            <button onclick="definirTempo(50)" style="padding:8px 15px; font-size:1em; cursor:pointer; border:1px solid #ccc; border-radius:6px; background:#fff; font-weight:bold;">50m</button>
        </div>
        <button id="btn-timer" onclick="iniciarCronometro()" style="background:#FF4444; color:white; border:none; width:70px; height:70px; border-radius:50%; font-size:2em; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.2); transition: 0.2s;">▶</button>
    </div>
`;

const telaPerfil = `
    <h2 style="color: #333; font-size: 1.8em;">Meu Perfil 👤</h2>
    <div class="card" style="text-align:center; padding: 40px 20px;">
        <img src="https://ui-avatars.com/api/?name=User&background=FFD700&color=333" style="width:100px; height:100px; border-radius:50%; margin-bottom:15px; border: 4px solid #f4f6f9;">
        <h3 id="perfil-nome" style="color:#333; font-size:1.5em; margin-bottom:5px;">Estudante</h3>
        <p style="color:#888; font-size:1em; font-weight: bold;">Nível 80 - Psistudy Pro</p>
        <button id="btn-sair" class="btn-primary" style="background:#dc3545; color:white; margin-top:30px; padding: 15px;">SAIR DA CONTA</button>
    </div>
`;

// ==========================================
// LÓGICA GERAL (LOGIN, CADASTRO, INIT)
// ==========================================

function alterarVisibilidadeBase(logado) {
    tabbar.style.display = logado ? 'flex' : 'none';
    perfilTopo.style.display = logado ? 'flex' : 'none';
}

window.carregarLogin = function() {
    appContent.innerHTML = telaLogin;
    alterarVisibilidadeBase(false);
    setTimeout(() => {
        document.getElementById('btn-entrar').onclick = async () => {
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;
            if(!email || !senha) return alert("Preencha tudo!");
            document.getElementById('btn-entrar').innerText = "Aguarde...";
            try {
                const res = await fetch(`${API_BASE}/login`, { method: 'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email, senha}) });
                const dados = await res.json();
                if(dados.sucesso) {
                    localStorage.setItem('usuario_id', dados.usuario_id);
                    localStorage.setItem('nome_usuario', dados.nome);
                    carregarInicio();
                } else { alert("Dados incorretos."); document.getElementById('btn-entrar').innerText = "ENTRAR"; }
            } catch(e) { alert("Erro de conexão."); document.getElementById('btn-entrar').innerText = "ENTRAR"; }
        };
    }, 50);
}

window.carregarCadastro = function() {
    appContent.innerHTML = telaCadastro;
    alterarVisibilidadeBase(false);
    setTimeout(() => {
        document.getElementById('btn-finalizar-cadastro').onclick = async () => {
            const nome = document.getElementById('cad-nome').value;
            const email = document.getElementById('cad-email').value;
            const senha = document.getElementById('cad-senha').value;
            if(!nome || !email || !senha) return alert("Preencha tudo!");
            try {
                const res = await fetch(`${API_BASE}/cadastro`, { method: 'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({nome, email, senha}) });
                const dados = await res.json();
                alert(dados.mensagem);
                if(dados.sucesso) carregarLogin();
            } catch(e) { alert("Erro de conexão."); }
        };
    }, 50);
}

// ==========================================
// ABA 1: INÍCIO (DASHBOARD E TAREFAS)
// ==========================================

function renderizarCalendarioDinamico() {
    const diasContainer = document.getElementById('dias-calendario');
    const titulo = document.getElementById('mes-ano-atual');
    if(!diasContainer) return;
    
    const ano = dataSelecionada.getFullYear();
    const mes = dataSelecionada.getMonth();
    const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    titulo.innerText = `${meses[mes]} ${ano}`;
    
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    
    let html = '';
    for(let i=0; i<primeiroDia; i++) html += `<div></div>`;
    
    for(let dia=1; dia<=totalDias; dia++) {
        let selecionado = (dia === dataSelecionada.getDate() && mes === dataSelecionada.getMonth() && ano === dataSelecionada.getFullYear()) 
            ? 'background:#FFD700; font-weight:bold; color:#333; box-shadow: 0 2px 4px rgba(0,0,0,0.2);' : 'color:#555;';
        
        let dataStrBusca = `${ano}-${mes}-${dia}`;
        let temTarefa = todasTarefasApp.some(t => t.descricao.startsWith(`[${dataStrBusca}]`));
        let dotHTML = temTarefa ? `<div class="dot-tarefa"></div>` : '';

        html += `<div class="dia-calendario" onclick="clicarDia(${ano}, ${mes}, ${dia})" style="${selecionado}">${dia}${dotHTML}</div>`;
    }
    diasContainer.innerHTML = html;
}

window.clicarDia = function(ano, mes, dia) {
    dataSelecionada = new Date(ano, mes, dia);
    renderizarCalendarioDinamico();
    document.getElementById('titulo-tarefas').innerText = `Lembretes (${dia}/${mes+1})`;
    renderizarTarefasNaTela();
};

function carregarInicio() {
    appContent.innerHTML = telaInicial;
    alterarVisibilidadeBase(true);
    
    setTimeout(() => {
        document.getElementById('nome-user').innerText = localStorage.getItem('nome_usuario') || 'Estudante';
        
        const campoMetas = document.getElementById('texto-metas');
        campoMetas.value = localStorage.getItem('metas_semana') || '';
        document.getElementById('btn-salvar-meta').onclick = function() {
            localStorage.setItem('metas_semana', campoMetas.value);
            this.innerText = "Salvo! ✓";
            setTimeout(() => this.innerText = "Salvar", 2000);
        };
        
        buscarParaGrafico();
        buscarTarefasGerais();

        document.getElementById('btn-add-tarefa').onclick = async () => {
            const hora = document.getElementById('input-hora').value;
            const text = document.getElementById('input-tarefa').value;
            if(!text) return;
            
            const dataStr = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth()}-${dataSelecionada.getDate()}`;
            const desc = `[${dataStr}]::${hora ? '['+hora+'] ' : ''}${text}`;
            
            await fetch(`${API_BASE}/tarefas/${localStorage.getItem('usuario_id')}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({descricao: desc}) });
            document.getElementById('input-tarefa').value = '';
            document.getElementById('input-hora').value = '';
            buscarTarefasGerais();
        };
    }, 50);
}

async function buscarTarefasGerais() {
    const id = localStorage.getItem('usuario_id');
    try {
        const res = await fetch(`${API_BASE}/tarefas/${id}`);
        todasTarefasApp = await res.json();
        renderizarCalendarioDinamico(); 
        renderizarTarefasNaTela();
    } catch(e){}
}

function renderizarTarefasNaTela() {
    const cont = document.getElementById('container-tarefas');
    if(!cont) return;
    
    const dataStrBusca = `${dataSelecionada.getFullYear()}-${dataSelecionada.getMonth()}-${dataSelecionada.getDate()}`;
    const tarefasDoDia = todasTarefasApp.filter(t => t.descricao.startsWith(`[${dataStrBusca}]::`));
    
    cont.innerHTML = tarefasDoDia.map(t => {
        let textoLimpo = t.descricao.split('::')[1] || t.descricao;
        return `
        <div style="display:flex; gap:10px; padding:12px; background:#fff; border:1px solid #eee; border-left:4px solid #FF4444; border-radius:8px; margin-bottom:10px; align-items:center;">
            <input type="checkbox" onchange="concluirTarefa(${t.id})" ${t.concluida?'checked':''} style="width:18px; height:18px;">
            <span style="font-size:1em; flex:1; color:#333; ${t.concluida?'text-decoration:line-through;color:#aaa;':''}">${textoLimpo}</span>
            <button onclick="deletarTarefa(${t.id})" style="background:transparent; border:none; cursor:pointer; font-size:1.2em; transition: 0.2s;">🗑️</button>
        </div>
    `}).join('') || '<p style="font-size:0.9em; color:#888; text-align:center; padding: 20px;">Nenhum lembrete para este dia.</p>';
}

window.concluirTarefa = async function(id) { 
    await fetch(`${API_BASE}/tarefas/${id}/concluir`, { method: 'PUT' }); 
    buscarTarefasGerais(); 
}

window.deletarTarefa = async function(id) { 
    if(confirm("Deseja excluir este lembrete?")) { 
        todasTarefasApp = todasTarefasApp.filter(t => t.id !== id);
        renderizarCalendarioDinamico(); 
        renderizarTarefasNaTela();
        try { await fetch(`${API_BASE}/tarefas/${id}`, { method: 'DELETE' }); } catch(e) {}
    } 
}

async function buscarParaGrafico() {
    const id = localStorage.getItem('usuario_id');
    try {
        const res = await fetch(`${API_BASE}/materias/${id}`);
        const mat = await res.json();
        const graf = document.getElementById('grafico-colunas');
        if(!graf) return;
        graf.innerHTML = mat.map(m => {
            let cor = m.status === 'Atrasado' ? '#FF4444' : m.status === 'Atenção' ? '#FFD700' : m.status === 'Concluído' ? '#28a745' : '#17a2b8';
            let alt = m.progresso > 0 ? m.progresso : 5;
            return `<div style="display:flex; flex-direction:column; align-items:center; width:18%; height:100%; justify-content:flex-end;">
                <span style="font-size:0.8em; font-weight:bold; color:#555;">${m.progresso}%</span>
                <div style="width:100%; background:${cor}; height:${alt}%; border-radius:4px 4px 0 0;"></div>
                <span style="font-size:0.8em; margin-top:5px; font-weight:bold; color:#333;">${m.nome.substring(0,4)}.</span>
            </div>`;
        }).join('') || '<p style="font-size:0.9em; color:#888; padding: 20px;">Adicione matérias para ver o gráfico.</p>';
    } catch(e){}
}

// ==========================================
// ABA 2: MATÉRIAS
// ==========================================

function carregarMaterias() {
    appContent.innerHTML = telaMaterias;
    setTimeout(() => {
        buscarMaterias();
        document.getElementById('btn-add-materia').onclick = async () => {
            const nome = document.getElementById('input-materia-nome').value;
            const modulo = document.getElementById('input-materia-modulo').value;
            if(!nome||!modulo) return;
            document.getElementById('btn-add-materia').innerText = "Aguarde...";
            await fetch(`${API_BASE}/materias/${localStorage.getItem('usuario_id')}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({nome, modulo}) });
            document.getElementById('input-materia-nome').value = '';
            document.getElementById('input-materia-modulo').value = '';
            buscarMaterias();
        };
    }, 50);
}

async function buscarMaterias() {
    const id = localStorage.getItem('usuario_id');
    try {
        const res = await fetch(`${API_BASE}/materias/${id}`);
        const mat = await res.json();
        const cont = document.getElementById('container-materias');
        if(!cont) return;
        cont.innerHTML = mat.map(m => {
            let cor = m.status === 'Atrasado' ? '#dc3545' : m.status === 'Atenção' ? '#ffc107' : m.status === 'Concluído' ? '#17a2b8' : '#28a745';
            return `
            <div class="card" id="card-materia-${m.id}" style="border-left: 5px solid ${cor}; position: relative; margin-bottom: 20px;">
                <button onclick="deletarMateria(${m.id})" style="position:absolute; top:15px; right:15px; background:transparent; border:none; cursor:pointer; font-size:1.2em;">🗑️</button>
                <h3 style="font-size:1.1em; color:#333; margin-bottom: 5px;">${m.nome}</h3>
                <p style="font-size:0.9em; color:#666; margin-bottom:15px; font-weight: bold;">${m.modulo}</p>
                <div style="background:#eee; height:10px; border-radius:5px; margin-bottom:15px;"><div style="background:${cor}; height:100%; width:${m.progresso}%; border-radius:5px; transition: width 0.4s ease;"></div></div>
                <div style="display:flex; gap:8px;">
                    <button onclick="updMat(${m.id}, ${m.progresso+10})" style="flex:1; padding:8px; border:1px solid #ccc; background:#fff; border-radius:6px; font-weight:bold; cursor:pointer;">+10%</button>
                    <select onchange="updStat(${m.id}, this.value)" style="flex:2; padding:8px; border:1px solid #ccc; border-radius:6px; background:#fff; font-weight:bold;">
                        <option value="Em dia" ${m.status==='Em dia'?'selected':''}>Em dia</option>
                        <option value="Atenção" ${m.status==='Atenção'?'selected':''}>Atenção</option>
                        <option value="Atrasado" ${m.status==='Atrasado'?'selected':''}>Atrasado</option>
                        <option value="Concluído" ${m.status==='Concluído'?'selected':''}>Concluído</option>
                    </select>
                </div>
            </div>`;
        }).join('') || '<p style="text-align:left; font-size:1em; color:#888;">Nenhuma matéria cadastrada.</p>';
        document.getElementById('btn-add-materia').innerText = "Adicionar Matéria";
    } catch(e){}
}

window.updMat = async function(id, prog) { if(prog>100)prog=100; await fetch(`${API_BASE}/materias/atualizar/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({progresso:prog})}); buscarMaterias(); }
window.updStat = async function(id, st) { await fetch(`${API_BASE}/materias/atualizar/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(st==='Concluído'?{status:st,progresso:100}:{status:st})}); buscarMaterias(); }

window.deletarMateria = async function(id) { 
    if(confirm("Deseja excluir esta matéria?")) { 
        const card = document.getElementById(`card-materia-${id}`);
        if(card) card.style.display = 'none';
        try { await fetch(`${API_BASE}/materias/${id}`, { method: 'DELETE' }); } catch(e) {}
    } 
}

// ==========================================
// ABA 3: ESTUDO (FLASHCARDS E POMODORO)
// ==========================================

function carregarEstudo() { appContent.innerHTML = telaEstudo; renderizarFlashcard(); }

window.salvarNovoFlashcard = function() {
    const p = document.getElementById('nova-pergunta').value;
    const r = document.getElementById('nova-resposta').value;
    if(!p || !r) return alert("Preencha a pergunta e a resposta!");
    
    let cards = JSON.parse(localStorage.getItem('meus_flashcards') || '[]');
    cards.push({ pergunta: p, resposta: r });
    localStorage.setItem('meus_flashcards', JSON.stringify(cards));
    
    document.getElementById('nova-pergunta').value = '';
    document.getElementById('nova-resposta').value = '';
    alert("Flashcard salvo!");
    renderizarFlashcard();
}

function renderizarFlashcard() {
    const cont = document.getElementById('container-flashcard');
    if(!cont) return;
    
    let cards = JSON.parse(localStorage.getItem('meus_flashcards') || '[]');
    if(cards.length === 0) {
        cont.innerHTML = `<div class="card" style="text-align:center; padding:40px; margin-bottom: 20px;"><p style="color:#888; font-size: 1.1em;">Nenhum flashcard cadastrado ainda.</p></div>`;
        return;
    }
    
    if(flashcardAtual >= cards.length) flashcardAtual = 0; 
    const c = cards[flashcardAtual];
    
    cont.innerHTML = `
        <div class="flip-container" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <p style="font-size: 1.3em; font-weight:bold; color:#333; padding: 0 20px;">${c.pergunta}</p>
                    <p style="font-size: 0.9em; margin-top:20px; color:#aaa;">(Toque para ver a resposta)</p>
                </div>
                <div class="flip-card-back">
                    <h3 style="color:#28a745; font-size:1em; margin-bottom:15px; text-transform:uppercase;">Resposta</h3>
                    <p style="font-size: 1.2em; font-weight:bold; color:#333; padding: 0 20px;">${c.resposta}</p>
                </div>
            </div>
        </div>
    `;
}

window.proximoCard = function() {
    const flip = document.querySelector('.flip-container');
    if (flip && flip.classList.contains('flipped')) {
        flip.classList.remove('flipped');
        setTimeout(() => { flashcardAtual++; renderizarFlashcard(); }, 250);
    } else {
        flashcardAtual++; renderizarFlashcard();
    }
}

window.deletarFlashcardAtual = function() {
    let cards = JSON.parse(localStorage.getItem('meus_flashcards') || '[]');
    if(cards.length === 0) return alert("Não há nada para excluir.");
    if(confirm("Deseja apagar este cartão?")) {
        cards.splice(flashcardAtual, 1);
        localStorage.setItem('meus_flashcards', JSON.stringify(cards));
        flashcardAtual = 0; 
        renderizarFlashcard();
    }
}

// CRONÔMETRO
window.definirTempo = function(minutos) {
    if(cronometroInterval) { clearInterval(cronometroInterval); cronometroInterval = null; }
    tempoRestante = minutos * 60;
    document.getElementById('display-tempo').innerText = `${minutos < 10 ? '0'+minutos : minutos}:00`;
    const btn = document.getElementById('btn-timer');
    btn.innerText = "▶"; btn.style.background = "#FF4444";
}

window.iniciarCronometro = function() {
    const btn = document.getElementById('btn-timer');
    const display = document.getElementById('display-tempo');
    if(cronometroInterval) {
        clearInterval(cronometroInterval); cronometroInterval = null;
        btn.innerText = "▶"; btn.style.background = "#FF4444";
        return;
    }
    btn.innerText = "⏸"; btn.style.background = "#333";
    cronometroInterval = setInterval(() => {
        if(tempoRestante <= 0) {
            clearInterval(cronometroInterval); cronometroInterval = null;
            alert("Tempo esgotado! Faça uma pausa.");
            definirTempo(25); return;
        }
        tempoRestante--;
        let min = Math.floor(tempoRestante / 60); let seg = tempoRestante % 60;
        display.innerText = `${min < 10 ? '0'+min : min}:${seg < 10 ? '0'+seg : seg}`;
    }, 1000);
}

// ==========================================
// NAVEGAÇÃO E INIT
// ==========================================

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const modulo = btn.dataset.module;
        if (modulo === 'inicio') carregarInicio();
        if (modulo === 'materias') carregarMaterias();
        if (modulo === 'estudo') carregarEstudo();
        if (modulo === 'perfil') {
            appContent.innerHTML = telaPerfil;
            setTimeout(() => {
                document.getElementById('perfil-nome').innerText = localStorage.getItem('nome_usuario');
                document.getElementById('btn-sair').onclick = () => { localStorage.clear(); carregarLogin(); };
            }, 50);
        }
    });
});

if (localStorage.getItem('usuario_id')) { carregarInicio(); } else { carregarLogin(); }