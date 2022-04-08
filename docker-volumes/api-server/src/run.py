from flask import Flask, jsonify, request, json, redirect
from flask import render_template

from flask_mysqldb import MySQL
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity,
    jwt_refresh_token_required, create_refresh_token
)

from flask_debugtoolbar import DebugToolbarExtension
import time
from flask import Response
import json

import redis
import os
from werkzeug.utils import secure_filename
import array

import logging

from db import db
from flask_migrate import Migrate
import uuid
import schema
import re

import requests
import shutil
from PIL import Image
import pybase64
from io import BytesIO

#from flask_sqlalchemy import SQLAlchemy as _BaseSQLAlchemy
# Make sure we are always connected by pre-pinging mysql server
#class SQLAlchemy(_BaseSQLAlchemy):
#    def apply_pool_defaults(self, app, options):
#        super(SQLAlchemy, self).apply_pool_defaults(app, options)
#        options["pool_pre_ping"] = True

app = Flask(__name__)

app.debug = True

app.config['SECRET_KEY'] = '<replace with a secret key>'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = os.environ['MYSQL_PASSWORD']
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_HOST'] = 'mariadb' # should be mariadb docker instance
app.config['MYSQL_DB'] = 'dothive'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['JWT_SECRET_KEY'] = os.environ['JWT_SECRET_KEY']
# charset setting is very important, mysql internal utf8 is 3-byte long which
# is pretty weird, 'cuz should be 4 bytes
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{app.config['MYSQL_USER']}:{app.config['MYSQL_PASSWORD']}@{app.config['MYSQL_HOST']}:{app.config['MYSQL_PORT']}/{app.config['MYSQL_DB']}?charset=utf8mb4"
app.config['UPLOAD_FOLDER'] = '/tmp'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['SQLALCHEMY_ECHO'] = True
app.config['SQLALCHEMY_POOL_SIZE'] = 100
app.config['SQLALCHEMY_POOL_RECYCLE'] = 600

#toolbar = DebugToolbarExtension(app) # DEBUG

#import db
db.app=app
db.init_app(app)
db.create_all()

#db=SQLAlchemy(app)
migrate = Migrate(app, db)

#import schema

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

#login_manager = LoginManager()
#login_manager.init_app(app)

#schema_init(db)
#schema_init.init_db(app,db)
CORS(app)

@app.route('/api/users/register', methods=['POST'])
def register():
#    cur = db.connection.cursor()
    # TODO Exception

    email = request.get_json()['email']

    q=schema.User.query.filter_by(email=email).first()
    if q:
        return "User already exists"

    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    created = datetime.utcnow()
    u=schema.User(name=f'{first_name} {last_name}',email=email,password=password)
    db.session.add(u)
    db.session.commit()

    result = {
		'first_name' : first_name,
		'last_name' : last_name,
		'email' : email,
		'password' : '',
		'created' : created
	}

    return jsonify({'result' : result})


@app.route('/api/users/login', methods=['POST'])
def login():

    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""
    q=schema.User.query.filter_by(email=email).first()

    if q and bcrypt.check_password_hash(q.password, password):
        access_token = {
                'access_token':create_access_token(identity = {'id': q.id, 'name': q.name,'email': q.email}),
                'refresh_token': create_refresh_token(identity = {'id': q.id, 'name': q.name,'email': q.email}),
                'error':''
                }
        result = access_token
    else:
        result = {"error":"Invalid username and password"}

    return jsonify(result)

@app.route('/api/auth/token/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user, fresh=False)
    ret = {'token': new_token}
    return jsonify(ret), 200

@app.route('/api/state')
def state():
    print("State")
    r = redis.Redis(host='redis', port=6379, db=0)
    return r.get('dot-in-space-snapshot') or '{}'

@app.route('/api/users/createdot', methods=['POST'])
@jwt_required
def upload_file():
    idInfo=get_jwt_identity()
    print("Uploading file",flush=True)
#    if request.method == 'POST':
    # check if the post request has the files part
    filenames={}
    hashes={}
#    if 'file' not in request.files:
#        print('No file part')
#        print(request.files)
#        return "no file part" #redirect(request.url)
#    files = request.files.getlist('file')
#    file_prefix=uuid.uuid4().hex
#    for file in files:
#        if file:# and allowed_file(file.filename):
#            uhash=str(uuid.uuid4())
#            filename = 'dhive-'+file_prefix+'-'+uhash

#            original_name=file.filename
#            path=os.path.join(app.config['UPLOAD_FOLDER'], filename)
#            file.save(path)
#            filenames[original_name]=path
#            hashes[original_name]=uhash
    # VALIDATION TODO

#    res=str(filenames)
    res=request.form.get('lat1')+ ":"+request.form.get('lon1')+","+request.form.get('lat2')+":"+request.form.get('lon2')

    x=[ 0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0 ]
    initial_state=json.dumps(x)
    script = request.form.get('script')

    res=res+"LONLONLON: INITIAL: "+initial_state

    p = schema.User.query.filter_by(email=idInfo['email']).first_or_404() #or404

    dot=schema.Dot(lat1=request.form.get('lat1'),
                    lon1=request.form.get('lon1'),
                    lat2=request.form.get('lat2'),
                    lon2=request.form.get('lon2'),
                    description=request.form.get('manifesto') or '',
                    dot_name=request.form.get('dot_name') or '',
                    script=script or '',
                    speed=0,
                    started_at=time.time(),
                    status=1)
    #db.session.add(dot)
    p.dots.append(dot)
    #db.session.commit()
    #return "<body>Session commited</body>"

    # for f in dict.keys(filenames):
    #     res=res+", working on "+f
    #     if os.path.exists(filenames[f]):
    #         with open(filenames[f]) as fl:
    #             res=res+"opened file="+filenames[f]+"="
    #             c=fl.read()
    #             dotfile=schema.DotFiles(file_name=f,content=c,file_hash=hashes[f])
    #             dot.dotfiles.append(dotfile)

    #initialize the state
    dotstate=schema.DotCollisions(state=initial_state,snapshot='')
    dot.dotcollisions.append(dotstate)

    # final commit here
    db.session.commit()

    r = redis.Redis(host='redis', port=6379, db=0)
    r.set("sync-dots","1")

    #TODO now delete all files that start with "dhive-file_prefix"
    return "<body>Success"+res+"</body>" #redirect('/')


@app.route('/api/users/dot_details/<dot_id>')
#@jwt_required
def dot_details(dot_id):
#    idInfo=get_jwt_identity()
#    user_id=idInfo.id
    dot_info=schema.Dot.query.filter_by(id=dot_id,#user_id=user_id
                ).first_or_404()

    return jsonify(dot_info.dotfiles[0].file_name)


@app.route('/api/users/dot_list/<user_id>')
@jwt_required
def dot_list(user_id):
    idInfo=get_jwt_identity()
    user_id=idInfo.id
    result=schema.Dot.query.filter_by(user_id=user_id).all_or_404()
    return jsonify(result)

# API to get files
# get file by its uuid, might not work, cuz javascript hash the bloody
# ability to require correct filenames
#
# in this case we will have to have different route interface
@app.route('/api/users/static/<filehash>', methods=['GET'])
#@jwt_required
def get_file(filehash):
    #filehash=request.args.get('hash')
    print("getting file "+filehash)

    result=schema.DotFiles.query.filter_by(file_hash=filehash).first_or_404()

    return result.content


@app.route('/api/view_dot/<dot_id>/<params>',methods=['GET'])
def view_dot(dot_id,params):
    print("dot info"+dot_id)
    script=schema.Dot.query.filter_by(id=dot_id).first_or_404()
    #script.script
    collision=schema.DotCollisions.query.filter_by(dot_id=script.id).order_by(schema.DotCollisions.collision_time.desc()).first_or_404()
    #now collision is the latest one
#    with open("iframe-template.tmpl") as f:
#    tmpl=f.read()
#    tmpl=re.sub("\\/\\*\\*SCRIPT\\*\\*\\/",script.script,tmpl)
    #tmpl.replace("/\\*\\*SCRIPT\\*\\*/",) # add init too!

#    print(tmpl)
    try:
        #prms=pybase64.b64decode(bytes(params,'utf-8')).decode()
        prms=params
    except Exception:
        print("VIEW_DOT: Couldn't convert base64 to string")
    return render_template("iframe-template.tmpl",script=prms+"\n"+script.script)
#    return "Error"

@app.route('/api/snapshot/save/<dot_id>/<params>/<collision_id>')
def snapshot(dot_id, params,collision_id):
    print('/api/snapshot/save/'+dot_id+'/'+params+'/'+collision_id)
    uhash=str(uuid.uuid4())
    filename = 'dhive-snap-'+uhash+'.png'
    #return f"http://snapshot-server:8080/image?id={dot_id}&params={params}"
    r = requests.get(f"http://snapshot-server:8080/image/{dot_id}/{params}", stream=True)
    #r.status_code
    if r.status_code == 200:
#        fake_upload = StringIO()
#        with open(filename, 'wb') as f:
        with open(filename,'wb') as fake_upload:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, fake_upload)
            # open file
            im=Image.open(filename).convert('RGB')
            left = 0
            top = 0
            right = 600
            bottom = 600
            im1 = im.crop((left, top, right, bottom))
            print("API: "+str(im))
            fake_file = BytesIO()
            im1.save(fake_file,"jpeg")
            fake_file.seek(0)
            img=fake_file.read()
            base64_img=pybase64.b64encode(img)
            #print ("IMG:"+base64_img)
            col=schema.DotCollisions.query.filter_by(id=collision_id).first_or_404()
            col.snapshot=base64_img
            db.session.commit()
    return "End of the code"

@app.route('/api/snapshot/load/<collision_id>')
def snapshot_load(collision_id):

    data=schema.DotCollisions.query.filter_by(id=collision_id).first_or_404()
    #header("Content-type: image/png")
    return Response(pybase64.b64decode(data.snapshot), mimetype='image/png')

# https://stackoverflow.com/questions/33284334/how-to-make-flask-sqlalchemy-automatically-rollback-the-session-if-an-exception
@app.teardown_request
def teardown_request(exception):
    if exception:
        db.session.rollback()
        print("Houston we have a problem: "+str(exception)) # TODO Data Exposure
    db.session.remove()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
