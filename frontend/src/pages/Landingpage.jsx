import { Link } from "react-router-dom";
import { FaChartPie, FaUsers, FaLock, FaMobileAlt, FaGithub, FaArrowRight, FaStar } from "react-icons/fa";

export default function LandingPage() {

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white opacity-2 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <div className="text-xl font-bold">💸 ExpenseTracker</div>
        <div className="flex gap-4">
          <Link 
            to="/login"
            className="px-4 py-2 text-sm hover:text-gray-300 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register"
            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-tight">
            Track. Split. Save.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The most intuitive expense tracker for modern budgeting. 
            <span className="text-white font-medium"> Split bills effortlessly</span> and 
            <span className="text-white font-medium"> visualize your spending</span> like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link 
              to="/register"
              className="group px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center"
            >
              Start Free Today
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login"
              className="px-8 py-4 border-2 border-gray-600 rounded-xl hover:border-white hover:bg-white hover:text-black transition-all duration-300 font-semibold"
            >
              Sign In
            </Link>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to 
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"> take control</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to make expense tracking effortless and enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaChartPie,
                title: "Smart Analytics",
                description: "Beautiful visualizations that make your spending patterns crystal clear with interactive charts.",
                color: "text-blue-400"
              },
              {
                icon: FaUsers,
                title: "Group Expenses",
                description: "Split bills instantly with friends and family. Track who owes what with zero hassle.",
                color: "text-green-400"
              },
              {
                icon: FaLock,
                title: "Bank-Grade Security",
                description: "Your financial data is protected with enterprise-level encryption and secure authentication.",
                color: "text-yellow-400"
              },
              {
                icon: FaMobileAlt,
                title: "Works Everywhere",
                description: "Seamless experience across all your devices. Access your data anytime, anywhere.",
                color: "text-purple-400"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <feature.icon className={`text-4xl mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your finances?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users who've already taken control of their spending
          </p>
          <Link 
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg"
          >
            Get Started for Free
            <FaArrowRight className="ml-2" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-950 border-t border-gray-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-bold mb-2">💸 ExpenseTracker</div>
              <div className="text-gray-400">Making expense tracking effortless</div>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/pramaray" 
                className="flex items-center text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="mr-2" /> 
                Prama Ray
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>Made with ❤️ by Prama Ray • &copy; 2025 ExpenseTracker • All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}