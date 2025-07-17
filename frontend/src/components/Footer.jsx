const Footer = () => (
  <footer className="w-full border-t bg-white mt-10 py-4 text-center text-sm text-gray-500">
    <p>&copy; {new Date().getFullYear()} Vishnorex Technologies. All rights reserved.</p>
    <div className="flex justify-center space-x-4 mt-2">
      <a href="https://github.com/vishnorex" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">GitHub</a>
      <a href="/about" className="hover:text-blue-600">About</a>
      <a href="/help" className="hover:text-blue-600">Help</a>
      <a href="/privacy" className="hover:text-blue-600">Privacy</a>
    </div>
  </footer>
);

export default Footer;
