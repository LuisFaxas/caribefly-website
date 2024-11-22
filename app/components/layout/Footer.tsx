export default function Footer() {
  return (
    <footer
      className="mt-10 md:mt-16 bg-blue-600 text-white py-4 text-center text-sm md:text-base"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        <p>
          {new Date().getFullYear()} CaribeFly - Your Travel Partner to Cuba
        </p>
        <nav className="mt-2" role="navigation" aria-label="Footer Navigation">
          <ul className="flex justify-center space-x-4">
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
