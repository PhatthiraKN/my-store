import {
    db,
    collection,
    getDocs
} from "./firebase.js";


// =========================
// โหลดประวัติการขาย
// =========================

async function loadHistory() {

    const historyList =
        document.getElementById("historyList");

    const totalSales =
        document.getElementById("totalSales");

    const totalBills =
        document.getElementById("totalBills");


    try {

        const snapshot =
            await getDocs(
                collection(db, "sales")
            );


        historyList.innerHTML = "";


        let salesTotal = 0;

        let billCount = snapshot.size;


        if (snapshot.empty) {

            historyList.innerHTML = `

                <div class="empty-history">

                    🧾

                    <br><br>

                    ยังไม่มีประวัติการขาย

                </div>

            `;

            totalSales.textContent = "฿0";

            totalBills.textContent = "0";

            return;
        }


        // แปลงข้อมูลเป็น Array
        const sales = [];


        snapshot.forEach((item) => {

            sales.push({

                id: item.id,

                ...item.data()

            });

        });


        // เรียงจากใหม่ → เก่า
        sales.sort((a, b) => {

            const dateA =
                a.soldAt?.toDate
                    ? a.soldAt.toDate()
                    : new Date(a.soldAt);

            const dateB =
                b.soldAt?.toDate
                    ? b.soldAt.toDate()
                    : new Date(b.soldAt);

            return dateB - dateA;

        });


        // แสดงแต่ละบิล
        sales.forEach((sale, index) => {

            const total =
                Number(sale.total) || 0;


            salesTotal += total;


            const date =
                sale.soldAt?.toDate
                    ? sale.soldAt.toDate()
                    : new Date(sale.soldAt);


            const dateText =
                date.toLocaleDateString(
                    "th-TH",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );


            const timeText =
                date.toLocaleTimeString(
                    "th-TH",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            const itemNames =
                sale.items
                    ?.map(item => {

                        return `
                            ${item.name}
                            × ${item.quantity}
                        `;

                    })
                    .join("<br>") || "-";


            const historyCard =
                document.createElement("div");


            historyCard.className =
                "history-card";


            historyCard.innerHTML = `

                <div class="history-left">

                    <div class="bill-number">

                        🧾 บิลที่ ${sales.length - index}

                    </div>

                    <div class="history-date">

                        ${dateText}
                        เวลา ${timeText}

                    </div>

                    <div class="history-items">

                        ${itemNames}

                    </div>

                </div>


                <div class="history-right">

                    <div class="history-total">

                        ฿${total.toLocaleString()}

                    </div>

                </div>

            `;


            historyList.appendChild(
                historyCard
            );

        });


        totalSales.textContent =
            `฿${salesTotal.toLocaleString()}`;


        totalBills.textContent =
            billCount;


    } catch (error) {

        console.error(error);


        historyList.innerHTML = `

            <div class="empty-history">

                ❌

                <br><br>

                ไม่สามารถโหลดประวัติการขายได้

            </div>

        `;

    }

}


// =========================
// เริ่มทำงาน
// =========================

loadHistory();