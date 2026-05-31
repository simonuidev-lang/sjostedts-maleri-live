export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white text-black selection:bg-black selection:text-white">
      
      {/* 1. HERO SECTION (Asymmetric Power Layout) */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 items-center gap-12 md:gap-16 py-20">
            {/* Left Column */}
            <div className="flex flex-col text-left">
              <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tight leading-none text-black">
                Sjöstedts<br />Måleri.
              </h1>
              <p className="font-sans mt-8 text-lg md:text-xl text-black/80 font-medium max-w-lg leading-relaxed">
                Premiummåleri för miljöer där kompromisser inte existerar. Vi levererar nymålad perfektion med kirurgisk precision.
              </p>
              <div className="mt-12 flex">
                <a href="#offert" className="inline-flex items-center justify-center px-10 py-5 border border-black bg-white hover:bg-black hover:text-white transition-colors duration-500 font-sans text-sm font-bold tracking-[0.15em] uppercase">
                  Boka Kostnadsfri Offert
                </a>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="w-full aspect-[3/4] lg:aspect-square bg-[#FAFAFA] border border-black/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/5 transition-opacity duration-700 group-hover:bg-transparent"></div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white px-4 py-2 border border-black/10">
                <span className="font-sans text-xs font-semibold tracking-widest uppercase text-black">
                  PROJEKT: VILLA SKANÖR (2026)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & AUTHORITY ROW (The Silent Flex) */}
      <div className="w-full border-y border-black/10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10">
            <div className="px-6 py-8 flex items-center justify-center md:justify-start">
              <span className="font-sans text-xs md:text-sm font-semibold tracking-widest uppercase text-black">01 / 100% NÖJD-KUND-GARANTI</span>
            </div>
            <div className="px-6 py-8 flex items-center justify-center md:justify-start">
              <span className="font-sans text-xs md:text-sm font-semibold tracking-widest uppercase text-black">02 / MÅLERIFÖRETAGENS AUKTORISATION</span>
            </div>
            <div className="px-6 py-8 flex items-center justify-center md:justify-start">
              <span className="font-sans text-xs md:text-sm font-semibold tracking-widest uppercase text-black">03 / FAST PRIS & UTAN DOLDA AVGIFTER</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE SERVICES ARCHITECTURE (The Expensive Grid) */}
      <section className="w-full py-32 lg:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="mb-16 md:mb-24">
            <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-none text-black">
              Vår Expertis.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col bg-[#FAFAFA] border border-black/5 p-10 md:p-14 hover:scale-[1.01] transition-transform duration-500 ease-out group">
              <div className="border-b border-black/20 pb-8 mb-8 group-hover:border-black transition-colors duration-500">
                <span className="font-sans text-xs font-bold tracking-widest uppercase mb-6 block text-black/40 group-hover:text-black transition-colors duration-500">Kategori 01</span>
                <h3 className="font-serif text-3xl font-bold tracking-tight">Exklusiv Interiör</h3>
              </div>
              <p className="font-sans text-base leading-relaxed text-black/70">
                Skräddarsydda interiörlösningar för hem och miljöer som kräver absolut högsta standard. Från noggrann maskering till perfekt finish som framhäver hemmets arkitektur.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col bg-[#FAFAFA] border border-black/5 p-10 md:p-14 hover:scale-[1.01] transition-transform duration-500 ease-out group">
              <div className="border-b border-black/20 pb-8 mb-8 group-hover:border-black transition-colors duration-500">
                <span className="font-sans text-xs font-bold tracking-widest uppercase mb-6 block text-black/40 group-hover:text-black transition-colors duration-500">Kategori 02</span>
                <h3 className="font-serif text-3xl font-bold tracking-tight">Fasad & Exteriörskydd</h3>
              </div>
              <p className="font-sans text-base leading-relaxed text-black/70">
                Maximalt skydd och estetik för din fastighet. Vi arbetar med premiumprodukter som garanterar ett långvarigt, vackert resultat som står emot det skandinaviska klimatet.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col bg-[#FAFAFA] border border-black/5 p-10 md:p-14 hover:scale-[1.01] transition-transform duration-500 ease-out group">
              <div className="border-b border-black/20 pb-8 mb-8 group-hover:border-black transition-colors duration-500">
                <span className="font-sans text-xs font-bold tracking-widest uppercase mb-6 block text-black/40 group-hover:text-black transition-colors duration-500">Kategori 03</span>
                <h3 className="font-serif text-3xl font-bold tracking-tight">Kommersiella Fastigheter</h3>
              </div>
              <p className="font-sans text-base leading-relaxed text-black/70">
                Effektivt, storskaligt måleri med industriell precision. Vi minimerar driftstörningar och levererar felfria ytor för kontor, butiker och offentliga rum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE BLUEPRINT (Our Flawless Execution Process) */}
      <section className="w-full py-32 lg:py-48 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="mb-20">
             <span className="font-sans text-xs font-bold tracking-widest uppercase mb-6 block text-black/50">Vår Process</span>
             <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-none text-black max-w-3xl">
               Konsten att leverera perfektion. Steg för steg.
             </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="flex flex-col">
              <div className="text-4xl font-serif font-light text-black/20 mb-6">01</div>
              <h4 className="font-sans font-bold text-lg mb-4">Skyddsmantling & Maskering</h4>
              <p className="font-sans text-sm leading-relaxed text-black/60">
                Vi förbereder arbetsplatsen med museal försiktighet. Allt som inte ska målas skyddas med kirurgisk precision.
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="text-4xl font-serif font-light text-black/20 mb-6">02</div>
              <h4 className="font-sans font-bold text-lg mb-4">Underarbete till Absolut Planhet</h4>
              <p className="font-sans text-sm leading-relaxed text-black/60">
                Grunden är avgörande. Spackling och slipning utförs tills ytan når absolut planhet innan en droppe färg appliceras.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="text-4xl font-serif font-light text-black/20 mb-6">03</div>
              <h4 className="font-sans font-bold text-lg mb-4">Applikation & Finish</h4>
              <p className="font-sans text-sm leading-relaxed text-black/60">
                Flera skikt av premiumfärg appliceras med experthand för att bygga ett djup och en struktur som utstrålar kvalitet.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="text-4xl font-serif font-light text-black/20 mb-6">04</div>
              <h4 className="font-sans font-bold text-lg mb-4">Slutbesiktning med Ljusanalys</h4>
              <p className="font-sans text-sm leading-relaxed text-black/60">
                Vi inspekterar varje centimeter under släpljus för att garantera ett 100% felfritt resultat innan överlämning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE GODFATHER OFFER / CONVERSION CANVAS */}
      <section id="offert" className="w-full bg-black text-white py-32 lg:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            
            {/* Left Column - Copy */}
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none text-white mb-10">
                Få en fast, bindande offert inom 24 timmar.
              </h2>
              <p className="font-sans text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-lg">
                Inga dolda avgifter. Ingen tidsspillan. Beskriv ditt projekt så återkommer vi med en exakt kalkyl och tidsplan.
              </p>
            </div>

            {/* Right Column - Luxury Form */}
            <div className="flex flex-col justify-center">
              <form className="flex flex-col w-full gap-10">
                
                <div className="relative">
                  <input type="text" id="name" placeholder=" " className="peer w-full bg-transparent border-b border-white/30 py-4 text-white font-sans text-lg focus:outline-none focus:border-white transition-colors placeholder-transparent" required />
                  <label htmlFor="name" className="absolute left-0 top-4 text-white/50 font-sans text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white">
                    Namn
                  </label>
                </div>

                <div className="relative">
                  <input type="text" id="type" placeholder=" " className="peer w-full bg-transparent border-b border-white/30 py-4 text-white font-sans text-lg focus:outline-none focus:border-white transition-colors placeholder-transparent" required />
                  <label htmlFor="type" className="absolute left-0 top-4 text-white/50 font-sans text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white">
                    Företag / Privat
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <input type="tel" id="phone" placeholder=" " className="peer w-full bg-transparent border-b border-white/30 py-4 text-white font-sans text-lg focus:outline-none focus:border-white transition-colors placeholder-transparent" required />
                    <label htmlFor="phone" className="absolute left-0 top-4 text-white/50 font-sans text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white">
                      Telefon
                    </label>
                  </div>
                  <div className="relative">
                    <input type="email" id="email" placeholder=" " className="peer w-full bg-transparent border-b border-white/30 py-4 text-white font-sans text-lg focus:outline-none focus:border-white transition-colors placeholder-transparent" required />
                    <label htmlFor="email" className="absolute left-0 top-4 text-white/50 font-sans text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white">
                      E-post
                    </label>
                  </div>
                </div>

                <div className="relative mt-4">
                  <textarea id="message" rows={3} placeholder=" " className="peer w-full bg-transparent border-b border-white/30 py-4 text-white font-sans text-lg focus:outline-none focus:border-white transition-colors placeholder-transparent resize-none" required></textarea>
                  <label htmlFor="message" className="absolute left-0 top-4 text-white/50 font-sans text-sm uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-white">
                    Meddelande
                  </label>
                </div>

                <button type="submit" className="mt-8 w-full bg-white text-black py-8 px-8 font-sans font-bold text-sm tracking-[0.2em] uppercase hover:bg-white/90 transition-colors duration-300">
                  BEGÄR DIN KOSTNADSFRI OFFERT
                </button>

              </form>
            </div>
            
          </div>
        </div>
      </section>

    </main>
  );
}
