const FILES = [
  ['All documents (ZIP)', '/docs/Trendora_All_Documents.zip', 'Trendora_All_Documents.zip', 'PDF + Word + PPT in one file.'],
  ['Project report (PDF)', '/docs/Trendora_Project_Report.pdf', 'Trendora_Project_Report.pdf', 'Submit this to the department.'],
  ['Project report (Word)', '/docs/Trendora_Project_Report.docx', 'Trendora_Project_Report.docx', 'Editable .docx if college wants Word.'],
  ['Presentation (PowerPoint)', '/docs/Trendora_Presentation.pptx', 'Trendora_Presentation.pptx', 'Open in MS PowerPoint / Google Slides.'],
  ['How it was built (PDF)', '/docs/Trendora_How_It_Was_Built.pdf', 'Trendora_How_It_Was_Built.pdf', 'Viva walk-through.'],
  ['Beginner complete guide (PDF, 50+ pages)', '/docs/Trendora_Beginner_Complete_Guide.pdf', 'Trendora_Beginner_Complete_Guide.pdf', 'Screenshots + how to use + free hosting on Vercel.'],
]

export default function Documents() {
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Download documents</h1>
        <p className="muted">Pink button = save file. If preview blocks it, open <a href="/download.html">/download.html</a>.</p>
      </div>
      <div className="prod-grid">
        {FILES.map(([title, href, name, text]) => (
          <a key={href} className="summary" style={{ position: 'static' }} href={href} download={name}>
            <h3 className="serif">{title}</h3>
            <p>{text}</p>
            <span className="btn btn-primary" style={{ marginTop: 10 }}>Download</span>
          </a>
        ))}
      </div>
    </div>
  )
}
