import { Link } from 'react-router-dom';
import { 
  Wand2, 
  Layout, 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  CheckCircle2, 
  ArrowRight,
  Star,
  Layers,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50/50 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-50/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-8 flex justify-center">
            <span className="flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 ring-1 ring-indigo-100">
              <Sparkles className="h-3 w-3" />
              Next-Gen AI Website Builder
            </span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-7xl">
            Build enterprise websites in <span className="text-indigo-600">seconds</span>, not weeks.
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-600 sm:text-xl">
            The world's most advanced AI-powered website builder. Describe your vision, and our engine generates production-ready code, marketing copy, and SEO meta tags instantly.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              to="/login" 
              className="group flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-500 hover:scale-105"
            >
              Start Building Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="rounded-2xl border border-neutral-200 bg-white px-8 py-4 text-lg font-bold text-neutral-700 hover:bg-neutral-50">
              View Templates
            </button>
          </div>

          <div className="mt-20 flex items-center justify-center gap-8 grayscale opacity-50">
            <div className="flex items-center gap-2 font-bold text-neutral-900"><Layers className="h-6 w-6" /> Stack</div>
            <div className="flex items-center gap-2 font-bold text-neutral-900"><Shield className="h-6 w-6" /> Secure</div>
            <div className="flex items-center gap-2 font-bold text-neutral-900"><Globe className="h-6 w-6" /> Global</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Enterprise-Grade Features</h2>
            <p className="mt-4 text-neutral-600">Everything you need to launch and scale your digital presence.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'AI Engine V2',
                desc: 'Powered by Gemini 3.1 Pro for the most accurate and creative code generation.',
                icon: Wand2,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50'
              },
              {
                title: 'Responsive by Default',
                desc: 'Every site generated is fully responsive and optimized for all screen sizes.',
                icon: Layout,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50'
              },
              {
                title: 'Instant Export',
                desc: 'Download your project as a clean, production-ready ZIP file with HTML/CSS/JS.',
                icon: Zap,
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              },
              {
                title: 'SEO Optimized',
                desc: 'AI-generated meta titles, descriptions, and keywords for maximum visibility.',
                icon: Globe,
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                title: 'Clean Codebase',
                desc: 'No bloated frameworks. Just clean HTML5, Tailwind CSS, and vanilla JavaScript.',
                icon: Code,
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              },
              {
                title: 'Role-Based Access',
                desc: 'Secure authentication system with admin panels and user dashboards.',
                icon: Shield,
                color: 'text-rose-600',
                bg: 'bg-rose-50'
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 transition-all hover:shadow-md">
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{feature.title}</h3>
                <p className="mt-3 text-neutral-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-neutral-600">Choose the plan that fits your needs.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '0',
                features: ['3 Projects', 'Standard AI Engine', 'Community Support', 'Basic Templates'],
                cta: 'Get Started',
                popular: false
              },
              {
                name: 'Pro',
                price: '29',
                features: ['Unlimited Projects', 'Advanced AI Engine', 'Priority Support', 'Premium Templates', 'Custom Domains'],
                cta: 'Upgrade to Pro',
                popular: true
              },
              {
                name: 'Enterprise',
                price: '99',
                features: ['Custom AI Training', 'Dedicated Support', 'SLA Guarantee', 'White-labeling', 'API Access'],
                cta: 'Contact Sales',
                popular: false
              }
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-3xl p-8 shadow-sm ring-1 ring-neutral-200 ${plan.popular ? 'bg-neutral-900 text-white ring-neutral-900' : 'bg-white text-neutral-900'}`}>
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  <span className="text-sm opacity-60">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={`h-5 w-5 ${plan.popular ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`mt-8 w-full rounded-2xl py-4 text-sm font-bold transition-all ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-xl font-bold tracking-tight text-neutral-900">
            <Layout className="h-6 w-6 text-indigo-600" />
            <span>SiteBuilder Pro</span>
          </div>
          <p className="mt-4 text-sm text-neutral-500">© 2026 AI SiteBuilder Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
