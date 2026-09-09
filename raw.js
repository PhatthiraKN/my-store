import {
    db,
    collection,
    getDocs,
    updateDoc,
    doc
} from "./firebase.js";

// =========================
// โหลดวัตถุดิบ
// =========================

async function loadRawMaterials() {

    const container = document.getElementById("rawList");

    if (!container) return;

    container.innerHTML = "กำลังโหลดวัตถุดิบ...";

    try {

        const snapshot = await getDocs(
            collection(db, "rawMaterials")
        );

        container.innerHTML = "";

        snapshot.forEach((item) => {

            const raw = item.data();

            const stock = Number(raw.stock) || 0;

            let status = "";
            let statusClass = "";

            if (stock === 0) {
                status = "หมด";
                statusClass = "red";
            } else if (stock <= 5) {
                status = "ใกล้หมด";
                statusClass = "yellow";
            } else {
                status = "มีเพียงพอ";
                statusClass = "green";
            }

            const card = document.createElement("div");

            card.className = "product-card";

            card.innerHTML = `

                <div class="product-image">
                    🧪
                </div>

                <h3>
                    ${raw.name || "ไม่มีชื่อ"}
                </h3>

                <div class="product-stock">

                    <span>
                        คงเหลือ
                    </span>

                    <strong>
                        ${stock} ${raw.unit || ""}
                    </strong>

                    <span class="stock-status ${statusClass}">
                        ${status}
                    </span>

                </div>

                <div class="product-actions">
    <button class="edit-stock-button">✏️ แก้สต๊อก</button>
</div>

                </div>

            `;

            card.querySelector(".edit-stock-button").addEventListener("click", () => {
    editRawStock(item.id, raw.name, stock);
});

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "เกิดข้อผิดพลาดในการโหลดวัตถุดิบ 😭";
    }
}


// =========================
// เพิ่มสต๊อกวัตถุดิบ
// =========================

async function increaseRawStock(id, name, currentStock) {

    const amount = Number(
        prompt(
            `เพิ่มสต๊อก "${name}" กี่ ${getUnit(name)}?`
        )
    );

    if (isNaN(amount) || amount <= 0) {

        alert("กรุณาใส่จำนวนให้ถูกต้อง");

        return;
    }

    try {

        await updateDoc(
            doc(db, "rawMaterials", id),
            {
                stock: currentStock + amount
            }
        );

        alert("เพิ่มสต๊อกเรียบร้อยแล้ว ✅");

        loadRawMaterials();

    } catch (error) {

        console.error(error);

        alert("ไม่สามารถเพิ่มสต๊อกได้ 😭");
    }
}


// =========================
// หน่วยของวัตถุดิบ
// =========================

function getUnit(name) {

    const units = {

        "แตงโม": "แก้ว",
        "อะโวคาโด": "แก้ว",
        "ส้ม": "แก้ว",
        "มะพร้าว": "แก้ว",
        "กล้วย": "แก้ว",

        "น้ำเชื่อม": "ช้อน",

        "น้ำแข็ง": "แก้ว",

        "แก้ว": "ใบ",
        "ฝา": "ใบ",
        "หลอด": "อัน",
        "ถุงหิ้ว": "ใบ"

    };

    return units[name] || "หน่วย";
}


// =========================
// ค้นหาวัตถุดิบ
// =========================

document
    .getElementById("rawSearch")
    ?.addEventListener("input", function () {

        const keyword =
            this.value.toLowerCase();

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

    });


// =========================
// เริ่มทำงาน
// =========================

loadRawMaterials();
async function editRawStock(id, name, currentStock) {

    const newStock = Number(
        prompt(
            `แก้ไขสต๊อก "${name}"\n\nปัจจุบัน: ${currentStock}\n\nกรอกจำนวนใหม่:`,
            currentStock
        )
    );

    if (isNaN(newStock) || newStock < 0) {
        alert("กรุณาใส่จำนวนที่ถูกต้อง");
        return;
    }

    try {

        await updateDoc(
            doc(db, "rawMaterials", id),
            {
                stock: newStock
            }
        );

        alert("แก้ไขสต๊อกเรียบร้อยแล้ว ✅");

        loadRawMaterials();

    } catch (error) {

        console.error(error);

        alert("ไม่สามารถแก้ไขสต๊อกได้ 😭");

    }
}