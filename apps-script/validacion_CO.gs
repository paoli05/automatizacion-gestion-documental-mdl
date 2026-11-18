/***** CONFIGURACIÓN *****/

const TIPO_CONTRATO = "CO";

// Campos que n8n usa con nombre fijo.
// Si cambias el título de una pregunta, agrega el nuevo título a la lista correspondiente.
const CAMPOS_CLAVE = {
  sede:                              ["SEDE"],
  cliente:                           ["NOMBRE"],
  cedula:                            ["CEDULA"],
  telefono:                          ["TELEFONO"],
  correoElectronico:                 ["CORREO ELECTRONICO"],
  asesor:                            ["ASESOR"],
  nombreProyecto:                    ["NOMBRE DE PROYECTO (CODIFICACION)"],
  tipoProyecto:                      ["TIPO DE PROYECTO"],
  fechaFirmaContrato:                ["FECHA FIRMA DE CONTRATO"],
  numeroContrato:                    ["NUMERO DE CONTRATO"],
  area:                              ["AREA"],
  alcanceProyecto:                   ["ALCANCE DE PROYECTO"],
  estadoProyecto:                    ["ESTADO DE PROYECTO"],
  departamento:                      ["DPTO DONDE SE VA A CONSTRUIR"],
  municipio:                         ["MUNICIPIO DONDE SE VA A CONSTRUIR"],
  sector:                            ["SECTOR/VEREDA/CORREGIMIENTO"],
  ubicacionReferencia:               ["UBICACION DE REFERENCIA"],
  valorVentaLosa:                    ["VALOR DE VENTA LOSA"],
  adicionalesDescuentosLosa:         ["VALOR ADICIONALES O DESCUENTOS LOSA"],
  valorVentaObraGris:                ["VALOR DE VENTA OBRA GRIS"],
  adicionalesDescuentosObraGris:     ["VALOR DE ADICIONALES O DESCUENTOS OBRA GRIS"],
  valorVentaElectricidad:            ["VALOR DE VENTA ELECTRICIDAD"],
  adicionalesDescuentosElectricidad: ["VALOR DE ADICIONALES O DESCUENTOS ELECTRICIDAD"],
  valorVentaAcabados:                ["VALOR DE VENTA ACABADOS"],
  adicionalesDescuentosAcabados:     ["VALOR DE ADICIONALES O DESCUENTOS ACABADOS"],
  transporteDescargue:               ["TRANSPORTE Y DESCARGUE"],
  totalValorContrato:                ["TOTAL VALOR DE CONTRATO"],
  cantidadOtroSi:                    ["CANTIDAD DE OTRO SI"],
  valorOtroSi:                       ["VALOR OTRO SI"],
  diasOtroSi:                        ["DIAS OTRO SI"],
  fechaOtroSi:                       ["FECHA DE OTROSI"],
  valorContratoOtroSi:               ["VALOR CONTRATO + OTROSI"],
  observacion:                       ["OBSERVACION"],
  aceptaCarpeta:                     ["¿SE ACEPTA CARPETA?", "SE ACEPTA CARPETA"],
  idValidacion:                      ["ID VALIDACION"],
  urlReanudacion:                    ["URL REANUDACION"]
};

// Campos sin los cuales no tiene sentido continuar
const CAMPOS_OBLIGATORIOS = ["idValidacion", "urlReanudacion", "aceptaCarpeta"];


/***** FUNCIÓN PRINCIPAL (activador: al enviar formulario) *****/

function enviarValidacionCO(e) {
  const respuestas = e.namedValues;

  // 1. Campos clave con los nombres que ya usa n8n
  const datos = { tipoContrato: TIPO_CONTRATO };
  for (const clave in CAMPOS_CLAVE) {
    datos[clave] = obtenerUno(respuestas, CAMPOS_CLAVE[clave]);
  }

  // 2. Todas las columnas de la respuesta, generadas automáticamente
  datos.campos = {};
  for (const encabezado in respuestas) {
    datos.campos[aClave(encabezado)] = respuestas[encabezado][0] || "";
  }

  // 3. Datos de trazabilidad
  datos.marcaTemporal = obtener(respuestas, "Marca temporal");
  datos.filaRespuesta = e.range ? e.range.getRow() : "";

  // 4. Avisar en el log si falta un campo clave
  const faltantes = Object.keys(CAMPOS_CLAVE).filter(k => datos[k] === "");
  if (faltantes.length) {
    Logger.log("Campos clave vacíos o no encontrados: " + faltantes.join(", "));
  }

  const obligatoriosFaltantes = CAMPOS_OBLIGATORIOS.filter(k => datos[k] === "");
  if (obligatoriosFaltantes.length) {
    Logger.log("Error: faltan campos obligatorios: " + obligatoriosFaltantes.join(", "));
    return;
  }

  enviarAlWebhook(datos);
}


/***** FUNCIONES DE APOYO *****/

function obtener(respuestas, nombreCampo) {
  for (const key in respuestas) {
    if (normalizarTexto(key) === normalizarTexto(nombreCampo)) {
      return respuestas[key][0] || "";
    }
  }
  return "";
}

function obtenerUno(respuestas, nombresCampos) {
  for (const nombreCampo of nombresCampos) {
    const valor = obtener(respuestas, nombreCampo);
    if (valor !== "") return valor;
  }
  return "";
}

function normalizarTexto(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// "VALOR CONTRATO + OTROSI" → "valorContratoOtrosi"
function aClave(encabezado) {
  const palabras = normalizarTexto(encabezado)
    .replace(/[^a-z0-9 ]/g, " ")
    .trim()
    .split(/\s+/);
  return palabras
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join("");
}

function enviarAlWebhook(datos) {
  const opciones = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(datos),
    muteHttpExceptions: true
  };

  // Hasta 3 intentos si n8n no responde o responde con error del servidor
  for (let intento = 1; intento <= 3; intento++) {
    const respuesta = UrlFetchApp.fetch(datos.urlReanudacion, opciones);
    const codigo = respuesta.getResponseCode();
    Logger.log("Intento " + intento + " - Código: " + codigo + " - " + respuesta.getContentText());

    if (codigo < 500) return;
    Utilities.sleep(5000);
  }
}