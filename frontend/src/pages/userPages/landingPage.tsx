 import background3 from '../../assets/landingImg/img-3.jpeg';
 import background1 from '../../assets/landingImg/pexels-gustavo-fring-7447067.jpg';

 
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Shield, Users, Video, ChevronDown, 
  Star, MessageCircle, Headphones, Globe,
  CheckCircle, ArrowRight
} from 'lucide-react';

const App = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const testimonials = [
    { name: "Sarah M.", role: "Found Love on VR_DATING", text: "The virtual reality experience made dating so much more immersive and meaningful!" },
    { name: "James R.", role: "Active User", text: "I've met amazing people in the most beautiful virtual environments. It's revolutionary!" },
    { name: "Emma K.", role: "Happily Matched", text: "The AI matching system really works! I found my perfect match within weeks." }
  ];

  const stats = [
    { number: "500K+", label: "Active Users" },
    { number: "98%", label: "Match Rate" },
    { number: "1M+", label: "Virtual Dates" },
    { number: "150+", label: "VR Environments" }
  ];

  return (
    <div className="landingPage relative">
      {/* Floating Action Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-red-400 p-4 rounded-full shadow-lg z-50 hover:bg-red-500 transition-all"
          >
            <ChevronDown className="w-6 h-6 text-white transform rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full p-4 md:p-6 bg-black bg-opacity-90 flex justify-between items-center z-50 shadow-lg backdrop-blur-sm"
      >
        <div className="text-2xl md:text-4xl font-bold">
          <span className="text-red-400">Cupids</span>
          <span className="text-white">Court</span>
        </div>
        <ul className="flex gap-4 md:gap-8 items-center">
          <li>
            <a href="#features" className="text-white hover:text-red-400 transition-all px-3 py-2 rounded font-medium">
              Features
            </a>
          </li>
          <li>
            <a href="#testimonials" className="text-white hover:text-red-400 transition-all px-3 py-2 rounded font-medium">
              Stories
            </a>
          </li>
          <li>
            <Link 
              to="/login" 
              className="bg-red-400 hover:bg-red-500 text-white transition-all px-6 py-2 rounded-full font-medium flex items-center gap-2"
            >
              Login <ArrowRight size={16} />
            </Link>
          </li>
        </ul>
      </motion.nav>

      {/* Hero Section */}
      <section 
        className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-center relative overflow-hidden"
        style={{ backgroundImage: `url(${background1})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2, scale: 0 }}
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [0, 1],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute w-2 h-2 bg-red-400 rounded-full"
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white px-4 relative z-10 max-w-4xl"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
              Experience Dating in
              <span className="text-red-400"> Virtual Reality</span>
            </h1>
          </motion.div>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
            Connect with like-minded individuals in immersive virtual environments
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link 
              to="/login" 
              className="group bg-red-400 hover:bg-red-500 transition-all px-8 py-4 text-lg text-white rounded-full font-medium w-48 flex items-center justify-center gap-2"
            >
              Get Started
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.span>
            </Link>
            <a 
              href="#features"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black transition-all px-8 py-4 text-lg rounded-full font-medium w-48 flex items-center justify-center gap-2"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 w-full bg-black/80 backdrop-blur-sm py-8"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-red-400 mb-2">{stat.number}</h3>
                  <p className="text-white text-sm md:text-base">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Revolutionary Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience dating like never before with our cutting-edge virtual reality platform
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Video className="w-12 h-12" />, title: "Virtual Dates", desc: "Immersive first dates in stunning environments" },
              { icon: <Shield className="w-12 h-12" />, title: "Safe & Secure", desc: "Advanced security for your privacy" },
              { icon: <Users className="w-12 h-12" />, title: "Active Community", desc: "Thousands of like-minded individuals" },
              { icon: <Heart className="w-12 h-12" />, title: "Smart Matching", desc: "AI-powered compatibility system" },
              { icon: <Globe className="w-12 h-12" />, title: "Global Dating", desc: "Connect with people worldwide" },
              { icon: <MessageCircle className="w-12 h-12" />, title: "Real-time Chat", desc: "Seamless communication tools" },
              { icon: <Headphones className="w-12 h-12" />, title: "Voice Chat", desc: "Crystal-clear audio communication" },
              { icon: <Star className="w-12 h-12" />, title: "Premium Experience", desc: "High-quality virtual environments" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gray-800 p-6 rounded-xl text-center hover:bg-red-400 transition-all duration-300"
              >
                <div className="mb-4 flex justify-center text-red-400 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-white/90">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from our happy couples who found love through VR_DATING
            </p>
          </motion.div>

          <div className="relative h-64">
            <AnimatePresence mode='wait'>
              {testimonials.map((testimonial, index) => (
                index === activeTestimonial && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0 flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 bg-red-400 rounded-full mb-6 flex items-center justify-center">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl mb-4 italic max-w-2xl">"{testimonial.text}"</p>
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <p className="text-red-400">{testimonial.role}</p>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeTestimonial ? 'bg-red-400 w-6' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-center relative"
        style={{ backgroundImage: `url(${background3})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-sm"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white px-4 relative z-10 max-w-4xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl md:text-2xl mb-8">
            Join thousands of successful couples who found love in virtual reality
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link 
              to="/login" 
              className="group bg-red-400 hover:bg-red-500 transition-all px-8 py-4 text-lg text-white rounded-full font-medium inline-flex items-center gap-2"
            >
              Start Your Journey
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.span>
            </Link>
            <Link 
              to="/login" 
              className="group bg-transparent border-2 border-white hover:bg-white hover:text-black transition-all px-8 py-4 text-lg rounded-full font-medium inline-flex items-center gap-2"
            >
              View Success Stories
              <Star className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-sm py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <CheckCircle className="w-6 h-6 text-red-400" />, text: "AI-Powered Matching" },
                { icon: <CheckCircle className="w-6 h-6 text-red-400" />, text: "Premium VR Environments" },
                { icon: <CheckCircle className="w-6 h-6 text-red-400" />, text: "24/7 Support" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center justify-center gap-3 text-white"
                >
                  {item.icon}
                  <span className="text-lg">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started with VR dating in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                number: "01", 
                title: "Create Profile", 
                desc: "Set up your virtual dating profile with photos and preferences" 
              },
              { 
                number: "02", 
                title: "Match & Connect", 
                desc: "Our AI system finds your perfect matches based on compatibility" 
              },
              { 
                number: "03", 
                title: "Virtual Date", 
                desc: "Meet in stunning VR environments and start your journey together" 
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative p-6 rounded-xl bg-gray-800 group hover:bg-red-400 transition-all duration-300"
              >
                <div className="text-6xl font-bold text-red-400/20 group-hover:text-white/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 group-hover:text-white/90">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-red-400">VR</span>
                <span className="text-white">_DATING</span>
              </div>
              <p className="text-gray-400">
                Experience the future of dating with our revolutionary virtual reality platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-red-400 transition-colors">Features</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-red-400 transition-colors">Success Stories</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-red-400 transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Safety Tips</a></li>
                <li><a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Stay updated with our latest features and success stories.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-gray-800 px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button className="bg-red-400 px-4 py-2 rounded-r-full hover:bg-red-500 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 VR_DATING. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;