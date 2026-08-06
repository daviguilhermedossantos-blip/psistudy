from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configuração do Banco de Dados
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///banco_reserva.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ==========================================
# 1. TABELAS DO BANCO DE DADOS (MODELS)
# ==========================================

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(100), nullable=False)

class Tarefa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    descricao = db.Column(db.String(200), nullable=False)
    concluida = db.Column(db.Boolean, default=False)
    data = db.Column(db.DateTime, default=datetime.utcnow)

class Materia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    modulo = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='Em dia') # Pode ser 'Em dia', 'Atrasado', 'Concluído'
    progresso = db.Column(db.Integer, default=0) # 0 a 100%

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    pergunta = db.Column(db.String(300), nullable=False)
    resposta = db.Column(db.String(500), nullable=False)
    nivel = db.Column(db.String(20), default='Novo') # 'Novo', 'Revisar', 'Difícil', 'Dominado'

# Cria as tabelas automaticamente
with app.app_context():
    db.create_all()

# ==========================================
# 2. ROTAS DE LOGIN E CADASTRO
# ==========================================

@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    dados = request.json
    if Usuario.query.filter_by(email=dados['email']).first():
        return jsonify({"sucesso": False, "mensagem": "Este e-mail já está em uso!"}), 400
    
    novo_usuario = Usuario(nome=dados['nome'], email=dados['email'], senha=dados['senha'])
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"sucesso": True, "mensagem": f"Conta criada com sucesso! Bem-vinda, {dados['nome']}!"})

@app.route('/api/login', methods=['POST'])
def login():
    dados = request.json
    usuario = Usuario.query.filter_by(email=dados['email'], senha=dados['senha']).first()
    if usuario:
        # AGORA RETORNA O ID DO USUÁRIO TAMBÉM!
        return jsonify({"sucesso": True, "mensagem": f"Login aprovado!", "usuario_id": usuario.id, "nome": usuario.nome})
    return jsonify({"sucesso": False, "mensagem": "E-mail ou senha incorretos."}), 401

# ==========================================
# 3. ROTAS DAS TAREFAS
# ==========================================

@app.route('/api/tarefas/<int:usuario_id>', methods=['GET', 'POST'])
def gerenciar_tarefas(usuario_id):
    if request.method == 'POST':
        dados = request.json
        nova_tarefa = Tarefa(usuario_id=usuario_id, descricao=dados['descricao'])
        db.session.add(nova_tarefa)
        db.session.commit()
        return jsonify({"sucesso": True, "mensagem": "Tarefa adicionada!"})
    
    # Se for GET, lista as tarefas
    tarefas = Tarefa.query.filter_by(usuario_id=usuario_id).all()
    resultado = [{"id": t.id, "descricao": t.descricao, "concluida": t.concluida} for t in tarefas]
    return jsonify(resultado)

@app.route('/api/tarefas/<int:tarefa_id>/concluir', methods=['PUT'])
def concluir_tarefa(tarefa_id):
    tarefa = Tarefa.query.get(tarefa_id)
    if tarefa:
        tarefa.concluida = not tarefa.concluida # Inverte (se tava falso vira verdadeiro)
        db.session.commit()
        return jsonify({"sucesso": True})
    return jsonify({"sucesso": False}), 404

# ==========================================
# 4. ROTAS DAS MATÉRIAS E FLASHCARDS
# ==========================================
# (Deixei preparados para conectarmos no Front-end depois!)

@app.route('/api/materias/<int:usuario_id>', methods=['GET'])
def listar_materias(usuario_id):
    materias = Materia.query.filter_by(usuario_id=usuario_id).all()
    resultado = [{"id": m.id, "nome": m.nome, "modulo": m.modulo, "status": m.status, "progresso": m.progresso} for m in materias]
    return jsonify(resultado)

@app.route('/api/flashcards/<int:usuario_id>', methods=['GET'])
def listar_flashcards(usuario_id):
    cards = Flashcard.query.filter_by(usuario_id=usuario_id).all()
    resultado = [{"id": c.id, "pergunta": c.pergunta, "resposta": c.resposta, "nivel": c.nivel} for c in cards]
    return jsonify(resultado)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)