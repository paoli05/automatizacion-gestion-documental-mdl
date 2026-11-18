# # Automatización de la gestión documental – MDL Modular
Repositorio académico del proyecto de automatización de la gestión documental de MDL Modular, desarrollado con n8n, Google Apps Script, Google Forms, Google Drive y Google Gemini.


## Descripción del proyecto

Este repositorio contiene los archivos técnicos correspondientes al desarrollo de una solución de automatización para la gestión documental de contratos de la empresa Constructora MDL Modular.

La solución permite automatizar la recepción, verificación, extracción, validación, organización y registro de documentos asociados a los procesos de Contrato de Obra y Plan Separe.

## Tecnologías utilizadas

- **n8n:** diseño y ejecución del flujo de automatización.
- **Google Apps Script:** procesamiento y envío de las respuestas de los formularios de validación.
- **Google Forms:** validación administrativa de la documentación.
- **Google Drive:** almacenamiento y organización de documentos.
- **Google Sheets:** registro y seguimiento de la información.
- **Google Gemini:** extracción de información de los documentos.

## Estructura del repositorio

- `n8n/`: contiene la exportación sanitizada del flujo de automatización.
- `apps-script/`: contiene los scripts utilizados para los formularios de Contrato de Obra y Plan Separe.

## Visualización del flujo en n8n

Para visualizar la estructura del flujo:

1. Descargar el repositorio o el archivo ZIP.
2. Ingresar a una instancia de n8n.
3. Seleccionar la opción para importar un flujo desde un archivo.
4. Seleccionar el archivo JSON ubicado en la carpeta `n8n`.
5. Una vez importado, se podrán visualizar los nodos, las conexiones y la estructura general de la automatización.

**Nota:** el archivo JSON se proporciona con fines académicos y de revisión técnica. Se han retirado configuraciones sensibles y referencias de producción. Por esta razón, permite visualizar la estructura del flujo, pero no ejecutar el proceso completo sin configurar previamente las credenciales, integraciones y parámetros correspondientes.

## Scripts de Google Apps Script

La carpeta `apps-script/` contiene los archivos fuente utilizados para procesar las respuestas de los formularios:

- `validacion_CO.gs`: procesamiento de respuestas del formulario de Contrato de Obra.
- `validacion_PS.gs`: procesamiento de respuestas del formulario de Plan Separe.

## Consideraciones

Este repositorio corresponde a una copia de revisión académica del desarrollo realizado durante la práctica profesional. No contiene las credenciales ni las configuraciones privadas necesarias para conectarse a los servicios utilizados en el entorno de producción.
