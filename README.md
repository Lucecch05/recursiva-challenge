## Recursiva Challenge

Este proyecto esta basado en los requerimientos de **Recursiva Challenge.** Prueba técnica de la empresa.

Se desarrollo en Angular 16, utilizando Angular Material para el diseño.

### Servidor de Desarrollo / Puesta en Marcha

Para iniciar el servidor local, primero instalar los paquetes necesarios con `npm install`. Al finalizar la instalación se corre la app con el comando `ng serve`, inicando en el puerto 4200 (\`localhost:4200\`).

### Demo

Se encuentra desplegado el proyecto para su prueba online en `Vercel`. Se puede acceder a la demo en el siguiente link: `https://recursiva-challenge.vercel.app`. 

### Estructura del proyecto

El proyecto esta dispuesto por 2 paginas principales: Home y Dashboard. Donde en la primera se realiza la carga del archivo csv y luego, es redirigido para ver resultados.

Todo esta separado por componentes y paginas, haciendo uso del routing de Angular.

El nucleo del proyecto es un “service” el cual tiene todas las funciones necesarias para el procesamiento de la información. 

`Entities`

Importante mencionar la entidad `Socio`, la cual es utilizada como principal estructura de dato.

Luego se creó una entidad más para Filtrar la información: `SocioFilter`.

`Socios.service.ts`

```javascript
updateCsvData() 
Se encarga de la comunicacion entre paginas de la infomarción del archivo

getSociosFilter()
Función principal para el filtrado de información. Tiene como parametro "filters", el cual puede recibir multiples objetos de filtro, haciendo posible su reutilización y personalización.

getPromedioEdad()
Función para el calculo del promedio de edad. Recibe como parametro un array de Socio y puede calcular de ese arreglo el promedio de edad.

getEdadMinAndMax()
Función que permite obtener la menor y mayor edad de un array de Socio

orderArray()
Función generica encargada de ordenar arreglos (array), con la posibilidad de seleccionar el tipo de ordenamiento (asc y desc) y la columna con la cual se quiere ordenar.

getColumnCount()
Cuenta la cantidad de elementos repetidos de un arreglo de Socio, seleccionando previamente la columna a contabilizar y el tipo de ordenamiento.

getColumnsValues()
Devuelve todos los diferentes valores posibles de una propiedad dada de un arreglo.
```

Como se observa, la mayoría de las funciones estan desarrolladas para su reutilización, no para el calculo especifico de unos datos. De esta forma, como se observa en la aplicación, es capaz de manera rapida obtener resultados (como el promedio de edad, por ejemplo) utilizando diferentes equipos. Pero así, podría hacerse con cualquier propiedad del Socio (estado civil, estudios, etc).

---

> Está aplicacion fue realizada en poco tiempo, por lo cuál, no se penso en todas las posibilidades, en todos los manejos de errores y sobre todo en el diseño. Tiene como finalidad mostrar las funciones realizadas sobre la carga de un archivo, optimizadas y reutilizables.
