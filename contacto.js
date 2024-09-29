function sendWhatsApp(event) {
    event.preventDefault(); // Evita el envío del formulario
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const phoneNumber = '51966569842'; // Cambia esto a tu número de WhatsApp
    const url = `https://wa.me/${phoneNumber}?text=Hola%20soy%20${encodeURIComponent(name)},%20tengo%20el%20siguiente%20reclamo:%20${encodeURIComponent(message)}`;
    window.open(url, '_blank'); // Abre WhatsApp en una nueva pestaña
}


// Cargar el mapa al final de la carga del documento
window.onload = function() {
    initMap();
};
