FROM python:alpine AS development

WORKDIR /app

RUN apk update && apk add alpine-sdk 

COPY requirements.txt .

RUN pip install cython

RUN pip install  -r requirements.txt

COPY . .

ENTRYPOINT ["python","app.py"]
 
## Production Stage
FROM development AS production

RUN pip install gunicorn 

ENTRYPOINT ["gunicorn" , "-w" , "4" ,"-b","0.0.0.0:80", "app:app"]
