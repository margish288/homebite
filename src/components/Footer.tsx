export default function Footer() {
  return (
    <footer className='bg-gray-50 dark:bg-dark-surface border-t border-gray-200 dark:border-gray-700'>
      <div className='container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo and Tagline */}
          <div className='md:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <span className='text-2xl'>🍱</span>
              <span className='text-xl font-bold text-ink'>HomeBite</span>
            </div>
            <p className='text-lg text-ink-light leading-relaxed max-w-md'>
              Daily homestyle meals, delivered by trusted neighborhood cooks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-sm font-semibold text-ink dark:text-dark-text uppercase tracking-wider mb-4'>
              For Foodies
            </h3>
            <ul className='space-y-3'>
              {/* <li><a href="/discover" className="text-ink-light dark:text-dark-text-muted hover:text-primary-500 transition-colors">Discover</a></li> */}
              <li>
                <a
                  href='/orders'
                  className='text-ink-light dark:text-dark-text-muted hover:text-primary-500 transition-colors'
                >
                  My Orders
                </a>
              </li>
              <li>
                <a
                  href='/favorites'
                  className='text-ink-light dark:text-dark-text-muted hover:text-primary-500 transition-colors'
                >
                  Favorites
                </a>
              </li>
              <li>
                <a
                  href='/help'
                  className='text-ink-light dark:text-dark-text-muted hover:text-primary-500 transition-colors'
                >
                  Help
                </a>
              </li>
            </ul>
          </div>

          {/* Cook Links */}
          <div>
            <h3 className='text-sm font-semibold text-ink dark:text-dark-text uppercase tracking-wider mb-4'>
              For Cooks
            </h3>
            <ul className='space-y-3'>
              <li>
                <a
                  href='/become-cook'
                  className='text-ink-light dark:text-dark-text-muted hover:text-primary-500 transition-colors'
                >
                  Become a Cook
                </a>
              </li>
              <li>
                <a
                  href='/dashboard'
                  className='text-ink-light dark:text-dark-text-muted hover:text-primary-500 transition-colors'
                >
                  Cook Dashboard
                </a>
              </li>
              <li>
                <a
                  href='/resources'
                  className='text-ink-light dark:text-dark-text-muted hover:text-primary-500 transition-colors'
                >
                  Resources
                </a>
              </li>
              <li>
                <a
                  href='/community'
                  className='text-ink-light dark:text-dark-text-muted hover:text-primary-500 transition-colors'
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <p className='text-sm text-ink-lighter dark:text-dark-text-muted'>
              © 2024 HomeBite. Made with ❤️ for home cooking enthusiasts.
            </p>
            <div className='flex space-x-6'>
              <a
                href='/privacy'
                className='text-sm text-ink-lighter dark:text-dark-text-muted hover:text-primary-500 transition-colors'
              >
                Privacy Policy
              </a>
              <a
                href='/terms'
                className='text-sm text-ink-lighter dark:text-dark-text-muted hover:text-primary-500 transition-colors'
              >
                Terms of Service
              </a>
              <a
                href='/contact'
                className='text-sm text-ink-lighter dark:text-dark-text-muted hover:text-primary-500 transition-colors'
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
