import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 pb-40 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm mt-2">
              © {new Date().getFullYear()} IT-ECOM. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
            <Link href="/history" className="text-gray-300 hover:text-white transition-colors">Order History</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
