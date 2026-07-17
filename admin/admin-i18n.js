/*
 * Admin i18n — Système de traduction trilingue pour le panneau admin Midenty
 */

const ADMIN_TRANSLATIONS = {
  fr: {
    // Login
    admin_title: "Midenty Admin",
    admin_subtitle: "Panneau de gestion des clients",
    admin_email_placeholder: "Email",
    admin_password_placeholder: "Mot de passe",
    admin_login_btn: "Connexion",
    admin_logout: "Déconnexion",

    // Header
    admin_header_title: "Midenty — Panneau Admin",
    admin_header_brand: "Gestion des clients",

    // Navigation
    admin_nav_clients: "Clients",
    admin_nav_stats: "Statistiques",

    // List view
    admin_clients_title: "Clients",
    admin_export_all: "Exporter tout (ZIP)",
    admin_new_client: "+ Nouveau client",
    admin_empty_state: "Aucun client configuré. Importez un fichier JSON ou créez un nouveau client.",
    admin_empty_create: "+ Créer le premier client",
    admin_import_clients: "Importer des clients (JSON)",

    // Table headers
    admin_th_name: "Nom",
    admin_th_code: "Code d'accès",
    admin_th_type: "Type",
    admin_th_status: "Statut",
    admin_th_date: "Date de création",
    admin_th_actions: "Actions",
    admin_status_active: "Actif",
    admin_status_inactive: "Désactivé",

    // GitHub
    admin_github_title: "Déploiement automatique",
    admin_github_desc: "Entrez votre token GitHub pour déployer les clients automatiquement quand vous cliquez \"Enregistrer\".",
    admin_github_save: "Enregistrer",

    // Form
    admin_new_client_title: "Nouveau client",
    admin_edit_client_title: "Modifier le client",
    admin_back_to_list: "← Retour à la liste",

    // Form — Identity
    admin_section_identity: "Identité de l'école",
    admin_type_etablissement: "Type d'établissement",
    admin_type_select: "-- Choisir un type --",
    admin_type_medersa: "École coranique / Médersa",
    admin_type_ecole_privee: "École privée",
    admin_type_universite_arabe: "Université arabe",
    admin_type_universite: "Université (francophone)",
    admin_type_centre_formation: "École professionnelle / Centre de formation",
    admin_nom_fr: "Nom (Français) *",
    admin_nom_ar: "Nom (Arabe) *",
    admin_adresse: "Adresse",
    admin_telephones: "Téléphones (séparés par des virgules)",
    admin_logo: "Logo (image)",

    // Form — Colors
    admin_section_colors: "Couleurs du thème",
    admin_color_primary: "Couleur principale",
    admin_color_secondary: "Couleur secondaire",
    admin_color_accent: "Couleur accent",

    // Form — Access
    admin_section_access: "Accès",
    admin_code_acces: "Code d'accès *",
    admin_statut: "Statut",
    admin_statut_actif: "Actif",
    admin_statut_desactive: "Désactivé",
    admin_generate_code: "Générer un code automatique",

    // Form — Firestore live
    admin_section_firestore: "État actuel du client (temps réel)",
    admin_firestore_waiting: "En attente de connexion...",
    admin_firestore_diff: "Le client a modifié ses classes, frais ou modes de paiement depuis son application. Les valeurs ci-dessous (formulaire) ne correspondent plus à ce qu'il voit actuellement.",
    admin_firestore_load: "Charger ces valeurs dans le formulaire",

    // Form — Schooling
    admin_section_schooling: "Scolarité",
    admin_frais_inscription: "Frais d'inscription (FCFA)",
    admin_frais_mensuels: "Frais mensuels (FCFA)",
    admin_debut_mois: "Mois de début",
    admin_debut_annee: "Année de début",
    admin_fin_mois: "Mois de fin",
    admin_fin_annee: "Année de fin",
    admin_prefixe_matricule: "Préfixe matricule",
    admin_devise: "Devise",

    // Form — Classes
    admin_section_classes: "Classes",
    admin_new_classe_placeholder: "Nom de la classe",
    admin_add_classe: "Ajouter",

    // Form — Payment modes
    admin_section_modes: "Modes de paiement",
    admin_new_mode_placeholder: "Mode de paiement",
    admin_add_mode: "Ajouter",

    // Form — SMS
    admin_section_sms: "Notifications SMS",
    admin_sms_desc: "Envoi automatique de SMS aux parents après inscription et paiement mensuel.",
    admin_sms_enabled: "SMS activés",
    admin_sms_disabled_opt: "Désactivé",
    admin_sms_enabled_opt: "Activé",
    admin_sms_provider: "Fournisseur SMS",
    admin_sms_generic: "Générique (URL personnalisée)",
    admin_sms_api_key: "Clé API",
    admin_sms_api_secret: "Secret API (Twilio uniquement)",
    admin_sms_sender: "Sender ID / Username",
    admin_sms_api_url: "URL API (fournisseur générique)",
    admin_sms_language: "Langue des SMS",
    admin_sms_lang_fr: "Français",
    admin_sms_lang_ar: "Arabe",
    admin_sms_test: "Envoyer SMS test",

    // Form — Messages
    admin_section_messages: "Messages sur les reçus",
    admin_msg_fr: "Message final (Français)",
    admin_msg_ar: "Message final (Arabe)",

    // Form — i18n overrides
    admin_section_i18n: "Personnalisation des textes",
    admin_i18n_desc: "Les champs vides utilisent le texte par défaut. Remplissez uniquement les textes que vous souhaitez personnaliser pour ce client.",
    admin_i18n_element: "Élément",
    admin_i18n_french: "Français",
    admin_i18n_arabic: "العربية",
    admin_i18n_english: "English",
    admin_i18n_tab_inscription: "Onglet Inscription",
    admin_i18n_tab_classes: "Onglet Classes",
    admin_i18n_tab_mensuel: "Onglet Mensuel",
    admin_i18n_tab_parametres: "Onglet Paramètres",
    admin_i18n_label_nom: "Champ Nom",
    admin_i18n_label_classe: "Champ Classe",
    admin_i18n_btn_inscrire: "Bouton Inscrire",
    admin_i18n_receipt_inscription: "Reçu : Inscription",
    admin_i18n_receipt_monthly: "Reçu : Frais mensuels",
    admin_i18n_receipt_total: "Reçu : Total",

    // Form — Modules
    admin_section_modules: "Modules activés",
    admin_modules_desc: "Un module désactivé est totalement invisible dans l'application du client — pas d'onglet grisé, comme s'il n'existait pas.",
    admin_forfait: "Forfait",
    admin_forfait_essentiel: "Essentiel",
    admin_forfait_complet: "Complet",
    admin_forfait_premium: "Premium",
    admin_forfait_sur_mesure: "Sur-mesure",
    admin_apply_essentiel: "Appliquer Essentiel",
    admin_apply_complet: "Appliquer Complet",
    admin_apply_premium: "Appliquer Premium",

    // Module labels
    admin_mod_inscription: "Inscription",
    admin_mod_inscription_desc: "Inscrire de nouveaux élèves",
    admin_mod_classes: "Classes",
    admin_mod_classes_desc: "Voir la liste des classes et élèves",
    admin_mod_paiements: "Paiements",
    admin_mod_paiements_desc: "Enregistrer les frais mensuels",
    admin_mod_parametres: "Paramètres",
    admin_mod_parametres_desc: "Réglages de l'application",
    admin_mod_guide: "Guide d'utilisation",
    admin_mod_guide_desc: "Guide intégré pour le client",
    admin_mod_presences: "Présences",
    admin_mod_presences_desc: "Appel oral et suivi des absences",
    admin_mod_bulletins: "Bulletins de notes",
    admin_mod_bulletins_desc: "Saisie des notes et bulletins PDF",
    admin_mod_attestations: "Attestations",
    admin_mod_attestations_desc: "Génération d'attestations et certificats",
    admin_mod_dashboard: "Tableau de bord",
    admin_mod_dashboard_desc: "Statistiques et vue d'ensemble",
    admin_mod_enseignants: "Gestion enseignants",
    admin_mod_enseignants_desc: "Profils et affectations des enseignants",
    admin_mod_historique: "Historique pluriannuel",
    admin_mod_historique_desc: "Promotion/redoublement, archivage",

    // Form — Guide
    admin_section_guide: "Guide d'utilisation intégré",
    admin_guide_desc: "Contenu du guide affiché dans l'application du client (module \"guide\"). Les vidéos sont facultatives — utilisez un lien YouTube au format \"embed\".",
    admin_guide_show_forfaits: "Afficher la section \"Forfaits disponibles\" dans le guide",
    admin_guide_yes: "Oui",
    admin_guide_no: "Non",
    admin_guide_modes_title: "Modes de paiement pour l'abonnement",
    admin_guide_new_mode: "Ex: Wave, Orange Money...",
    admin_guide_add_mode: "Ajouter",
    admin_guide_msg_title: "Message personnalisé (optionnel)",
    admin_guide_msg_fr: "Message (Français)",
    admin_guide_msg_ar: "Message (Arabe)",
    admin_guide_msg_en: "Message (Anglais)",

    // Form — Actions
    admin_cancel: "Annuler",
    admin_download_json: "Télécharger JSON",
    admin_save: "Enregistrer",

    // Months
    admin_month_1: "Janvier", admin_month_2: "Février", admin_month_3: "Mars",
    admin_month_4: "Avril", admin_month_5: "Mai", admin_month_6: "Juin",
    admin_month_7: "Juillet", admin_month_8: "Août", admin_month_9: "Septembre",
    admin_month_10: "Octobre", admin_month_11: "Novembre", admin_month_12: "Décembre",

    // Video labels
    admin_video_inscription: "Vidéo — Inscription",
    admin_video_classes: "Vidéo — Classes",
    admin_video_paiement: "Vidéo — Paiement",
    admin_video_recus: "Vidéo — Reçus",
    admin_video_presences: "Vidéo — Présences",
    admin_video_bulletins: "Vidéo — Bulletins",
    admin_video_attestations: "Vidéo — Attestations",
    admin_video_dashboard: "Vidéo — Tableau de bord",

    // Stats
    admin_stats_title: "Statistiques & Analyses",
    admin_stats_select_school: "Choisir un établissement",
    admin_stats_select_placeholder: "-- Sélectionner une école --",
    admin_stats_total_students: "Total élèves",
    admin_stats_total_receipts: "Total reçus",
    admin_stats_total_revenue: "Revenus totaux",
    admin_stats_attendance_rate: "Taux de présence",
    admin_stats_students_by_class: "Élèves par classe",
    admin_stats_monthly_revenue: "Revenus mensuels",
    admin_stats_payment_status: "Statut des paiements",
    admin_stats_attendance_by_class: "Présence par classe",
    admin_stats_paid: "Payé",
    admin_stats_unpaid: "Impayé",
    admin_stats_no_data: "Aucune donnée disponible. Sélectionnez un établissement.",
    admin_stats_students_list: "Liste des élèves",
    admin_stats_recent_payments: "Paiements récents",
    admin_stats_student_name: "Nom",
    admin_stats_student_class: "Classe",
    admin_stats_student_matricule: "Matricule",
    admin_stats_student_date: "Date d'inscription",
    admin_stats_payment_receipt: "N° Reçu",
    admin_stats_payment_amount: "Montant",
    admin_stats_payment_type: "Type",
    admin_stats_payment_date: "Date",
    admin_stats_inscription: "Inscription",
    admin_stats_mensuel: "Mensuel"
  },

  ar: {
    admin_title: "لوحة تحكم ميدنتي",
    admin_subtitle: "إدارة العملاء",
    admin_email_placeholder: "البريد الإلكتروني",
    admin_password_placeholder: "كلمة المرور",
    admin_login_btn: "تسجيل الدخول",
    admin_logout: "تسجيل الخروج",

    admin_header_title: "ميدنتي — لوحة التحكم",
    admin_header_brand: "إدارة العملاء",

    admin_nav_clients: "العملاء",
    admin_nav_stats: "الإحصائيات",

    admin_clients_title: "العملاء",
    admin_export_all: "تصدير الكل (ZIP)",
    admin_new_client: "+ عميل جديد",
    admin_empty_state: "لا يوجد عملاء مهيئين. قم باستيراد ملف JSON أو إنشاء عميل جديد.",
    admin_empty_create: "+ إنشاء أول عميل",
    admin_import_clients: "استيراد عملاء (JSON)",

    admin_th_name: "الاسم",
    admin_th_code: "رمز الدخول",
    admin_th_type: "النوع",
    admin_th_status: "الحالة",
    admin_th_date: "تاريخ الإنشاء",
    admin_th_actions: "الإجراءات",
    admin_status_active: "نشط",
    admin_status_inactive: "معطل",

    admin_github_title: "النشر التلقائي",
    admin_github_desc: "أدخل رمز GitHub الخاص بك لنشر العملاء تلقائياً عند النقر على \"حفظ\".",
    admin_github_save: "حفظ",

    admin_new_client_title: "عميل جديد",
    admin_edit_client_title: "تعديل العميل",
    admin_back_to_list: "← العودة إلى القائمة",

    admin_section_identity: "هوية المدرسة",
    admin_type_etablissement: "نوع المؤسسة",
    admin_type_select: "-- اختر النوع --",
    admin_type_medersa: "مدرسة قرآنية / مدرسة",
    admin_type_ecole_privee: "مدرسة خاصة",
    admin_type_universite_arabe: "جامعة عربية",
    admin_type_universite: "جامعة (فرنكوفونية)",
    admin_type_centre_formation: "مدرسة مهنية / مركز تكوين",
    admin_nom_fr: "الاسم (بالفرنسية) *",
    admin_nom_ar: "الاسم (بالعربية) *",
    admin_adresse: "العنوان",
    admin_telephones: "أرقام الهاتف (مفصولة بفواصل)",
    admin_logo: "الشعار (صورة)",

    admin_section_colors: "ألوان السمة",
    admin_color_primary: "اللون الرئيسي",
    admin_color_secondary: "اللون الثانوي",
    admin_color_accent: "لون التمييز",

    admin_section_access: "الوصول",
    admin_code_acces: "رمز الدخول *",
    admin_statut: "الحالة",
    admin_statut_actif: "نشط",
    admin_statut_desactive: "معطل",
    admin_generate_code: "توليد رمز تلقائي",

    admin_section_firestore: "الحالة الحالية للعميل (مباشر)",
    admin_firestore_waiting: "في انتظار الاتصال...",
    admin_firestore_diff: "قام العميل بتعديل الأقسام أو الرسوم أو طرق الدفع من تطبيقه. القيم أدناه (النموذج) لم تعد تطابق ما يراه حالياً.",
    admin_firestore_load: "تحميل هذه القيم في النموذج",

    admin_section_schooling: "الدراسة",
    admin_frais_inscription: "رسوم التسجيل (FCFA)",
    admin_frais_mensuels: "الرسوم الشهرية (FCFA)",
    admin_debut_mois: "شهر البداية",
    admin_debut_annee: "سنة البداية",
    admin_fin_mois: "شهر النهاية",
    admin_fin_annee: "سنة النهاية",
    admin_prefixe_matricule: "بادئة الرقم التسلسلي",
    admin_devise: "العملة",

    admin_section_classes: "الأقسام",
    admin_new_classe_placeholder: "اسم القسم",
    admin_add_classe: "إضافة",

    admin_section_modes: "طرق الدفع",
    admin_new_mode_placeholder: "طريقة الدفع",
    admin_add_mode: "إضافة",

    admin_section_sms: "إشعارات SMS",
    admin_sms_desc: "إرسال تلقائي لرسائل SMS لأولياء الأمور بعد التسجيل والدفع الشهري.",
    admin_sms_enabled: "SMS مفعلة",
    admin_sms_disabled_opt: "معطل",
    admin_sms_enabled_opt: "مفعل",
    admin_sms_provider: "مزود SMS",
    admin_sms_generic: "عام (رابط مخصص)",
    admin_sms_api_key: "مفتاح API",
    admin_sms_api_secret: "سر API (Twilio فقط)",
    admin_sms_sender: "معرف المرسل / اسم المستخدم",
    admin_sms_api_url: "رابط API (مزود عام)",
    admin_sms_language: "لغة الرسائل",
    admin_sms_lang_fr: "الفرنسية",
    admin_sms_lang_ar: "العربية",
    admin_sms_test: "إرسال SMS تجريبي",

    admin_section_messages: "رسائل الإيصالات",
    admin_msg_fr: "الرسالة النهائية (بالفرنسية)",
    admin_msg_ar: "الرسالة النهائية (بالعربية)",

    admin_section_i18n: "تخصيص النصوص",
    admin_i18n_desc: "الحقول الفارغة تستخدم النص الافتراضي. املأ فقط النصوص التي تريد تخصيصها لهذا العميل.",
    admin_i18n_element: "العنصر",
    admin_i18n_french: "Français",
    admin_i18n_arabic: "العربية",
    admin_i18n_english: "English",
    admin_i18n_tab_inscription: "تبويب التسجيل",
    admin_i18n_tab_classes: "تبويب الأقسام",
    admin_i18n_tab_mensuel: "تبويب الشهري",
    admin_i18n_tab_parametres: "تبويب الإعدادات",
    admin_i18n_label_nom: "حقل الاسم",
    admin_i18n_label_classe: "حقل القسم",
    admin_i18n_btn_inscrire: "زر التسجيل",
    admin_i18n_receipt_inscription: "إيصال: التسجيل",
    admin_i18n_receipt_monthly: "إيصال: الرسوم الشهرية",
    admin_i18n_receipt_total: "إيصال: المجموع",

    admin_section_modules: "الوحدات المفعلة",
    admin_modules_desc: "الوحدة المعطلة تكون غير مرئية تماماً في تطبيق العميل — لا يوجد تبويب رمادي، كأنها غير موجودة.",
    admin_forfait: "الباقة",
    admin_forfait_essentiel: "أساسي",
    admin_forfait_complet: "كامل",
    admin_forfait_premium: "متميز",
    admin_forfait_sur_mesure: "مخصص",
    admin_apply_essentiel: "تطبيق أساسي",
    admin_apply_complet: "تطبيق كامل",
    admin_apply_premium: "تطبيق متميز",

    admin_mod_inscription: "التسجيل",
    admin_mod_inscription_desc: "تسجيل تلاميذ جدد",
    admin_mod_classes: "الأقسام",
    admin_mod_classes_desc: "عرض قائمة الأقسام والتلاميذ",
    admin_mod_paiements: "المدفوعات",
    admin_mod_paiements_desc: "تسجيل الرسوم الشهرية",
    admin_mod_parametres: "الإعدادات",
    admin_mod_parametres_desc: "إعدادات التطبيق",
    admin_mod_guide: "دليل الاستخدام",
    admin_mod_guide_desc: "دليل مدمج للعميل",
    admin_mod_presences: "الحضور",
    admin_mod_presences_desc: "النداء الشفوي ومتابعة الغياب",
    admin_mod_bulletins: "كشوف النقاط",
    admin_mod_bulletins_desc: "إدخال الدرجات وكشوف PDF",
    admin_mod_attestations: "الشهادات",
    admin_mod_attestations_desc: "إنشاء شهادات ووثائق",
    admin_mod_dashboard: "لوحة القيادة",
    admin_mod_dashboard_desc: "إحصائيات ونظرة عامة",
    admin_mod_enseignants: "إدارة المعلمين",
    admin_mod_enseignants_desc: "ملفات وتعيينات المعلمين",
    admin_mod_historique: "السجل متعدد السنوات",
    admin_mod_historique_desc: "الترقية/الإعادة، الأرشفة",

    admin_section_guide: "دليل الاستخدام المدمج",
    admin_guide_desc: "محتوى الدليل المعروض في تطبيق العميل (وحدة \"الدليل\"). الفيديوهات اختيارية — استخدم رابط YouTube بصيغة \"embed\".",
    admin_guide_show_forfaits: "عرض قسم \"الباقات المتاحة\" في الدليل",
    admin_guide_yes: "نعم",
    admin_guide_no: "لا",
    admin_guide_modes_title: "طرق الدفع للاشتراك",
    admin_guide_new_mode: "مثال: Wave، Orange Money...",
    admin_guide_add_mode: "إضافة",
    admin_guide_msg_title: "رسالة مخصصة (اختياري)",
    admin_guide_msg_fr: "الرسالة (بالفرنسية)",
    admin_guide_msg_ar: "الرسالة (بالعربية)",
    admin_guide_msg_en: "الرسالة (بالإنجليزية)",

    admin_cancel: "إلغاء",
    admin_download_json: "تحميل JSON",
    admin_save: "حفظ",

    admin_month_1: "يناير", admin_month_2: "فبراير", admin_month_3: "مارس",
    admin_month_4: "أبريل", admin_month_5: "مايو", admin_month_6: "يونيو",
    admin_month_7: "يوليو", admin_month_8: "أغسطس", admin_month_9: "سبتمبر",
    admin_month_10: "أكتوبر", admin_month_11: "نوفمبر", admin_month_12: "ديسمبر",

    admin_video_inscription: "فيديو — التسجيل",
    admin_video_classes: "فيديو — الأقسام",
    admin_video_paiement: "فيديو — الدفع",
    admin_video_recus: "فيديو — الإيصالات",
    admin_video_presences: "فيديو — الحضور",
    admin_video_bulletins: "فيديو — كشوف النقاط",
    admin_video_attestations: "فيديو — الشهادات",
    admin_video_dashboard: "فيديو — لوحة القيادة",

    admin_stats_title: "الإحصائيات والتحليلات",
    admin_stats_select_school: "اختر مؤسسة",
    admin_stats_select_placeholder: "-- اختر مدرسة --",
    admin_stats_total_students: "إجمالي التلاميذ",
    admin_stats_total_receipts: "إجمالي الإيصالات",
    admin_stats_total_revenue: "إجمالي الإيرادات",
    admin_stats_attendance_rate: "معدل الحضور",
    admin_stats_students_by_class: "التلاميذ حسب القسم",
    admin_stats_monthly_revenue: "الإيرادات الشهرية",
    admin_stats_payment_status: "حالة المدفوعات",
    admin_stats_attendance_by_class: "الحضور حسب القسم",
    admin_stats_paid: "مدفوع",
    admin_stats_unpaid: "غير مدفوع",
    admin_stats_no_data: "لا توجد بيانات متاحة. اختر مؤسسة.",
    admin_stats_students_list: "قائمة التلاميذ",
    admin_stats_recent_payments: "المدفوعات الأخيرة",
    admin_stats_student_name: "الاسم",
    admin_stats_student_class: "القسم",
    admin_stats_student_matricule: "الرقم التسلسلي",
    admin_stats_student_date: "تاريخ التسجيل",
    admin_stats_payment_receipt: "رقم الإيصال",
    admin_stats_payment_amount: "المبلغ",
    admin_stats_payment_type: "النوع",
    admin_stats_payment_date: "التاريخ",
    admin_stats_inscription: "تسجيل",
    admin_stats_mensuel: "شهري"
  },

  en: {
    admin_title: "Midenty Admin",
    admin_subtitle: "Client management panel",
    admin_email_placeholder: "Email",
    admin_password_placeholder: "Password",
    admin_login_btn: "Login",
    admin_logout: "Logout",

    admin_header_title: "Midenty — Admin Panel",
    admin_header_brand: "Client management",

    admin_nav_clients: "Clients",
    admin_nav_stats: "Statistics",

    admin_clients_title: "Clients",
    admin_export_all: "Export all (ZIP)",
    admin_new_client: "+ New client",
    admin_empty_state: "No clients configured. Import a JSON file or create a new client.",
    admin_empty_create: "+ Create first client",
    admin_import_clients: "Import clients (JSON)",

    admin_th_name: "Name",
    admin_th_code: "Access code",
    admin_th_type: "Type",
    admin_th_status: "Status",
    admin_th_date: "Created",
    admin_th_actions: "Actions",
    admin_status_active: "Active",
    admin_status_inactive: "Disabled",

    admin_github_title: "Automatic deployment",
    admin_github_desc: "Enter your GitHub token to automatically deploy clients when you click \"Save\".",
    admin_github_save: "Save",

    admin_new_client_title: "New client",
    admin_edit_client_title: "Edit client",
    admin_back_to_list: "← Back to list",

    admin_section_identity: "School identity",
    admin_type_etablissement: "Establishment type",
    admin_type_select: "-- Choose a type --",
    admin_type_medersa: "Quranic school / Medersa",
    admin_type_ecole_privee: "Private school",
    admin_type_universite_arabe: "Arab university",
    admin_type_universite: "University (French-speaking)",
    admin_type_centre_formation: "Vocational school / Training center",
    admin_nom_fr: "Name (French) *",
    admin_nom_ar: "Name (Arabic) *",
    admin_adresse: "Address",
    admin_telephones: "Phone numbers (comma-separated)",
    admin_logo: "Logo (image)",

    admin_section_colors: "Theme colors",
    admin_color_primary: "Primary color",
    admin_color_secondary: "Secondary color",
    admin_color_accent: "Accent color",

    admin_section_access: "Access",
    admin_code_acces: "Access code *",
    admin_statut: "Status",
    admin_statut_actif: "Active",
    admin_statut_desactive: "Disabled",
    admin_generate_code: "Generate automatic code",

    admin_section_firestore: "Current client state (real-time)",
    admin_firestore_waiting: "Waiting for connection...",
    admin_firestore_diff: "The client has modified their classes, fees, or payment methods from their app. The values below (form) no longer match what they currently see.",
    admin_firestore_load: "Load these values into the form",

    admin_section_schooling: "Schooling",
    admin_frais_inscription: "Enrollment fee (FCFA)",
    admin_frais_mensuels: "Monthly fees (FCFA)",
    admin_debut_mois: "Start month",
    admin_debut_annee: "Start year",
    admin_fin_mois: "End month",
    admin_fin_annee: "End year",
    admin_prefixe_matricule: "Student ID prefix",
    admin_devise: "Currency",

    admin_section_classes: "Classes",
    admin_new_classe_placeholder: "Class name",
    admin_add_classe: "Add",

    admin_section_modes: "Payment methods",
    admin_new_mode_placeholder: "Payment method",
    admin_add_mode: "Add",

    admin_section_sms: "SMS Notifications",
    admin_sms_desc: "Automatic SMS to parents after enrollment and monthly payment.",
    admin_sms_enabled: "SMS enabled",
    admin_sms_disabled_opt: "Disabled",
    admin_sms_enabled_opt: "Enabled",
    admin_sms_provider: "SMS provider",
    admin_sms_generic: "Generic (custom URL)",
    admin_sms_api_key: "API key",
    admin_sms_api_secret: "API secret (Twilio only)",
    admin_sms_sender: "Sender ID / Username",
    admin_sms_api_url: "API URL (generic provider)",
    admin_sms_language: "SMS language",
    admin_sms_lang_fr: "French",
    admin_sms_lang_ar: "Arabic",
    admin_sms_test: "Send test SMS",

    admin_section_messages: "Receipt messages",
    admin_msg_fr: "Final message (French)",
    admin_msg_ar: "Final message (Arabic)",

    admin_section_i18n: "Text customization",
    admin_i18n_desc: "Empty fields use default text. Only fill in texts you want to customize for this client.",
    admin_i18n_element: "Element",
    admin_i18n_french: "Français",
    admin_i18n_arabic: "العربية",
    admin_i18n_english: "English",
    admin_i18n_tab_inscription: "Enrollment tab",
    admin_i18n_tab_classes: "Classes tab",
    admin_i18n_tab_mensuel: "Monthly tab",
    admin_i18n_tab_parametres: "Settings tab",
    admin_i18n_label_nom: "Name field",
    admin_i18n_label_classe: "Class field",
    admin_i18n_btn_inscrire: "Enroll button",
    admin_i18n_receipt_inscription: "Receipt: Enrollment",
    admin_i18n_receipt_monthly: "Receipt: Monthly fees",
    admin_i18n_receipt_total: "Receipt: Total",

    admin_section_modules: "Enabled modules",
    admin_modules_desc: "A disabled module is completely invisible in the client's app — no grayed-out tab, as if it doesn't exist.",
    admin_forfait: "Package",
    admin_forfait_essentiel: "Essential",
    admin_forfait_complet: "Complete",
    admin_forfait_premium: "Premium",
    admin_forfait_sur_mesure: "Custom",
    admin_apply_essentiel: "Apply Essential",
    admin_apply_complet: "Apply Complete",
    admin_apply_premium: "Apply Premium",

    admin_mod_inscription: "Enrollment",
    admin_mod_inscription_desc: "Enroll new students",
    admin_mod_classes: "Classes",
    admin_mod_classes_desc: "View class and student lists",
    admin_mod_paiements: "Payments",
    admin_mod_paiements_desc: "Record monthly fees",
    admin_mod_parametres: "Settings",
    admin_mod_parametres_desc: "Application settings",
    admin_mod_guide: "User guide",
    admin_mod_guide_desc: "Built-in guide for the client",
    admin_mod_presences: "Attendance",
    admin_mod_presences_desc: "Roll call and absence tracking",
    admin_mod_bulletins: "Report cards",
    admin_mod_bulletins_desc: "Grade entry and PDF report cards",
    admin_mod_attestations: "Certificates",
    admin_mod_attestations_desc: "Generate certificates and attestations",
    admin_mod_dashboard: "Dashboard",
    admin_mod_dashboard_desc: "Statistics and overview",
    admin_mod_enseignants: "Teacher management",
    admin_mod_enseignants_desc: "Teacher profiles and assignments",
    admin_mod_historique: "Multi-year history",
    admin_mod_historique_desc: "Promotion/repetition, archiving",

    admin_section_guide: "Built-in user guide",
    admin_guide_desc: "Guide content displayed in the client's app (\"guide\" module). Videos are optional — use a YouTube link in \"embed\" format.",
    admin_guide_show_forfaits: "Show \"Available plans\" section in the guide",
    admin_guide_yes: "Yes",
    admin_guide_no: "No",
    admin_guide_modes_title: "Payment methods for subscription",
    admin_guide_new_mode: "E.g.: Wave, Orange Money...",
    admin_guide_add_mode: "Add",
    admin_guide_msg_title: "Custom message (optional)",
    admin_guide_msg_fr: "Message (French)",
    admin_guide_msg_ar: "Message (Arabic)",
    admin_guide_msg_en: "Message (English)",

    admin_cancel: "Cancel",
    admin_download_json: "Download JSON",
    admin_save: "Save",

    admin_month_1: "January", admin_month_2: "February", admin_month_3: "March",
    admin_month_4: "April", admin_month_5: "May", admin_month_6: "June",
    admin_month_7: "July", admin_month_8: "August", admin_month_9: "September",
    admin_month_10: "October", admin_month_11: "November", admin_month_12: "December",

    admin_video_inscription: "Video — Enrollment",
    admin_video_classes: "Video — Classes",
    admin_video_paiement: "Video — Payment",
    admin_video_recus: "Video — Receipts",
    admin_video_presences: "Video — Attendance",
    admin_video_bulletins: "Video — Report cards",
    admin_video_attestations: "Video — Certificates",
    admin_video_dashboard: "Video — Dashboard",

    admin_stats_title: "Statistics & Analytics",
    admin_stats_select_school: "Choose an establishment",
    admin_stats_select_placeholder: "-- Select a school --",
    admin_stats_total_students: "Total students",
    admin_stats_total_receipts: "Total receipts",
    admin_stats_total_revenue: "Total revenue",
    admin_stats_attendance_rate: "Attendance rate",
    admin_stats_students_by_class: "Students by class",
    admin_stats_monthly_revenue: "Monthly revenue",
    admin_stats_payment_status: "Payment status",
    admin_stats_attendance_by_class: "Attendance by class",
    admin_stats_paid: "Paid",
    admin_stats_unpaid: "Unpaid",
    admin_stats_no_data: "No data available. Select an establishment.",
    admin_stats_students_list: "Student list",
    admin_stats_recent_payments: "Recent payments",
    admin_stats_student_name: "Name",
    admin_stats_student_class: "Class",
    admin_stats_student_matricule: "Student ID",
    admin_stats_student_date: "Enrollment date",
    admin_stats_payment_receipt: "Receipt #",
    admin_stats_payment_amount: "Amount",
    admin_stats_payment_type: "Type",
    admin_stats_payment_date: "Date",
    admin_stats_inscription: "Enrollment",
    admin_stats_mensuel: "Monthly"
  }
};

const AdminI18n = {
  _lang: "fr",
  _listeners: [],

  init() {
    this._lang = localStorage.getItem("midenty_admin_lang") || "fr";
    this.apply();
  },

  getLang() {
    return this._lang;
  },

  setLang(lang) {
    if (!ADMIN_TRANSLATIONS[lang]) return;
    this._lang = lang;
    localStorage.setItem("midenty_admin_lang", lang);
    this.apply();
    this._listeners.forEach(fn => fn(lang));
  },

  t(key, params) {
    let text = (ADMIN_TRANSLATIONS[this._lang] && ADMIN_TRANSLATIONS[this._lang][key])
      || (ADMIN_TRANSLATIONS.fr[key])
      || key;
    if (params) {
      Object.keys(params).forEach(k => {
        text = text.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
      });
    }
    return text;
  },

  onChange(fn) {
    this._listeners.push(fn);
  },

  apply() {
    const lang = this._lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    if (lang === "ar") {
      document.body.classList.add("admin-rtl");
    } else {
      document.body.classList.remove("admin-rtl");
    }

    document.querySelectorAll("[data-i18n-admin]").forEach(el => {
      const key = el.getAttribute("data-i18n-admin");
      el.textContent = this.t(key);
    });

    document.querySelectorAll("[data-i18n-admin-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-admin-placeholder");
      el.placeholder = this.t(key);
    });

    document.querySelectorAll("[data-i18n-admin-html]").forEach(el => {
      const key = el.getAttribute("data-i18n-admin-html");
      el.innerHTML = this.t(key);
    });

    // Update language switcher active state
    document.querySelectorAll(".admin-lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }
};
