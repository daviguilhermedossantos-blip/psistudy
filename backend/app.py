from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv
import os
import ssl

# Carrega as variáveis do arquivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# ==========================================
# 1. CONFIGURAÇÃO DO BANCO DE DADOS (COM PG8000)
# ==========================================
url_banco = os.getenv('DATABASE_URL', 'sqlite:///banco_reserva.db')

if url_banco.startswith("postgres://"):
    url_banco = url_banco.replace("postgres://", "postgresql+pg8000://", 1)
elif url_banco.startswith("postgresql://"):
    url_banco = url_banco.replace("postgresql://", "postgresql+pg8000://", 1)

if "?" in url_banco:
    url_banco = url_banco.split('?')[0]

app.config['SQLALCHEMY_DATABASE_URI'] = url_banco
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'connect_args': {'ssl_context': ssl.create_default_context()}
}

db = SQLAlchemy(app)

# ==========================================
# 2. TABELAS DO BANCO DE DADOS (MODELS)
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
    status = db.Column(db.String(20), default='Em dia')
    progresso = db.Column(db.Integer, default=0)

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    pergunta = db.Column(db.String(300), nullable=False)
    resposta = db.Column(db.String(500), nullable=False)
    nivel = db.Column(db.String(20), default='Novo')

with app.app_context():
    db.create_all()

# ==========================================
# 3. ROTAS DE LOGIN E CADASTRO
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
        return jsonify({"sucesso": True, "mensagem": "Login aprovado!", "usuario_id": usuario.id, "nome": usuario.nome})
    return jsonify({"sucesso": False, "mensagem": "E-mail ou senha incorretos."}), 401

# ==========================================
# 4. ROTAS DAS TAREFAS
# ==========================================
@app.route('/api/tarefas/<int:usuario_id>', methods=['GET', 'POST'])
def gerenciar_tarefas(usuario_id):
    if request.method == 'POST':
        dados = request.json
        nova_tarefa = Tarefa(usuario_id=usuario_id, descricao=dados['descricao'])
        db.session.add(nova_tarefa)
        db.session.commit()
        return jsonify({"sucesso": True, "mensagem": "Tarefa adicionada!"})
    
    tarefas = Tarefa.query.filter_by(usuario_id=usuario_id).order_by(Tarefa.id).all()
    resultado = [{"id": t.id, "descricao": t.descricao, "concluida": t.concluida} for t in tarefas]
    return jsonify(resultado)

@app.route('/api/tarefas/<int:tarefa_id>/concluir', methods=['PUT'])
def concluir_tarefa(tarefa_id):
    tarefa = Tarefa.query.get(tarefa_id)
    if tarefa:
        tarefa.concluida = not tarefa.concluida
        db.session.commit()
        return jsonify({"sucesso": True})
    return jsonify({"sucesso": False}), 404

# ==========================================
# 5. ROTAS DAS MATÉRIAS E FLASHCARDS
# ==========================================
# (NOVO) Agora o servidor sabe salvar matérias novas!
@app.route('/api/materias/<int:usuario_id>', methods=['GET', 'POST'])
def gerenciar_materias(usuario_id):
    if request.method == 'POST':
        dados = request.json
        nova_materia = Materia(usuario_id=usuario_id, nome=dados['nome'], modulo=dados['modulo'])
        db.session.add(nova_materia)
        db.session.commit()
        return jsonify({"sucesso": True})
    
    materias = Materia.query.filter_by(usuario_id=usuario_id).order_by(Materia.id).all()
    resultado = [{"id": m.id, "nome": m.nome, "modulo": m.modulo, "status": m.status, "progresso": m.progresso} for m in materias]
    return jsonify(resultado)

@app.route('/api/flashcards/<int:usuario_id>', methods=['GET'])
def listar_flashcards(usuario_id):
    cards = Flashcard.query.filter_by(usuario_id=usuario_id).all()
    resultado = [{"id": c.id, "pergunta": c.pergunta, "resposta": c.resposta, "nivel": c.nivel} for c in cards]
    return jsonify(resultado)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)