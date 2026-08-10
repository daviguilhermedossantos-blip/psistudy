import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# Configuramos o Flask para ler a pasta atual como pasta de arquivos estáticos (HTML, CSS, JS)
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# ==========================================
# CONFIGURAÇÃO BLINDADA DO BANCO DE DADOS
# ==========================================
db_url = os.getenv('DATABASE_URL')

if db_url:
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    if "?" in db_url:
        db_url = db_url.split("?")[0]
else:
    db_path = os.path.join(os.path.dirname(__file__), 'psistudy.db')
    db_url = 'sqlite:///' + db_path

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ==========================================
# TABELAS DO BANCO DE DADOS
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

class Materia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    modulo = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='Em dia')
    progresso = db.Column(db.Integer, default=0)

with app.app_context():
    db.create_all()

# ==========================================
# ROTA PRINCIPAL (MOSTRAR O SITE - FRONTEND)
# ==========================================
@app.route('/')
def index():
    # Isso faz o servidor enviar o seu index.html quando acessam o site
    return send_from_directory('.', 'index.html')

# ==========================================
# ROTAS DA API (BACKEND)
# ==========================================
@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    d = request.json
    if Usuario.query.filter_by(email=d['email']).first(): return jsonify({"sucesso": False}), 400
    db.session.add(Usuario(nome=d['nome'], email=d['email'], senha=d['senha']))
    db.session.commit()
    return jsonify({"sucesso": True})

@app.route('/api/login', methods=['POST'])
def login():
    d = request.json
    u = Usuario.query.filter_by(email=d['email'], senha=d['senha']).first()
    return jsonify({"sucesso": bool(u), "usuario_id": u.id if u else None, "nome": u.nome if u else None})

@app.route('/api/tarefas/<int:uid>', methods=['GET', 'POST'])
def tarefas(uid):
    if request.method == 'POST':
        db.session.add(Tarefa(usuario_id=uid, descricao=request.json['descricao']))
        db.session.commit()
        return jsonify({"sucesso": True})
    return jsonify([{"id": t.id, "descricao": t.descricao, "concluida": t.concluida} for t in Tarefa.query.filter_by(usuario_id=uid).all()])

@app.route('/api/tarefas/<int:tid>/concluir', methods=['PUT'])
def concluir_tarefa(tid):
    t = Tarefa.query.get(tid)
    if t:
        t.concluida = not t.concluida
        db.session.commit()
    return jsonify({"sucesso": True})

@app.route('/api/tarefas/<int:tid>', methods=['DELETE'])
def deletar_tarefa(tid):
    t = Tarefa.query.get(tid)
    if t:
        db.session.delete(t)
        db.session.commit()
    return jsonify({"sucesso": True})

@app.route('/api/materias/<int:uid>', methods=['GET', 'POST'])
def materias(uid):
    if request.method == 'POST':
        d = request.json
        db.session.add(Materia(usuario_id=uid, nome=d['nome'], modulo=d['modulo']))
        db.session.commit()
        return jsonify({"sucesso": True})
    return jsonify([{"id": m.id, "nome": m.nome, "modulo": m.modulo, "status": m.status, "progresso": m.progresso} for m in Materia.query.filter_by(usuario_id=uid).all()])

@app.route('/api/materias/atualizar/<int:mid>', methods=['PUT'])
def atualizar_materia(mid):
    m = Materia.query.get(mid)
    d = request.json
    if 'progresso' in d: m.progresso = d['progresso']
    if 'status' in d: m.status = d['status']
    db.session.commit()
    return jsonify({"sucesso": True})

@app.route('/api/materias/<int:mid>', methods=['DELETE'])
def deletar_materia(mid):
    m = Materia.query.get(mid)
    if m:
        db.session.delete(m)
        db.session.commit()
    return jsonify({"sucesso": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)