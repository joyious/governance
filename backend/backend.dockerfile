FROM python:3.8
ENV PYTHONUNBUFFERED 1

WORKDIR /app/

ADD /app /app/
ADD requirements.txt /app/

RUN pip install -r requirements.txt

#Install jupyterlab
RUN pip install jupyterlab