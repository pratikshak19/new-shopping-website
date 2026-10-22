const FILES = [
  ['Vercel upload (ZIP)', '/docs/Trendify_For_Vercel.zip', 'Trendify_For_Vercel.zip', 'Unzip on laptop, then npx vercel --prod on the existing project.'],
  ['All documents (ZIP)', '/docs/Trendify_All_Documents.zip', 'Trendify_All_Documents.zip', 'PDF + Word + PPT in one file.'],
  ['Project report (PDF)', '/docs/Trendify_Project_Report.pdf', 'Trendify_Project_Report.pdf', 'Submit this to the department.'],
  ['Project report (Word)', '/docs/Trendify_Project_Report.docx', 'Trendify_Project_Report.docx', 'Editable .docx if college wants Word.'],
  ['Presentation (PowerPoint)', '/docs/Trendify_Presentation.pptx', 'Trendify_Presentation.pptx', 'Open in MS PowerPoint / Google Slides.'],
  ['How it was built (PDF)', '/docs/Trendify_How_It_Was_Built.pdf', 'Trendify_How_It_Was_Built.pdf', 'Viva walk-through.'],
  ['Beginner complete guide (PDF, 50+ pages)', '/docs/Trendify_Beginner_Complete_Guide.pdf', 'Trendify_Beginner_Complete_Guide.pdf', 'Screenshots + how to use + free hosting on Vercel.'],
]

export default function Documents() {
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>Download documents</h1>
        <p className="muted">
          College papers for this same Trendify site. Pink button saves the file.
          How to use: <a href="/help">Help</a>. If the preview blocks download, open <a href="/download.html">/download.html</a>.
        </p>
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
