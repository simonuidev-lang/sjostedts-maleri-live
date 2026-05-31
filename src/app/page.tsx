export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full bg-white text-black">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 md:gap-16">
            <div className="flex flex-col text-left">
              <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-none">
                Sjöstedts Måleri.
              </h2>
              <p className="font-sans mt-4 text-lg md:text-xl text-black/60 font-medium">
                Noggrannhet i varje penseldrag.
              </p>
            </div>
            <div className="w-full aspect-[4/3] lg:aspect-square bg-[#FAFAFA] border border-black/10"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full px-6 py-32 lg:py-48 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          
          <div className="flex flex-col gap-8">
            <div className="border-b-2 border-black pb-6">
              <span className="font-sans text-sm font-bold tracking-widest uppercase mb-4 block text-black/50">01</span>
              <h3 className="font-serif text-4xl font-medium">Interiör</h3>
            </div>
            <p className="font-sans text-lg font-light leading-relaxed text-black/80">
              Transforming interior spaces with precise color selection and flawless execution. We bring your architectural vision to life.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="border-b-2 border-black pb-6">
              <span className="font-sans text-sm font-bold tracking-widest uppercase mb-4 block text-black/50">02</span>
              <h3 className="font-serif text-4xl font-medium">Exteriör</h3>
            </div>
            <p className="font-sans text-lg font-light leading-relaxed text-black/80">
              Durable, striking exterior treatments designed to withstand the elements while elevating your property's facade.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="border-b-2 border-black pb-6">
              <span className="font-sans text-sm font-bold tracking-widest uppercase mb-4 block text-black/50">03</span>
              <h3 className="font-serif text-4xl font-medium">Restaurering</h3>
            </div>
            <p className="font-sans text-lg font-light leading-relaxed text-black/80">
              Meticulous restoration of heritage elements. We preserve history through careful craftsmanship and attention to detail.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Action / Footer */}
      <footer className="w-full bg-black text-white px-6 py-32 lg:py-48 flex flex-col items-center justify-center text-center mt-auto">
        <div className="max-w-4xl flex flex-col gap-12 lg:gap-16 items-center">
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight">
            Redo för förändring?
          </h2>
          <p className="font-sans text-xl md:text-2xl font-light text-white/80 max-w-xl">
            Kontakta oss för en exklusiv konsultation och offert.
          </p>
          <a href="mailto:info@sjostedts-maleri.se" className="mt-8 px-14 py-6 border border-white bg-black hover:bg-white hover:text-black transition-all duration-500 font-sans text-lg uppercase tracking-[0.2em] font-medium">
            Begär Offert
          </a>
        </div>
      </footer>
    </main>
  );
}
