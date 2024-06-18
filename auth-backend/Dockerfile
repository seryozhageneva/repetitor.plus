FROM python:3.12.3-alpine3.19

WORKDIR /app


COPY . .
RUN ls
RUN pip install -r requirements.txt

CMD ["python", "wsgi.py"]
