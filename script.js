const API_URL = "https://script.google.com/macros/s/AKfycbwj1rZY_nhRV5rjOubm1kzo1cdYZEznOp2Sx_4IIvAxGBHWqU6bxaS7-cpWRSpCnxHx/exec";

let html5QrCode = null;
let ultimoCodigo = "";
let puedeEscanear = true;

const resultado = document.getElementById("resultado");

function mostrarProducto(data){

    if(!data.encontrado){

    resultado.innerHTML = `
        <button class="btn-limpiar" onclick="limpiarResultado()">
            🔄 Nueva consulta
        </button>

        <h3 style="color:#c62828;">❌ Producto no encontrado</h3>

        <p>
            <b>Código escaneado</b><br>
            ${data.codigo}
        </p>

        <p>
            El código de fabricante no está registrado.
        </p>
    `;

    return;
    }

    resultado.innerHTML = `

        <button class="btn-limpiar" onclick="limpiarResultado()">
            🔄 Nueva consulta
        </button>

        <h3 style="color:#2e7d32;">✅ Producto encontrado</h3>

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

    try{

        JsBarcode("#barcodeSKU", data.sku, {

            format:"CODE128",
            displayValue:true,
            textPosition:"top",
            fontSize:18,
            margin:3,
            width:2,
            height:60

        });

    }
    catch(e){

        console.log(e);

    }

}

async function buscarCodigo(codigo){

    try{

        const respuesta = await fetch(

            `${API_URL}?codigo=${encodeURIComponent(codigo)}`

        );

        const data = await respuesta.json();

        data.codigo = codigo;

        mostrarProducto(data);

    }

    catch(error){

        resultado.innerHTML = `

            <button class="btn-limpiar" onclick="limpiarResultado()">
                🔄 Nueva consulta
            </button>

            <h3>⚠️ Error</h3>

            <p>${error.message}</p>

        `;

        console.error(error);

    }

}


function iniciarCamara(){

    document.querySelector(".camera-container").style.display = "block";

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(

        { facingMode:"environment" },

        {

            fps:10,

            aspectRatio:16/9,

            qrbox:function(viewfinderWidth){

                return{

                    width:viewfinderWidth*0.90,

                    height:70

                };

            }

        },

        function(decodedText){

            if(!puedeEscanear){

                return;

            }

            puedeEscanear=false;

            ultimoCodigo=decodedText;

            html5QrCode.stop()

            .then(()=>{

                document.querySelector(".camera-container").style.display = "none";

                resultado.innerHTML = `
                    <p class="espera">
                        ⏳ Buscando código...
                    </p>
                `;

                buscarCodigo(decodedText);

            })

            .catch(err=>{

                console.error(err);

                buscarCodigo(decodedText);

            });

        }

    )

    .catch(error=>{

        console.error("Error cámara:",error);

    });

}


function limpiarResultado(){

    ultimoCodigo="";

    puedeEscanear=true;

    resultado.innerHTML=`

        <p class="espera">

            Escanee un código de barras del fabricante

        </p>

    `;

    iniciarCamara();

}

iniciarCamara();
