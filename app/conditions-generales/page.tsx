import Link from 'next/link'

export default function ConditionsGenerales() {
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
            Conditions Générales d'Utilisation
          </h1>
          
          <div className="space-y-6 text-text-soft text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">1. Acceptation des conditions</h2>
              <p>
                En accédant et en utilisant FLAZY, vous acceptez sans réserve les présentes Conditions Générales d'Utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">2. Description du service</h2>
              <p className="mb-3">
                FLAZY est une plateforme de génération de vidéos par intelligence artificielle permettant aux utilisateurs 
                de créer des vidéos courtes à partir de prompts textuels. Le service est accessible via abonnement avec 
                un système de tokens.
              </p>
              <p className="mb-3">
                <strong>Limitations de l'intelligence artificielle :</strong> Le contenu généré est produit par des systèmes 
                d'intelligence artificielle et peut contenir des erreurs, des approximations ou des incohérences.
              </p>
              <p>
                <strong>Aucune garantie de résultats :</strong> FLAZY ne garantit pas l'exactitude, la qualité, la conformité 
                ou l'adéquation du contenu généré pour un usage spécifique. L'utilisateur reconnaît que les résultats peuvent 
                varier et que FLAZY ne peut être tenu responsable de la qualité ou de la pertinence du contenu généré.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">3. Responsabilité de l'utilisateur et règles d'utilisation</h2>
              <div className="bg-[rgba(255,138,31,0.1)] border border-[rgba(255,138,31,0.3)] rounded-xl p-4 my-4">
                <p className="font-semibold text-text-main mb-3 text-base">
                  ⚠️ Règles strictes de génération de contenu
                </p>
                <p className="mb-3">
                  En utilisant FLAZY, vous vous engagez formellement à respecter les règles suivantes. 
                  Toute violation peut entraîner la suspension immédiate de votre compte et, le cas échéant, des poursuites judiciaires.
                </p>
                
                <h3 className="font-semibold text-text-main mb-2 mt-4">Contenu strictement interdit :</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Contenu illégal :</strong> Tout contenu violant les lois applicables (diffamation, incitation à la haine, etc.)</li>
                  <li><strong>Personnes identifiables :</strong> Génération de contenu impliquant des personnes réelles identifiables, des célébrités, ou toute personne sans son consentement explicite écrit</li>
                  <li><strong>Contenu diffamatoire ou haineux :</strong> Contenu portant atteinte à la dignité, à la réputation ou aux droits d'autrui</li>
                  <li><strong>Violation de droits de propriété intellectuelle :</strong> Contenu portant atteinte aux droits d'auteur, marques, ou autres droits de propriété intellectuelle</li>
                  <li><strong>Contenu inapproprié :</strong> Contenu pornographique, obscène, violent ou autrement inapproprié</li>
                  <li><strong>Contenu trompeur :</strong> Contenu destiné à tromper, escroquer ou nuire à autrui</li>
                </ul>

                <div className="mt-4 p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg">
                  <p className="font-bold text-text-main mb-1">
                    Responsabilité totale de l'utilisateur
                  </p>
                  <p>
                    Vous êtes <strong>entièrement et exclusivement responsable</strong> :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                    <li>Du contenu que vous générez via FLAZY</li>
                    <li>De la manière dont vous utilisez ce contenu</li>
                    <li>De vous assurer que votre utilisation respecte toutes les lois applicables</li>
                    <li>D'obtenir toutes les autorisations nécessaires avant d'utiliser le contenu généré</li>
                  </ul>
                  <p className="mt-2">
                    FLAZY décline toute responsabilité concernant l'utilisation que vous faites du contenu généré. 
                    Vous acceptez d'indemniser et de dégager FLAZY de toute responsabilité en cas de réclamation 
                    résultant de votre utilisation du service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">4. Propriété du contenu généré</h2>
              <p>
                Les vidéos générées via FLAZY vous appartiennent à 100%. Vous êtes libre de les utiliser à des fins 
                personnelles ou commerciales, sous réserve du respect des présentes conditions et des lois applicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">5. Système de tokens et paiements</h2>
              <p>
                L'utilisation de FLAZY nécessite l'achat de tokens via nos packs d'abonnement. Les tokens sont 
                cumulables et non remboursables. Les paiements sont traités de manière sécurisée via Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">6. Disponibilité du service</h2>
              <p>
                FLAZY s'efforce d'assurer une disponibilité continue du service, mais ne peut garantir un accès 
                ininterrompu. Le service peut être temporairement indisponible pour maintenance ou en cas de force majeure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">7. Modération et droit de retrait</h2>
              <p className="mb-3">
                FLAZY se réserve le droit, à sa seule discrétion, de refuser, suspendre ou retirer tout contenu ou 
                compte utilisateur qui ne respecte pas les présentes Conditions, sans préavis.
              </p>
              <p>
                Cette mesure peut être prise en cas de non-conformité avec les règles d'utilisation, de violation 
                des présentes conditions, ou pour toute autre raison légitime que FLAZY jugerait appropriée.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">8. Suspension et résiliation</h2>
              <p>
                FLAZY se réserve le droit de suspendre ou résilier votre compte à tout moment en cas de violation 
                des présentes conditions, notamment en cas de génération de contenu interdit. Aucun remboursement 
                ne sera effectué en cas de résiliation pour violation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">9. Modifications des conditions</h2>
              <p>
                FLAZY se réserve le droit de modifier les présentes conditions à tout moment. Les modifications 
                entrent en vigueur dès leur publication. Il est de votre responsabilité de consulter régulièrement 
                ces conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">10. Droit applicable et juridiction</h2>
              <p>
                Les présentes conditions sont régies par le droit français. Tout litige sera soumis aux tribunaux 
                compétents français.
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

