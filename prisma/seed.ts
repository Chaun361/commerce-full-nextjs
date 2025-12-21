import { prisma } from "./prismaClient";
import { Role } from "@/app/generated/prisma/enums";

async function main() {
    const user_1 = await prisma.user.upsert({
        where: { email: 'test@test.com'},
        update: {},
        create: {
            email: 'test@test.com',
            password_hash: '$2a$10$Ns06blKx9wJ0Z7NW2zhJbuhWpH.fmIfDvateryrxLgp688wnyO8l6',
            role: Role.CUSTOMER
        }
    })

    console.log(`created user with id: ${user_1.id}`);

    const user_2 = await prisma.user.upsert({
        where: { email: 'admin@admin.com'},
        update: {},
        create: {
            email: 'admin@admin.com',
            password_hash: '$2a$10$eLZs0iUkdAsz4h3u8bXr8e/MHRtbSbXVgdAmpQ.clD6pnJld6vzgi',
            role: Role.ADMIN
        }
    })

    console.log(`created user with id: ${user_2.id}`);

    const productsData = [
        {
            name: 'Apple iPad Air 11-inch (M2) Wi-Fi 1TB Blue',
            slug: 'ipad-air-m2',
            details: 'iPad Air อัดฉีดโดยชิปอันทรงพลังที่รวดเร็ว พร้อมจอภาพที่สวยสดงดงาม กล้องในแนวนอนใหม่ที่ลงตัวสุด ๆ สำหรับ FaceTime และการโทรแบบวิดีโอ คุณจึงสามารถทำนั่นทำนี่แบบมัลติทาสก์ ทำงาน เรียนรู้ เล่นสนุก และสร้างสรรค์จากที่ไหนก็ได้',
            price: '20900.00',
            inStock: 3
        },
        {
            name: 'Apple iPad Pro 11-inch Wi-Fi 256GB with Standard glass - Space Black (5th Gen)',
            slug: 'ipad-pro-5th-256',
            details: 'iPad Pro ใหม่นั้นบางอย่างเหลือเชื่อ พร้อมประสิทธิภาพที่แรงสุดด้วยชิปอันทรงพลัง และกราฟิกที่เร็วสุดขั้ว จอภาพที่สีสันสวยสดงดงามสุดล้ำ ถ่ายทอดสีสันได้อย่างแม่นยำ ให้คุณเชื่อมต่อแบบไร้สายได้รวดเร็ว เพื่อประสิทธิภาพการทำงานที่ไม่มีที่สิ้นสุด',
            price: '29900.00',
            inStock: 15
        },
        {
            name: 'Apple Watch Series 11 GPS + Cellular 42mm Rose Gold Aluminium Case with Light Blush Sport Band - M/L',
            slug: 'apple-watch-11',
            details: 'Apple Watch Series 11 มาพร้อมข้อมูลเชิงลึกด้านสุขภาพที่สำคัญซึ่งรวมถึงการแจ้งเตือนอัตราการเต้นของหัวใจเร็วหรือช้าและคะแนนการนอนหลับ ทั้งยังมีตัวชี้วัดขั้นสูงสำหรับทุกการออกกำลังกายเพื่อยกระดับความฟิตของคุณ พร้อมด้วยแบตเตอรี่ที่ใช้งานได้ นานสูงสุด 24 ชั่วโมง และวันนี้ยังมาพร้อม 5G ที่เร็วสุดๆ คุณจึงใช้งานได้อย่างรวดเร็วในทุกที่ที่ไป',
            price: '15600.00',
            inStock: 3
        },
        {
            name: 'HP OMEN 16-ap0159AX Black',
            slug: 'hp-omen-16',
            details: 'โน๊ตบุ๊ค HP OMEN 16  รุ่นใหม่ล่าสุด พร้อมนวัตกรรมการระบายความร้อนที่เหมาะสม จับคู่กับ OMEN AI เพื่อให้ได้ FPS สูงสุดเท่าที่เป็นไปได้เพียงคลิกปุ่มและโหมด Unleashed เพื่อเพิ่มประสิทธิภาพพิเศษ เปิดเครื่องพร้อมใช้งานทันที',
            price: '47990.50',
            inStock: 10
        },
        {
            name: 'Asus ROG Strix G16 G614FH-S5015W Volt Green',
            slug: 'asus-rog-strix-g16',
            details: 'โน๊ตบุ๊ค Asus ROG Strix G16  ที่สุดแห่งประสิทธิภาพกับโน๊ตบุ๊คเกมมิ่งที่ให้คุณได้สัมผัสประสบการณ์การเล่นเกมที่เหนือชั้นยิ่งขึ้น มาพร้อมกับ Windows 11 กับ AMD Ryzen และ NVIDIA GeForce RTX รุ่นใหม่ ให้คุณสนุกไปกับเกมโปรดของคุณอย่างไร้ที่ติ',
            price: '55990.50',
            inStock: 10
        },{
            name: 'JBL T110 Black',
            slug: 'jbl-t110-black',
            details: 'JBL T110 หูฟังอินเอียร์พร้อมไมโครโฟนในตัว คุณเสียงสุดพรีเมี่ยมพร้อมให้คุณใช้งานได้อย่างเต็มประสิทธิภาพ พร้อมดื่มด่ำกับการฟังเพลงได้อย่างเต็มที่  ให้เสียงเบสที่แน่นและใสเป็นธรรมชาติไม่เแหลมจนเกินไป มาพร้อมด้วยไมโครโฟนในตัวสำหรับรับสายและสนทนา รองรับการใช้งานร่วมกับได้ทั้งโทรศัพทระบบ ios และ Android  ควบคุมการใช้งานได้อย่างง่ายดายด้วยสัมผัสเพียงครั้งเดียว',
            price: '440.00',
            inStock: 10
        },{
            name: 'JBL Tour One M3 Smart TX Latte',
            slug: 'jbl-tour-one',
            details: 'JBL Tour One M3 Smart TX  เป็นหูฟัง Over-Ear ไร้สายระดับพรีเมียมที่ถูกออกแบบมาเพื่อมอบประสบการณ์การฟังเพลงที่เหนือกว่าในทุกสถานการณ์ ไม่ว่าจะเป็นการเดินทาง การทำงาน หรือการพักผ่อน ด้วยเทคโนโลยีเสียงที่ล้ำสมัยและฟีเจอร์อัจฉริยะมากมาย',
            price: '12720.50',
            inStock: 10
        },
        {
            name: 'Sony WF-C710N/BZ Black',
            slug: 'sony-wf',
            details: 'Sony WF-C710N ออกแบบให้มีขนาดเล็กทำให้สวมใส่ได้สบายและกระชับกับหูยิ่งขึ้น มาพร้อมกับการปรับปรุงระบบตัดเสียงรบกวนแบบแอคทีฟให้ดียิ่งขึ้น ด้วยเทคโนโลยี Dual Noise Sensor สองตัวภายนอกเพื่อกรองเสียงรบกวน ปุ่มควบคุมแบบ physical เป็นระบบสัมผัส และมีอายุการใช้งานแบตเตอรี่ที่ยาวนานขึ้น โดยที่คุณภาพเสียงไม่ลดทอนลง ช่วยให้คุณเพลิดเพลินกับเสียงเพลงได้มากขึ้น',
            price: '2990.00',
            inStock: 10
        }
    ]

    for (const p of productsData) {
        const product = await prisma.product.upsert({
            where: { name: p.name },
            update: {},
            create: p
        })
        console.log(`Added product with id: ${product.id}`);
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect()
        process.exit(1)
    })
