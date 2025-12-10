'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, Activity, Clock } from 'lucide-react';
import { useViewStore } from '@/store/view-store';

export function DashboardView() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-8 h-full overflow-y-auto space-y-8"
        >
            {/* 1. Greeting Section */}
            <motion.div variants={item} className="space-y-1">
                <h1 className="text-3xl font-light text-foreground/90">
                    Buenos días, <span className="font-semibold text-primary">Dr. Sánchez</span>
                </h1>
                <p className="text-muted-foreground text-lg font-light">
                    Tiene <span className="text-foreground font-medium">4 consultas</span> programadas para hoy.
                </p>
            </motion.div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Pacientes Totales", value: "1,284", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { title: "Citas Hoy", value: "4", icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { title: "Pendientes", value: "2", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { title: "Actividad", value: "+12%", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10" },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={item}
                        className="group relative overflow-hidden rounded-2xl glass border border-white/5 p-6 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        <div className={`absolute top-4 right-4 p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                        <h3 className="text-4xl font-light mt-2 text-foreground">{stat.value}</h3>

                        {/* Hover Glow Effect */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all opacity-0 group-hover:opacity-100" />
                    </motion.div>
                ))}
            </div>

            {/* 3. Main Split View: Agenda vs Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-20">

                {/* Agenda Widget */}
                <motion.div variants={item} className="lg:col-span-2 glass rounded-2xl border border-white/5 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium">Agenda del Día</h2>
                        <button className="text-sm text-primary hover:underline">Ver Calendario</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { time: "09:00 AM", patient: "Maria González", type: "Primera Vez", status: "Confirmada" },
                            { time: "11:30 AM", patient: "Roberto Díaz", type: "Seguimiento", status: "En Sala" },
                            { time: "02:00 PM", patient: "Ana López", type: "Post-Operatorio", status: "Pendiente" },
                            { time: "04:15 PM", patient: "Carlos Ruiz", type: "Consulta General", status: "Confirmada" },
                        ].map((appt, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                <div className="text-lg font-light text-muted-foreground w-20">{appt.time}</div>
                                <div className="h-10 w-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                                <div className="flex-1">
                                    <h4 className="text-base font-medium">{appt.patient}</h4>
                                    <p className="text-xs text-muted-foreground">{appt.type}</p>
                                </div>
                                <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-foreground/80 border border-white/5">
                                    {appt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity / Quick Actions */}
                <motion.div variants={item} className="glass rounded-2xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                    <h2 className="text-xl font-medium mb-6 relative z-10">Actividad Reciente</h2>
                    <div className="space-y-6 relative z-10">
                        {[
                            "Dr. Sánchez actualizó expediente de R. Díaz",
                            "Nueva cita agendada desde Web",
                            "Documento subido: Radiografía Torax",
                            "Recordatorio enviado a Maria G."
                        ].map((act, i) => (
                            <div key={i} className="flex gap-3 items-start text-sm text-muted-foreground">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary/40" />
                                <p>{act}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                        <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                            Nueva Cita
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
