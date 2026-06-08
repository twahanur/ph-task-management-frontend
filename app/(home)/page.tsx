"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Zap,
  BarChart3,
  Bell,
  ArrowRight,
  Star,
  Shield,
  Globe,
  Layers,
  MessageSquare,
  Calendar,
} from "lucide-react";

// ── Fade-up animation helper ──────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

// ── Data ──────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Layers,
    title: "Kanban Boards",
    desc: "Visualize work with drag-and-drop boards. Organise tasks across lists, track progress in real time.",
    color: "text-violet-400",
    glow: "shadow-violet-500/20",
  },
  {
    icon: CheckSquare,
    title: "Smart Checklists",
    desc: "Break tasks into subtasks with due dates, assignees, and completion tracking built right in.",
    color: "text-yellow-400",
    glow: "shadow-yellow-500/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Invite members, assign roles, and work together across multiple workspaces seamlessly.",
    color: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Monitor productivity trends, workload distribution, and completion rates with live charts.",
    color: "text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    desc: "Stay updated with instant alerts for assignments, comments, deadlines, and status changes.",
    color: "text-pink-400",
    glow: "shadow-pink-500/20",
  },
  {
    icon: Zap,
    title: "Custom Fields",
    desc: "Extend cards with text, numbers, dates, dropdowns, and checkboxes for full flexibility.",
    color: "text-orange-400",
    glow: "shadow-orange-500/20",
  },
];

const stats = [
  { value: "10k+", label: "Active Users" },
  { value: "500k+", label: "Tasks Completed" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "User Rating" },
];

const steps = [
  {
    step: "01",
    title: "Create a Workspace",
    desc: "Set up your project workspace in seconds. Invite your team and get everyone on the same page.",
  },
  {
    step: "02",
    title: "Build Your Boards",
    desc: "Create Kanban boards for each project. Add lists, cards, labels, and priorities with ease.",
  },
  {
    step: "03",
    title: "Track & Deliver",
    desc: "Monitor progress through dashboards, assign tasks, set deadlines, and hit your goals on time.",
  },
];

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Product Manager, TechCorp",
    quote:
      "PH Tasks transformed how our team works. The Kanban boards are intuitive and the real-time sync is flawless.",
    avatar: "SA",
    stars: 5,
  },
  {
    name: "Rafiq Hassan",
    role: "Engineering Lead, DevStudio",
    quote:
      "We replaced three tools with PH Tasks. The custom fields and analytics alone are worth it.",
    avatar: "RH",
    stars: 5,
  },
  {
    name: "Nadia Islam",
    role: "Freelance Designer",
    quote:
      "Simple, fast, and powerful. I manage all my client projects here. The notification system is perfect.",
    avatar: "NI",
    stars: 5,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="bg-[#030115] text-white overflow-x-hidden">

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-wide mb-4">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
              Now in Public Beta — Free to Use
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]"
          >
            Manage Projects{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smarter
            </span>
            <br />
            Deliver{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Faster
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            PH Tasks is your all-in-one project management platform — Kanban boards, smart checklists, real-time collaboration, and powerful analytics, all in one place.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-violet-900/30 group"
            >
              Get Started Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition-all"
            >
              <LayoutDashboard size={15} />
              Sign In
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div {...fadeUp(0.4)} className="flex items-center justify-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D", "E"].map((l) => (
                <div
                  key={l}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 border-2 border-[#030115] flex items-center justify-center text-[10px] font-bold"
                >
                  {l}
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-yellow-400 font-bold">10,000+</span> teams already onboard
            </div>
          </motion.div>
        </div>

        {/* Hero Board Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" as const }}
          className="relative z-10 w-full max-w-5xl mx-auto mt-16 px-4"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/60">
            {/* Fake window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-4 flex-1 h-5 bg-white/5 rounded-md max-w-xs text-[10px] text-white/30 flex items-center px-3">
                phtasks.com/dashboard
              </span>
            </div>
            {/* Fake kanban columns */}
            <div className="p-4 grid grid-cols-3 gap-3 min-h-[220px]">
              {[
                { label: "To Do", color: "bg-slate-500/20", count: 4 },
                { label: "In Progress", color: "bg-violet-500/20", count: 3 },
                { label: "Done", color: "bg-emerald-500/20", count: 6 },
              ].map((col) => (
                <div key={col.label} className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${col.color} text-white/80 uppercase tracking-wide`}>
                      {col.label}
                    </span>
                    <span className="text-[10px] text-white/30 font-bold">{col.count}</span>
                  </div>
                  {Array.from({ length: col.count > 3 ? 3 : col.count }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2.5 space-y-1.5"
                    >
                      <div className={`h-1.5 rounded-full ${col.color} w-${["3/4", "1/2", "5/6"][i % 3]}`} />
                      <div className="h-1.5 bg-white/5 rounded-full w-full" />
                      <div className="h-1.5 bg-white/5 rounded-full w-2/3" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════════ */}
      <section className="py-16 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-yellow-400 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">
              Everything You Need
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Built for Modern Teams
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Every feature is crafted to eliminate friction and help you ship work faster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.07)}
                className={`group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-6 space-y-4 transition-all duration-300 cursor-default shadow-lg ${f.glow}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${f.color}`}>
                  <f.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white/[0.015] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Up & Running in Minutes
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.12)} className="relative text-center space-y-4">
                {/* connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+40px)] right-0 h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center font-extrabold text-sm text-white shadow-lg shadow-violet-900/40">
                  {s.step}
                </div>
                <h3 className="font-bold text-white text-lg">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">
              Loved by Teams
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              What Our Users Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.1)}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 space-y-5"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TRUST BADGES
      ════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Shield, label: "Enterprise Security", sub: "SOC 2 Type II & GDPR compliant" },
            { icon: Globe, label: "Available Globally", sub: "Deployed on edge servers worldwide" },
            { icon: MessageSquare, label: "24/7 Support", sub: "Live chat, docs, and email support" },
          ].map((b, i) => (
            <motion.div key={b.label} {...fadeUp(i * 0.1)} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                <b.icon size={18} />
              </div>
              <p className="font-bold text-white text-sm">{b.label}</p>
              <p className="text-xs text-slate-500">{b.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          {...fadeUp()}
          className="relative z-10 max-w-2xl mx-auto text-center space-y-7"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Build{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Something Great?
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Join thousands of teams already shipping faster with PH Tasks. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-violet-900/30 group"
            >
              Start for Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition-all"
            >
              <Calendar size={15} />
              Book a Demo
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
