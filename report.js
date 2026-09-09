import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =========================
// โหลดรายงาน
// =========================

async function loadReport() {

    try {

        const snapshot = await getDocs(
            collection(db, "sales")
        );


        // -------------------------
        // ตัวแปรเก็บข้อมูล
        // -------------------------

        let totalSales = 0;

        let totalBills = snapshot.size;

        const productSales = {};

        const dailySales = {};


        // -------------------------
        // อ่านข้อมูลการขาย
        // -------------------------

        snapshot.forEach((item) => {

            const sale = item.data();

            const total =
                Number(sale.total) || 0;

            totalSales += total;


            // วันที่ขาย

            let date;

            if (sale.soldAt?.toDate) {

                date = sale.soldAt.toDate();

            } else {

                date = new Date(sale.soldAt);

            }


            // -------------------------
            // ยอดขายรายวัน
            // -------------------------

            const dateKey =
                date.toLocaleDateString(
                    "th-TH"
                );

            if (!dailySales[dateKey]) {

                dailySales[dateKey] = 0;

            }

            dailySales[dateKey] += total;


            // -------------------------
            // สินค้าขายดี
            // -------------------------

            if (sale.items) {

                sale.items.forEach((item) => {

                    const name =
                        item.name || "ไม่ทราบชื่อ";

                    const quantity =
                        Number(item.quantity) || 0;


                    if (!productSales[name]) {

                        productSales[name] = 0;

                    }


                    productSales[name] += quantity;

                });

            }

        });


        // -------------------------
        // แสดงยอดขายรวม
        // -------------------------

        document.getElementById(
            "reportSales"
        ).textContent =
            `฿${totalSales.toLocaleString()}`;


        // -------------------------
        // แสดงจำนวนบิล
        // -------------------------

        document.getElementById(
            "reportBills"
        ).textContent =
            totalBills;


        // -------------------------
        // แสดงสินค้าขายดี
        // -------------------------

        const bestProducts =
            document.getElementById(
                "bestProducts"
            );


        const sortedProducts =
            Object.entries(productSales)
                .sort((a, b) => b[1] - a[1]);


        if (sortedProducts.length === 0) {

            bestProducts.innerHTML = `
                <div class="empty-history">
                    🥤<br><br>
                    ยังไม่มีข้อมูลการขาย
                </div>
            `;

        } else {

            bestProducts.innerHTML = "";


            sortedProducts
                .slice(0, 5)
                .forEach(
                    ([name, quantity], index) => {

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "history-card";


                        item.innerHTML = `

                            <div>

                                <div class="bill-number">

                                    ${index + 1}.
                                    🥤 ${name}

                                </div>

                                <div
                                    class="history-date"
                                >
                                    จำนวนที่ขาย
                                </div>

                            </div>


                            <div
                                class="history-total"
                            >

                                ${quantity} แก้ว

                            </div>

                        `;


                        bestProducts.appendChild(
                            item
                        );

                    }
                );

        }


        // -------------------------
        // แสดงยอดขายรายวัน
        // -------------------------

        const dailySalesContainer =
            document.getElementById(
                "dailySales"
            );


        const sortedDays =
            Object.entries(dailySales)
                .sort((a, b) => {

                    const dateA =
                        new Date(
                            a[0]
                        );

                    const dateB =
                        new Date(
                            b[0]
                        );

                    return dateB - dateA;

                });


        if (sortedDays.length === 0) {

            dailySalesContainer.innerHTML = `
                <div class="empty-history">
                    📅<br><br>
                    ยังไม่มีข้อมูลการขาย
                </div>
            `;

        } else {

            dailySalesContainer.innerHTML = "";


            sortedDays.forEach(
                ([date, total]) => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "history-card";


                    item.innerHTML = `

                        <div>

                            <div
                                class="bill-number"
                            >
                                📅 ${date}
                            </div>

                            <div
                                class="history-date"
                            >
                                ยอดขายของวัน
                            </div>

                        </div>


                        <div
                            class="history-total"
                        >

                            ฿${total.toLocaleString()}

                        </div>

                    `;


                    dailySalesContainer
                        .appendChild(item);

                }
            );

        }


    } catch (error) {

        console.error(error);

        alert(
            "ไม่สามารถโหลดรายงานได้ 😭"
        );

    }

}


// =========================
// เริ่มทำงาน
// =========================

loadReport();