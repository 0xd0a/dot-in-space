from flask import Flask
from flask_sqlalchemy import SQLAlchemy
#from run import db
from db import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    dots = db.relationship('Dot', backref='user', lazy=True)

class Dot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lat1 = db.Column(db.Float, nullable=False)
    lon1 = db.Column(db.Float, nullable=False)
    lat2 = db.Column(db.Float, nullable=False)
    lon2 = db.Column(db.Float, nullable=False)
    speed= db.Column(db.Float, nullable=False)
    dot_name =db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)
    script = db.Column(db.Text, nullable=False)
    started_at=db.Column(db.BigInteger, nullable=False)
    status = db.Column(db.Integer, nullable=False)


    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
        nullable=False)
    dotfiles = db.relationship('DotFiles', backref='dot', lazy=True)
    dotcollisions=db.relationship('DotCollisions', backref='dot', lazy=True)

# we won't use it for now
class DotFiles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.Text, nullable=False)
    content =db.Column(db.Text,nullable=False)
    file_hash = db.Column (db.String(255),nullable=False)
    dot_id = db.Column(db.Integer, db.ForeignKey('dot.id'),
        nullable=False)

class DotCollisions(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    collided_with=db.Column(db.Integer)
    collision_time=db.Column(db.DateTime, index=True, default=datetime.utcnow)
    state=db.Column(db.Text,nullable=False)
    snapshot=db.Column(db.Text(4294000000),nullable=False) # Base64 encoded binary
    dot_id = db.Column(db.Integer, db.ForeignKey('dot.id'),
        nullable=False)

#
# This is where hive-server will save interim json-state of the universe and a timestamp
# (every 5-10 seconds to reduce i/o)
# upon startup it must load the json from the saved state and [probably TODO] replay the world until
# it catches up with realtime
#

class CachedState(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    state=db.Column(db.Text,nullable=False)
