import { auth } from "@/auth";

export default async function AssignmentsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "ADMIN" && role !== "TEACHER") {
    return <div>ไม่ได้รับอนุญาตให้เข้าถึงหน้านี้</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)" }}>ระบบจัดการใบงานและการเช็คชื่อ</h1>
        <button className="btn-primary">สร้างใบงานใหม่</button>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Assignment Section */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", color: "var(--primary-blue)", marginBottom: "1rem" }}>ใบงานที่สั่งล่าสุด</h2>
          <div style={{ padding: "1rem", backgroundColor: "var(--background)", borderRadius: "0.5rem", border: "1px solid var(--border)" }}>
            <h3 style={{ fontWeight: 500, marginBottom: "0.5rem" }}>ใบงานที่ 1: การแก้สมการพหุนาม</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--foreground)", opacity: 0.7, marginBottom: "0.5rem" }}>กำหนดส่ง: 30 ส.ค. 2026</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--primary-dark)", fontWeight: 500 }}>ส่งแล้ว 25/30 คน</span>
              <button style={{ padding: "0.25rem 0.75rem", fontSize: "0.85rem", border: "none", backgroundColor: "var(--primary-blue)", color: "white", borderRadius: "0.25rem", cursor: "pointer" }}>ตรวจงาน</button>
            </div>
          </div>
        </div>

        {/* Attendance Section */}
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", color: "var(--primary-blue)", marginBottom: "1rem" }}>สถิติการเข้าเรียน (ภาพรวม)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#d4edda", borderRadius: "0.5rem", color: "#155724" }}>
              <span style={{ fontWeight: 500 }}>มาเรียน (Present)</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>90%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#fff3cd", borderRadius: "0.5rem", color: "#856404" }}>
              <span style={{ fontWeight: 500 }}>มาสาย (Late)</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>5%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#f8d7da", borderRadius: "0.5rem", color: "#721c24" }}>
              <span style={{ fontWeight: 500 }}>ขาดเรียน (Absent)</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
