'use client'

export default function PrintButton() {
  return (
    <div className="no-print" style={{ padding: '14px 40px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #e0d9d3' }}>
      <button
        onClick={() => window.print()}
        style={{
          background: '#c47a3a',
          color: 'white',
          border: 'none',
          padding: '8px 22px',
          cursor: 'pointer',
          fontFamily: 'var(--font-montserrat)',
          fontWeight: '600',
          fontSize: '0.82rem',
          letterSpacing: '0.04em',
        }}
      >
        Imprimir / Guardar PDF
      </button>
    </div>
  )
}
