const API_URL = "https://script.google.com/macros/s/AKfycbwj1rZY_nhRV5rjOubm1kzo1cdYZEznOp2Sx_4IIvAxGBHWqU6bxaS7-cpWRSpCnxHx/exec";

let ultimoCodigo = "";
let puedeEscanear = true;
const resultado = document.getElementById("resultado");
function mostrarProducto(data){
    if(!data.encontrado){

        resultado.innerHTML = `
            <h3>❌ No encontrado</h3>
            <p>El código de fabricante no está registrado.</p>
        `;
        return;
    }
puedeEscanear = false;

resultado.innerHTML = `

    <button class="btn-limpiar" onclick="limpiarResultado()">
    🔄 Nueva consulta
    </button>

    <h3>✅ Producto encontrado</h3>

    <p><b>Código escaneado (fabricante)</b><br>
    ${data.codigo}</p>

    <p><b>Código Geodrill</b><br>
    ${data.sku}</p>

    <svg id="barcodeSKU"></svg>

    <p><b>Número de Parte</b><br>
    ${data.numeroparte}</p>

    <p><b>Descripción</b><br>
    ${data.descripcion}</p>

`;
    try {
        JsBarcode("#barcodeSKU", data.sku, {
            format: "CODE128",
            displayValue: true,
            width: 2,
            height: 70
        });

    }
    catch(e){
        console.log("Error código barra:", e);
    }
}
async function buscarCodigo(codigo){
    try{
        const respuesta = await fetch(

            `${API_URL}?codigo=${encodeURIComponent(codigo)}`,      
        );
        const data = await respuesta.json();
        data.codigo = codigo;
        mostrarProducto(data);
    }
    catch(error){
        resultado.innerHTML = `
            <h3>⚠️ Error</h3>
            <p>${error.message}</p>
        `;
        console.error("Error consulta:", error);
    }
}

function iniciarCamara(){

    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(

    { facingMode: "environment" },

    {
    fps: 10,
    aspectRatio: 16 / 9,
    qrbox: function(viewfinderWidth, viewfinderHeight) {
        return {
            width: viewfinderWidth * 0.90,
            height: 70
        };

        }
    },
        (decodedText)=>{
            if(decodedText === ultimoCodigo){
                return;
            }
            ultimoCodigo = decodedText;
            buscarCodigo(decodedText);
        }
    )
    .catch(error=>{
        console.error("Error cámara:", error);
        resultado.innerHTML = `
            <h3>⚠️ Error cámara</h3>

            <p>${error}</p>
        `;
    });
}

iniciarCamara();
