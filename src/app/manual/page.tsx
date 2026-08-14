import Link from "next/link";
import AppFooter from "@/components/AppFooter";

export const dynamic = "force-dynamic";

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-xs text-gray-500 hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 mt-1">User Manual</h1>
          <p className="text-xs text-gray-500">How to use Office Documents Manager</p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
        <Section title="📁 Company कसरी थप्ने (Add Company)">
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li><strong>Admin</strong> page मा जानुहोस् (Dashboard माथि &quot;Admin&quot; button)</li>
            <li>Company को नाम ra सथापना वर्ष (B.S.) हाल्नुहोस्</li>
            <li>&quot;Add&quot; button click गर्नुहोस् — यसमा शेयर्ड PIN चाहिँदैन, कोही पनि team member ले थप्न सक्छ</li>
          </ol>
        </Section>

        <Section title="📄 Document कसरी upload गर्ने">
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Company को page मा जानुहोस् (Dashboard बाट company card click गरेर)</li>
            <li>चाहिने section (Registration, VAT, Tax Clearance, Experience Letter) मा &quot;Upload&quot; वा &quot;+ Add&quot; button click गर्नुहोस्</li>
            <li>File select गर्नुहोस् — PNG, JPG, वा PDF junसुकै chalxa, system ले automatically PDF मा convert गरेर compress गर्छ</li>
            <li>Tax Clearance ra Experience Letter मा extra field (fiscal year, sector, province) पनि भर्नुपर्छ</li>
          </ol>
        </Section>

        <Section title="🗑️ Document कसरी delete गर्ने">
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Document को छेउमा &quot;Delete&quot; click गर्नुहोस्</li>
            <li><strong>Admin PIN</strong> सोधिन्छ — यो शेयर्ड login PIN भन्दा फरक हो, matra admin/office head लाई थाहा हुनुपर्छ</li>
            <li>Sahi PIN हालेपछि, document तुरुन्तै हराउँदैन — <strong>30 दिनको लागि &quot;Trash&quot; मा जान्छ</strong></li>
            <li>Galti भएमा, Admin → Trash मा गएर, Admin PIN हालेर &quot;Restore&quot; गर्न सकिन्छ</li>
            <li>30 दिनपछि, trash बाट automatically सधैंको लागि हराउँछ</li>
          </ol>
          <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2 mt-2">
            ⚠ कसले delete गर्न सक्छ: जोसँग Admin PIN छ, teही मात्र। सामान्य team member (शेयर्ड login PIN मात्र भएको) ले upload/view/download गर्न सक्छ, तर delete गर्न सक्दैन।
          </p>
        </Section>

        <Section title="⬇️ Merge गरेर Download कसरी गर्ने">
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Company page मा, चाहिने document हरूको छेउमा भएको checkbox click गरेर select गर्नुहोस्</li>
            <li>तल देखिने bar मा, हरेक document को अगाडि number हालेर क्रम (order) मिलाउनुहोस् (1, 2, 3...)</li>
            <li>&quot;Download Merged PDF&quot; button click गर्नुहोस्</li>
            <li>सबै selected document हरू euta PDF मा merge भएर, automatic filename (e.g. &quot;BI_LegalDocuments_2082-08-12.pdf&quot;) सहित download हुन्छ</li>
          </ol>
        </Section>

        <Section title="🖼️ Company Logo कसरी थप्ने">
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Company page मा माथि, logo को छेउमा &quot;Add logo&quot; वा &quot;Change logo&quot; click गर्नुहोस्</li>
            <li>Image select गर्नुहोस् (PNG/JPG) — यो dashboard card ra company page दुबैमा देखिन्छ</li>
          </ol>
        </Section>

        <Section title="🔑 Login PIN हरू">
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li><strong>Team Access PIN</strong>: सबै 10-15 जना team member ले साझा गर्ने, system भित्र पस्न चाहिने</li>
            <li><strong>Admin PIN</strong>: matra document delete गर्दा चाहिने, अलग ra थप सुरक्षित</li>
          </ul>
        </Section>
      </main>

      <AppFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}
