"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import FloatingShapes from "./FloatingShapes";
import { animateScroll as scroll, Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  ClipboardList,
  Lock,
  LayoutDashboard,
  Share2,
  FileSpreadsheet,
  Edit,
  Zap,
  Globe,
  Users,
  BarChart3,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MoveRight,
  Loader2,
} from "lucide-react";
import { SignInButton, SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { user, isSignedIn } = useUser();
  const [showTopBtn, setShowTopBtn] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setShowSignUp(true);
    }, 1000);
  };

  if (showSignUp) {
    return <SignUp path="/sign-up" routing="hash" signInUrl="/sign-in" />;
  }
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 800, smooth: "easeInOutQuart" });
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* ANIMATED BACKGROUND */}
        <div className="absolute inset-1 bg-gradient-to-br from-purple-500 via-blue-600 to-yellow-500 animate-gradient"></div>

        {/* GLASS EFFECT LAYER */}
        <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-xl"></div>

        {/* FLOATING SHAPES */}
        <div>
          <FloatingShapes />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-4xl px-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex justify-center"
          >
            <span className="inline-flex items-center px-4 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-sm font-medium">
              <Zap className="mr-2 h-4 w-4 text-yellow-300" />
              Revolutionizing form creation with AI technology
            </span>
          </motion.div>

          <h1 className="text-6xl font-extrabold sm:text-7xl leading-tight drop-shadow-lg">
            Elevate Your Forms <br />
            <span className="bg-gradient-to-r from-yellow-300 via-red-400 to-purple-500 bg-clip-text text-transparent">
              with AI in ReForm
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto">
            Create smart, automated forms in seconds. Boost efficiency and
            streamline workflows with AI-powered solutions that adapt to your
            business needs.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {isSignedIn ? (
              <>
                <Link href="/dashboard" onClick={handleClick}>
                  <Button
                    disabled={loading}
                    className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform transition 
          bg-gradient-to-r from-yellow-400 to-red-500 text-white
          ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                    ) : (
                      "Go to Dashboard"
                    )}
                  </Button>
                </Link>
                <ScrollLink
                  to="features"
                  smooth={true}
                  duration={800}
                  offset={-50}
                >
                  <Button className="px-8 py-4 text-lg font-semibold bg-gray-800 text-white rounded-lg shadow-lg transform hover:scale-105 transition">
                    Explore Features
                  </Button>
                </ScrollLink>
              </>
            ) : (
              <>
                <SignInButton>
                  <Button
                    disabled={loading}
                    onClick={handleClick}
                    className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform transition 
        bg-gradient-to-r from-yellow-400 to-red-500 text-white 
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Get Started</span>
                        <MoveRight />
                      </div>
                    )}
                  </Button>
                </SignInButton>

                <ScrollLink
                  to="features"
                  smooth={true}
                  duration={800}
                  offset={-50}
                >
                  <Button className="px-8 py-4 text-lg font-semibold bg-gray-800 text-white rounded-lg shadow-lg transform hover:scale-105 transition">
                    Explore Features
                  </Button>
                </ScrollLink>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-12 flex justify-center space-x-6"
          ></motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="bg-gray-100 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
              <Zap className="mr-1 h-4 w-4" />
              Powerful Features
            </span>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Why Choose Our AI Forms?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              ReForm combines cutting-edge AI with intuitive design to create
              the most powerful form solution on the market.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {[
              {
                Icon: Bot,
                title: "AI-Powered Forms",
                desc: "Generate complex forms in seconds with our advanced AI. Just describe what you need, and watch the magic happen.",
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                Icon: LayoutDashboard,
                title: "Streamlined Workflow",
                desc: "Manage all your forms in one intuitive dashboard. Track submissions, analyze responses, and optimize your process.",
                color: "text-green-500",
                bg: "bg-green-50",
              },
              {
                Icon: Lock,
                title: "Enterprise-Grade Security",
                desc: "Your data is protected with end-to-end encryption and compliance.",
                color: "text-red-500",
                bg: "bg-red-50",
              },
              {
                Icon: Share2,
                title: "One-Click Sharing",
                desc: "Share your forms via links, embed them on your website, or send them directly to recipients via links.",
                color: "text-indigo-500",
                bg: "bg-indigo-50",
              },
              {
                Icon: FileSpreadsheet,
                title: "Advanced Analytics",
                desc: "Get insights from your form responses with built-in analytics. Export to Excel, PDF.",
                color: "text-emerald-500",
                bg: "bg-emerald-50",
              },
              {
                Icon: Edit,
                title: "Flexible Customization",
                desc: "Modify AI-generated forms to match your brand. Customize fields, validation rules, and appearance with ease.",
                color: "text-orange-500",
                bg: "bg-orange-50",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-all transform"
              >
                <div className={`${item.bg} p-4 rounded-full mb-6`}>
                  <item.Icon className={`text-4xl ${item.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
              <Zap className="mr-1 h-4 w-4" />
              Simple Process
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How ReForm Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Creating powerful forms has never been easier. Our AI-powered
              platform simplifies the entire process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe Your Form",
                description:
                  "Tell our AI what kind of form you need in plain language. No technical knowledge required.",
                color: "from-blue-400 to-blue-600",
              },
              {
                step: "02",
                title: "AI Generates Your Form",
                description:
                  "Our AI creates a complete form with all necessary fields, validation, and logic in seconds.",
                color: "from-purple-400 to-purple-600",
              },
              {
                step: "03",
                title: "Share & Collect Data",
                description:
                  "Publish your form instantly and start collecting responses. Analyze data in real-time.",
                color: "from-red-400 to-red-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-xl shadow-lg p-8"
              >
                <div
                  className={`absolute -top-5 left-8 w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold`}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Trusted by Businesses Worldwide
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Join thousands of companies using ReForm to streamline their data
              collection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "100+", label: "Active Users", icon: Users },
              { value: "500+", label: "Forms Created", icon: ClipboardList },
              { value: "600+", label: "Submissions", icon: BarChart3 },
              { value: "80%", label: "Uptime", icon: Globe },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium mb-4">
              <MessageSquare className="mr-1 h-4 w-4" />
              FAQ
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about ReForm and our AI-powered form
              solution.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "How does the AI form generation work?",
                answer:
                  "Our AI analyzes your description and automatically creates a form with all necessary fields, validation rules, and logic. It uses natural language processing to understand your requirements and generates a complete form in seconds.",
              },
              {
                question: "Can I customize the AI-generated forms?",
                answer:
                  "While our AI creates excellent forms out of the box, you have full control to edit, add, or remove fields, customize the design, and more.",
              },
              {
                question: "Is my data secure with ReForm?",
                answer:
                  "Yes, security is our top priority. We use end-to-end encryption, regular security audits. Your data is stored securely and never shared with third parties.",
              },
              {
                question: "What integrations does ReForm support?",
                answer:
                  "ReForm integrates with popular tools like Excel, and many more. You can export you created to Excel and PDF.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex justify-between items-center w-full p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  {activeAccordion === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeAccordion === index
                      ? "max-h-96 p-5 border-t"
                      : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Forms?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of businesses already using ReForm to create
              smarter, more efficient forms. Get started today and see the
              difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BACK TO TOP BUTTON */}
      {showTopBtn && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all z-50"
        >
          <ArrowUp className="text-2xl" />
        </motion.button>
      )}

      {/* CUSTOM CSS FOR ANIMATED BACKGROUND */}
      <style jsx>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 300% 300%;
          animation: gradientAnimation 10s ease infinite;
        }
      `}</style>

      {/* FOOTER SECTION */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold">ReForm - AI Form Builder</h2>

          <p className="mt-1">
            Made with ☕ and ❤️ by{" Muthuvelan Thangaiah"}
          </p>

          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://www.linkedin.com/in/muthuvelan-thangaiah-b5a4a4216/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <img
                src="/icons8-linkedin.svg"
                alt="LinkedIn"
                className="w-8 h-8"
              />
            </a>
            <a
              href="https://github.com/Muthuvelan02"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <img src="/github.svg" alt="GitHub" className="w-7 h-7" />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=tmuthuvelan0201@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <img src="/icons8-gmail.svg" alt="Email" className="w-8 h-8" />
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            &copy; {new Date().getFullYear()} ReForm. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Hero;
