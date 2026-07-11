const API_URL = "https://script.google.com/macros/s/AKfycbzQUXHHtwlA5FIOfhAnsJNRil0hU41HLiQzzZqQAsOOBmvOuQW2eafp5QWaMwEINc6b/exec";

let ultimoCodigo = "";

const resultado = document.getElementById("resultado");

function mostrarProducto(data){

    if(!data.encontrado){

        resultado.innerHTML = `
            <h3>❌ No encontrado</h3>
            <p>El código no existe.</p>
        `;

        return;

    }

    resultado.innerHTML = `
        <h3>✅ Producto encontrado</h3>

        <p><b>Código escaneado</b><br>${data.codigo}</p>

        <p><b>SKU</b><br>${data.sku}</p>
        <p><b>Número de Parte</b><br>${data.numeroparte}</p>

        <p><b>Descripción</b><br>${data.descripcion}</p>
    `;

}

async function buscarCodigo(codigo){

    try{

        const respuesta = await fetch(
            `${API_URL}?codigo=${encodeURIComponent(codigo)}`
        );

        const data = await respuesta.json();

        mostrarProducto(data);

    }

    catch(error){

        resultado.innerHTML = `
            <h3>⚠️ Error</h3>
            <p>No fue posible consultar Google Sheets.</p>
        `;

        console.error(error);

    }

}

function iniciarCamara(){

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(

        { facingMode: "environment" },

        {
            fps:10,
            qrbox:{width:250,height:120}
        },

        (decodedText)=>{

            if(decodedText===ultimoCodigo){
                return;
            }

            ultimoCodigo=decodedText;

            buscarCodigo(decodedText);

        }

    ).catch(console.error);

}

iniciarCamara();
