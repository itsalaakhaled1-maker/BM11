export const metadata = {
  title: "سياسة الخصوصية | مُفكِر",
  description: "سياسة الخصوصية لموقع مُفكِر - نظام البحث والمقارنة المعيارية",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          سياسة الخصوصية
        </h1>
        <p className="text-slate-500 mb-8 text-sm">
          <strong>تاريخ السريان:</strong> 22 يوليو 2026 | <strong>آخر تحديث:</strong> 22 يوليو 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. مقدمة</h2>
            <p className="text-slate-600 leading-relaxed">
              تُقدّر شركة سمارت حكيم للتكنولوجيا (&quot;HAKIM&quot; أو &quot;نحن&quot; أو &quot;الشركة&quot;) خصوصيتك وتلتزم بحماية بياناتك الشخصية. تُوضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدامك لمواقعنا الإلكترونية وتطبيقاتنا وخدماتنا (&quot;الخدمات&quot;).
            </p>
            <p className="text-slate-600 leading-relaxed mt-2">
              باستخدامك لخدماتنا، فإنك توافق على ممارسات جمع واستخدام المعلومات الموضحة في هذه السياسة. إذا كنت لا توافق على أي جزء من هذه السياسة، يُرجى عدم استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. البيانات التي نجمعها</h2>
            <p className="text-slate-600 leading-relaxed mb-2">قد نجمع الأنواع التالية من البيانات:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>بيانات الهوية:</strong> الاسم، البريد الإلكتروني، رقم الهاتف، معلومات الشركة (عند التسجيل).</li>
              <li><strong>بيانات الاستخدام:</strong> كيفية تفاعلك مع خدماتنا، الصفحات التي تزورها، الميزات التي تستخدمها.</li>
              <li><strong>بيانات الجهاز:</strong> نوع الجهاز، نظام التشغيل، نوع المتصفح، عنوان IP، معرف الجهاز.</li>
              <li><strong>بيانات المحتوى:</strong> المستندات والبحوث والملفات التي تُرفع إلى أنظمتنا (مثل مُفكّر).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. كيفية استخدام البيانات</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>تقديم وتحسين خدماتنا وتخصيص تجربتك.</li>
              <li>التواصل معك بشأن تحديثات، إشعارات، ودعم فني.</li>
              <li>تحليل استخدام الخدمات لتحسين الأداء وتطوير ميزات جديدة.</li>
              <li>الامتثال للالتزامات القانونية والتنظيمية في دولة الإمارات العربية المتحدة.</li>
              <li>منع الاحتيال وحماية أمن أنظمتنا وخدماتنا.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. حماية البيانات والأمان</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>تشفير البيانات أثناء النقل (SSL/TLS) وأثناء التخزين (AES-256).</li>
              <li>جدران حماية ونظم كشف التسلل المستمر.</li>
              <li>الوصول المحدود للبيانات الشخصية للموظفين المصرح لهم فقط.</li>
              <li>مراجعات أمنية دورية واختبارات اختراق منتظمة.</li>
              <li>نسخ احتياطية مشفّرة ومحمية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. مشاركة البيانات مع أطراف ثالثة</h2>
            <p className="text-slate-600 leading-relaxed mb-2">
              لا نبيع بياناتك الشخصية لأي طرف ثالث. قد نشارك بياناتك فقط في الحالات التالية:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>مزودي الخدمات:</strong> شركات تقدم خدمات استضافة، تحليلات، دعم فني نيابة عنا.</li>
              <li><strong>الامتثال القانوني:</strong> عندما يكون ذلك مطلوبًا بموجب القانون أو أمر قضائي.</li>
              <li><strong>حماية الحقوق:</strong> للدفاع عن حقوقنا أو ملكيتنا أو سلامة مستخدمينا.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. ملفات تعريف الارتباط (Cookies)</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>ضرورية:</strong> للتشغيل الأساسي للموقع (تسجيل الدخول، الأمان).</li>
              <li><strong>الأداء:</strong> لفهم كيفية استخدام الزوار للموقع وتحسين الأداء.</li>
              <li><strong>الوظيفية:</strong> لتذكر تفضيلاتك (اللغة، الوضع المظلم).</li>
              <li><strong>التحليلية:</strong> لتحليل سلوك المستخدم وتحسين المنتجات.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. حقوقك</h2>
            <p className="text-slate-600 leading-relaxed mb-2">
              بموجب قوانين حماية البيانات المعمول بها في دولة الإمارات العربية المتحدة، لك الحقوق التالية:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>الحق في الوصول:</strong> طلب نسخة من بياناتك الشخصية التي نحتفظ بها.</li>
              <li><strong>الحق في التصحيح:</strong> تحديث أو تصحيح أي بيانات غير دقيقة.</li>
              <li><strong>الحق في الحذف:</strong> طلب حذف بياناتك (مع مراعاة الالتزامات القانونية).</li>
              <li><strong>الحق في الاعتراض:</strong> الاعتراض على معالجة بياناتك لأغراض تسويقية.</li>
              <li><strong>الحق في سحب الموافقة:</strong> سحب موافقتك على معالجة البيانات في أي وقت.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-2">
              لممارسة أي من هذه الحقوق، يُرجى التواصل معنا عبر البريد الإلكتروني: privacy@hakim.tech
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. الاحتفاظ بالبيانات</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>بيانات الحساب: طوال فترة استخدامك للخدمة + 12 شهرًا بعد الإلغاء.</li>
              <li>بيانات المعاملات: 7 سنوات (متطلبات ضريبية وقانونية).</li>
              <li>سجلات الأمان: 12 شهرًا.</li>
              <li>بيانات التحليلات المجهولة: إلى أجل غير مسمى (لا تحتوي على معلومات تعريف شخصية).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. الخصوصية الخاصة بالأطفال</h2>
            <p className="text-slate-600 leading-relaxed">
              خدماتنا غير موجهة للأشخاص دون سن 16 عامًا. لا نجمع بيانات شخصية عن قصد من الأطفال. إذا اكتشفنا أننا جمعنا بيانات من طفل دون 16 عامًا دون موافقة الوالدين، سنحذف هذه البيانات فورًا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. التعديلات على هذه السياسة</h2>
            <p className="text-slate-600 leading-relaxed">
              قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات جوهرية على هذه الصفحة مع تاريخ التحديث. ننصحك بمراجعة هذه السياسة بشكل دوري. استمرارك في استخدام خدماتنا بعد نشر التعديلات يعني قبولك للتغييرات.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. التواصل معنا</h2>
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