'use client';

export default function StudentAttendanceView({ attendances }: { attendances: any[] }) {
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PRESENT': return { color: 'green', label: 'มาเรียน' };
      case 'LATE': return { color: 'orange', label: 'สาย' };
      case 'ABSENT': return { color: 'red', label: 'ขาดเรียน' };
      default: return { color: 'gray', label: status };
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '1rem', border: '1px solid var(--border)' }}>
      {attendances.length === 0 ? (
        <p style={{ padding: '1rem' }}>ยังไม่มีประวัติการเช็คชื่อ</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>วันที่</th>
              <th style={{ padding: '1rem' }}>วิชา</th>
              <th style={{ padding: '1rem' }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map(record => {
              const style = getStatusStyle(record.status);
              return (
                <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(record.date).toLocaleDateString('th-TH')}</td>
                  <td style={{ padding: '1rem' }}>{record.course?.title}</td>
                  <td style={{ padding: '1rem', color: style.color, fontWeight: 'bold' }}>{style.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
