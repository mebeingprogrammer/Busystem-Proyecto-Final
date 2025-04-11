# REQUERIMIENTOS DE INSTALACION - Busystem
## Instalar flask y sus dependencias

Debemos instalar flask y sus dependencias en la carpeta ***Backend***, tener en cuenta que esta carpeta fue creada como un virtual env de python (aunque no es necesario levantar el venv pera que este funcione). Las dependencias a instalar son:
```shell
pip3 install flask flask-cors flask-pymongo 
```
Luego de instalado, se debe aplicar los archivos debidos en las rutas del flask
```shell
set FLASK_APP= app.py
set FLASK_DEBUG=True  
```
## MongoDB

Se debe instalar MongoDB server Atlas para poder utilizar el proyecto, en el MongoDBCompass crear una base de datos llamada **busystem** y listo, la ruta de la bd en mongoDB siempre es la misma default y, al mismo tiempo, las colecciones de datos se crearan autonomamente.

## FrontEnd - React

En react se deben instalar los paquetes de lo que dependen el funcionamiento del codigo, en este caso, axios y bootstrap.
```shell
 npm install axios bootstrap 
```
