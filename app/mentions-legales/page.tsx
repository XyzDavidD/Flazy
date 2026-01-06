import Link from 'next/link'

export default function MentionsLegales() {
  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(circle at top right, rgba(255, 138, 31, 0.24), transparent 58%),
        radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.22), transparent 60%),
        radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.4), transparent 58%),
        #020314
      `
    }}>
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="bg-[rgba(6,9,22,0.98)] rounded-[22px] border border-[rgba(252,211,77,0.7)] shadow-[0_18px_40px_rgba(0,0,0,0.8)] p-8 lg:p-12">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-6 bg-gradient-to-br from-[#ffe29f] via-[#ff8a1f] to-[#ff4b2b] bg-clip-text text-transparent">
            Mentions Légales
          </h1>
          
          <div className="space-y-6 text-text-soft text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">1. Informations sur l'éditeur</h2>
              <p>
                Le site FLAZY est édité par FLAZY, plateforme de génération de vidéos par intelligence artificielle.
              </p>
              <p className="mt-2">
                <strong>Email :</strong> Flazy.orders@gmail.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">2. Hébergement</h2>
              <p>
                Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">3. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu du site FLAZY (textes, images, logos, vidéos, etc.) est la propriété exclusive de FLAZY, sauf mention contraire. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">4. Protection des données personnelles</h2>
              <p>
                Les données personnelles collectées sur le site sont traitées conformément à notre{' '}
                <Link href="/politique-confidentialite" className="text-accent-orange-soft hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">5. Responsabilité de l'utilisateur</h2>
              <div className="bg-[rgba(255,138,31,0.1)] border border-[rgba(255,138,31,0.3)] rounded-xl p-4 my-4">
                <p className="font-semibold text-text-main mb-2">
                  ⚠️ Règles d'utilisation strictes
                </p>
                <p className="mb-2">
                  En utilisant FLAZY, vous vous engagez à ne <strong>jamais générer</strong> :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Du contenu illégal ou contraire aux lois applicables</li>
                  <li>Du contenu impliquant des personnes réelles identifiables ou des célébrités sans leur autorisation explicite</li>
                  <li>Du contenu diffamatoire, haineux, discriminatoire ou violent</li>
                  <li>Du contenu portant atteinte aux droits de propriété intellectuelle de tiers</li>
                  <li>Du contenu pornographique, obscène ou inapproprié</li>
                </ul>
                <p className="mt-3 font-semibold">
                  Vous êtes <strong>entièrement responsable</strong> du contenu que vous générez et de la manière dont vous l'utilisez. 
                  FLAZY se réserve le droit de suspendre ou supprimer tout compte en cas de violation de ces règles.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">6. Limitation de responsabilité</h2>
              <p>
                FLAZY ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du service ou de l'impossibilité de l'utiliser. 
                Le service est fourni "tel quel" sans garantie d'aucune sorte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">7. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. Tout litige relatif à leur interprétation 
                et/ou à leur exécution relève des tribunaux compétents.
              </p>
            </section>

            <div className="pt-6 border-t border-[rgba(51,65,85,0.5)] mt-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-accent-orange-soft hover:text-accent-orange transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

