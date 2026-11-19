/* ============================================================
   MoneyTV site configuration
   Paste your form-handling endpoints below. Leave "endpoint" empty
   to fall back to opening the visitor's email app (mailto).
   format: "json"  -> POST application/json
           "form"  -> POST application/x-www-form-urlencoded
   ============================================================ */
window.MONEYTV_CONFIG = {
  email: "hello@moneytvpod.com",
  forms: {
    booking: {
      endpoint: "",          // e.g. "https://formspree.io/f/xxxxxxx"
      format: "json",
      success: "Thanks! We'll follow up within 1\u20132 business days.",
      subjectPrefix: "MoneyTV Inquiry \u2014 "
    },
    newsletter: {
      endpoint: "",          // e.g. your Mailchimp / Beehiiv / Kit form endpoint
      format: "json",
      success: "You're in! Watch your inbox for Buy The Dip on Monday.",
      subjectPrefix: "Buy The Dip subscription"
    }
  }
};
