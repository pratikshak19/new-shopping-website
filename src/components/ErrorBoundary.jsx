import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { err: null }
  }

  static getDerivedStateFromError(err) {
    return { err }
  }

  componentDidCatch(err, info) {
    console.error('Trendora crashed', err, info)
  }

  render() {
    if (!this.state.err) return this.props.children
    return (
      <div className="empty" role="alert">
        <h2>Something went wrong</h2>
        <p>Reload the page. If it keeps happening, clear site data for this origin.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    )
  }
}
