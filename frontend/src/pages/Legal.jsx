import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setPageMeta } from "../lib/seo";
import { SITE_URL } from "../config/env";

const CONTACT_EMAIL = "hello.placero@gmail.com";
const LAST_UPDATED = "August 23, 2026";

function PrivacyContent() {
  return (
    <>
      <p className="text-xs text-muted-light mb-8">Last updated: {LAST_UPDATED}</p>

      <p className="text-sm text-muted leading-relaxed">
        PlaceRo (&ldquo;PlaceRo&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates placero.in (the &ldquo;Site&rdquo;), which curates and
        lists jobs, internships and fresher openings. This Privacy Policy explains what information we
        collect when you use the Site, how we use it, and the choices you have.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">1. Information We Collect</h2>
      <p className="text-sm text-muted leading-relaxed">
        We aim to collect as little personal information as possible. Depending on how you use the Site,
        we may collect:
      </p>
      <ul className="mt-3 space-y-1.5">
        {[
          "Usage data — pages visited, search queries you type, referring pages, device/browser type, and approximate location (derived from IP address), collected automatically through standard analytics and server logs.",
          "Cookies and similar technologies — used to remember basic preferences and to support advertising (see Section 3 below).",
          "Information you give us directly — such as your email address, if you contact us at hello.placero@gmail.com or otherwise reach out to us.",
        ].map((item, i) => (
          <li key={i} className="text-sm text-muted flex gap-2 leading-relaxed">
            <span className="text-accent mt-0.5">•</span> {item}
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted leading-relaxed mt-3">
        We do not require you to create an account or submit a resume to browse job listings on PlaceRo.
        When you click &ldquo;Apply&rdquo;, you are taken to the employer&rsquo;s or a third party&rsquo;s application page, which
        has its own privacy practices that we do not control.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">2. How We Use Information</h2>
      <ul className="mt-1 space-y-1.5">
        {[
          "To operate, maintain and improve the Site and its listings.",
          "To understand aggregate usage patterns (e.g. which job categories are popular) so we can make the Site more useful.",
          "To respond to your emails or support requests.",
          "To serve advertising, including personalized ads, through Google AdSense (see Section 3).",
          "To detect, prevent and address technical issues, abuse, or fraud.",
        ].map((item, i) => (
          <li key={i} className="text-sm text-muted flex gap-2 leading-relaxed">
            <span className="text-accent mt-0.5">•</span> {item}
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-bold mt-8 mb-2">3. Cookies &amp; Advertising</h2>
      <p className="text-sm text-muted leading-relaxed">
        PlaceRo displays advertising served by Google AdSense. Google and its partners may use cookies
        (including the DoubleClick cookie) or similar technologies to serve ads based on your prior visits
        to this Site and other websites, and to measure ad performance.
      </p>
      <p className="text-sm text-muted leading-relaxed mt-3">
        You can opt out of personalized advertising by visiting{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          Google&rsquo;s Ads Settings
        </a>{" "}
        or{" "}
        <a
          href="https://www.aboutads.info/choices/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          aboutads.info
        </a>
        . You can also disable cookies entirely in your browser settings, though some parts of the Site may
        not work as intended.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">4. Third-Party Links</h2>
      <p className="text-sm text-muted leading-relaxed">
        Job and internship listings on PlaceRo link out to employer websites, applicant tracking systems,
        or other third-party platforms. We are not responsible for the content, accuracy, or privacy
        practices of these external sites. We encourage you to review the privacy policy of any site before
        submitting personal information, such as your resume.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">5. Data Retention &amp; Security</h2>
      <p className="text-sm text-muted leading-relaxed">
        We retain the limited information described above only for as long as needed for the purposes set
        out in this policy, or as required by law. We take reasonable technical and organizational measures
        to protect information from unauthorized access, alteration, or loss, though no method of
        transmission or storage is completely secure.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">6. Children&rsquo;s Privacy</h2>
      <p className="text-sm text-muted leading-relaxed">
        PlaceRo is intended for job seekers, students and fresh graduates and is not directed at children
        under 13. We do not knowingly collect personal information from children under 13. If you believe a
        child has provided us with personal information, please contact us so we can remove it.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">7. Your Choices</h2>
      <p className="text-sm text-muted leading-relaxed">
        You can browse most of PlaceRo without providing any personal information. Where we do hold your
        information (for example, an email you sent us), you may ask us to access, correct, or delete it by
        emailing us at the address below.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">8. Changes to This Policy</h2>
      <p className="text-sm text-muted leading-relaxed">
        We may update this Privacy Policy from time to time to reflect changes to our practices or for
        legal reasons. We&rsquo;ll update the &ldquo;Last updated&rdquo; date above when we do. Continued use of the Site
        after changes means you accept the revised policy.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">9. Contact Us</h2>
      <p className="text-sm text-muted leading-relaxed">
        If you have questions about this Privacy Policy or how we handle information, email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline">
          {CONTACT_EMAIL}
        </a>
        . See also our{" "}
        <Link to="/contact" className="text-accent underline">
          Contact page
        </Link>
        .
      </p>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <p className="text-xs text-muted-light mb-8">Last updated: {LAST_UPDATED}</p>

      <p className="text-sm text-muted leading-relaxed">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of placero.in (the &ldquo;Site&rdquo;), operated by PlaceRo
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using the Site, you agree to these Terms. If you don&rsquo;t agree,
        please don&rsquo;t use the Site.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">1. What PlaceRo Is</h2>
      <p className="text-sm text-muted leading-relaxed">
        PlaceRo is a discovery platform that curates and lists jobs, internships and fresher openings
        gathered from employers and third-party sources. PlaceRo is not a recruitment agency or an
        employer, and we do not hire for, guarantee, or process any of the roles listed on the Site.
        Applications are submitted directly to the employer or third-party platform linked from each
        listing.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">2. No Guarantee of Accuracy or Outcome</h2>
      <p className="text-sm text-muted leading-relaxed">
        We make reasonable efforts to keep listings accurate and up to date, but job details (salary,
        deadlines, eligibility, location, etc.) are set by the employer or original source and can change
        or expire without notice. We do not guarantee that any listing is currently open, accurate, or
        legitimate, and we do not guarantee that using PlaceRo will result in an interview, offer, or job.
        Always verify details on the employer&rsquo;s own page before applying.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">3. Your Responsibilities</h2>
      <ul className="mt-1 space-y-1.5">
        {[
          "Use the Site only for lawful purposes related to genuinely seeking jobs, internships, or fresher opportunities.",
          "Do not attempt to scrape, copy, or republish PlaceRo's listings or content at scale without our permission.",
          "Do not attempt to interfere with, disrupt, or gain unauthorized access to the Site or its infrastructure.",
          "Provide accurate information if you contact us or apply to a role through a linked third-party page.",
        ].map((item, i) => (
          <li key={i} className="text-sm text-muted flex gap-2 leading-relaxed">
            <span className="text-accent mt-0.5">•</span> {item}
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-bold mt-8 mb-2">4. Third-Party Links &amp; Applications</h2>
      <p className="text-sm text-muted leading-relaxed">
        Clicking &ldquo;Apply&rdquo; or any external link takes you off PlaceRo to a third-party website that we don&rsquo;t
        control and aren&rsquo;t responsible for. Your interactions with that site — including any personal
        information you submit there — are governed by that site&rsquo;s own terms and privacy policy, not ours.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">5. Advertising</h2>
      <p className="text-sm text-muted leading-relaxed">
        PlaceRo displays advertising, including through Google AdSense, to support the free operation of
        the Site. Ads and any third-party content shown alongside them are the responsibility of the
        respective advertiser or ad network, not PlaceRo.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">6. Intellectual Property</h2>
      <p className="text-sm text-muted leading-relaxed">
        The PlaceRo name, logo, and the Site&rsquo;s design and original content are owned by PlaceRo. Individual
        job listings may originate from third parties and remain their respective owners&rsquo; content. You may
        not reproduce, redistribute, or use PlaceRo&rsquo;s branding or design without our written permission.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">7. Disclaimer &amp; Limitation of Liability</h2>
      <p className="text-sm text-muted leading-relaxed">
        The Site and its listings are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any kind,
        express or implied. To the fullest extent permitted by law, PlaceRo is not liable for any indirect,
        incidental, or consequential damages arising from your use of the Site, reliance on any listing, or
        your interactions with any third-party website linked from PlaceRo.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">8. Changes to the Site or These Terms</h2>
      <p className="text-sm text-muted leading-relaxed">
        We may modify, suspend, or discontinue any part of the Site at any time. We may also update these
        Terms from time to time; the &ldquo;Last updated&rdquo; date above will reflect the latest revision. Continued
        use of the Site after changes take effect means you accept the updated Terms.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">9. Governing Law</h2>
      <p className="text-sm text-muted leading-relaxed">
        These Terms are governed by the laws of India, without regard to conflict-of-law principles.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">10. Contact Us</h2>
      <p className="text-sm text-muted leading-relaxed">
        Questions about these Terms? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline">
          {CONTACT_EMAIL}
        </a>
        . See also our{" "}
        <Link to="/contact" className="text-accent underline">
          Contact page
        </Link>
        .
      </p>
    </>
  );
}

export default function Legal({ title }) {
  useEffect(() => {
    setPageMeta({
      title: `${title} — PlaceRo`,
      description: `${title} for PlaceRo, a job, internship and fresher-openings listing site.`,
      canonical: `${SITE_URL}${window.location.pathname}`,
    });
  }, [title]);

  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      {title === "Terms of Service" ? <TermsContent /> : <PrivacyContent />}
    </div>
  );
}