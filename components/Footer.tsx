export default function Footer() {
  return (
    <footer className="py-24 px-6 border-t border-earth-green/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Brand column — spans 2 cols on desktop */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-earth-green rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-cream text-xs">
                aspect_ratio
              </span>
            </div>
            <span className="text-xl font-headline italic font-bold">
              WidePlayer
            </span>
          </div>
          <p className="text-muted-text font-light max-w-sm mb-8 leading-relaxed">
            An independent design project focused on restoring the cinema
            experience to the modern web. Built with love and coffee.
          </p>
          <div className="flex space-x-4">
            <div className="w-8 h-8 rounded-full border border-earth-green/10 flex items-center justify-center hover:bg-earth-green hover:text-cream transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">share</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-earth-green/10 flex items-center justify-center hover:bg-earth-green hover:text-cream transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">code</span>
            </div>
          </div>
        </div>

        {/* Product links */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-earth-green mb-6">
            Product
          </h4>
          <ul className="space-y-4 text-sm text-muted-text font-light">
            <li>
              <a href="#" className="hover:text-earth-green transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-earth-green transition-colors">
                Roadmap
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-earth-green transition-colors">
                Browser Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-earth-green transition-colors">
                Release Notes
              </a>
            </li>
          </ul>
        </div>

        {/* Support links */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-earth-green mb-6">
            Support
          </h4>
          <ul className="space-y-4 text-sm text-muted-text font-light">
            <li>
              <a href="#" className="hover:text-earth-green transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-earth-green transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-earth-green transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-earth-green transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="max-w-7xl mx-auto pt-16 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-earth-green/30">
        <p>© 2024 WidePlayer Studio. All Rights Reserved.</p>
        <p className="mt-4 md:mt-0 italic">Designed for the expansive mind.</p>
      </div>
    </footer>
  );
}
