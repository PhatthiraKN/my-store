import {
    db,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc
} from "./firebase.js";


// =========================
// โหลดสินค้า
// =========================

async function loadProducts() {

    const container = document.getElementById("productList");

    if (!container) return;

    container.innerHTML = "กำลังโหลดสินค้า...";

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        console.log("จำนวนสินค้า:", snapshot.size);

        container.innerHTML = "";

        snapshot.forEach((item) => {

            const product = item.data();

            const stock = Number(product.stock) || 0;
            const price = Number(product.price) || 0;

            let status = "";
            let statusClass = "";

            if (stock === 0) {

                status = "หมด";
                statusClass = "red";

            } else if (stock <= 5) {

                status = "ใกล้หมด";
                statusClass = "yellow";

            } else {

                status = "พร้อมขาย";
                statusClass = "green";

            }


            // สร้างการ์ดสินค้า 1 ใบ
            const card = document.createElement("div");

            card.className = "product-card";


            card.innerHTML = `

                <div class="product-image">
                    ${product.emoji || "🥤"}
                </div>

                <h3>
                    ${product.name || "ไม่มีชื่อสินค้า"}
                </h3>

                <div class="product-price">
                    ฿${price}
                </div>

                <div class="product-stock">

                    <span>
                        สต๊อก
                    </span>

                    <strong>
                        ${stock} ${product.unit || "ชิ้น"}
                    </strong>

                    <span class="stock-status ${statusClass}">
                        ${status}
                    </span>

                </div>

                <div class="product-actions">

                    <button class="increase-button">
                        ＋ เพิ่มสต๊อก
                    </button>

                    <button class="edit-button">
                        ✏️ แก้ไข
                    </button>

                </div>

            `;


            // ปุ่มเพิ่มสต๊อก
            card
                .querySelector(".increase-button")
                .addEventListener("click", () => {

                    increaseStock(item.id);

                });


            // ปุ่มแก้ไข
            card
                .querySelector(".edit-button")
                .addEventListener("click", () => {

                    editProduct(item.id);

                });


            // เอาการ์ดเข้า productList
            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "เกิดข้อผิดพลาดในการโหลดสินค้า";

    }

}


// =========================
// เพิ่มสต๊อก
// =========================

async function increaseStock(id) {

    const amount = Number(
        prompt("ต้องการเพิ่มสต๊อกกี่ชิ้น?")
    );

    if (isNaN(amount) || amount <= 0) {

        alert("กรุณาใส่จำนวนที่ถูกต้อง");

        return;

    }

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        let currentStock = 0;

        snapshot.forEach((item) => {

            if (item.id === id) {

                currentStock =
                    Number(item.data().stock) || 0;

            }

        });


        await updateDoc(
            doc(db, "products", id),
            {
                stock: currentStock + amount
            }
        );


        alert("เพิ่มสต๊อกเรียบร้อยแล้ว ✅");

        loadProducts();

    } catch (error) {

        console.error(error);

        alert("ไม่สามารถเพิ่มสต๊อกได้");

    }

}


// =========================
// แก้ไขราคา
// =========================

// =========================
// แก้ไขสินค้า
// =========================

async function editProduct(id) {

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        let currentPrice = 0;
        let currentStock = 0;
        let productName = "";

        snapshot.forEach((item) => {

            if (item.id === id) {

                const product = item.data();

                productName = product.name || "สินค้า";

                currentPrice =
                    Number(product.price) || 0;

                currentStock =
                    Number(product.stock) || 0;

            }

        });


        // แก้ราคา
        const newPrice = Number(
            prompt(
                `แก้ไข "${productName}"\n\nราคาปัจจุบัน: ${currentPrice} บาท\n\nกรอกราคาใหม่:`,
                currentPrice
            )
        );


        if (isNaN(newPrice) || newPrice < 0) {

            alert("กรุณาใส่ราคาให้ถูกต้อง");

            return;

        }


        // แก้สต๊อก
        const newStock = Number(
            prompt(
                `แก้ไขสต๊อก "${productName}"\n\nสต๊อกปัจจุบัน: ${currentStock}\n\nกรอกจำนวนสต๊อกใหม่:`,
                currentStock
            )
        );


        if (isNaN(newStock) || newStock < 0) {

            alert("กรุณาใส่จำนวนสต๊อกให้ถูกต้อง");

            return;

        }


        await updateDoc(
            doc(db, "products", id),
            {
                price: newPrice,
                stock: newStock
            }
        );


        alert("แก้ไขสินค้าเรียบร้อยแล้ว ✅");

        loadProducts();


    } catch (error) {

        console.error(error);

        alert("ไม่สามารถแก้ไขสินค้าได้ 😭");

    }

}


// =========================
// ค้นหา
// =========================

function searchProduct() {

    const input =
        document.getElementById("search");

    if (!input) return;

    const keyword =
        input.value.toLowerCase();


    const cards =
        document.querySelectorAll(".product-card");


    cards.forEach((card) => {

        const name =
            card
                .querySelector("h3")
                .textContent
                .toLowerCase();


        if (name.includes(keyword)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


// =========================
// เพิ่มสินค้า
// =========================

async function addProduct() {

    const name =
        prompt("ชื่อสินค้า");

    if (!name) return;


    const price =
        Number(prompt("ราคาสินค้า"));


    const stock =
        Number(prompt("จำนวนสต๊อก"));


    if (
        isNaN(price) ||
        isNaN(stock) ||
        price < 0 ||
        stock < 0
    ) {

        alert("กรุณากรอกข้อมูลให้ถูกต้อง");

        return;

    }


    try {

        await addDoc(
            collection(db, "products"),
            {

                name: name,

                emoji: "🥤",

                price: price,

                stock: stock,

                unit: "แก้ว"

            }
        );


        alert("เพิ่มสินค้าเรียบร้อยแล้ว ✅");

        loadProducts();

    } catch (error) {

        console.error(error);

        alert("ไม่สามารถเพิ่มสินค้าได้");

    }

}


// =========================
// ให้ HTML ใช้ฟังก์ชัน
// =========================

window.addProduct = addProduct;

window.searchProduct = searchProduct;


// =========================
// เริ่มทำงาน
// =========================

loadProducts();
// =========================
// Dashboard
// =========================

async function loadDashboard() {

    try {

        // -------------------------
        // โหลดข้อมูลสินค้า
        // -------------------------

        const productSnapshot = await getDocs(
            collection(db, "products")
        );

        let readyProducts = 0;
        let lowProducts = 0;

        const products = [];

        productSnapshot.forEach((item) => {

            const product = item.data();

            const stock = Number(product.stock) || 0;

            products.push({
                name: product.name || "ไม่มีชื่อ",
                emoji: product.emoji || "🥤",
                stock: stock,
                unit: product.unit || "ชิ้น"
            });

            // สินค้าที่มีสต๊อก
            if (stock > 0) {
                readyProducts++;
            }

            // สินค้าใกล้หมด
            if (stock > 0 && stock <= 5) {
                lowProducts++;
            }

        });


        // -------------------------
        // แสดงจำนวนสินค้า
        // -------------------------

        const readyElement =
            document.getElementById("readyProducts");

        const lowElement =
            document.getElementById("lowProducts");

        if (readyElement) {
            readyElement.textContent = readyProducts;
        }

        if (lowElement) {
            lowElement.textContent = lowProducts;
        }


        // -------------------------
        // แสดงสต๊อกสินค้า
        // -------------------------

        const stockList =
            document.getElementById("dashboardStockList");

        if (stockList) {

            stockList.innerHTML = "";

            // แสดงสินค้าไม่เกิน 5 รายการ
            products.slice(0, 5).forEach((product) => {

                let statusClass = "green";
                let statusText =
                    `${product.stock} ${product.unit}`;

                if (product.stock === 0) {

                    statusClass = "red";
                    statusText = "หมด";

                } else if (product.stock <= 5) {

                    statusClass = "yellow";

                }


                const item =
                    document.createElement("div");

                item.className = "stock-item";

                item.innerHTML = `

                    <div>
                        <strong>
                            ${product.emoji}
                            ${product.name}
                        </strong>

                        <small>
                            สินค้า
                        </small>
                    </div>

                    <span class="stock ${statusClass}">
                        ${statusText}
                    </span>

                `;

                stockList.appendChild(item);

            });

        }


        // -------------------------
        // โหลดประวัติการขาย
        // -------------------------

        const salesSnapshot = await getDocs(
            collection(db, "sales")
        );

        let todaySales = 0;
        let todayOrders = 0;

        // วันที่วันนี้
        const today = new Date();

        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();


        salesSnapshot.forEach((item) => {

            const sale = item.data();

            let saleDate;

            if (sale.soldAt?.toDate) {

                saleDate = sale.soldAt.toDate();

            } else {

                saleDate = new Date(sale.soldAt);

            }


            // เช็กว่าเป็นรายการขายของวันนี้หรือไม่
            if (
                saleDate.getFullYear() === todayYear &&
                saleDate.getMonth() === todayMonth &&
                saleDate.getDate() === todayDate
            ) {

                todaySales +=
                    Number(sale.total) || 0;

                todayOrders++;

            }

        });


        // -------------------------
        // แสดงยอดขายวันนี้
        // -------------------------

        const salesElement =
            document.getElementById("todaySales");

        const ordersElement =
            document.getElementById("todayOrders");

        if (salesElement) {

            salesElement.textContent =
                `฿${todaySales.toLocaleString()}`;

        }

        if (ordersElement) {

            ordersElement.textContent =
                todayOrders;

        }

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// =========================
// โหลด Dashboard
// =========================

loadDashboard();