import Link from 'next/link'

export default function PolitiqueConfidentialite() {
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
            Politique de Confidentialité
          </h1>
          
          <div className="space-y-6 text-text-soft text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">1. Introduction</h2>
              <p>
                FLAZY s'engage à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité 
                explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles conformément 
                au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">2. Données collectées</h2>
              <p className="mb-2">Nous collectons les données suivantes :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Données d'identification :</strong> Nom, adresse email</li>
                <li><strong>Données de transaction :</strong> Informations de paiement (traitées par Stripe, nous ne stockons pas vos informations bancaires)</li>
                <li><strong>Données d'utilisation :</strong> Prompts générés, vidéos créées, préférences d'utilisation</li>
                <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, données de connexion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">3. Finalités du traitement</h2>
              <p>Vos données sont utilisées pour :</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Fournir et améliorer nos services de génération de vidéos</li>
                <li>Traiter vos commandes et paiements</li>
                <li>Vous envoyer des confirmations et notifications par email</li>
                <li>Assurer la sécurité et prévenir les fraudes</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">4. Base légale du traitement</h2>
              <p>
                Le traitement de vos données personnelles est basé sur :
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Votre consentement pour l'envoi de communications marketing</li>
                <li>L'exécution d'un contrat pour la fourniture de nos services</li>
                <li>Le respect d'obligations légales</li>
                <li>Notre intérêt légitime pour la sécurité et l'amélioration du service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">5. Conservation des données</h2>
              <p>
                Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles 
                elles ont été collectées, conformément aux obligations légales. Les données de paiement sont conservées selon 
                les exigences légales applicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">6. Partage des données</h2>
              <p className="mb-2">Vos données peuvent être partagées avec :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Stripe :</strong> Pour le traitement des paiements (conformément à leur politique de confidentialité)</li>
                <li><strong>Supabase :</strong> Pour l'hébergement et le stockage des données (conformément à leur politique de confidentialité)</li>
                <li><strong>Resend :</strong> Pour l'envoi d'emails transactionnels (conformément à leur politique de confidentialité)</li>
                <li><strong>Autorités compétentes :</strong> Si requis par la loi ou en cas d'obligation légale</li>
              </ul>
              <p className="mt-2">
                Nous ne vendons jamais vos données personnelles à des tiers à des fins commerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">7. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li><strong>Droit d'accès :</strong> Vous pouvez demander l'accès à vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
                <li><strong>Droit à la limitation :</strong> Vous pouvez demander la limitation du traitement</li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, contactez-nous à : <strong>Flazy.orders@gmail.com</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">8. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données 
                personnelles contre tout accès non autorisé, perte, destruction ou altération. Cependant, aucune méthode 
                de transmission sur Internet n'est 100% sécurisée.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">9. Cookies</h2>
              <p>
                Notre site utilise des cookies techniques nécessaires au fonctionnement du service. Nous n'utilisons pas 
                de cookies de tracking publicitaire sans votre consentement explicite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">10. Modifications</h2>
              <p>
                Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur 
                dès leur publication sur cette page. Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-text-main mb-3">11. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
                contactez-nous à : <strong>Flazy.orders@gmail.com</strong>
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
