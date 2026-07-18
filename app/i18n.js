/* i18n.js — Système multilingue (fr/ar/en). Chargé avant app.js. */

const TRANSLATIONS = {
  fr: {
    // Onglets
    tab_inscription: "Inscription",
    tab_classes: "Classes",
    tab_mensuel: "Mensuel",
    tab_presences: "Présences",
    tab_guide: "Guide",
    tab_parametres: "Paramètres",

    // Guide d'utilisation
    guide_title: "Comment utiliser l'application",
    guide_intro: "Retrouvez ici toutes les explications pour utiliser l'application, ainsi que les forfaits disponibles.",
    guide_forfaits_title: "Forfaits disponibles",
    guide_payment_title: "Modes de paiement pour l'abonnement",
    guide_video_btn: "▶ Voir la vidéo",
    guide_section_inscription_title: "Inscrire un élève",
    guide_section_inscription_desc: "Va dans l'onglet Inscription, remplis le nom, le téléphone et la classe de l'élève, puis clique sur « Inscrire ». Un matricule et un reçu sont générés automatiquement.",
    guide_section_classes_title: "Consulter les classes",
    guide_section_classes_desc: "Va dans l'onglet Classes, choisis une classe dans la liste pour voir tous les élèves inscrits dans cette classe.",
    guide_section_paiement_title: "Enregistrer un paiement",
    guide_section_paiement_desc: "Va dans l'onglet Mensuel, saisis le matricule de l'élève, choisis le(s) mois à payer, puis clique sur « Payer ». Le reçu est généré automatiquement.",
    guide_section_recus_title: "Partager un reçu",
    guide_section_recus_desc: "Chaque reçu peut être téléchargé en PDF, en image, partagé sur WhatsApp, ou imprimé sur une imprimante Bluetooth.",
    guide_section_presences_title: "Faire l'appel (Présences)",
    guide_section_presences_desc: "Va dans l'onglet Présences, choisis la classe, puis clique sur « Commencer l'appel ». Pour chaque élève, indique s'il est présent ou absent.",
    guide_section_bulletins_title: "Créer des bulletins de notes",
    guide_section_bulletins_desc: "Va dans l'onglet Bulletins, choisis la classe et la période, saisis les notes de chaque élève, puis génère les bulletins en PDF.",
    guide_section_attestations_title: "Générer une attestation",
    guide_section_attestations_desc: "Va dans l'onglet Attestations, choisis l'élève et le type d'attestation, puis génère le document en PDF.",
    guide_section_dashboard_title: "Consulter le tableau de bord",
    guide_section_dashboard_desc: "Le tableau de bord affiche le nombre d'élèves, les revenus et les statistiques principales de l'établissement.",
    guide_forfait_essentiel_name: "Essentiel",
    guide_forfait_essentiel_desc: "Inscription, Classes, Paiements, Reçus, synchronisation et support.",
    guide_forfait_complet_name: "Complet",
    guide_forfait_complet_desc: "Tout l'Essentiel + Présences, Bulletins, Attestations, Tableau de bord et SMS.",
    guide_forfait_premium_name: "Premium",
    guide_forfait_premium_desc: "Tout le Complet + Gestion des enseignants, Historique pluriannuel, Multi-utilisateurs et SMS illimités.",

    // Présences
    label_date_appel: "Date de l'appel",
    btn_commencer_appel: "Commencer l'appel",
    msg_choose_date_appel: "Choisis une date.",
    msg_resume_draft: "Un appel non terminé existe déjà pour cette classe et cette date. Reprendre où tu t'étais arrêté ?",
    msg_attendance_already_exists: "Une présence a déjà été enregistrée pour cette classe à cette date (peut-être depuis un autre appareil). Refaire l'appel remplacera entièrement l'ancien enregistrement. Continuer ?",
    msg_sync_write_error: "Enregistré sur l'appareil, mais pas encore synchronisé en ligne (erreur réseau). Réessayez plus tard ou vérifiez la connexion.",
    msg_no_students_in_class: "Aucun élève dans cette classe.",
    btn_present: "Présent",
    btn_absent: "Absent",
    txt_rollcall_progress: "{current} / {total} élèves",
    btn_retour: "Retour",
    btn_terminer_plus_tard: "Terminer l'appel plus tard",
    msg_attendance_paused: "Appel mis en pause. Tu peux le reprendre plus tard.",
    title_rollcall_summary: "Résumé de l'appel",
    txt_summary_presents: "Présents",
    txt_summary_absents: "Absents",
    title_absents_list: "Élèves absents",
    msg_no_absents: "Aucun absent aujourd'hui.",
    btn_valider_enregistrer: "Valider et enregistrer",
    msg_attendance_saved: "Appel enregistré avec succès.",
    title_attendance_history: "Historique des présences",
    label_history_month: "Choisir un mois",
    msg_choose_class_and_month: "Choisis une classe et un mois.",
    msg_no_attendance_data: "Aucun appel enregistré pour cette période.",
    btn_export_attendance_pdf: "Export PDF",

    // Login
    login_title: "Code d'accès",
    login_placeholder: "••••••••",
    btn_login: "Entrer",
    welcome_message: "Bienvenue dans l'application de gestion des systèmes scolaires",
    btn_enter: "Entrer",
    msg_connecting: "Connexion...",
    msg_code_incorrect: "Code incorrect",
    msg_account_disabled: "Ce compte est désactivé.",
    msg_contact_whatsapp: "Contacter Midenty sur WhatsApp",

    // Vérification
    verify_title: "Vérification requise",
    verify_message: "Connectez-vous à internet pour continuer à utiliser l'application.\nCette vérification est nécessaire tous les 7 jours.",
    btn_verify: "Vérifier maintenant",
    msg_verifying: "Vérification...",
    msg_account_deactivated: "Ce compte a été <strong>désactivé</strong>.<br>Contactez Midenty pour le réactiver.",
    msg_no_internet: "Pas de connexion internet. Réessayez.",
    msg_need_help: "Besoin d'aide ? Contactez Midenty",

    // Sync
    sync_synced: "Synchronisé",
    sync_pending: "En attente...",
    sync_offline: "Hors-ligne",

    // Mise à jour
    msg_update_available: "Une nouvelle version est disponible.",
    btn_update_refresh: "Actualiser",
    btn_refresh_app_tooltip: "Rafraîchir l'application",

    // Inscription - labels
    label_matricule: "Matricule",
    label_nom_complet: "Nom complet",
    label_tel_eleve: "Téléphone de l'élève",
    label_tel_parent: "Téléphone du parent",
    label_classe: "Classe",
    label_choose: "-- Choisir --",
    btn_inscrire: "Inscrire",

    // Inscription - reçu
    title_receipt_inscription: "Reçu d'inscription",
    title_students_list: "Élèves inscrits",
    placeholder_search: "Rechercher...",
    btn_list_pdf: "Liste PDF",
    title_edit_student: "Modifier l'élève",
    label_nom: "Nom",
    label_tel_eleve_short: "Tél. élève",
    label_tel_parent_short: "Tél. parent",
    btn_save: "Enregistrer",
    btn_cancel: "Annuler",

    // Classes
    label_choose_class: "Choisir une classe",
    label_all_classes: "-- Toutes les classes --",
    btn_export_pdf: "Exporter PDF",
    txt_students_count: "élève(s)",

    // Mensuel
    label_matricule_eleve: "Matricule de l'élève",
    btn_search: "Rechercher",
    label_name: "Nom :",
    label_class: "Classe :",
    label_parent_tel: "Tél. parent :",
    title_select_months: "Sélectionner le(s) mois à payer",
    label_payment_mode: "Mode de paiement",
    label_total: "Total",
    btn_generate_receipt: "Générer le reçu",
    title_receipt_fees: "Reçu des frais",
    title_payment_consult: "Consultation des paiements",
    label_choose_month: "-- Choisir un mois --",

    // Paramètres
    title_school_info: "Informations de l'école",
    title_dev_config: "Configuration développeur",
    label_nom_fr: "Nom (français)",
    label_nom_ar: "Nom (arabe)",
    label_adresse: "Adresse",
    label_telephones: "Téléphone(s)",
    label_logo: "Logo de l'école",
    label_color_primary: "Couleur principale",
    label_color_secondary: "Couleur secondaire",
    label_color_accent: "Couleur accent",
    label_code_acces: "Code d'accès client",
    btn_save_dev: "Enregistrer (dev)",
    title_class_management: "Gestion des classes",
    placeholder_class_name: "Nom de la classe",
    btn_add_class: "+ Ajouter une classe",
    title_fee_amounts: "Montants des frais",
    label_inscription_fee: "Frais d'inscription (FCFA)",
    label_monthly_fee: "Frais mensuels (FCFA)",
    title_school_year: "Année scolaire",
    label_start_month: "Mois de début",
    label_start_year: "Année de début",
    label_end_month: "Mois de fin",
    label_end_year: "Année de fin",
    label_matricule_prefix: "Préfixe matricule",
    title_backup: "Sauvegarde des données",
    hint_backup: "Exporte une sauvegarde régulièrement.",
    btn_export_backup: "Exporter une sauvegarde",
    btn_export_csv: "Exporter en Excel/CSV",
    btn_import_backup: "Importer une sauvegarde",
    title_about: "À propos",
    about_line1: "Cette application a été développée par <strong>Midenty</strong>.",
    about_line2: "Pour toute assistance technique ou information, contactez-nous :",
    about_copyright: "© Midenty — Tous droits réservés",
    whatsapp_help_message: "Bonjour, j'ai besoin d'une assistance technique concernant mon application",
    title_language: "Langue",

    // Messages toast
    msg_no_students: "Aucun élève inscrit.",
    msg_enter_name: "Saisis le nom de l'élève.",
    msg_choose_class: "Choisis une classe.",
    msg_student_enrolled: "Élève inscrit : {name} — {matricule}",
    msg_name_required: "Le nom est obligatoire.",
    msg_student_modified: "Élève modifié.",
    msg_no_student_class: "Aucun élève dans cette classe.",
    msg_no_class_config: "Aucune classe configurée. Va dans Paramètres pour en créer.",
    msg_enter_matricule: "Saisis un matricule.",
    msg_student_not_found: "Aucun élève trouvé avec ce matricule.",
    msg_find_student_first: "Cherche d'abord un élève.",
    msg_select_month: "Sélectionne au moins un mois.",
    msg_payment_saved: "Paiement enregistré — {numero}",
    msg_backup_downloaded: "Sauvegarde téléchargée.",
    msg_image_downloaded: "Image téléchargée — joins-la manuellement dans WhatsApp.",
    msg_no_students_export: "Aucun élève à exporter.",
    msg_csv_downloaded: "Fichier CSV téléchargé.",
    msg_data_reset: "Données réinitialisées.",
    msg_code_wrong: "Code incorrect.",
    msg_dev_panel_opened: "Panneau développeur ouvert.",
    msg_dev_config_saved: "Configuration développeur enregistrée.",
    msg_class_deleted: "Classe supprimée.",
    msg_enter_class_name: "Saisis un nom de classe.",
    msg_class_exists: "Cette classe existe déjà.",
    msg_class_added: "Classe ajoutée : {name}",
    msg_amounts_saved: "Montants enregistrés.",
    msg_settings_saved: "Paramètres enregistrés.",
    msg_backup_imported: "Sauvegarde importée.",
    msg_print_error: "Erreur impression : {error}",
    msg_no_search_result: "Aucun résultat.",
    msg_no_class_created: "Aucune classe créée.",

    // Reçus
    receipt_number: "Reçu N°",
    receipt_date: "Date",
    receipt_student: "Élève",
    receipt_matricule: "Matricule",
    receipt_class: "Classe",
    receipt_inscription: "Inscription",
    receipt_total: "TOTAL",
    receipt_monthly_fees: "Frais mensuels",
    receipt_month: "Mois",
    receipt_payment_mode: "Paiement",
    receipt_use_matricule: "Utilisez ce matricule pour payer les frais mensuels :",
    receipt_months_multiply: "{count} mois × {amount}",

    // Mois
    month_1: "Janvier", month_2: "Février", month_3: "Mars",
    month_4: "Avril", month_5: "Mai", month_6: "Juin",
    month_7: "Juillet", month_8: "Août", month_9: "Septembre",
    month_10: "Octobre", month_11: "Novembre", month_12: "Décembre",

    // Consultation
    txt_unpaid: "Impayés",
    txt_paid: "Payés",

    // Export warning
    msg_no_backup: "Aucune sauvegarde exportée. Fais-le dans Paramètres.",
    msg_backup_days_ago: "Dernière sauvegarde il y a {days} jours.",
    msg_no_backup_yet: "Aucune sauvegarde exportée.",
    msg_backup_today: "Dernière sauvegarde : aujourd'hui.",
    msg_backup_ago: "Dernière sauvegarde : il y a {days} jour(s).",

    // Install banner
    txt_install_banner: "Installe cette application sur ton écran d'accueil.",
    btn_install: "Installer",
    btn_later: "Plus tard",

    // Divers
    btn_modify: "Modifier",
    txt_optional: "Optionnel",
    txt_delete_class_confirm: "Supprimer la classe \"{name}\" ?",
    txt_import_confirm: "Importer {students} élève(s) et {payments} paiement(s) ?\nCeci remplacera les données actuelles.",
    txt_reset_confirm: "Supprimer TOUTES les données ? Cette action est irréversible.",
    txt_reset_unsynced_warning: "Attention : des données ne sont pas encore synchronisées avec le cloud (connexion instable ou hors-ligne). Réinitialiser maintenant risque de les perdre définitivement.\n\nContinuer quand même ?",
    txt_dev_prompt: "Code développeur / administrateur :",
    txt_dev_action_prompt: "Tapez DEV pour configurer, ou RESET pour réinitialiser :",
    msg_import_error: "Import impossible : {error}",
    msg_whatsapp_download: "Image téléchargée — joins-la manuellement dans WhatsApp.",

    // PDF
    pdf_students_list: "Liste des élèves inscrits",
    pdf_exported_on: "Exporté le {date} — {count} élève(s)",
    pdf_class_label: "Classe : {name}",
    pdf_class_count: "{count} élève(s) — {date}",
    pdf_col_name: "Nom",
    pdf_col_matricule: "Matricule",
    pdf_col_class: "Classe",
    pdf_col_parent_tel: "Tél. parent",
    pdf_col_number: "N°",

    // Impression
    print_use_number: "استخدموا هذا الرقم:",

    // Langue
    lang_choose_title_ar: "اختر لغتك",
    lang_choose_title_fr: "Choisissez votre langue",
    lang_choose_title_en: "Choose your language",

    // Séparateurs visuels
    placeholder_tel: "Optionnel",
    placeholder_matricule: "MEI-001",
    placeholder_matricule_num: "001"
  },

  ar: {
    tab_inscription: "التسجيل",
    tab_classes: "الأقسام",
    tab_mensuel: "الرسوم الشهرية",
    tab_guide: "الدليل",
    tab_parametres: "الإعدادات",

    // دليل الاستخدام
    guide_title: "كيفية استخدام التطبيق",
    guide_intro: "ستجد هنا كل الشروحات لاستخدام التطبيق، بالإضافة إلى الباقات المتاحة.",
    guide_forfaits_title: "الباقات المتاحة",
    guide_payment_title: "طرق الدفع للاشتراك",
    guide_video_btn: "▶ مشاهدة الفيديو",
    guide_section_inscription_title: "تسجيل تلميذ",
    guide_section_inscription_desc: "اذهب إلى قسم التسجيل، أدخل اسم التلميذ ورقم الهاتف والقسم، ثم اضغط على «تسجيل». يتم إنشاء الرقم التسلسلي والإيصال تلقائياً.",
    guide_section_classes_title: "الاطلاع على الأقسام",
    guide_section_classes_desc: "اذهب إلى قسم الأقسام، اختر قسماً من القائمة لرؤية جميع التلاميذ المسجلين فيه.",
    guide_section_paiement_title: "تسجيل دفعة",
    guide_section_paiement_desc: "اذهب إلى قسم الرسوم الشهرية، أدخل الرقم التسلسلي للتلميذ، اختر الشهر أو الأشهر المراد دفعها، ثم اضغط على «دفع». يتم إنشاء الإيصال تلقائياً.",
    guide_section_recus_title: "مشاركة إيصال",
    guide_section_recus_desc: "يمكن تحميل كل إيصال بصيغة PDF أو صورة، أو مشاركته عبر واتساب، أو طباعته على طابعة بلوتوث.",
    guide_section_presences_title: "أخذ الحضور",
    guide_section_presences_desc: "اذهب إلى قسم الحضور، اختر القسم، ثم اضغط على «بدء النداء». لكل تلميذ، حدد إن كان حاضراً أو غائباً.",
    guide_section_bulletins_title: "إنشاء كشوف النقاط",
    guide_section_bulletins_desc: "اذهب إلى قسم كشوف النقاط، اختر القسم والفترة، أدخل نقاط كل تلميذ، ثم أنشئ الكشوف بصيغة PDF.",
    guide_section_attestations_title: "إنشاء شهادة",
    guide_section_attestations_desc: "اذهب إلى قسم الشهادات، اختر التلميذ ونوع الشهادة، ثم أنشئ الوثيقة بصيغة PDF.",
    guide_section_dashboard_title: "الاطلاع على لوحة القيادة",
    guide_section_dashboard_desc: "تعرض لوحة القيادة عدد التلاميذ والإيرادات والإحصائيات الرئيسية للمؤسسة.",
    guide_forfait_essentiel_name: "الأساسي",
    guide_forfait_essentiel_desc: "التسجيل، الأقسام، المدفوعات، الإيصالات، المزامنة والدعم.",
    guide_forfait_complet_name: "الكامل",
    guide_forfait_complet_desc: "كل مزايا الباقة الأساسية + الحضور، كشوف النقاط، الشهادات، لوحة القيادة والرسائل النصية.",
    guide_forfait_premium_name: "المميز",
    guide_forfait_premium_desc: "كل مزايا الباقة الكاملة + إدارة المعلمين، السجل متعدد السنوات، تعدد المستخدمين ورسائل نصية غير محدودة.",

    // الحضور
    label_date_appel: "تاريخ النداء",
    btn_commencer_appel: "بدء النداء",
    msg_choose_date_appel: "اختر تاريخاً.",
    msg_resume_draft: "يوجد نداء غير مكتمل لهذا القسم وهذا التاريخ. هل تريد المتابعة من حيث توقفت؟",
    msg_attendance_already_exists: "تم تسجيل حضور لهذا القسم في هذا التاريخ من قبل (ربما من جهاز آخر). إعادة النداء ستستبدل التسجيل السابق بالكامل. هل تريد المتابعة؟",
    msg_sync_write_error: "تم الحفظ على الجهاز، لكن لم تتم المزامنة بعد عبر الإنترنت (خطأ في الشبكة). حاول لاحقاً أو تحقق من الاتصال.",
    msg_no_students_in_class: "لا يوجد تلاميذ في هذا القسم.",
    btn_present: "حاضر",
    btn_absent: "غائب",
    txt_rollcall_progress: "{current} / {total} تلميذ",
    btn_retour: "رجوع",
    btn_terminer_plus_tard: "إنهاء النداء لاحقاً",
    msg_attendance_paused: "تم إيقاف النداء مؤقتاً. يمكنك المتابعة لاحقاً.",
    title_rollcall_summary: "ملخص النداء",
    txt_summary_presents: "الحاضرون",
    txt_summary_absents: "الغائبون",
    title_absents_list: "التلاميذ الغائبون",
    msg_no_absents: "لا يوجد غائبون اليوم.",
    btn_valider_enregistrer: "تأكيد وتسجيل",
    msg_attendance_saved: "تم تسجيل النداء بنجاح.",
    title_attendance_history: "سجل الحضور",
    label_history_month: "اختر الشهر",
    msg_choose_class_and_month: "اختر القسم والشهر.",
    msg_no_attendance_data: "لا يوجد نداء مسجل لهذه الفترة.",
    btn_export_attendance_pdf: "تصدير PDF",

    login_title: "رمز الدخول",
    login_placeholder: "••••••••",
    btn_login: "دخول",
    welcome_message: "مرحباً بكم في تطبيق إدارة الأنظمة المدرسية",
    btn_enter: "دخول",
    msg_connecting: "...جاري الاتصال",
    msg_code_incorrect: "رمز غير صحيح",
    msg_account_disabled: "تم تعطيل هذا الحساب.",
    msg_contact_whatsapp: "تواصل مع Midenty عبر واتساب",

    verify_title: "التحقق مطلوب",
    verify_message: "اتصل بالإنترنت لمواصلة استخدام التطبيق.\nهذا التحقق ضروري كل 7 أيام.",
    btn_verify: "تحقق الآن",
    msg_verifying: "...جاري التحقق",
    msg_account_deactivated: "تم <strong>تعطيل</strong> هذا الحساب.<br>تواصل مع Midenty لإعادة التفعيل.",
    msg_no_internet: "لا يوجد اتصال بالإنترنت. حاول مرة أخرى.",
    msg_need_help: "تحتاج مساعدة؟ تواصل مع Midenty",

    sync_synced: "تمت المزامنة",
    sync_pending: "...في الانتظار",
    sync_offline: "غير متصل",

    msg_update_available: "يتوفر إصدار جديد.",
    btn_update_refresh: "تحديث",
    btn_refresh_app_tooltip: "تحديث التطبيق",

    label_matricule: "الرقم التسلسلي",
    label_nom_complet: "الاسم الكامل",
    label_tel_eleve: "هاتف التلميذ",
    label_tel_parent: "هاتف ولي الأمر",
    label_classe: "القسم",
    label_choose: "-- اختر --",
    btn_inscrire: "تسجيل",

    title_receipt_inscription: "إيصال التسجيل",
    title_students_list: "قائمة التلاميذ المسجلين",
    placeholder_search: "...بحث",
    btn_list_pdf: "قائمة PDF",
    title_edit_student: "تعديل التلميذ",
    label_nom: "الاسم",
    label_tel_eleve_short: "هاتف التلميذ",
    label_tel_parent_short: "هاتف ولي الأمر",
    btn_save: "حفظ",
    btn_cancel: "إلغاء",

    label_choose_class: "اختر القسم",
    label_all_classes: "-- جميع الأقسام --",
    btn_export_pdf: "تصدير PDF",
    txt_students_count: "تلميذ(ة)",

    label_matricule_eleve: "الرقم التسلسلي للتلميذ",
    btn_search: "بحث",
    label_name: "الاسم:",
    label_class: "القسم:",
    label_parent_tel: "هاتف ولي الأمر:",
    title_select_months: "اختر الشهر(الأشهر) للدفع",
    label_payment_mode: "طريقة الدفع",
    label_total: "المجموع",
    btn_generate_receipt: "إنشاء الإيصال",
    title_receipt_fees: "إيصال الرسوم",
    title_payment_consult: "استشارة المدفوعات",
    label_choose_month: "-- اختر الشهر --",

    title_school_info: "معلومات المدرسة",
    title_dev_config: "إعدادات المطور",
    label_nom_fr: "الاسم (بالفرنسية)",
    label_nom_ar: "الاسم (بالعربية)",
    label_adresse: "العنوان",
    label_telephones: "الهاتف",
    label_logo: "شعار المدرسة",
    label_color_primary: "اللون الرئيسي",
    label_color_secondary: "اللون الثانوي",
    label_color_accent: "لون التمييز",
    label_code_acces: "رمز دخول العميل",
    btn_save_dev: "حفظ (مطور)",
    title_class_management: "إدارة الأقسام",
    placeholder_class_name: "اسم القسم",
    btn_add_class: "+ إضافة قسم",
    title_fee_amounts: "مبالغ الرسوم",
    label_inscription_fee: "رسوم التسجيل",
    label_monthly_fee: "الرسوم الشهرية",
    title_school_year: "السنة الدراسية",
    label_start_month: "شهر البداية",
    label_start_year: "سنة البداية",
    label_end_month: "شهر النهاية",
    label_end_year: "سنة النهاية",
    label_matricule_prefix: "بادئة الرقم التسلسلي",
    title_backup: "النسخ الاحتياطي",
    hint_backup: "قم بتصدير نسخة احتياطية بانتظام.",
    btn_export_backup: "تصدير نسخة احتياطية",
    btn_export_csv: "تصدير Excel/CSV",
    btn_import_backup: "استيراد نسخة احتياطية",
    title_about: "حول التطبيق",
    about_line1: "تم تطوير هذا التطبيق بواسطة <strong>Midenty</strong>.",
    about_line2: "لأي مساعدة تقنية أو استفسار، تواصلوا معنا:",
    about_copyright: "© Midenty — جميع الحقوق محفوظة",
    whatsapp_help_message: "السلام عليكم، أحتاج إلى مساعدة تقنية بخصوص تطبيقي",
    title_language: "اللغة",

    msg_no_students: "لا يوجد تلاميذ مسجلين.",
    msg_enter_name: "أدخل اسم التلميذ.",
    msg_choose_class: "اختر القسم.",
    msg_student_enrolled: "تم تسجيل التلميذ: {name} — {matricule}",
    msg_name_required: "الاسم إجباري.",
    msg_student_modified: "تم تعديل التلميذ.",
    msg_no_student_class: "لا يوجد تلاميذ في هذا القسم.",
    msg_no_class_config: "لا توجد أقسام. اذهب إلى الإعدادات لإنشائها.",
    msg_enter_matricule: "أدخل الرقم التسلسلي.",
    msg_student_not_found: "لم يتم العثور على تلميذ بهذا الرقم.",
    msg_find_student_first: "ابحث عن تلميذ أولاً.",
    msg_select_month: "اختر شهراً واحداً على الأقل.",
    msg_payment_saved: "تم حفظ الدفع — {numero}",
    msg_backup_downloaded: "تم تحميل النسخة الاحتياطية.",
    msg_image_downloaded: "تم تحميل الصورة — أرفقها يدوياً في واتساب.",
    msg_no_students_export: "لا يوجد تلاميذ للتصدير.",
    msg_csv_downloaded: "تم تحميل ملف CSV.",
    msg_data_reset: "تمت إعادة تعيين البيانات.",
    msg_code_wrong: "رمز غير صحيح.",
    msg_dev_panel_opened: "تم فتح لوحة المطور.",
    msg_dev_config_saved: "تم حفظ إعدادات المطور.",
    msg_class_deleted: "تم حذف القسم.",
    msg_enter_class_name: "أدخل اسم القسم.",
    msg_class_exists: "هذا القسم موجود بالفعل.",
    msg_class_added: "تمت إضافة القسم: {name}",
    msg_amounts_saved: "تم حفظ المبالغ.",
    msg_settings_saved: "تم حفظ الإعدادات.",
    msg_backup_imported: "تم استيراد النسخة الاحتياطية.",
    msg_print_error: "خطأ في الطباعة: {error}",
    msg_no_search_result: "لا توجد نتائج.",
    msg_no_class_created: "لم يتم إنشاء أقسام.",

    receipt_number: "إيصال رقم",
    receipt_date: "التاريخ",
    receipt_student: "التلميذ",
    receipt_matricule: "الرقم التسلسلي",
    receipt_class: "القسم",
    receipt_inscription: "التسجيل",
    receipt_total: "المجموع",
    receipt_monthly_fees: "الرسوم الشهرية",
    receipt_month: "الشهر",
    receipt_payment_mode: "طريقة الدفع",
    receipt_use_matricule: "استخدموا هذا الرقم لدفع الرسوم الشهرية:",
    receipt_months_multiply: "{count} شهر × {amount}",

    month_1: "يناير", month_2: "فبراير", month_3: "مارس",
    month_4: "أبريل", month_5: "ماي", month_6: "يونيو",
    month_7: "يوليو", month_8: "أغسطس", month_9: "سبتمبر",
    month_10: "أكتوبر", month_11: "نوفمبر", month_12: "ديسمبر",

    txt_unpaid: "غير مدفوع",
    txt_paid: "مدفوع",

    msg_no_backup: "لم يتم تصدير نسخة احتياطية. افعل ذلك في الإعدادات.",
    msg_backup_days_ago: "آخر نسخة احتياطية منذ {days} يوم.",
    msg_no_backup_yet: "لم يتم تصدير نسخة احتياطية.",
    msg_backup_today: "آخر نسخة احتياطية: اليوم.",
    msg_backup_ago: "آخر نسخة احتياطية: منذ {days} يوم.",

    txt_install_banner: "ثبّت هذا التطبيق على شاشتك الرئيسية.",
    btn_install: "تثبيت",
    btn_later: "لاحقاً",

    btn_modify: "تعديل",
    txt_optional: "اختياري",
    txt_delete_class_confirm: "حذف القسم \"{name}\"؟",
    txt_import_confirm: "استيراد {students} تلميذ(ة) و {payments} دفعة؟\nسيتم استبدال البيانات الحالية.",
    txt_reset_confirm: "حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.",
    txt_reset_unsynced_warning: "تنبيه: بعض البيانات لم تتم مزامنتها بعد مع السحابة (اتصال غير مستقر أو غير متصل). إعادة التعيين الآن قد تؤدي إلى فقدانها نهائياً.\n\nهل تريد المتابعة رغم ذلك؟",
    txt_dev_prompt: "رمز المطور / المسؤول:",
    txt_dev_action_prompt: "اكتب DEV للتهيئة أو RESET لإعادة التعيين:",
    msg_import_error: "تعذر الاستيراد: {error}",
    msg_whatsapp_download: "تم تحميل الصورة — أرفقها يدوياً في واتساب.",

    pdf_students_list: "قائمة التلاميذ المسجلين",
    pdf_exported_on: "تم التصدير في {date} — {count} تلميذ(ة)",
    pdf_class_label: "القسم: {name}",
    pdf_class_count: "{count} تلميذ(ة) — {date}",
    pdf_col_name: "الاسم",
    pdf_col_matricule: "الرقم",
    pdf_col_class: "القسم",
    pdf_col_parent_tel: "هاتف ولي الأمر",
    pdf_col_number: "رقم",

    print_use_number: "استخدموا هذا الرقم:",

    placeholder_tel: "اختياري",
    placeholder_matricule: "MEI-001",
    placeholder_matricule_num: "001"
  },

  en: {
    tab_inscription: "Registration",
    tab_classes: "Classes",
    tab_mensuel: "Monthly",
    tab_presences: "Attendance",
    tab_guide: "Guide",
    tab_parametres: "Settings",

    // User guide
    guide_title: "How to use the application",
    guide_intro: "Find here all the explanations to use the application, as well as the available plans.",
    guide_forfaits_title: "Available plans",
    guide_payment_title: "Subscription payment methods",
    guide_video_btn: "▶ Watch the video",
    guide_section_inscription_title: "Register a student",
    guide_section_inscription_desc: "Go to the Registration tab, fill in the student's name, phone and class, then click « Register ». A student ID and receipt are generated automatically.",
    guide_section_classes_title: "View classes",
    guide_section_classes_desc: "Go to the Classes tab, choose a class from the list to see all students enrolled in it.",
    guide_section_paiement_title: "Record a payment",
    guide_section_paiement_desc: "Go to the Monthly tab, enter the student's ID, choose the month(s) to pay, then click « Pay ». The receipt is generated automatically.",
    guide_section_recus_title: "Share a receipt",
    guide_section_recus_desc: "Each receipt can be downloaded as a PDF, as an image, shared on WhatsApp, or printed on a Bluetooth printer.",
    guide_section_presences_title: "Take attendance",
    guide_section_presences_desc: "Go to the Attendance tab, choose the class, then click « Start roll call ». For each student, indicate whether they are present or absent.",
    guide_section_bulletins_title: "Create report cards",
    guide_section_bulletins_desc: "Go to the Report Cards tab, choose the class and period, enter each student's grades, then generate the report cards as PDF.",
    guide_section_attestations_title: "Generate a certificate",
    guide_section_attestations_desc: "Go to the Certificates tab, choose the student and certificate type, then generate the document as PDF.",
    guide_section_dashboard_title: "View the dashboard",
    guide_section_dashboard_desc: "The dashboard shows the number of students, revenue, and the main statistics of the institution.",
    guide_forfait_essentiel_name: "Essential",
    guide_forfait_essentiel_desc: "Registration, Classes, Payments, Receipts, sync and support.",
    guide_forfait_complet_name: "Complete",
    guide_forfait_complet_desc: "Everything in Essential + Attendance, Report cards, Certificates, Dashboard and SMS.",
    guide_forfait_premium_name: "Premium",
    guide_forfait_premium_desc: "Everything in Complete + Teacher management, Multi-year history, Multi-user and unlimited SMS.",

    // Attendance
    label_date_appel: "Roll call date",
    btn_commencer_appel: "Start roll call",
    msg_choose_date_appel: "Choose a date.",
    msg_resume_draft: "An unfinished roll call already exists for this class and date. Resume where you left off?",
    msg_attendance_already_exists: "Attendance has already been recorded for this class on this date (maybe from another device). Redoing the roll call will fully replace the previous record. Continue?",
    msg_sync_write_error: "Saved on this device, but not yet synced online (network error). Try again later or check your connection.",
    msg_no_students_in_class: "No students in this class.",
    btn_present: "Present",
    btn_absent: "Absent",
    txt_rollcall_progress: "{current} / {total} students",
    btn_retour: "Back",
    btn_terminer_plus_tard: "Finish roll call later",
    msg_attendance_paused: "Roll call paused. You can resume it later.",
    title_rollcall_summary: "Roll call summary",
    txt_summary_presents: "Present",
    txt_summary_absents: "Absent",
    title_absents_list: "Absent students",
    msg_no_absents: "No absent students today.",
    btn_valider_enregistrer: "Validate and save",
    msg_attendance_saved: "Roll call saved successfully.",
    title_attendance_history: "Attendance history",
    label_history_month: "Choose a month",
    msg_choose_class_and_month: "Choose a class and a month.",
    msg_no_attendance_data: "No roll call recorded for this period.",
    btn_export_attendance_pdf: "Export PDF",

    login_title: "Access Code",
    login_placeholder: "••••••••",
    btn_login: "Enter",
    welcome_message: "Welcome to the school management system application",
    btn_enter: "Enter",
    msg_connecting: "Connecting...",
    msg_code_incorrect: "Incorrect code",
    msg_account_disabled: "This account is disabled.",
    msg_contact_whatsapp: "Contact Midenty on WhatsApp",

    verify_title: "Verification required",
    verify_message: "Connect to the internet to continue using the app.\nThis verification is required every 7 days.",
    btn_verify: "Verify now",
    msg_verifying: "Verifying...",
    msg_account_deactivated: "This account has been <strong>disabled</strong>.<br>Contact Midenty to reactivate.",
    msg_no_internet: "No internet connection. Try again.",
    msg_need_help: "Need help? Contact Midenty",

    sync_synced: "Synced",
    sync_pending: "Pending...",
    sync_offline: "Offline",

    msg_update_available: "A new version is available.",
    btn_update_refresh: "Refresh",
    btn_refresh_app_tooltip: "Refresh the app",

    label_matricule: "Student ID",
    label_nom_complet: "Full name",
    label_tel_eleve: "Student phone",
    label_tel_parent: "Parent phone",
    label_classe: "Class",
    label_choose: "-- Choose --",
    btn_inscrire: "Register",

    title_receipt_inscription: "Registration receipt",
    title_students_list: "Enrolled students",
    placeholder_search: "Search...",
    btn_list_pdf: "List PDF",
    title_edit_student: "Edit student",
    label_nom: "Name",
    label_tel_eleve_short: "Student tel.",
    label_tel_parent_short: "Parent tel.",
    btn_save: "Save",
    btn_cancel: "Cancel",

    label_choose_class: "Choose a class",
    label_all_classes: "-- All classes --",
    btn_export_pdf: "Export PDF",
    txt_students_count: "student(s)",

    label_matricule_eleve: "Student ID",
    btn_search: "Search",
    label_name: "Name:",
    label_class: "Class:",
    label_parent_tel: "Parent tel.:",
    title_select_months: "Select month(s) to pay",
    label_payment_mode: "Payment method",
    label_total: "Total",
    btn_generate_receipt: "Generate receipt",
    title_receipt_fees: "Fees receipt",
    title_payment_consult: "Payment consultation",
    label_choose_month: "-- Choose a month --",

    title_school_info: "School information",
    title_dev_config: "Developer settings",
    label_nom_fr: "Name (French)",
    label_nom_ar: "Name (Arabic)",
    label_adresse: "Address",
    label_telephones: "Phone(s)",
    label_logo: "School logo",
    label_color_primary: "Primary color",
    label_color_secondary: "Secondary color",
    label_color_accent: "Accent color",
    label_code_acces: "Client access code",
    btn_save_dev: "Save (dev)",
    title_class_management: "Class management",
    placeholder_class_name: "Class name",
    btn_add_class: "+ Add a class",
    title_fee_amounts: "Fee amounts",
    label_inscription_fee: "Registration fee",
    label_monthly_fee: "Monthly fee",
    title_school_year: "School year",
    label_start_month: "Start month",
    label_start_year: "Start year",
    label_end_month: "End month",
    label_end_year: "End year",
    label_matricule_prefix: "ID prefix",
    title_backup: "Data backup",
    hint_backup: "Export a backup regularly.",
    btn_export_backup: "Export a backup",
    btn_export_csv: "Export to Excel/CSV",
    btn_import_backup: "Import a backup",
    title_about: "About",
    about_line1: "This application was developed by <strong>Midenty</strong>.",
    about_line2: "For any technical assistance or information, contact us:",
    about_copyright: "© Midenty — All rights reserved",
    whatsapp_help_message: "Hello, I need technical assistance regarding my application",
    title_language: "Language",

    msg_no_students: "No students enrolled.",
    msg_enter_name: "Enter the student's name.",
    msg_choose_class: "Choose a class.",
    msg_student_enrolled: "Student enrolled: {name} — {matricule}",
    msg_name_required: "Name is required.",
    msg_student_modified: "Student modified.",
    msg_no_student_class: "No students in this class.",
    msg_no_class_config: "No classes configured. Go to Settings to create some.",
    msg_enter_matricule: "Enter a student ID.",
    msg_student_not_found: "No student found with this ID.",
    msg_find_student_first: "Search for a student first.",
    msg_select_month: "Select at least one month.",
    msg_payment_saved: "Payment saved — {numero}",
    msg_backup_downloaded: "Backup downloaded.",
    msg_image_downloaded: "Image downloaded — attach it manually in WhatsApp.",
    msg_no_students_export: "No students to export.",
    msg_csv_downloaded: "CSV file downloaded.",
    msg_data_reset: "Data reset.",
    msg_code_wrong: "Incorrect code.",
    msg_dev_panel_opened: "Developer panel opened.",
    msg_dev_config_saved: "Developer config saved.",
    msg_class_deleted: "Class deleted.",
    msg_enter_class_name: "Enter a class name.",
    msg_class_exists: "This class already exists.",
    msg_class_added: "Class added: {name}",
    msg_amounts_saved: "Amounts saved.",
    msg_settings_saved: "Settings saved.",
    msg_backup_imported: "Backup imported.",
    msg_print_error: "Print error: {error}",
    msg_no_search_result: "No results.",
    msg_no_class_created: "No classes created.",

    receipt_number: "Receipt No.",
    receipt_date: "Date",
    receipt_student: "Student",
    receipt_matricule: "Student ID",
    receipt_class: "Class",
    receipt_inscription: "Registration",
    receipt_total: "TOTAL",
    receipt_monthly_fees: "Monthly fees",
    receipt_month: "Month",
    receipt_payment_mode: "Payment",
    receipt_use_matricule: "Use this ID to pay monthly fees:",
    receipt_months_multiply: "{count} months × {amount}",

    month_1: "January", month_2: "February", month_3: "March",
    month_4: "April", month_5: "May", month_6: "June",
    month_7: "July", month_8: "August", month_9: "September",
    month_10: "October", month_11: "November", month_12: "December",

    txt_unpaid: "Unpaid",
    txt_paid: "Paid",

    msg_no_backup: "No backup exported. Do it in Settings.",
    msg_backup_days_ago: "Last backup {days} days ago.",
    msg_no_backup_yet: "No backup exported.",
    msg_backup_today: "Last backup: today.",
    msg_backup_ago: "Last backup: {days} day(s) ago.",

    txt_install_banner: "Install this app on your home screen.",
    btn_install: "Install",
    btn_later: "Later",

    btn_modify: "Edit",
    txt_optional: "Optional",
    txt_delete_class_confirm: "Delete class \"{name}\"?",
    txt_import_confirm: "Import {students} student(s) and {payments} payment(s)?\nThis will replace current data.",
    txt_reset_confirm: "Delete ALL data? This cannot be undone.",
    txt_reset_unsynced_warning: "Warning: some data hasn't synced to the cloud yet (unstable or offline connection). Resetting now may lose it permanently.\n\nContinue anyway?",
    txt_dev_prompt: "Developer / admin code:",
    txt_dev_action_prompt: "Type DEV to configure, or RESET to reset:",
    msg_import_error: "Import failed: {error}",
    msg_whatsapp_download: "Image downloaded — attach it manually in WhatsApp.",

    pdf_students_list: "Enrolled students list",
    pdf_exported_on: "Exported on {date} — {count} student(s)",
    pdf_class_label: "Class: {name}",
    pdf_class_count: "{count} student(s) — {date}",
    pdf_col_name: "Name",
    pdf_col_matricule: "Student ID",
    pdf_col_class: "Class",
    pdf_col_parent_tel: "Parent tel.",
    pdf_col_number: "No.",

    print_use_number: "Use this number:",

    placeholder_tel: "Optional",
    placeholder_matricule: "MEI-001",
    placeholder_matricule_num: "001"
  }
};

/* ==================== Module I18n ==================== */

const I18n = {
  _lang: null,
  _overrides: null,

  init() {
    this._lang = localStorage.getItem("medersa_lang");
    const saved = localStorage.getItem("medersa_i18n_overrides");
    if (saved) {
      try { this._overrides = JSON.parse(saved); } catch (e) { this._overrides = null; }
    }
  },

  getLang() {
    return this._lang;
  },

  setLang(lang) {
    this._lang = lang;
    localStorage.setItem("medersa_lang", lang);
    applyLanguage();
  },

  setOverrides(obj) {
    this._overrides = obj;
    localStorage.setItem("medersa_i18n_overrides", JSON.stringify(obj));
  }
};

function t(key, params) {
  const lang = I18n.getLang() || "fr";

  // 1. Client overrides
  if (I18n._overrides && I18n._overrides[lang] && I18n._overrides[lang][key] !== undefined) {
    return _interpolate(I18n._overrides[lang][key], params);
  }

  // 2. Translation dictionary
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
    return _interpolate(TRANSLATIONS[lang][key], params);
  }

  // 3. Fallback to French
  if (TRANSLATIONS.fr[key] !== undefined) {
    return _interpolate(TRANSLATIONS.fr[key], params);
  }

  return key;
}

function _interpolate(str, params) {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] !== undefined ? params[k] : `{${k}}`);
}

function monthName(monthNum) {
  return t("month_" + monthNum);
}

function applyLanguage() {
  const lang = I18n.getLang() || "fr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  if (lang === "ar") {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    document.body.classList.add("lang-ar");
    document.body.classList.remove("lang-en");
  } else if (lang === "en") {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
    document.body.classList.remove("lang-ar");
    document.body.classList.add("lang-en");
  } else {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "fr";
    document.body.classList.remove("lang-ar", "lang-en");
  }
}

I18n.init();
