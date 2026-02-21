// ABOUTME: Root application component with route definitions.
// ABOUTME: Uses preact-iso for SSR-compatible routing.

import { LocationProvider, Router, Route } from 'preact-iso'
import { HomePage } from './pages/HomePage.tsx'
import { BlogListPage } from './pages/BlogListPage.tsx'
import { PostPage } from './pages/PostPage.tsx'
import { TagIndexPage } from './pages/TagIndexPage.tsx'
import { TagPage } from './pages/TagPage.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { LibraryPage } from './pages/LibraryPage.tsx'
import { PhotosPage } from './pages/PhotosPage.tsx'
import { PhotoCollectionPage } from './pages/PhotoCollectionPage.tsx'

export function App() {
  return (
    <LocationProvider>
      <Router>
        {[
          <Route path="/" component={HomePage} />,
          <Route path="/blog" component={BlogListPage} />,
          <Route path="/blog/:slug" component={PostPage} />,
          <Route path="/library" component={LibraryPage} />,
          <Route path="/photos" component={PhotosPage} />,
          <Route path="/photos/:slug" component={PhotoCollectionPage} />,
          <Route path="/tags" component={TagIndexPage} />,
          <Route path="/tags/:tag" component={TagPage} />,
          <Route path="/about" component={AboutPage} />,
        ]}
      </Router>
    </LocationProvider>
  )
}
