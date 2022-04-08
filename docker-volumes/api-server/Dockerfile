FROM python:3.8

WORKDIR /code

ENV FLASK_APP="run.py"

#RUN cd /code

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY src/ .

RUN flask db init; exit 0
RUN flask db migrate -m "Automatic Migration"; exit 0
RUN flask db upgrade; exit 0

CMD [ "python", "./run.py" ]
