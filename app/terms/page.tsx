export const metadata = {
  title: "الشروط والأحكام | مُفكِر",
  description: "شروط وأحكام استخدام موقع مُفكِر - نظام البحث والمقارنة المعيارية",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          الشروط والأحكام
        </h1>
        <p className="text-slate-500 mb-8 text-sm">
          <strong>تاريخ السريان:</strong> 22 يوليو 2026 | <strong>آخر تحديث:</strong> 22 يوليو 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. مقدمة</h2>
            <p className="text-slate-600 leading-relaxed">
              مرحباً بك في مُفكِر. هذه الشروط والأحكام (&quot;الاتفاقية&quot;) تحكم استخدامك لموقع مُفكِر وتطبيقاته وخدماته (&quot;الخدمات&quot;). باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من هذه الاتفاقية، يُرجى عدم استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. تعريفات</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>&quot;الشركة&quot; أو &quot;نحن&quot;:</strong> سمارت حكيم للتكنولوجيا (Smart Hakim Technology).</li>
              <li><strong>&quot;المستخدم&quot; أو &quot;أنت&quot;:</strong> أي شخص يستخدم خدماتنا.</li>
              <li><strong>&quot;الخدمات&quot;:</strong> موقع مُفكِر وتطبيقاته وكافة الميزات المقدمة.</li>
              <li><strong>&quot;المحتوى&quot;:</strong> الأبحاث والمستندات والبيانات التي يتم إنشاؤها أو رفعها عبر خدماتنا.</li>
              <li><strong>&quot;الاشتراك&quot;:</strong> الخطة المدفوعة التي يختارها المستخدم للوصول للميزات المتقدمة.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. الأهلية والتسجيل</h2>
            <p className="text-slate-600 leading-relaxed mb-2">
              باستخدامك لخدماتنا، تُقر وتضمن أنك:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>بلغت سن 18 عاماً على الأقل، أو أنك تستخدم الخدمات بإشراف ولي أمر.</li>
              <li>تملك الصلاحية القانونية لإبرام هذه الاتفاقية.</li>
              <li>المعلومات التي تقدمها أثناء التسجيل دقيقة وكاملة ومح updated.</li>
              <li>تحافظ على سرية بيانات اعتماد حسابك (اسم المستخدم وكلمة المرور).</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-2">
              نحتفظ بالحق في تعليق أو إنهاء حسابك إذا تبين أن المعلومات المقدمة غير دقيقة أو مضللة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. الاشتراكات والدفع</h2>
            <p className="text-slate-600 leading-relaxed mb-2">
              نقدم خطط اشتراك مدفوعة للوصول لميزات متقدمة:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>الأسعار:</strong> محددة في صفحة التسعير وقد تتغير بإشعار مسبق 30 يوماً.</li>
              <li><strong>الدورية:</strong> الاشتراكات تُجدد تلقائياً شهرياً أو سنوياً حسب الخطة المختارة.</li>
              <li><strong>طرق الدفع:</strong> بطاقات ائتمانية، Apple Pay، Google Pay، وغيرها.</li>
              <li><strong>الفوترة:</strong> يتم إصدار فاتورة إلكترونية عند كل عملية دفع.</li>
              <li><strong>التجديد:</strong> يتم خصم رسوم التجديد تلقائياً قبل 24 ساعة من انتهاء الفترة الحالية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. سياسة الاسترداد</h2>
            <p className="text-slate-600 leading-relaxed">
              يرجى مراجعة <a href="/refund" className="text-blue-600 hover:underline">سياسة الاسترداد</a> الخاصة بنا للاطلاع على شروط وإجراءات إرجاع الأموال.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. حقوق الملكية الفكرية</h2>
            <p className="text-slate-600 leading-relaxed mb-2">
              <strong>ملكية الشركة:</strong> جميع المحتويات والتصميمات والشعارات والبرمجيات والتقنيات المستخدمة في خدماتنا هي ملكية حصرية لشركة حكيم. لا يجوز نسخها أو تعديلها أو توزيعها بدون إذن كتابي مسبق.
            </p>
            <p className="text-slate-600 leading-relaxed mb-2">
              <strong>ملكية المستخدم:</strong> أنت تحتفظ بحقوق الملكية الفكرية للأبحاث والمستندات التي تنشئها عبر خدماتنا. ومع ذلك، تمنحنا ترخيصاً غير حصري لاستخدام هذا المحتوى لأغراض تحسين خدماتنا وتطويرها.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. الاستخدام المسموح به</h2>
            <p className="text-slate-600 leading-relaxed mb-2">
              يجوز لك استخدام خدماتنا للأغراض الشخصية والأكاديمية والبحثية. يُحظر عليك:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>استخدام الخدمات لأغراض غير قانونية أو احتيالية.</li>
              <li>محاولة اختراق أنظمتنا أو الوصول غير المصرح به للبيانات.</li>
              <li>إعادة بيع أو تأجير أو ترخيص خدماتنا لأطراف ثالثة.</li>
              <li>استخدام الروبوتات أو البرامج الآلية للوصول للخدمات.</li>
              <li>نشر محتوى مسيء أو تشهيري أو ينتهك حقوق الآخرين.</li>
              <li>استخدام الأبحاث المُنشأة لأغراض تجارية بدون ترخيص.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. إلغاء الاشتراك</h2>
            <p className="text-slate-600 leading-relaxed mb-2">
              يمكنك إلغاء اشتراكك في أي وقت:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>عبر إعدادات الحساب في لوحة التحكم.</li>
              <li>عبر التواصل معنا على support@hakim.tech</li>
              <li>سيظل اشتراكك نشطاً حتى نهاية الفترة المدفوعة.</li>
              <li>لا يتم استرداد الرسوم المدفوعة مسبقاً للفترة الحالية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. إنهاء الخدمة</h2>
            <p className="text-slate-600 leading-relaxed">
              نحتفظ بالحق في تعليق أو إنهاء حسابك فوراً إذا:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>انتهكت هذه الشروط والأحكام.</li>
              <li>استخدمت الخدمات لأغراض غير قانونية.</li>
              <li>أدت أفعالك لضرر فني أو مالي للشركة أو المستخدمين الآخرين.</li>
              <li>لم تدفع الرسوم المستحقة بعد إشعارين.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. إخلاء المسؤولية</h2>
            <p className="text-slate-600 leading-relaxed">
              يتم توفير خدماتنا &quot;كما هي&quot; دون أي ضمانات صريحة أو ضمنية. لا نضمن دقة أو اكتمال أو موثوقية الأبحاث المُنشأة عبر الذكاء الاصطناعي. يجب على المستخدمين مراجعة وتحقق من المحتوى قبل استخدامه في أي سياق أكاديمي أو مهني.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. القانون الساري</h2>
            <p className="text-slate-600 leading-relaxed">
              تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة. أي نزاع ينشأ عن استخدام خدماتنا يُحل أمام محاكم دبي المختصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">12. التعديلات</h2>
            <p className="text-slate-600 leading-relaxed">
              قد نقوم بتحديث هذه الشروط من وقت لآخر. سيتم إشعارك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار داخل التطبيق. استمرارك في استخدام الخدمات بعد نشر التعديلات يعني قبولك لها.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">13. التواصل معنا</h2>
            <div className="bg-slate-50 rounded-xl p-6 space-y-2 border border-slate-200">
              <p className="text-slate-600"><strong>البريد الإلكتروني:</strong> info@hakim1.com</p>
              <p className="text-slate-600"><strong>الشركة:</strong> سمارت حكيم للتكنولوجيا (Smart Hakim Technology)</p>
              <p className="text-slate-600"><strong>الرخصة:</strong> 1639246 — دائرة الاقتصاد والسياحة بدبي</p>
              <p className="text-slate-600"><strong>العنوان:</strong> منطقة الورقاء — دبي، الإمارات العربية المتحدة</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}