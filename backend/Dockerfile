# 
FROM python:3.12-slim-bookworm

#
WORKDIR /code

#
COPY ./requirements*.txt /code/

#
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt -r /code/requirements-prod.txt

#
COPY . /code/

#
CMD ["gunicorn", "-b", "0.0.0.0:80", "index:app"]

EXPOSE 80
