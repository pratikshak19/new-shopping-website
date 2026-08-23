const FILES = [
  ['Project report (PDF)', '/docs/Trendora_Project_Report.pdf', 'Submit this to the department. Full IEEE-style chapters.'],
  ['Project report (Word)', '/docs/Trendora_Project_Report.docx', 'Editable .docx if your college wants Word.'],
  ['Presentation (PowerPoint)', '/docs/Trendora_Presentation.pptx', 'Open in MS PowerPoint / Google Slides.'],
  ['How it was built (PDF)', '/docs/Trendora_How_It_Was_Built.pdf', 'Viva walk-through of architecture and steps.'],
  ['On-screen slides', '/docs/presentation.html', 'Arrow-key deck if the projector hates PPT.'],
]

export default function Documents() {
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-hero">
        <h1>College documents</h1>
        <p className="muted">PDF, Word and PPT — complete structure for submission and viva.</p>
      </div>
      <div className="prod-grid">
        {FILES.map(([title, href, text]) => (
          <a key={href} className="summary" style={{ position: 'static' }} href={href} target="_blank" rel="noreferrer">
            <h3 className="serif">{title}</h3>
            <p>{text}</p>
            <span className="link-more">Download / open</span>
          </a>
        ))}
      </div>
    </div>
  )
}
