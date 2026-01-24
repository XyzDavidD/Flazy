// Static translation dictionary for guaranteed translations
// This ensures all known UI strings are translated correctly without API calls

export type Language = 'fr' | 'en' | 'es'

export const translations: Record<string, Record<Language, string>> = {
  // ============================================
  // HEADER & NAVIGATION
  // ============================================
  'Creations': {
    fr: 'Créations',
    en: 'Creations',
    es: 'Creaciones',
  },
  'Tarifs': {
    fr: 'Tarifs',
    en: 'Pricing',
    es: 'Precios',
  },
  'FAQ': {
    fr: 'FAQ',
    en: 'FAQ',
    es: 'FAQ',
  },
  'Se connecter': {
    fr: 'Se connecter',
    en: 'Sign in',
    es: 'Iniciar sesión',
  },
  "S'inscrire": {
    fr: "S'inscrire",
    en: 'Sign up',
    es: 'Registrarse',
  },
  'Mon compte': {
    fr: 'Mon compte',
    en: 'My account',
    es: 'Mi cuenta',
  },
  'Se déconnecter': {
    fr: 'Se déconnecter',
    en: 'Sign out',
    es: 'Cerrar sesión',
  },
  'crédits': {
    fr: 'crédits',
    en: 'credits',
    es: 'créditos',
  },
  'Vidéos IA virales prêtes à poster': {
    fr: 'Vidéos IA virales prêtes à poster',
    en: 'Viral AI videos ready to post',
    es: 'Videos IA virales listos para publicar',
  },
  'Langue / Language / Idioma': {
    fr: 'Langue / Language / Idioma',
    en: 'Langue / Language / Idioma',
    es: 'Langue / Language / Idioma',
  },
  "Retour à l'accueil": {
    fr: "Retour à l'accueil",
    en: 'Back to home',
    es: 'Volver al inicio',
  },
  'Retour': {
    fr: 'Retour',
    en: 'Back',
    es: 'Volver',
  },

  // ============================================
  // FOOTER
  // ============================================
  'Tous droits réservés.': {
    fr: 'Tous droits réservés.',
    en: 'All rights reserved.',
    es: 'Todos los derechos reservados.',
  },
  'Mentions légales': {
    fr: 'Mentions légales',
    en: 'Legal notice',
    es: 'Aviso legal',
  },
  'Conditions générales': {
    fr: 'Conditions générales',
    en: 'Terms and conditions',
    es: 'Términos y condiciones',
  },
  'Politique de confidentialité': {
    fr: 'Politique de confidentialité',
    en: 'Privacy policy',
    es: 'Política de privacidad',
  },

  // ============================================
  // FAQ PAGE - TITLES & LABELS
  // ============================================
  'Questions fréquentes': {
    fr: 'Questions fréquentes',
    en: 'Frequently asked questions',
    es: 'Preguntas frecuentes',
  },
  'Des réponses claires et transparentes': {
    fr: 'Des réponses claires et transparentes',
    en: 'Clear and transparent answers',
    es: 'Respuestas claras y transparentes',
  },
  'Voici les informations essentielles à connaître sur FLAZY.': {
    fr: 'Voici les informations essentielles à connaître sur FLAZY.',
    en: 'Here is the essential information you need to know about FLAZY.',
    es: 'Aquí está la información esencial que necesita saber sobre FLAZY.',
  },
  'Découvrez nos tarifs': {
    fr: 'Découvrez nos tarifs',
    en: 'Discover our pricing',
    es: 'Descubre nuestros precios',
  },

  // ============================================
  // FAQ QUESTIONS
  // ============================================
  'Combien de temps faut-il pour générer mes vidéos ?': {
    fr: 'Combien de temps faut-il pour générer mes vidéos ?',
    en: 'How long does it take to generate my videos?',
    es: '¿Cuánto tiempo se tarda en generar mis videos?',
  },
  'Puis-je utiliser les vidéos à des fins commerciales ?': {
    fr: 'Puis-je utiliser les vidéos à des fins commerciales ?',
    en: 'Can I use the videos for commercial purposes?',
    es: '¿Puedo usar los videos con fines comerciales?',
  },
  'Les vidéos contiennent-elles un filigrane ?': {
    fr: 'Les vidéos contiennent-elles un filigrane ?',
    en: 'Do the videos contain a watermark?',
    es: '¿Los videos contienen una marca de agua?',
  },
  'Où puis-je publier mes vidéos ?': {
    fr: 'Où puis-je publier mes vidéos ?',
    en: 'Where can I publish my videos?',
    es: '¿Dónde puedo publicar mis videos?',
  },
  "Que faire si je n'aime pas le résultat ?": {
    fr: "Que faire si je n'aime pas le résultat ?",
    en: "What if I don't like the result?",
    es: '¿Qué pasa si no me gusta el resultado?',
  },
  'Mes prompts et vidéos générées sont-ils privés ?': {
    fr: 'Mes prompts et vidéos générées sont-ils privés ?',
    en: 'Are my prompts and generated videos private?',
    es: '¿Son privados mis prompts y videos generados?',
  },
  "Que se passe-t-il si j'arrive au bout de mes tokens ?": {
    fr: "Que se passe-t-il si j'arrive au bout de mes tokens ?",
    en: 'What happens if I run out of tokens?',
    es: '¿Qué pasa si me quedo sin tokens?',
  },

  // ============================================
  // FAQ ANSWERS
  // ============================================
  'faq_answer_1': {
    fr: 'Le temps de génération dépend de la demande actuelle, mais dans la plupart des cas, les vidéos sont générées <strong>en quelques minutes</strong> après la validation de votre prompt.',
    en: 'Generation time depends on current demand, but in most cases, videos are generated <strong>within a few minutes</strong> after your prompt is validated.',
    es: 'El tiempo de generación depende de la demanda actual, pero en la mayoría de los casos, los videos se generan <strong>en pocos minutos</strong> después de validar tu prompt.',
  },
  'faq_answer_2': {
    fr: 'Vous conservez l\'intégralité des droits sur les vidéos générées.<br />Vous êtes libre de les utiliser à des fins personnelles ou professionnelles.',
    en: 'You retain full rights to the generated videos.<br />You are free to use them for personal or professional purposes.',
    es: 'Conservas la totalidad de los derechos sobre los videos generados.<br />Eres libre de usarlos con fines personales o profesionales.',
  },
  'faq_answer_3': {
    fr: 'Par défaut, les vidéos sont disponibles <strong>sans aucun filigrane</strong> et sont prêtes à être publiées.',
    en: 'By default, videos are available <strong>without any watermark</strong> and are ready to be published.',
    es: 'Por defecto, los videos están disponibles <strong>sin ninguna marca de agua</strong> y están listos para publicarse.',
  },
  'faq_answer_4': {
    fr: 'Par défaut, les vidéos sont disponibles <strong>sans aucun filigrane</strong> et sont prêtes à être publiées.',
    en: 'By default, videos are available <strong>without any watermark</strong> and are ready to be published.',
    es: 'Por defecto, los videos están disponibles <strong>sin ninguna marca de agua</strong> y están listos para publicarse.',
  },
  'faq_answer_5': {
    fr: 'Les vidéos sont optimisées pour le format vertical 9:16 et peuvent être publiées sur TikTok, Instagram Reels, YouTube Shorts, Snapchat, Facebook et autres plateformes de contenu court.',
    en: 'Videos are optimized for the vertical 9:16 format and can be published on TikTok, Instagram Reels, YouTube Shorts, Snapchat, Facebook and other short-form content platforms.',
    es: 'Los videos están optimizados para el formato vertical 9:16 y se pueden publicar en TikTok, Instagram Reels, YouTube Shorts, Snapchat, Facebook y otras plataformas de contenido corto.',
  },
  'faq_answer_6': {
    fr: 'Vous pouvez ajuster votre prompt et générer une nouvelle vidéo tant que vous avez des tokens disponibles.',
    en: 'You can adjust your prompt and generate a new video as long as you have tokens available.',
    es: 'Puedes ajustar tu prompt y generar un nuevo video siempre que tengas tokens disponibles.',
  },
  'faq_answer_7': {
    fr: 'Oui. Les prompts et les vidéos générées sont privés par défaut et ne sont pas partagés publiquement, sauf si vous avez explicitement autorisé la publication de la vidéo dans le feed public.',
    en: 'Yes. Prompts and generated videos are private by default and are not shared publicly, unless you have explicitly authorized the video to be published in the public feed.',
    es: 'Sí. Los prompts y los videos generados son privados por defecto y no se comparten públicamente, a menos que hayas autorizado explícitamente la publicación del video en el feed público.',
  },
  'faq_answer_8': {
    fr: 'Vous pouvez simplement acheter des packs de tokens supplémentaires ou combiner plusieurs packs de tokens. Les tokens sont <strong>cumulables</strong>, vous permettant de générer autant de vidéos que vous le souhaitez, sans limiter votre rythme de publication.',
    en: 'You can simply purchase additional token packs or combine multiple token packs. Tokens are <strong>cumulative</strong>, allowing you to generate as many videos as you want, without limiting your publishing pace.',
    es: 'Simplemente puedes comprar packs de tokens adicionales o combinar varios packs de tokens. Los tokens son <strong>acumulables</strong>, lo que te permite generar tantos videos como desees, sin limitar tu ritmo de publicación.',
  },

  // ============================================
  // HOMEPAGE - HERO
  // ============================================
  'Nouveau': {
    fr: 'Nouveau',
    en: 'New',
    es: 'Nuevo',
  },
  'Générateur FLAZY maintenant disponible': {
    fr: 'Générateur FLAZY maintenant disponible',
    en: 'FLAZY Generator now available',
    es: 'Generador FLAZY ahora disponible',
  },
  'Générateur de': {
    fr: 'Générateur de',
    en: 'Generator of',
    es: 'Generador de',
  },
  'Vidéos IA Virales & Monétisables': {
    fr: 'Vidéos IA Virales & Monétisables',
    en: 'Viral & Monetizable AI Videos',
    es: 'Videos IA Virales y Monetizables',
  },
  'Transformez vos idées en vidéos de 10 secondes prêtes à poster sur TikTok, Reels Instagram et YouTube Shorts. Simple, rapide et efficace.': {
    fr: 'Transformez vos idées en vidéos de 10 secondes prêtes à poster sur TikTok, Reels Instagram et YouTube Shorts. Simple, rapide et efficace.',
    en: 'Transform your ideas into 10-second videos ready to post on TikTok, Instagram Reels and YouTube Shorts. Simple, fast and effective.',
    es: 'Transforma tus ideas en videos de 10 segundos listos para publicar en TikTok, Instagram Reels y YouTube Shorts. Simple, rápido y efectivo.',
  },
  'Créer ma vidéo virale': {
    fr: 'Créer ma vidéo virale',
    en: 'Create my viral video',
    es: 'Crear mi video viral',
  },
  'Découvrir les créations': {
    fr: 'Découvrir les créations',
    en: 'Discover creations',
    es: 'Descubrir creaciones',
  },

  // ============================================
  // HOMEPAGE - FORM SECTION
  // ============================================
  'Décrivez la vidéo que vous voulez': {
    fr: 'Décrivez la vidéo que vous voulez',
    en: 'Describe the video you want',
    es: 'Describe el video que quieres',
  },
  "Vous écrivez le prompt, FLAZY s'occupe du reste": {
    fr: "Vous écrivez le prompt, FLAZY s'occupe du reste",
    en: 'You write the prompt, FLAZY takes care of the rest',
    es: 'Tú escribes el prompt, FLAZY se encarga del resto',
  },
  'Donnez quelques indications simples et laissez FLAZY transformer vos idées en vidéos prêtes à poster.': {
    fr: 'Donnez quelques indications simples et laissez FLAZY transformer vos idées en vidéos prêtes à poster.',
    en: 'Give some simple indications and let FLAZY transform your ideas into videos ready to post.',
    es: 'Da algunas indicaciones simples y deja que FLAZY transforme tus ideas en videos listos para publicar.',
  },
  'générations en cours': {
    fr: 'générations en cours',
    en: 'generations in progress',
    es: 'generaciones en curso',
  },
  'Votre prompt': {
    fr: 'Votre prompt',
    en: 'Your prompt',
    es: 'Tu prompt',
  },
  'Décrivez votre vidéo': {
    fr: 'Décrivez votre vidéo',
    en: 'Describe your video',
    es: 'Describe tu video',
  },
  'Exemple': {
    fr: 'Exemple :',
    en: 'Example:',
    es: 'Ejemplo:',
  },
  'prompt_example': {
    fr: '« Une femme élégante explique comment elle a augmenté ses ventes grâce aux vidéos courtes. »',
    en: '“An elegant woman explains how she increased her sales thanks to short videos.”',
    es: '“Una mujer elegante explica cómo aumentó sus ventas gracias a los videos cortos.”',
  },
  'Générer': {
    fr: 'Générer',
    en: 'Generate',
    es: 'Generar',
  },
  'Génération en cours...': {
    fr: 'Génération en cours...',
    en: 'Generating...',
    es: 'Generando...',
  },
  'Votre prompt est en cours de traitement.': {
    fr: 'Votre prompt est en cours de traitement.',
    en: 'Your prompt is being processed.',
    es: 'Tu prompt se está procesando.',
  },
  'Prompt envoyé avec succès !': {
    fr: 'Prompt envoyé avec succès !',
    en: 'Prompt sent successfully!',
    es: '¡Prompt enviado con éxito!',
  },
  'Votre prompt a été transmis. Crédits restants :': {
    fr: 'Votre prompt a été transmis. Crédits restants :',
    en: 'Your prompt has been transmitted. Remaining credits:',
    es: 'Tu prompt ha sido transmitido. Créditos restantes:',
  },
  'Une fois votre prompt envoyé, la vidéo est générée automatiquement en quelques minutes.': {
    fr: 'Une fois votre prompt envoyé, la vidéo est générée automatiquement en quelques minutes.',
    en: 'Once your prompt is sent, the video is automatically generated in a few minutes.',
    es: 'Una vez enviado tu prompt, el video se genera automáticamente en unos minutos.',
  },
  'Elle est disponible dans votre espace (Mes vidéos).': {
    fr: 'Elle est disponible dans votre espace (Mes vidéos).',
    en: 'It is available in your space (My videos).',
    es: 'Está disponible en tu espacio (Mis videos).',
  },

  // ============================================
  // CREDITS POPUP
  // ============================================
  'Crédits insuffisants': {
    fr: 'Crédits insuffisants',
    en: 'Insufficient credits',
    es: 'Créditos insuficientes',
  },
  "Vous n'avez plus de crédits disponibles pour générer une vidéo.": {
    fr: "Vous n'avez plus de crédits disponibles pour générer une vidéo.",
    en: 'You no longer have credits available to generate a video.',
    es: 'Ya no tienes créditos disponibles para generar un video.',
  },
  'Recharger vos tokens': {
    fr: 'Recharger vos tokens',
    en: 'Recharge your tokens',
    es: 'Recargar tus tokens',
  },

  // ============================================
  // EXAMPLES SECTION
  // ============================================
  'Exemples de vidéos virales': {
    fr: 'Exemples de vidéos virales',
    en: 'Examples of viral videos',
    es: 'Ejemplos de videos virales',
  },
  'Aperçu des vidéos que vous pouvez générer avec FLAZY': {
    fr: 'Aperçu des vidéos que vous pouvez générer avec FLAZY',
    en: 'Preview of videos you can generate with FLAZY',
    es: 'Vista previa de los videos que puedes generar con FLAZY',
  },
  'Chaque exemple ci-dessous illustre un type de vidéo que vous pouvez générer avec FLAZY.': {
    fr: 'Chaque exemple ci-dessous illustre un type de vidéo que vous pouvez générer avec FLAZY.',
    en: 'Each example below illustrates a type of video you can generate with FLAZY.',
    es: 'Cada ejemplo a continuación ilustra un tipo de video que puedes generar con FLAZY.',
  },
  'Actualité': {
    fr: 'Actualité',
    en: 'News',
    es: 'Noticias',
  },
  'Preuve': {
    fr: 'Preuve',
    en: 'Proof',
    es: 'Prueba',
  },
  'Publicité': {
    fr: 'Publicité',
    en: 'Advertising',
    es: 'Publicidad',
  },
  'Viral': {
    fr: 'Viral',
    en: 'Viral',
    es: 'Viral',
  },

  // ============================================
  // HOW IT WORKS SECTION
  // ============================================
  'Comment ça fonctionne': {
    fr: 'Comment ça fonctionne',
    en: 'How it works',
    es: 'Cómo funciona',
  },
  'Créez des vidéos virales en quelques minutes, grâce à un processus simple et fluide': {
    fr: 'Créez des vidéos virales en quelques minutes, grâce à un processus simple et fluide',
    en: 'Create viral videos in minutes with a simple and smooth process',
    es: 'Crea videos virales en minutos con un proceso simple y fluido',
  },
  'Choisissez votre pack': {
    fr: 'Choisissez votre pack',
    en: 'Choose your pack',
    es: 'Elige tu pack',
  },
  'Sélectionnez le pack qui correspond à vos besoins (Starter, Creator, Pro ou Boost), puis finalisez votre commande.': {
    fr: 'Sélectionnez le pack qui correspond à vos besoins (Starter, Creator, Pro ou Boost), puis finalisez votre commande.',
    en: 'Select the pack that suits your needs (Starter, Creator, Pro or Boost), then complete your order.',
    es: 'Selecciona el pack que se adapte a tus necesidades (Starter, Creator, Pro o Boost), luego finaliza tu pedido.',
  },
  'Décrivez la vidéo que vous souhaitez générer : sujet, ambiance, style.': {
    fr: 'Décrivez la vidéo que vous souhaitez générer : sujet, ambiance, style.',
    en: 'Describe the video you want to generate: subject, atmosphere, style.',
    es: 'Describe el video que quieres generar: tema, ambiente, estilo.',
  },
  'Génération automatique': {
    fr: 'Génération automatique',
    en: 'Automatic generation',
    es: 'Generación automática',
  },
  'Votre vidéo est générée automatiquement en quelques minutes et accessible dans votre espace "Mes vidéos".': {
    fr: 'Votre vidéo est générée automatiquement en quelques minutes et accessible dans votre espace "Mes vidéos".',
    en: 'Your video is automatically generated in minutes and accessible in your "My videos" space.',
    es: 'Tu video se genera automáticamente en minutos y es accesible en tu espacio "Mis videos".',
  },
  'Publiez et monétisez': {
    fr: 'Publiez et monétisez',
    en: 'Publish and monetize',
    es: 'Publica y monetiza',
  },
  'Téléchargez votre vidéo et publiez-la sur TikTok, Reels, YouTube Shorts ou toute autre plateforme. Vous conservez l\'intégralité des droits sur vos vidéos.': {
    fr: 'Téléchargez votre vidéo et publiez-la sur TikTok, Reels, YouTube Shorts ou toute autre plateforme. Vous conservez l\'intégralité des droits sur vos vidéos.',
    en: 'Download your video and publish it on TikTok, Reels, YouTube Shorts or any other platform. You retain full rights to your videos.',
    es: 'Descarga tu video y publícalo en TikTok, Reels, YouTube Shorts o cualquier otra plataforma. Conservas la totalidad de los derechos sobre tus videos.',
  },

  // ============================================
  // PRICING SECTION
  // ============================================
  'Choisissez le pack qui correspond à votre rythme': {
    fr: 'Choisissez le pack qui correspond à votre rythme',
    en: 'Choose the pack that matches your pace',
    es: 'Elige el pack que se adapte a tu ritmo',
  },
  'Des packs attractifs et adaptés à tous les niveaux.': {
    fr: 'Des packs attractifs et adaptés à tous les niveaux.',
    en: 'Attractive packs adapted to all levels.',
    es: 'Packs atractivos adaptados a todos los niveles.',
  },
  'Pack Starter': {
    fr: 'Pack Starter',
    en: 'Starter Pack',
    es: 'Pack Starter',
  },
  'Pack Creator': {
    fr: 'Pack Creator',
    en: 'Creator Pack',
    es: 'Pack Creator',
  },
  'Pack Pro': {
    fr: 'Pack Pro',
    en: 'Pro Pack',
    es: 'Pack Pro',
  },
  'Pack Boost': {
    fr: 'Pack Boost',
    en: 'Boost Pack',
    es: 'Pack Boost',
  },
  '5 tokens': {
    fr: '5 tokens',
    en: '5 tokens',
    es: '5 tokens',
  },
  '10 tokens': {
    fr: '10 tokens',
    en: '10 tokens',
    es: '10 tokens',
  },
  '25 tokens': {
    fr: '25 tokens',
    en: '25 tokens',
    es: '25 tokens',
  },
  '50 tokens': {
    fr: '50 tokens',
    en: '50 tokens',
    es: '50 tokens',
  },
  'Aucun abonnement requis': {
    fr: 'Aucun abonnement requis',
    en: 'No subscription required',
    es: 'Sin suscripción requerida',
  },
  'Le plus populaire': {
    fr: 'Le plus populaire',
    en: 'Most popular',
    es: 'El más popular',
  },
  'Choisir ce pack': {
    fr: 'Choisir ce pack',
    en: 'Choose this pack',
    es: 'Elegir este pack',
  },
  'Sélectionner': {
    fr: 'Sélectionner',
    en: 'Select',
    es: 'Seleccionar',
  },
  'Chargement...': {
    fr: 'Chargement...',
    en: 'Loading...',
    es: 'Cargando...',
  },
  'Paiement sécurisé SSL': {
    fr: 'Paiement sécurisé SSL',
    en: 'Secure SSL payment',
    es: 'Pago seguro SSL',
  },
  'Données protégées': {
    fr: 'Données protégées',
    en: 'Protected data',
    es: 'Datos protegidos',
  },

  // ============================================
  // STEPS SECTION (Homepage)
  // ============================================
  'Comment ça marche': {
    fr: 'Comment ça marche',
    en: 'How it works',
    es: 'Cómo funciona',
  },
  'Pourquoi choisir FLAZY': {
    fr: 'Pourquoi choisir FLAZY',
    en: 'Why choose FLAZY',
    es: 'Por qué elegir FLAZY',
  },
  'Des vidéos pensées pour la viralité prêtes à poster': {
    fr: 'Des vidéos pensées pour la viralité prêtes à poster',
    en: 'Videos designed for virality ready to post',
    es: 'Videos diseñados para la viralidad listos para publicar',
  },
  'FLAZY combine intelligence artificielle et formats courts pour créer des vidéos qui accrochent dès la première seconde.': {
    fr: 'FLAZY combine intelligence artificielle et formats courts pour créer des vidéos qui accrochent dès la première seconde.',
    en: 'FLAZY combines artificial intelligence and short formats to create videos that hook from the first second.',
    es: 'FLAZY combina inteligencia artificial y formatos cortos para crear videos que enganchan desde el primer segundo.',
  },
  'En 3 étapes, vos vidéos IA sont prêtes à publier': {
    fr: 'En 3 étapes, vos vidéos IA sont prêtes à publier',
    en: 'In 3 steps, your AI videos are ready to publish',
    es: 'En 3 pasos, tus videos IA están listos para publicar',
  },
  'Choisissez votre pack, décrivez la vidéo que vous voulez, et retrouvez vos vidéos prêtes à poster dans votre espace (Mes vidéos).': {
    fr: 'Choisissez votre pack, décrivez la vidéo que vous voulez, et retrouvez vos vidéos prêtes à poster dans votre espace (Mes vidéos).',
    en: 'Choose your pack, describe the video you want, and find your videos ready to post in your space (My videos).',
    es: 'Elige tu pack, describe el video que quieres, y encuentra tus videos listos para publicar en tu espacio (Mis videos).',
  },
  'Sélectionnez le pack Starter, Creator, Pro ou Boost selon le nombre de vidéos que vous souhaitez générer chaque mois.': {
    fr: 'Sélectionnez le pack Starter, Creator, Pro ou Boost selon le nombre de vidéos que vous souhaitez générer chaque mois.',
    en: 'Select the Starter, Creator, Pro or Boost pack depending on the number of videos you want to generate each month.',
    es: 'Selecciona el pack Starter, Creator, Pro o Boost según el número de videos que quieras generar cada mes.',
  },
  'Écrivez un prompt simple : type de vidéo, ambiance, message, langue. FLAZY gère les hooks, le rythme et la structure.': {
    fr: 'Écrivez un prompt simple : type de vidéo, ambiance, message, langue. FLAZY gère les hooks, le rythme et la structure.',
    en: 'Write a simple prompt: video type, mood, message, language. FLAZY handles the hooks, rhythm and structure.',
    es: 'Escribe un prompt simple: tipo de video, ambiente, mensaje, idioma. FLAZY se encarga de los hooks, el ritmo y la estructura.',
  },
  'Retrouvez vos vidéos': {
    fr: 'Retrouvez vos vidéos',
    en: 'Find your videos',
    es: 'Encuentra tus videos',
  },
  'Vos vidéos de 10 secondes sont disponibles dans votre espace (Mes vidéos), prêtes à poster sur TikTok, Reels Instagram ou YouTube Shorts. Format optimisé, aucun montage à faire.': {
    fr: 'Vos vidéos de 10 secondes sont disponibles dans votre espace (Mes vidéos), prêtes à poster sur TikTok, Reels Instagram ou YouTube Shorts. Format optimisé, aucun montage à faire.',
    en: 'Your 10-second videos are available in your space (My videos), ready to post on TikTok, Instagram Reels or YouTube Shorts. Optimized format, no editing required.',
    es: 'Tus videos de 10 segundos están disponibles en tu espacio (Mis videos), listos para publicar en TikTok, Instagram Reels o YouTube Shorts. Formato optimizado, sin necesidad de edición.',
  },

  // ============================================
  // AUTH PAGES
  // ============================================
  'Créer un compte': {
    fr: 'Créer un compte',
    en: 'Create an account',
    es: 'Crear una cuenta',
  },
  'Voir les packs': {
    fr: 'Voir les packs',
    en: 'View packs',
    es: 'Ver packs',
  },
  'Vous devez être connecté pour générer une vidéo.': {
    fr: 'Vous devez être connecté pour générer une vidéo.',
    en: 'You must be logged in to generate a video.',
    es: 'Debes iniciar sesión para generar un video.',
  },
  'Veuillez remplir le prompt.': {
    fr: 'Veuillez remplir le prompt.',
    en: 'Please fill in the prompt.',
    es: 'Por favor completa el prompt.',
  },

  // ============================================
  // CAROUSEL PAGE
  // ============================================
  'Chargement des vidéos...': {
    fr: 'Chargement des vidéos...',
    en: 'Loading videos...',
    es: 'Cargando videos...',
  },
  'Aucune vidéo disponible pour le moment.': {
    fr: 'Aucune vidéo disponible pour le moment.',
    en: 'No videos available at the moment.',
    es: 'No hay videos disponibles por el momento.',
  },
  'Revenez bientôt pour découvrir de nouvelles vidéos !': {
    fr: 'Revenez bientôt pour découvrir de nouvelles vidéos !',
    en: 'Come back soon to discover new videos!',
    es: '¡Vuelve pronto para descubrir nuevos videos!',
  },
  'Erreur de chargement': {
    fr: 'Erreur de chargement',
    en: 'Loading error',
    es: 'Error de carga',
  },
  'Réessayer': {
    fr: 'Réessayer',
    en: 'Try again',
    es: 'Intentar de nuevo',
  },
}

// Helper function to get translation
export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] || key
}

// Helper to get FAQ answer by index
export function getFaqAnswer(index: number, lang: Language): string {
  const key = `faq_answer_${index + 1}`
  return translations[key]?.[lang] || translations[key]?.fr || ''
}
