"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.16, 1, 0.3, 1];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* 1. PREMIUM NAVBAR INTEGRATION */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-24 flex items-center justify-between">
          <Image
            src="/logga.png"
            alt="Sjöstedts Måleri"
            width={300}
            height={90}
            priority
            className="h-10 md:h-12 w-auto object-contain"
          />
          <button className="rounded-full bg-black text-white px-6 py-2.5 text-xs tracking-widest font-medium uppercase transition-all shadow-md hover:scale-105 hover:shadow-xl hover:shadow-black/20">
            Boka Offert
          </button>
        </div>
      </motion.nav>

      <main className="pt-24 overflow-hidden">
        {/* 2. THE "NYMÅLAT" HERO REVEAL */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full min-h-[85vh] flex flex-col lg:flex-row items-center gap-12 lg:gap-24 py-12">
          {/* Left Column */}
          <div className="flex-1 w-full relative z-10 flex flex-col items-start justify-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.2 }}
              className="absolute -inset-x-12 -inset-y-24 bg-[#F3F1EB] -z-10 rounded-r-[4rem] hidden lg:block opacity-60"
            />
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease, delay: 0.1 }}
              className="font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] tracking-tight mb-8"
            >
              Sjöstedts<br />Måleri.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.3 }}
              className="font-sans text-lg md:text-xl font-light tracking-wide text-black/70 mb-12 max-w-lg"
            >
              Exklusivt hantverk, oöverträffad precision och perfektion i varje penseldrag. Vi förvandlar utrymmen till mästerverk.
            </motion.p>
            
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.5 }}
              className="relative overflow-hidden rounded-full bg-[#F3F1EB] text-black border border-black/10 px-8 py-4 text-sm tracking-widest font-medium uppercase transition-all group shadow-[inset_0px_-2px_6px_rgba(0,0,0,0.05),0px_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[inset_0px_-2px_4px_rgba(0,0,0,0.02),0px_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1"
            >
              <span className="relative z-10">Upptäck vår vision</span>
              <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </motion.button>
          </div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease }}
            className="flex-1 w-full h-[60vh] lg:h-[80vh] relative rounded-3xl overflow-hidden border border-black/5 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[#F3F1EB]" />
            <Image
              src="https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?q=80&w=2000&auto=format&fit=crop"
              alt="Premium Interior"
              fill
              className="object-cover opacity-90"
              priority
            />
          </motion.div>
        </section>

        {/* 3. THE FLOATING TRUST CARDS */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Premium Garanti", desc: "Vi lämnar ingenting åt slumpen. Fullständig nöjdhetsgaranti på alla våra utförda arbeten." },
              { title: "Mästarklass Certifierade", desc: "Våra målare bär stolt mästarbrev. Ett bevis på yrkesskicklighet och dedikation till konsten." },
              { title: "Transparent Prissättning", desc: "Raka besked, fast pris och noll dolda avgifter. Ärlig kommunikation från första penseldraget." }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease, delay: idx * 0.2 }}
                className="bg-[#F3F1EB] rounded-3xl p-10 shadow-[inset_0px_2px_10px_rgba(255,255,255,0.7),0px_10px_30px_rgba(0,0,0,0.03)] border border-white"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-6">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <h3 className="font-serif text-2xl mb-4">{card.title}</h3>
                <p className="font-sans font-light text-black/70 leading-relaxed tracking-wide">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. ULTRA-LUXURY EXPERTISE GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="mb-20 text-center"
          >
            <h2 className="font-serif text-5xl md:text-7xl mb-6">Vår Expertis.</h2>
            <p className="font-sans text-lg tracking-wide font-light text-black/60 max-w-2xl mx-auto">
              Skräddarsydda lösningar för miljöer som kräver det absolut bästa.
            </p>
          </motion.div>

          <div className="flex flex-col border-t border-black/10">
            {[
              {
                title: "Exklusiv Interiör",
                desc: "Finputs, färgval och mikrocement. Vi skapar harmoniska rum med oöverträffad finish där detaljerna gör helheten.",
                number: "01"
              },
              {
                title: "Fasad & Exteriörskydd",
                desc: "Hållbara fasadmålningar som skyddar mot det nordiska klimatet och förhöjer din fastighets karaktär och värde.",
                number: "02"
              },
              {
                title: "Arkitektonisk Rådgivning",
                desc: "Vi hjälper dig hitta rätt kulörer, glans och textur för att lyfta arkitekturen och framhäva hemmets själ.",
                number: "03"
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease, delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between py-12 md:py-16 border-b border-black/10 hover:bg-[#F3F1EB] transition-colors duration-500 px-4 md:px-8 cursor-pointer rounded-2xl"
              >
                <div className="flex items-center gap-8 mb-6 md:mb-0">
                  <span className="font-sans text-sm tracking-widest text-black/40 group-hover:text-black transition-colors">{service.number}</span>
                  <h3 className="font-serif text-3xl md:text-5xl group-hover:translate-x-4 transition-transform duration-500 ease-out">{service.title}</h3>
                </div>
                <p className="font-sans font-light text-black/60 max-w-md md:text-right group-hover:text-black/80 transition-colors">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. THE BLACKOUT CONVERSION FORM */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease }}
            className="bg-black text-white rounded-[2.5rem] mx-4 md:mx-12 xl:mx-auto max-w-6xl p-12 md:p-24 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <h2 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
                  Dags för<br />förändring?
                </h2>
                <p className="font-sans text-lg md:text-xl tracking-wide font-light text-white/60 mb-12">
                  Låt oss förverkliga din vision. Fyll i formuläret så återkommer vi med en skräddarsydd plan.
                </p>
              </div>

              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="group relative">
                  <input 
                    type="text" 
                    placeholder="Ditt Namn" 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans font-light tracking-wide"
                  />
                </div>
                <div className="group relative">
                  <input 
                    type="email" 
                    placeholder="E-postadress" 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans font-light tracking-wide"
                  />
                </div>
                <div className="group relative">
                  <textarea 
                    placeholder="Berätta om ditt projekt..." 
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans font-light tracking-wide resize-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full rounded-full bg-white text-black px-8 py-6 text-sm tracking-widest font-semibold uppercase mt-4 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Skicka Förfrågan
                </button>
              </form>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
