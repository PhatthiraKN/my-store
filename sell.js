import {
    db,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc
} from "./firebase.js";


// =========================
// ตะกร้า
// =========================

let cart = [];


// =========================
// สูตรวัตถุดิบของแต่ละเมนู
// =========================

const recipes = {

    "น้ำแตงโมปั่น": {
        "แตงโม": 1,
        "น้ำเชื่อม": 1,
        "น้ำแข็ง": 1,
        "แก้ว": 1,
        "ฝา": 1,
        "หลอด": 1,
        "ถุงหิ้ว": 1
    },

    "น้ำอะโวคาโดปั่น": {
        "อะโวคาโด": 1,
        "น้ำเชื่อม": 1,
        "น้ำแข็ง": 1,
        "แก้ว": 1,
        "ฝา": 1,
        "หลอด": 1,
        "ถุงหิ้ว": 1
    },

    "น้ำส้มปั่น": {
        "ส้ม": 1,
        "น้ำเชื่อม": 1,
        "น้ำแข็ง": 1,
        "แก้ว": 1,
        "ฝา": 1,
        "หลอด": 1,
        "ถุงหิ้ว": 1
    },

    "น้ำมะพร้าวปั่น": {
        "มะพร้าว": 1,
        "น้ำเชื่อม": 1,
        "น้ำแข็ง": 1,
        "แก้ว": 1,
        "ฝา": 1,
        "หลอด": 1,
        "ถุงหิ้ว": 1
    },

    "น้ำกล้วยปั่น": {
        "กล้วย": 1,
        "น้ำแข็ง": 1,
        "แก้ว": 1,
        "ฝา": 1,
        "หลอด": 1,
        "ถุงหิ้ว": 1
    }

};


// =========================
// โหลดเมนู
// =========================

async function loadMenu() {

    const menuList = document.getElementById("menuList");

    if (!menuList) return;

    menuList.innerHTML =
        `<div class="loading">กำลังโหลดเมนู... 🍉</div>`;

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        menuList.innerHTML = "";

        snapshot.forEach((item) => {

            const product = item.data();

            const stock = Number(product.stock) || 0;
            const price = Number(product.price) || 0;

            const card = document.createElement("div");

            card.className = "menu-card";

            card.innerHTML = `

                <div class="menu-emoji">
                    ${product.emoji || "🥤"}
                </div>

                <h3>
                    ${product.name || "ไม่มีชื่อสินค้า"}
                </h3>

                <div class="menu-price">
                    ฿${price.toLocaleString()}
                </div>

                <div class="menu-stock">
                    เหลือ ${stock} ${product.unit || "แก้ว"}
                </div>

                <button class="add-to-cart">
                    🛒 เพิ่มลงตะกร้า
                </button>

            `;

            card
                .querySelector(".add-to-cart")
                .addEventListener("click", () => {

                    addToCart(
                        item.id,
                        product.name,
                        price,
                        stock,
                        product.unit || "แก้ว"
                    );

                });

            menuList.appendChild(card);

        });

    } catch (error) {

        console.error("Load Menu Error:", error);

        menuList.innerHTML = `
            <div class="loading">
                โหลดเมนูไม่สำเร็จ 😭
            </div>
        `;

    }

}


// =========================
// เพิ่มลงตะกร้า
// =========================

function addToCart(
    id,
    name,
    price,
    stock,
    unit
) {

    if (stock <= 0) {

        alert("สินค้านี้หมดแล้ว 🥺");

        return;
    }

    const existing =
        cart.find(item => item.id === id);

    if (existing) {

        if (existing.quantity >= stock) {

            alert("สินค้าในสต๊อกไม่เพียงพอ");

            return;
        }

        existing.quantity++;

    } else {

        cart.push({
            id,
            name,
            price,
            stock,
            unit,
            quantity: 1
        });

    }

    renderCart();

}


// =========================
// แสดงตะกร้า
// =========================

function renderCart() {

    const cartList =
        document.getElementById("cartList");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkoutButton =
        document.getElementById("checkoutButton");

    if (!cartList || !cartTotal || !checkoutButton) {
        return;
    }

    if (cart.length === 0) {

        cartList.innerHTML = `
            <div class="empty-cart">
                🥤<br>
                ยังไม่มีสินค้าในตะกร้า
            </div>
        `;

        cartTotal.textContent = "฿0";

        checkoutButton.disabled = true;

        return;
    }

    cartList.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    ฿${item.price.toLocaleString()} × ${item.quantity}
                </span>

            </div>

            <div class="quantity-control">

                <button class="minus">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button class="plus">
                    ＋
                </button>

            </div>

        `;

        cartItem
            .querySelector(".minus")
            .addEventListener("click", () => {
                decreaseQuantity(index);
            });

        cartItem
            .querySelector(".plus")
            .addEventListener("click", () => {
                increaseQuantity(index);
            });

        cartList.appendChild(cartItem);

    });

    cartTotal.textContent =
        `฿${total.toLocaleString()}`;

    checkoutButton.disabled = false;

}


// =========================
// ลดจำนวน
// =========================

function decreaseQuantity(index) {

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    renderCart();

}


// =========================
// เพิ่มจำนวน
// =========================

function increaseQuantity(index) {

    const item = cart[index];

    if (item.quantity >= item.stock) {

        alert("สินค้าในสต๊อกไม่เพียงพอ");

        return;
    }

    item.quantity++;

    renderCart();

}


// =========================
// ยืนยันการขาย
// =========================

async function checkout() {

    if (cart.length === 0) {

        alert("ยังไม่มีสินค้าในตะกร้า");

        return;
    }

    const confirmSale =
        confirm("ยืนยันการขายสินค้าหรือไม่?");

    if (!confirmSale) return;

    try {

        // =========================
        // คำนวณยอดรวม
        // =========================

        const total = cart.reduce(
            (sum, item) =>
                sum + (item.price * item.quantity),
            0
        );


        // =========================
        // โหลดสต๊อกสินค้า
        // =========================

        const productSnapshot =
            await getDocs(
                collection(db, "products")
            );

        const products = {};

        productSnapshot.forEach((item) => {

            products[item.id] = {
                id: item.id,
                ...item.data()
            };

        });


        // =========================
        // ตรวจสอบสต๊อกสินค้า
        // =========================

        for (const item of cart) {

            const product =
                products[item.id];

            if (!product) {

                alert(
                    `ไม่พบสินค้า ${item.name}`
                );

                return;
            }

            const currentStock =
                Number(product.stock) || 0;

            if (currentStock < item.quantity) {

                alert(
                    `${item.name} มีสต๊อกไม่เพียงพอ`
                );

                return;
            }

        }


        // =========================
        // โหลดวัตถุดิบ
        // =========================

        const rawSnapshot =
            await getDocs(
                collection(db, "rawMaterials")
            );

        const rawMaterials = {};

rawSnapshot.forEach((item) => {

    const data = item.data();

    // ทำให้ชื่อเป็นมาตรฐาน
    const rawName = String(data.name || "")
        .replace(/\s+/g, "")
        .trim();

    rawMaterials[rawName] = {
        id: item.id,
        ...data
    };

});


        // =========================
        // คำนวณวัตถุดิบที่ต้องใช้
        // =========================

        const requiredRaw = {};

        for (const item of cart) {

            const productName = String(item.name || "")
    .replace(/\s+/g, "")
    .trim();

const recipe = recipes[productName];

            // ถ้ามีสูตร → หักวัตถุดิบ
            // ถ้าไม่มีสูตร → ไม่หักวัตถุดิบ
            if (recipe) {

                for (const rawName in recipe) {

    const cleanRawName = String(rawName)
        .replace(/\s+/g, "")
        .trim();

    const amount =
        recipe[rawName] * item.quantity;

    if (!requiredRaw[cleanRawName]) {
        requiredRaw[cleanRawName] = 0;
    }

    requiredRaw[cleanRawName] += amount;
}

            }

        }


        // =========================
        // ตรวจสอบวัตถุดิบ
        // =========================

        for (const rawName in requiredRaw) {

            const raw =
                rawMaterials[rawName];

            if (!raw) {

                alert(
                    `ไม่พบวัตถุดิบ: ${rawName}`
                );

                return;
            }

            const currentStock =
                Number(raw.stock) || 0;

            if (
                currentStock <
                requiredRaw[rawName]
            ) {

                alert(
                    `${rawName} มีสต๊อกไม่เพียงพอ`
                );

                return;
            }

        }


        // =========================
        // ตัดสต๊อกสินค้า
        // =========================

        for (const item of cart) {

            const product =
                products[item.id];

            const currentStock =
                Number(product.stock) || 0;

            await updateDoc(
                doc(
                    db,
                    "products",
                    item.id
                ),
                {
                    stock:
                        currentStock -
                        item.quantity
                }
            );

        }


        // =========================
        // ตัดสต๊อกวัตถุดิบ
        // =========================

        for (const rawName in requiredRaw) {

            const raw =
                rawMaterials[rawName];

            const currentStock =
                Number(raw.stock) || 0;

            await updateDoc(
                doc(
                    db,
                    "rawMaterials",
                    raw.id
                ),
                {
                    stock:
                        currentStock -
                        requiredRaw[rawName]
                }
            );

        }


        // =========================
        // บันทึกการขาย
        // =========================

        const saleRef =
            await addDoc(
                collection(db, "sales"),
                {
                    items: cart.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        unit: item.unit
                    })),

                    total: total,

                    soldAt: new Date()
                }
            );


        // =========================
        // แสดงใบเสร็จ
        // =========================

        showReceipt(
            saleRef.id,
            cart,
            total
        );


        // =========================
        // ล้างตะกร้า
        // =========================

        cart = [];

        renderCart();

        loadMenu();

    } catch (error) {

        console.error("Checkout Error:", error);

        alert(
            "เกิดข้อผิดพลาดในการบันทึกการขาย 😭"
        );

    }

}


// =========================
// ปุ่มยืนยันการขาย
// =========================

document
    .getElementById("checkoutButton")
    ?.addEventListener(
        "click",
        checkout
    );


// =========================
// แสดงใบเสร็จ
// =========================

function showReceipt(
    billId,
    items,
    total
) {

    const oldReceipt =
        document.getElementById("receiptOverlay");

    if (oldReceipt) {
        oldReceipt.remove();
    }

    const now = new Date();

    const dateText =
        now.toLocaleDateString(
            "th-TH",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    const timeText =
        now.toLocaleTimeString(
            "th-TH",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    let itemHTML = "";

    items.forEach((item) => {

        const itemTotal =
            item.price * item.quantity;

        itemHTML += `

            <div class="receipt-item">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <small>
                        ${item.quantity}
                        ${item.unit || "ชิ้น"}
                        × ฿${item.price.toLocaleString()}
                    </small>

                </div>

                <strong>
                    ฿${itemTotal.toLocaleString()}
                </strong>

            </div>

        `;

    });


    const overlay =
        document.createElement("div");

    overlay.id =
        "receiptOverlay";

    overlay.className =
        "receipt-overlay";

    overlay.innerHTML = `

        <div class="receipt-box">

            <div class="receipt-header">

                <div class="receipt-logo">
                    🍉
                </div>

                <h2>
                    MY STORE
                </h2>

                <p>
                    ใบเสร็จรับเงิน
                </p>

            </div>

            <div class="receipt-info">

                <div>
                    เลขที่บิล
                    <strong>
                        ${billId.slice(-6)}
                    </strong>
                </div>

                <div>
                    วันที่
                    <strong>
                        ${dateText}
                    </strong>
                </div>

                <div>
                    เวลา
                    <strong>
                        ${timeText}
                    </strong>
                </div>

            </div>

            <div class="receipt-items">
                ${itemHTML}
            </div>

            <div class="receipt-total">

                <span>
                    รวมทั้งหมด
                </span>

                <strong>
                    ฿${total.toLocaleString()}
                </strong>

            </div>

            <div class="receipt-thank">
                ขอบคุณที่ใช้บริการ 💗
            </div>

            <div class="receipt-buttons">

                <button
                    class="print-receipt"
                    onclick="window.print()"
                >
                    🖨️ พิมพ์ใบเสร็จ
                </button>

                <button
                    class="close-receipt"
                    onclick="closeReceipt()"
                >
                    ✕ ปิด
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);

}


// =========================
// ปิดใบเสร็จ
// =========================

function closeReceipt() {

    const receipt =
        document.getElementById(
            "receiptOverlay"
        );

    if (receipt) {
        receipt.remove();
    }

}

window.closeReceipt = closeReceipt;


// =========================
// เริ่มระบบ
// =========================

loadMenu();

renderCart();