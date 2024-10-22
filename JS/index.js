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
                <button class="btn-decrease" data-title="${product.title}">-</button>
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <button class="btn-increase" data-title="${product.title}">+</button>
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
    const title = e.target.dataset.title;
    if (e.target.classList.contains('btn-increase')) {
        allProducts = allProducts.map(product => {
            if (product.title === title) product.quantity++;
            return product;
        });
    } else if (e.target.classList.contains('btn-decrease')) {
        allProducts = allProducts.map(product => {
            if (product.title === title && product.quantity > 1) product.quantity--;
            return product;
        });
    }
    showHTML();
    saveCartToLocalStorage();
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

    const total = parseFloat(valorTotal.innerText.replace('S/', '').replace(',', ''));
    if (isNaN(total)) {
        alert('Error al calcular el total.');
        return;
    }

    message += `Total a pagar: S/ ${total.toFixed(2)}`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=51966569842&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});

// Funcionalidad de búsqueda
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('.container-items .item');
    items.forEach(item => {
        const title = item.querySelector('.info-product h2').textContent.toLowerCase();
        item.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// Carrusel
document.querySelectorAll('.carousel').forEach(carousel => {
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const images = carousel.querySelector('.carousel-images');
    const imageCount = images.children.length;
    let currentIndex = 0;

    const updateCarousel = () => {
        const offset = -currentIndex * 100;
        images.style.transform = `translateX(${offset}%)`;
    };

    const showNextImage = () => {
        currentIndex = (currentIndex < imageCount - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    };

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : imageCount - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', showNextImage);
    setInterval(showNextImage, 3000); // Cambia la imagen cada 3 segundos
});

// Función para filtrar productos
const filterProducts = () => {
    const brandFilter = document.getElementById('filter-brand').value;
    const priceFilter = document.getElementById('filter-price').value;

    // Guardar los filtros seleccionados en localStorage
    localStorage.setItem('brandFilter', brandFilter);
    localStorage.setItem('priceFilter', priceFilter);

    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemBrand = item.getAttribute('data-brand');
        const itemPrice = parseFloat(item.getAttribute('data-price'));

        const brandMatch = (brandFilter === 'all' || itemBrand === brandFilter);
        let priceMatch = true;

        if (priceFilter === 'low') {
            priceMatch = itemPrice < 50;
        } else if (priceFilter === 'mid') {
            priceMatch = itemPrice >= 50 && itemPrice <= 100;
        } else if (priceFilter === 'high') {
            priceMatch = itemPrice > 100;
        }

        item.style.display = (brandMatch && priceMatch) ? 'block' : 'none';
    });
};

// Función para cargar los filtros desde localStorage al cargar la página
const loadFilters = () => {
    const savedBrandFilter = localStorage.getItem('brandFilter');
    const savedPriceFilter = localStorage.getItem('priceFilter');

    if (savedBrandFilter) {
        document.getElementById('filter-brand').value = savedBrandFilter;
    }

    if (savedPriceFilter) {
        document.getElementById('filter-price').value = savedPriceFilter;
    }

    filterProducts(); // Aplicar los filtros cargados
};

// Event listeners para cambiar filtros
document.getElementById('filter-brand').addEventListener('change', filterProducts);
document.getElementById('filter-price').addEventListener('change', filterProducts);

// Cargar filtros guardados al cargar la página
document.addEventListener('DOMContentLoaded', loadFilters);
