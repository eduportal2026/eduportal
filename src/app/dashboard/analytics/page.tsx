import { auth } from "@/auth";

export default async function AnalyticsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "ADMIN" && role !== "TEACHER") {
    return <div>ไม่ได้รับอนุญาตให้เข้าถึงหน้านี้</div>;
  }

  // Mock Data for Item Analysis
  const mockAnalysis = [
    { id: "q1", text: "ข้อใดคือสูตรกำลังสองสมบูรณ์?", p: 0.85, r: 0.62, diff: "ง่าย", discrimination: "ดีมาก" },
    { id: "q2", text: "จงหาค่าของอินทิเกรต 2x dx", p: 0.45, r: 0.35, diff: "ปานกลาง", discrimination: "พอใช้" },
    { id: "q3", text: "สมการพาราโบลาคือข้อใด?", p: 0.20, r: -0.15, diff: "ยากเกินไป", discrimination: "ควรปรับปรุง" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "var(--primary-dark)", marginBottom: "0.5rem" }}>การวิเคราะห์คุณภาพข้อสอบ (Item Analysis)</h1>
      <p style={{ color: "var(--foreground)", opacity: 0.7, marginBottom: "2rem" }}>วิเคราะห์ความยากง่าย (p) และค่าอำนาจจำแนก (r) จากผลสอบของนักเรียนทั้งหมด</p>
      
      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1rem", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ backgroundColor: "var(--surface-hover)", borderBottom: "1px solid var(--border)" }}>
            <tr>
              <th style={{ padding: "1rem" }}>คำถาม</th>
              <th style={{ padding: "1rem" }}>ความยากง่าย (p)</th>
              <th style={{ padding: "1rem" }}>ค่าอำนาจจำแนก (r)</th>
              <th style={{ padding: "1rem" }}>สรุปผล</th>
            </tr>
          </thead>
          <tbody>
            {mockAnalysis.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1rem" }}>{item.text}</td>
                <td style={{ padding: "1rem" }}>{item.p} ({item.diff})</td>
                <td style={{ padding: "1rem" }}>{item.r}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    padding: "0.25rem 0.5rem", 
                    borderRadius: "0.25rem", 
                    fontSize: "0.85rem",
                    backgroundColor: item.discrimination === "ดีมาก" ? "#d4edda" : item.discrimination === "ควรปรับปรุง" ? "#f8d7da" : "#fff3cd",
                    color: item.discrimination === "ดีมาก" ? "#155724" : item.discrimination === "ควรปรับปรุง" ? "#721c24" : "#856404"
                  }}>
                    {item.discrimination}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
