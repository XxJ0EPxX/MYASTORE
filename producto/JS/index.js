// Elementos del DOM
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('.container-items');

let allProducts = JSON.parse(localStorage.getItem('cart')) || [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Función para guardar el carrito en localStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(allProducts));
};

// Función para calcular y mostrar el total del carrito
const calculateTotal = () => {
    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const productPrice = parseFloat(product.price.replace('S/', '').replace(',', ''));
        if (isNaN(productPrice)) {
            console.error(`Error al leer el precio de ${product.title}`);
            return;
        }
        total += product.quantity * productPrice;
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `S/ ${total.toFixed(2)}`;
    countProducts.innerText = totalOfProducts;
};

// Función para mostrar el carrito en el DOM
const showHTML = () => {
    if (allProducts.length === 0) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';
    
    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
                data-title="${product.title}"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;

        rowProduct.append(containerProduct);
    });

    calculateTotal();
};

// Mostrar/Ocultar carrito
btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

// Agregar al carrito
productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('.price').textContent
        };        

        const exists = allProducts.some(p => p.title === infoProduct.title);

        if (exists) {
            allProducts = allProducts.map(p => {
                if (p.title === infoProduct.title) p.quantity++;
                return p;
            });
        } else {
            allProducts.push(infoProduct);
        }

        showHTML();
        saveCartToLocalStorage();
    }
});

// Eliminar del carrito
rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('icon-close')) {
        const title = e.target.dataset.title;

        allProducts = allProducts.filter(product => product.title !== title);

        showHTML();
        saveCartToLocalStorage();
    }
});

// Aumentar o disminuir cantidad del producto
rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('btn-decrease')) {
        const title = e.target.dataset.title;
        allProducts = allProducts.map(product => {
            if (product.title === title && product.quantity > 1) {
                product.quantity--;
            }
            return product;
        });
        showHTML();
        saveCartToLocalStorage();
    }

    if (e.target.classList.contains('btn-increase')) {
        const title = e.target.dataset.title;
        allProducts = allProducts.map(product => {
            if (product.title === title) {
                product.quantity++;
            }
            return product;
        });
        showHTML();
        saveCartToLocalStorage();
    }
});

// Cargar carrito desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', showHTML);

// Función para enviar el pedido a WhatsApp
const sendToWhatsApp = document.querySelector('#send-to-whatsapp');
sendToWhatsApp.addEventListener('click', () => {
    let message = 'Hola, quiero hacer un pedido:\n\n';

    allProducts.forEach(product => {
        message += `Producto: ${product.title}\nCantidad: ${product.quantity}\nPrecio: ${product.price}\n\n`;
    });

    const total = parseFloat(valorTotal.innerText.replace('S/.', '').replace(',', ''));
    if (isNaN(total)) {
        alert('Error al calcular el total.');
        return;
    }

    message += `Total a pagar: S/. ${total.toFixed(2)}`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=51966569842&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});

// Evaluación
document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const averageStars = document.querySelectorAll('.average-star');
    let totalRatings = 0;
    let sumRatings = 0;

    // Verificamos si el usuario ya ha calificado
    const userRating = localStorage.getItem('userRating');
    if (userRating) {
        setRating(parseInt(userRating));
    }

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            highlightStars(star.getAttribute('data-value'));
        });

        star.addEventListener('mouseleave', () => {
            resetStars();
        });

        star.addEventListener('click', () => {
            const ratingValue = parseInt(star.getAttribute('data-value'));
            setRating(ratingValue);
            addRating(ratingValue);
            localStorage.setItem('userRating', ratingValue);
        });
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('hovered');
            } else {
                star.classList.remove('hovered');
            }
        });
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('hovered');
        });
    }

    function setRating(rating) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function addRating(rating) {
        totalRatings += 1;
        sumRatings += rating;

        const averageRating = (sumRatings / totalRatings).toFixed(1);
        updateRatingInfo(averageRating, totalRatings);
        setAverageRating(averageRating);
    }

    function setAverageRating(average) {
        averageStars.forEach(star => {
            star.classList.remove('active', 'half', 'quarter', 'three-quarters');
        });
    
        const fullStars = Math.floor(average);
        const decimal = average % 1;
    
        for (let i = 0; i < fullStars; i++) {
            averageStars[i].classList.add('active');
        }
    
        if (decimal >= 0.75) {
            averageStars[fullStars].classList.add('three-quarters');
        } else if (decimal >= 0.5) {
            averageStars[fullStars].classList.add('half');
        } else if (decimal >= 0.25) {
            averageStars[fullStars].classList.add('quarter');
        }
    
        const percentage = ((average / 5) * 100).toFixed(0);
        document.getElementById('average-text').textContent = `${average} de 5.0 (${percentage}%)`;
    }

    function updateRatingInfo(average, total) {
        document.getElementById('total-ratings').textContent = total;
    }
});

// Agregar evento para aumentar o disminuir la cantidad directamente en el producto
productsList.addEventListener('click', e => {
    const item = e.target.closest('.item');
    const quantityElement = item.querySelector('.quantity');
    let currentQuantity = parseInt(quantityElement.textContent);

    if (e.target.classList.contains('btn-decrease')) {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityElement.textContent = currentQuantity;
        }
    }

    if (e.target.classList.contains('btn-increase')) {
        currentQuantity++;
        quantityElement.textContent = currentQuantity;
    }
});

// Agregar al carrito con la cantidad actualizada sin duplicar cantidades
productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.closest('.item');
        const title = product.querySelector('h2').textContent;
        const price = product.querySelector('.price').textContent;
        const quantity = parseInt(product.querySelector('.quantity').textContent);

        const infoProduct = {
            quantity: quantity,
            title: title,
            price: price
        };

        const exists = allProducts.find(p => p.title === infoProduct.title);

        if (exists) {
            // Si el producto ya existe, actualizamos la cantidad a la cantidad actual seleccionada
            allProducts = allProducts.map(p => {
                if (p.title === infoProduct.title) {
                    p.quantity = infoProduct.quantity;  // Actualizamos la cantidad, no sumamos
                }
                return p;
            });
        } else {
            // Si no existe, lo añadimos al carrito
            allProducts.push(infoProduct);
        }

        showHTML();
        saveCartToLocalStorage();
    }
});
