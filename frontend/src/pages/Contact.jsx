import { useEffect } from "react";
import { setPageMeta } from "../lib/seo";
import { SITE_URL } from "../config/env";
import Button from "../components/ui/Button";

const CONTACT_EMAIL = "hello.placero@gmail.com";

export default function Contact() {
  useEffect(() => {
    setPageMeta({
      title: "Contact Us — PlaceRo",
      description: "Get in touch with the PlaceRo team — questions, feedback, or a job to share with us.",
      canonical: `${SITE_URL}/contact`,
    });
  }, []);

  return (
    <div className="container-page py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>

      <p className="text-sm text-muted leading-relaxed">
        Have a question, spotted an issue with a listing, want to share a job opening, or just want to say
        hi? We'd love to hear from you — we read every email.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-sm2">
        <p className="text-xs uppercase tracking-wide text-muted-light font-medium">Email us</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="block text-lg font-semibold text-accent mt-1 break-all">
          {CONTACT_EMAIL}
        </a>
        <p className="text-sm text-muted mt-2">
          We typically reply within 1–2 business days.
        </p>
        <Button as="a" href={`mailto:${CONTACT_EMAIL}`} className="mt-4">
          Email PlaceRo →
        </Button>
      </div>

      <h2 className="text-lg font-bold mt-8 mb-2">What to include</h2>
      <p className="text-sm text-muted leading-relaxed">
        If you're reporting a problem with a specific listing (wrong details, expired deadline, broken
        apply link), it helps a lot if you include the job title, company name, and a link to the listing
        on PlaceRo.
      </p>

      <h2 className="text-lg font-bold mt-8 mb-2">Are you an employer?</h2>
      <p className="text-sm text-muted leading-relaxed">
        If you'd like to get a job or internship listed on PlaceRo, email us the role details at the address
        above and we'll take a look.
      </p>
    </div>
  );
}